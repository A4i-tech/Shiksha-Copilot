import asyncio
import sys
from pathlib import Path

import pytest

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))

import period_plan_legacy_rag as legacy  # noqa: E402
from test_period_plan import INDEX, conn, graph, payload, section  # noqa: E402,F401

BLOB_INDEX = "indices/science/chapter_1"


@pytest.mark.parametrize(
    "path, expected",
    [
        (INDEX, "qdrant"),
        ("indices/science/chapter_1", "vector"),
        ("indices/graph-index/chapter_1", "graph"),
        ("qdrant-backup/graph-index/x", "graph"),
    ],
)
def test_index_kind_checks_graph_then_qdrant_then_vector(path, expected):
    assert legacy.kind(path) == expected
    assert legacy.is_legacy(path) is (expected != "qdrant")


def test_legacy_chapter_is_answered_from_its_blob_index_without_qdrant(conn, monkeypatch):
    asked = []

    async def answer(path, query):
        asked.append((path, query))
        return '```json\n{"hook": "ask a question"}\n```'

    monkeypatch.setattr(legacy, "answer", answer)
    raw = payload([section("a", mode="rag")])
    raw["chapter_info"]["index_path"] = BLOB_INDEX
    result = asyncio.run(graph()._plan(raw))

    assert result["status"] == "completed"
    assert result["plan"]["sections"][0]["content"] == {"hook": "ask a question"}
    assert asked[0][0] == BLOB_INDEX and "Describe a in detail" in asked[0][1]
    assert conn.qdrant.scrolls == [] and conn.qdrant.queries == [] and conn.llm.embedded == []
    assert len(conn.llm.prompts) == 0  # no retrieval-query call: the blob index retrieves with the synthesis prompt


def test_legacy_answer_that_is_not_json_stays_text(conn, monkeypatch):
    async def answer(path, query):
        return "plain text answer"

    monkeypatch.setattr(legacy, "answer", answer)
    raw = payload([section("a", mode="rag")])
    raw["chapter_info"]["index_path"] = BLOB_INDEX
    assert asyncio.run(graph()._plan(raw))["plan"]["sections"][0]["content"] == "plain text answer"


def test_legacy_failure_fails_the_plan_with_the_reason(conn, monkeypatch):
    async def answer(path, query):
        raise ValueError("Chapter index 'x' is stored in Azure Blob Storage. Set BLOB_STORE_CONNECTION_STRING or BLOB_STORE_URL.")

    monkeypatch.setattr(legacy, "answer", answer)
    raw = payload([section("a", mode="rag")])
    raw["chapter_info"]["index_path"] = BLOB_INDEX
    result = asyncio.run(graph()._plan(raw))
    assert result["status"] == "failed" and "BLOB_STORE_CONNECTION_STRING" in result["error"]
    assert conn.posted[-1]["status"] == "FAILED"


def test_downloaded_index_is_deleted_only_after_the_last_plan_ends(tmp_path, monkeypatch):
    folder = tmp_path / "index"
    folder.mkdir()
    monkeypatch.setattr(legacy, "local_dir", lambda path: str(folder))

    async def go():
        async with legacy.session(BLOB_INDEX):
            async with legacy.session(BLOB_INDEX):
                pass
            assert folder.exists()
        assert not folder.exists()

    asyncio.run(go())


def test_qdrant_chapter_never_touches_the_blob_index(tmp_path, monkeypatch):
    monkeypatch.setattr(legacy, "local_dir", lambda path: pytest.fail("a Qdrant chapter must not use a local index folder"))

    async def go():
        async with legacy.session(INDEX):
            pass

    asyncio.run(go())


def test_legacy_answer_that_is_not_json_fails_a_section_that_needs_json(conn, monkeypatch):
    async def answer(path, query):
        return "plain text answer"

    monkeypatch.setattr(legacy, "answer", answer)
    raw = payload([section("a", mode="rag", fmt={"type": "object"})])
    raw["chapter_info"]["index_path"] = BLOB_INDEX
    result = asyncio.run(graph()._plan(raw))
    assert result["status"] == "failed" and "not valid JSON" in result["error"]


@pytest.mark.parametrize("reply", ["", "504.0 GatewayTimeout"])
def test_legacy_empty_or_gateway_answer_fails_the_plan(conn, monkeypatch, reply):
    async def answer(path, query):
        return reply

    monkeypatch.setattr(legacy, "answer", answer)
    raw = payload([section("a", mode="rag")])
    raw["chapter_info"]["index_path"] = BLOB_INDEX
    result = asyncio.run(graph()._plan(raw))
    assert result["status"] == "failed" and "empty answer" in result["error"]


def test_blob_containers_are_off_until_the_operator_lists_them(monkeypatch):
    monkeypatch.delenv("LEGACY_INDEX_CONTAINERS", raising=False)
    with pytest.raises(ValueError, match="Set LEGACY_INDEX_CONTAINERS"):
        legacy.split_index_path(BLOB_INDEX)


def test_only_listed_blob_containers_can_be_read(monkeypatch):
    monkeypatch.setenv("LEGACY_INDEX_CONTAINERS", "indices, backups")
    assert legacy.split_index_path("backups/science/chapter_1") == ("backups", "science/chapter_1")
    with pytest.raises(ValueError, match="container 'secrets', which is not in LEGACY_INDEX_CONTAINERS"):
        legacy.split_index_path("secrets/anything")
    with pytest.raises(ValueError, match="must look like <container>/<path>"):
        legacy.split_index_path("indices")
