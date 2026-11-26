import os
import uuid

import pytest
from pydantic import SecretStr
from aiobotocore.session import get_session

from app.utils import blob_store as blob_store_module
from app.utils.blob_store import _OBJECT_STORE_CONFIG, BlobStore

ENDPOINT = os.getenv("OBJECT_STORE_TEST_ENDPOINT_URL", "http://localhost:9000")
ACCESS_KEY = os.getenv("OBJECT_STORE_TEST_ACCESS_KEY_ID", "test-access-key")
SECRET_KEY = os.getenv("OBJECT_STORE_TEST_SECRET_ACCESS_KEY", "test-secret-key")
BUCKET = os.getenv("OBJECT_STORE_TEST_BUCKET_NAME", "qdrant")

pytestmark = pytest.mark.object_store


@pytest.fixture
def store(monkeypatch):
    settings = blob_store_module.settings
    monkeypatch.setattr(settings, "storage_backend", "object-store")
    monkeypatch.setattr(settings, "object_store_endpoint_url", ENDPOINT)
    monkeypatch.setattr(settings, "object_store_access_key_id", ACCESS_KEY)
    monkeypatch.setattr(settings, "object_store_secret_access_key", SecretStr(SECRET_KEY))
    monkeypatch.setattr(settings, "object_store_region", "us-east-1")
    return BlobStore()


@pytest.fixture
async def client():
    async with get_session().create_client(
        "s3",
        endpoint_url=ENDPOINT,
        aws_access_key_id=ACCESS_KEY,
        aws_secret_access_key=SECRET_KEY,
        region_name="us-east-1",
        config=_OBJECT_STORE_CONFIG,
    ) as client:
        yield client


@pytest.fixture
async def run(client):
    run_id = f"pytest-{uuid.uuid4().hex}"
    yield run_id
    listing = await client.list_objects_v2(Bucket=BUCKET, Prefix=run_id)
    for obj in listing.get("Contents", []):
        await client.delete_object(Bucket=BUCKET, Key=obj["Key"])


async def put(client, objects: dict[str, bytes]) -> None:
    for key, body in objects.items():
        await client.put_object(Bucket=BUCKET, Key=key, Body=body)


def files_in(folder) -> dict[str, bytes]:
    return {p.name: p.read_bytes() for p in folder.iterdir()}


async def test_downloads_only_objects_under_prefix(store, client, run, tmp_path):
    await put(
        client,
        {
            f"{run}/index/a.json": b"alpha",
            f"{run}/index/sub/b.bin": b"\x00\x01\x02",
            f"{run}/other/c.txt": b"not requested",
        },
    )

    result = await store.download_blobs_to_folder(
        f"{BUCKET}/{run}/index/", str(tmp_path)
    )

    assert sorted(result) == sorted(
        str(tmp_path / name) for name in ("a.json", "b.bin")
    )
    assert files_in(tmp_path) == {"a.json": b"alpha", "b.bin": b"\x00\x01\x02"}


async def test_prefix_matches_start_of_key_not_folder(store, client, run, tmp_path):
    await put(
        client,
        {
            f"{run}/vec1.json": b"1",
            f"{run}/vec2.json": b"2",
            f"{run}/doc.json": b"3",
        },
    )

    await store.download_blobs_to_folder(f"{BUCKET}/{run}/vec", str(tmp_path))

    assert files_in(tmp_path) == {"vec1.json": b"1", "vec2.json": b"2"}


async def test_prefix_with_no_objects_returns_empty_list(store, run, tmp_path):
    result = await store.download_blobs_to_folder(
        f"{BUCKET}/{run}/nothing/", str(tmp_path)
    )

    assert result == []
    assert files_in(tmp_path) == {}


async def test_skips_folder_placeholder_objects(store, client, run, tmp_path):
    await put(client, {f"{run}/dir/": b"", f"{run}/dir/a.txt": b"a"})

    result = await store.download_blobs_to_folder(f"{BUCKET}/{run}/dir/", str(tmp_path))

    assert result == [str(tmp_path / "a.txt")]


async def test_missing_bucket_raises_runtime_error(store, tmp_path):
    bucket = f"no-such-bucket-{uuid.uuid4().hex}"

    with pytest.raises(RuntimeError, match=f"object store bucket '{bucket}'"):
        await store.download_blobs_to_folder(f"{bucket}/x", str(tmp_path))


async def test_wrong_secret_key_raises_runtime_error(store, monkeypatch, tmp_path):
    monkeypatch.setattr(
        blob_store_module.settings, "object_store_secret_access_key", SecretStr("wrong-secret")
    )

    with pytest.raises(RuntimeError, match="SignatureDoesNotMatch"):
        await BlobStore().download_blobs_to_folder(f"{BUCKET}/x", str(tmp_path))
