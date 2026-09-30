import urllib.request
import uuid

import aioboto3
import pytest
from botocore.config import Config

from app.utils import blob_store as blob_store_module
from app.utils.blob_store import BlobStore

ENDPOINT = "http://localhost:9000"
ACCESS_KEY = "test-access-key"
SECRET_KEY = "test-secret-key"
BUCKET = "qdrant"


def _minio_ready() -> bool:
    try:
        with urllib.request.urlopen(f"{ENDPOINT}/minio/health/ready", timeout=2):
            return True
    except OSError:
        return False


pytestmark = pytest.mark.skipif(
    not _minio_ready(),
    reason=f"MinIO does not answer at {ENDPOINT}/minio/health/ready. Start MinIO to run the S3 contract tests.",
)


@pytest.fixture
def store(monkeypatch):
    settings = blob_store_module.settings
    monkeypatch.setattr(settings, "storage_backend", "s3")
    monkeypatch.setattr(settings, "s3_endpoint_url", ENDPOINT)
    monkeypatch.setattr(settings, "s3_access_key_id", ACCESS_KEY)
    monkeypatch.setattr(settings, "s3_secret_access_key", SECRET_KEY)
    monkeypatch.setattr(settings, "s3_region", "us-east-1")
    return BlobStore()


@pytest.fixture
async def s3():
    session = aioboto3.Session(
        aws_access_key_id=ACCESS_KEY, aws_secret_access_key=SECRET_KEY, region_name="us-east-1"
    )
    async with session.client(
        "s3", endpoint_url=ENDPOINT, config=Config(s3={"addressing_style": "path"})
    ) as client:
        yield client


@pytest.fixture
async def run(s3):
    run_id = f"pytest-{uuid.uuid4().hex}"
    yield run_id
    listing = await s3.list_objects_v2(Bucket=BUCKET, Prefix=run_id)
    for obj in listing.get("Contents", []):
        await s3.delete_object(Bucket=BUCKET, Key=obj["Key"])


async def put(s3, objects: dict[str, bytes]) -> None:
    for key, body in objects.items():
        await s3.put_object(Bucket=BUCKET, Key=key, Body=body)


def files_in(folder) -> dict[str, bytes]:
    return {p.name: p.read_bytes() for p in folder.iterdir()}


async def test_downloads_only_objects_under_prefix(store, s3, run, tmp_path):
    await put(s3, {
        f"{run}/index/a.json": b"alpha",
        f"{run}/index/sub/b.bin": b"\x00\x01\x02",
        f"{run}/other/c.txt": b"not requested",
    })

    result = await store.download_blobs_to_folder(f"{BUCKET}/{run}/index/", str(tmp_path))

    assert sorted(result) == sorted(str(tmp_path / name) for name in ("a.json", "b.bin"))
    assert files_in(tmp_path) == {"a.json": b"alpha", "b.bin": b"\x00\x01\x02"}


async def test_prefix_matches_start_of_key_not_folder(store, s3, run, tmp_path):
    await put(s3, {
        f"{run}/vec1.json": b"1",
        f"{run}/vec2.json": b"2",
        f"{run}/doc.json": b"3",
    })

    await store.download_blobs_to_folder(f"{BUCKET}/{run}/vec", str(tmp_path))

    assert files_in(tmp_path) == {"vec1.json": b"1", "vec2.json": b"2"}


async def test_prefix_with_no_objects_returns_empty_list(store, run, tmp_path):
    result = await store.download_blobs_to_folder(f"{BUCKET}/{run}/nothing/", str(tmp_path))

    assert result == []
    assert files_in(tmp_path) == {}


async def test_skips_folder_placeholder_objects(store, s3, run, tmp_path):
    await put(s3, {f"{run}/dir/": b"", f"{run}/dir/a.txt": b"a"})

    result = await store.download_blobs_to_folder(f"{BUCKET}/{run}/dir/", str(tmp_path))

    assert result == [str(tmp_path / "a.txt")]


@pytest.mark.parametrize("prefix", ["", "no-slash"])
async def test_prefix_without_container_raises_value_error(store, prefix, tmp_path):
    with pytest.raises(ValueError, match="Prefix must be in the format 'container/prefix_path'"):
        await store.download_blobs_to_folder(prefix, str(tmp_path))


async def test_missing_bucket_raises_runtime_error(store, tmp_path):
    bucket = f"no-such-bucket-{uuid.uuid4().hex}"

    with pytest.raises(RuntimeError, match=f"S3 bucket '{bucket}'"):
        await store.download_blobs_to_folder(f"{bucket}/x", str(tmp_path))


async def test_wrong_secret_key_raises_runtime_error(store, monkeypatch, tmp_path):
    monkeypatch.setattr(blob_store_module.settings, "s3_secret_access_key", "wrong-secret")

    with pytest.raises(RuntimeError, match="S3_SECRET_ACCESS_KEY"):
        await BlobStore().download_blobs_to_folder(f"{BUCKET}/x", str(tmp_path))
