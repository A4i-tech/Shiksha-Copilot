import asyncio
import sys
from pathlib import Path

from aiohttp.test_utils import TestClient, TestServer
from yarl import URL

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))

import period_plan_server as server  # noqa: E402
from test_period_plan import conn, graph, payload, section  # noqa: E402,F401


def call(method, path, body=None, wait_for_run=False):
    async def go():
        async with TestClient(TestServer(server.make_app(graph()))) as client:
            response = await client.request(method, path, json=body)
            data = await response.json()
            if wait_for_run:
                await asyncio.gather(*client.server.app[server.TASKS].values())
                data["run"] = await (await client.get(URL(data["status_query_get_uri"]).path)).json()
            return response.status, data

    return asyncio.run(go())


def checklist_payload(**kw):
    lesson_plan = {"sections": [{"section_id": "a", "section_title": "A", "content": "OLD-A"}]}
    return payload([section("a"), section("b", ["a"])], start_from_section_id="b", lesson_plan=lesson_plan, **kw)


def test_generate_returns_202_then_posts_statuses_under_the_instance_id(conn):
    status, data = call("POST", "/api/v2/lesson-plans", payload([section("a")]), wait_for_run=True)
    assert status == 202
    assert [p["status"] for p in conn.posted] == ["PENDING", "RUNNING", "COMPLETED"]
    assert {p["instance_id"] for p in conn.posted} == {data["instance_id"]} != {"plan-1"}
    assert data["run"]["runtimeStatus"] == "Completed" and data["run"]["output"]["_id"] == "plan-1"


def test_generate_stays_202_when_the_webhook_receiver_fails(conn):
    async def broken(status):
        raise ConnectionError("receiver down")

    conn.post_status = broken
    status, data = call("POST", "/api/v2/lesson-plans", payload([section("a")]), wait_for_run=True)
    assert status == 202 and data["run"]["runtimeStatus"] == "Completed"


def test_failed_run_is_reported_by_status_and_webhook(conn):
    status, data = call("POST", "/api/v2/lesson-plans", payload([section("a", ["missing"])]), wait_for_run=True)
    assert status == 202 and data["run"]["runtimeStatus"] == "Failed"
    assert conn.posted[-1]["status"] == "FAILED" and "missing" in data["run"]["output"]


def test_generate_rejects_an_invalid_body_with_400(conn):
    status, data = call("POST", "/api/v2/lesson-plans", {"lp_level": "CHAPTER"})
    assert status == 400 and "workflow" in data["error"]
    assert conn.posted == []


def test_unknown_instance_id_is_404(conn):
    status, data = call("GET", "/api/v2/lesson-plans/nope")
    assert status == 404 and "instance_id" in data["error"]


def test_checklist_returns_the_plan_directly_and_posts_no_status(conn):
    conn.llm.reply = lambda p, kw: "NEW"
    status, data = call("POST", "/api/v2/lesson-plans/checklist", checklist_payload())
    assert status == 200
    assert {s["section_id"]: s["content"] for s in data["sections"]} == {"a": "OLD-A", "b": "NEW"}
    assert conn.posted == []


def test_checklist_requires_a_known_start_section(conn):
    status, data = call("POST", "/api/v2/lesson-plans/checklist", payload([section("a")]))
    assert status == 400 and data["error"] == "start_from_section_id is required for checklist mode"
    status, data = call("POST", "/api/v2/lesson-plans/checklist", payload([section("a")], start_from_section_id="zz"))
    assert status == 400 and data["error"] == "Section ID 'zz' not found in workflow"


def test_checklist_failure_is_500_with_the_reason(conn):
    status, data = call("POST", "/api/v2/lesson-plans/checklist", payload([section("a"), section("b", ["a"])], start_from_section_id="b", lesson_plan={"sections": []}))
    assert status == 500 and "Missing dependency content" in data["error"]


def test_checklist_timeout_is_504(conn, monkeypatch):
    monkeypatch.setattr(server, "CHECKLIST_TIMEOUT_SECONDS", 0)
    status, data = call("POST", "/api/v2/lesson-plans/checklist", checklist_payload())
    assert status == 504 and "did not finish" in data["error"]


def test_server_connections_keep_no_plan_files(monkeypatch):
    monkeypatch.setenv("AZURE_OPENAI_API_BASE", "http://localhost:1")
    monkeypatch.setenv("AZURE_OPENAI_API_KEY", "k")
    server.steps.CONN = server.runner.connect()
    server.steps.CONN.save("plan-1", {})
    assert server.steps.CONN.is_done("plan-1") is False


def test_generate_also_accepts_the_trailing_slash(conn):
    status, data = call("POST", "/api/v2/lesson-plans/", payload([section("a")]), wait_for_run=True)
    assert status == 202 and data["run"]["runtimeStatus"] == "Completed"
