import asyncio
import os
from types import SimpleNamespace

import pytest

import period_plan_legacy_rag as legacy
import period_plan_steps as steps
from conftest import INDEX, graph, payload, run_plan, section

BLOB_INDEX = "indices/science/chapter_1"
EMBED = "text-embedding-ada-002"


@pytest.mark.parametrize(
    "path, expected",
    [
        (INDEX, "qdrant"),
        (BLOB_INDEX, "vector"),
        ("indices/graph-index/chapter_1", "graph"),
        ("qdrant-backup/graph-index/x", "graph"),
    ],
)
def test_index_kind_checks_graph_then_qdrant_then_vector(path, expected):
    index = steps.parse_index(path)
    if expected == "qdrant":
        assert isinstance(index, steps.QdrantIndex)
    else:
        assert index.kind == expected


def test_legacy_chapter_is_answered_from_its_blob_index_without_qdrant(
    conn, monkeypatch
):
    asked = []

    async def answer(index, query, model, embed_model):
        asked.append((index.path, query))
        return '```json\n{"hook": "ask a question"}\n```'

    monkeypatch.setattr(legacy, "answer", answer)
    raw = payload([section("a", mode="rag")])
    raw["chapter_info"]["index_path"] = BLOB_INDEX
    result = run_plan(graph(conn), raw)

    assert result.status == "completed"
    assert result.plan["sections"][0]["content"] == {"hook": "ask a question"}
    assert asked[0][0] == BLOB_INDEX
    assert "Describe a in detail" in asked[0][1]
    assert conn.qdrant.scrolls == []
    assert conn.qdrant.queries == []
    assert conn.llm.embedded == []
    assert conn.llm.prompts == []


def test_legacy_answer_that_is_not_json_stays_text(conn, monkeypatch):
    async def answer(index, query, model, embed_model):
        return "plain text answer"

    monkeypatch.setattr(legacy, "answer", answer)
    raw = payload([section("a", mode="rag")])
    raw["chapter_info"]["index_path"] = BLOB_INDEX
    assert (
        run_plan(graph(conn), raw).plan["sections"][0]["content"]
        == "plain text answer"
    )


def test_legacy_failure_fails_the_plan_with_the_reason(conn, monkeypatch):
    async def answer(index, query, model, embed_model):
        raise ValueError(
            "Chapter index 'x' is stored in Azure Blob Storage. Set "
            "BLOB_STORE_CONNECTION_STRING or BLOB_STORE_URL."
        )

    monkeypatch.setattr(legacy, "answer", answer)
    raw = payload([section("a", mode="rag")])
    raw["chapter_info"]["index_path"] = BLOB_INDEX
    result = run_plan(graph(conn), raw)
    assert result.status == "failed"
    assert "BLOB_STORE_CONNECTION_STRING" in result.error
    assert conn.posted[-1]["status"] == "FAILED"


def test_downloaded_index_is_deleted_only_after_the_last_plan_ends(
    tmp_path, monkeypatch
):
    folder = tmp_path / "index"
    folder.mkdir()
    monkeypatch.setattr(legacy, "local_dir", lambda index: str(folder))
    index = steps.parse_index(BLOB_INDEX)

    async def go():
        async with legacy.session(index):
            async with legacy.session(index):
                pass
            assert folder.exists()
        assert not folder.exists()

    asyncio.run(go())


def test_qdrant_chapter_never_touches_the_blob_index(conn, monkeypatch):
    monkeypatch.setattr(
        legacy,
        "local_dir",
        lambda index: pytest.fail(
            "a Qdrant chapter must not use a local index folder"
        ),
    )
    result = run_plan(graph(conn), payload([section("a")]))
    assert result.status == "completed"


def test_legacy_answer_that_is_not_json_fails_a_section_that_needs_json(
    conn, monkeypatch
):
    async def answer(index, query, model, embed_model):
        return "plain text answer"

    monkeypatch.setattr(legacy, "answer", answer)
    raw = payload([section("a", mode="rag", fmt={"type": "object"})])
    raw["chapter_info"]["index_path"] = BLOB_INDEX
    result = run_plan(graph(conn), raw)
    assert result.status == "failed"
    assert "not valid JSON" in result.error


def test_legacy_empty_answer_fails_the_plan(conn, monkeypatch):
    async def answer(index, query, model, embed_model):
        return ""

    monkeypatch.setattr(legacy, "answer", answer)
    raw = payload([section("a", mode="rag")])
    raw["chapter_info"]["index_path"] = BLOB_INDEX
    result = run_plan(graph(conn), raw)
    assert result.status == "failed"
    assert "empty answer" in result.error


def test_blob_containers_are_off_until_the_operator_lists_them(monkeypatch):
    monkeypatch.delenv("LEGACY_INDEX_CONTAINERS", raising=False)
    with pytest.raises(ValueError, match="Set LEGACY_INDEX_CONTAINERS"):
        legacy.check_container(steps.parse_index(BLOB_INDEX))


def test_only_listed_blob_containers_can_be_read(monkeypatch):
    monkeypatch.setenv("LEGACY_INDEX_CONTAINERS", "indices, backups")
    index = steps.parse_index("backups/science/chapter_1")
    legacy.check_container(index)
    assert (index.container, index.prefix) == ("backups", "science/chapter_1")
    with pytest.raises(
        ValueError,
        match="container 'secrets', which is not in LEGACY_INDEX_CONTAINERS",
    ):
        legacy.check_container(steps.parse_index("secrets/anything"))
    with pytest.raises(ValueError, match="must look like <container>/<path>"):
        steps.parse_index("indices")


class FakeBlobs:
    created = 0
    fail_after = None

    @classmethod
    def from_connection_string(cls, _):
        cls.created += 1
        return cls()

    async def __aenter__(self):
        return self

    async def __aexit__(self, *_):
        return False

    def get_container_client(self, _):
        return self

    async def list_blobs(self, name_starts_with):
        for i in range(3):
            if i == self.fail_after:
                raise ConnectionError("download broke")
            yield SimpleNamespace(name=f"{name_starts_with}/f{i}.json")

    def get_blob_client(self, name):
        async def download_blob():
            async def readall():
                await asyncio.sleep(0)
                return b"{}"

            return SimpleNamespace(readall=readall)

        return SimpleNamespace(download_blob=download_blob)


class FakeOps:
    def __init__(self, persist_dir, **_):
        self.dir = persist_dir

    async def index_exists(self):
        return os.path.isdir(self.dir) and bool(os.listdir(self.dir))

    async def initiate_index(self):
        pass

    async def query_index(self, text_str):
        return "ok"


@pytest.fixture
def blob_store(tmp_path, monkeypatch):
    import azure.storage.blob.aio as blob_aio
    import rag_wrapper

    folder = tmp_path / "index"
    FakeBlobs.created, FakeBlobs.fail_after = 0, None
    monkeypatch.setattr(blob_aio, "BlobServiceClient", FakeBlobs)
    monkeypatch.setattr(rag_wrapper, "InMemRagOps", FakeOps)
    monkeypatch.setattr(legacy, "local_dir", lambda index: str(folder))
    monkeypatch.setenv("LEGACY_INDEX_CONTAINERS", "indices")
    monkeypatch.setenv("BLOB_STORE_CONNECTION_STRING", "fake")
    monkeypatch.setenv("AZURE_OPENAI_API_KEY", "k")
    monkeypatch.setenv("AZURE_OPENAI_API_BASE", "https://example.invalid")
    monkeypatch.setenv("AZURE_OPENAI_API_VERSION", "2024-06-01")
    return folder


def test_a_download_that_breaks_midway_leaves_no_partial_index(blob_store):
    FakeBlobs.fail_after = 2
    index = steps.parse_index(BLOB_INDEX)

    async def go():
        async with legacy.session(index):
            await legacy.answer(index, "q", "m", EMBED)

    with pytest.raises(ConnectionError):
        asyncio.run(go())
    assert not blob_store.exists()


def test_two_sessions_on_one_index_download_it_once(blob_store):
    index = steps.parse_index(BLOB_INDEX)

    async def ask():
        async with legacy.session(index):
            return await legacy.answer(index, "q", "m", EMBED)

    async def go():
        return await asyncio.gather(ask(), ask())

    assert asyncio.run(go()) == ["ok", "ok"]
    assert FakeBlobs.created == 1
