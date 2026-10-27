import asyncio
import sys
from pathlib import Path

import pytest

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))

import period_plan_runner as runner  # noqa: E402
import period_plan_server as server_module  # noqa: E402
from aiohttp.test_utils import TestClient, TestServer  # noqa: E402
import period_plan_steps as steps  # noqa: E402
from test_period_plan import FakeLLM, conn, graph, payload, section  # noqa: E402,F401
from test_period_plan_pipelines import KEY, PARAMS, api_key, call  # noqa: E402,F401
from test_period_plan_server import call as call_json  # noqa: E402
from test_period_plan_xlsx import ROWS, workbook  # noqa: E402

SECRET = "teacher-secret-42"


def plan(raw, **kw):
    return asyncio.run(graph()._plan(raw, **kw))


def test_string_parameters_keep_their_text_on_the_command_line():
    assert runner.name_value("grade=6") == ("grade", "6")
    assert runner.name_value("top_k=5") == ("top_k", 5)
    assert runner.name_value('discourse_types={"major": []}') == ("discourse_types", '{"major": []}')


def test_json_body_values_get_the_type_the_yaml_declares():
    declared = runner.PARAMETERS
    assert runner.typed(declared, "grade", 6) == "6"
    assert runner.typed(declared, "discourse_types", {"major": []}) == '{"major": []}'
    assert runner.typed(declared, "top_k", 5) == 5


def test_pipeline_route_accepts_a_numeric_grade(conn):
    status, data = call("POST", "/api/v2/pipelines/period_plan", params=PARAMS | {"grade": 6}, wait=True)
    assert status == 202 and data["run"]["runtimeStatus"] == "Completed"


def test_pipeline_route_caps_concurrency():
    status, data = call("POST", "/api/v2/pipelines/period_plan", params=PARAMS | {"concurrency": 1000})
    assert status == 400 and "maximum" in data["error"]


def test_two_periods_with_the_same_topic_title_fail_the_run_instead_of_overwriting(conn):
    rows = [ROWS[0], (18, "Devotion", 1, "Hindu", "LO a"), (None, None, 2, "Hindu", "LO b")]
    status, data = call("POST", "/api/v2/pipelines/period_plan", content=workbook(rows), wait=True)
    assert status == 202 and data["run"]["runtimeStatus"] == "Failed"
    assert any("same _id" in e for e in data["run"]["output"]["errors"])


def test_pipeline_run_status_needs_the_api_key_but_lesson_plan_status_stays_open():
    status, data = call("GET", "/api/v2/pipelines/runs/x", headers={"x-api-key": "wrong"})
    assert status == 401
    status, data = call("GET", "/api/v2/lesson-plans/x", headers={"x-api-key": "wrong"})
    assert status == 404


def test_a_bad_request_body_is_not_echoed_back(conn):
    status, data = call_json("POST", "/api/v2/lesson-plans", {"user_id": SECRET, "lp_level": "CHAPTER"})
    assert status == 400 and "workflow" in data["error"] and SECRET not in data["error"]


def test_a_failed_validation_does_not_echo_the_request_to_the_webhook_or_the_result(conn):
    result = plan({"_id": "x", "user_id": SECRET, "lp_level": "BAD"})
    assert result["status"] == "failed" and "lp_level" in result["error"]
    assert SECRET not in result["error"] and SECRET not in str(conn.posted[-1]["output"])


def test_a_json_null_model_reply_fails_the_section_instead_of_dropping_it(conn):
    conn.llm.reply = lambda prompt, kw: "null"
    result = plan(payload([section("a")]))
    assert result["status"] == "failed" and "JSON null" in result["error"]


def test_saved_section_content_may_not_be_null(conn):
    raw = payload([section("a"), section("b", ["a"])], start_from_section_id="b", lesson_plan={"sections": [{"section_id": "a", "section_title": "A", "content": None}]})
    result = plan(raw)
    assert result["status"] == "failed" and "no content for sections ['a']" in result["error"]


def test_a_plan_can_run_without_posting_status(conn):
    assert plan(payload([section("a")]), webhook=False)["status"] == "completed"
    assert conn.posted == []


def test_retrieval_filter_returns_only_the_passages_of_the_requested_chapter(monkeypatch):
    from qdrant_client import AsyncQdrantClient
    from qdrant_client.http.models import Distance, PointStruct, VectorParams

    async def post(status):
        return None

    async def go():
        client = AsyncQdrantClient(":memory:")
        await client.create_collection("BSE-TG", vectors_config={"text-dense": VectorParams(size=2, distance=Distance.COSINE)})
        points = [PointStruct(id=i, vector={"text-dense": [1.0, 0.0]}, payload={"chapter_id": chapter, "text": f"passage {i} of {chapter}"}) for i, chapter in enumerate(["A", "B", "A"], 1)]
        await client.upsert("BSE-TG", points)
        monkeypatch.setattr(steps, "CONN", steps.Connections(client, FakeLLM(), post, lambda _: False, lambda *_: None), raising=False)
        retrieve = steps.QdrantRetrieve(embed_model="e")
        found = await retrieve.search("qdrant/BSE-TG/chapter_id:A", "query")
        with pytest.raises(ValueError, match="No data matches"):
            await retrieve.check("qdrant/BSE-TG/chapter_id:C")
        await client.close()
        return found

    assert sorted(asyncio.run(go())) == ["passage 1 of A", "passage 3 of A"]


def test_params_may_arrive_as_a_file_part(conn):
    import json

    from aiohttp import FormData
    from aiohttp.test_utils import TestClient, TestServer
    from test_period_plan_xlsx import TEMPLATE

    async def go():
        async with TestClient(TestServer(server_module.make_app(graph()))) as client:
            form = FormData()
            form.add_field("file", workbook(), filename="social.xlsx")
            form.add_field("params", json.dumps(PARAMS | {"workflow_template": TEMPLATE}), filename="params.json", content_type="application/json")
            response = await client.post("/api/v2/pipelines/period_plan", data=form, headers={"x-api-key": KEY})
            return response.status

    assert asyncio.run(go()) == 202


def test_finished_runs_are_dropped_oldest_first(conn, monkeypatch):
    monkeypatch.setenv("MAX_RETAINED_RUNS", "2")

    async def go():
        async with TestClient(TestServer(server_module.make_app(graph()))) as client:
            ids = []
            for _ in range(4):
                response = await client.post("/api/v2/lesson-plans", json=payload([section("a")]))
                ids.append((await response.json())["instance_id"])
                await asyncio.gather(*client.server.app[server_module.TASKS].values())
            return [(await client.get(f"/api/v2/lesson-plans/{i}")).status for i in ids]

    assert asyncio.run(go()) == [404, 404, 200, 200]


def test_mixed_number_and_text_keys_sort_without_error():
    assert sorted([None, "Review", 2, 1.5, "Unit 2"], key=steps.order) == [1.5, 2, "Review", "Unit 2", None]


def test_terminal_status_post_is_retried_then_raised(monkeypatch):
    calls = []

    class Http:
        async def __aenter__(self):
            return self

        async def __aexit__(self, *_):
            return False

        async def post(self, url, json):
            calls.append(url)
            raise runner.httpx.ConnectError("down")

    sleeps = []

    async def no_sleep(seconds):
        sleeps.append(seconds)

    monkeypatch.setenv("WEBHOOK_URL", "http://backend/hook")
    monkeypatch.setenv("AZURE_OPENAI_API_BASE", "http://x")
    monkeypatch.setenv("AZURE_OPENAI_API_KEY", "k")
    monkeypatch.setenv("AZURE_OPENAI_API_VERSION", "2024-06-01")
    monkeypatch.setattr(runner.httpx, "AsyncClient", lambda **_: Http())
    monkeypatch.setattr(runner.asyncio, "sleep", no_sleep)
    post = runner.connect().post_status
    with pytest.raises(runner.httpx.ConnectError):
        asyncio.run(post({"status": "COMPLETED"}))
    assert len(calls) == 4 and sleeps == [1, 2, 4]
