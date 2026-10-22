import asyncio
import json
import sys
from pathlib import Path

import pytest
from aiohttp import FormData
from aiohttp.test_utils import TestClient, TestServer
from yarl import URL

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))

import period_plan_server as server  # noqa: E402
from test_period_plan import conn, graph, payload, section  # noqa: E402,F401
from test_period_plan_xlsx import TEMPLATE, workbook  # noqa: E402

KEY = "secret-key"


@pytest.fixture(autouse=True)
def api_key(monkeypatch):
    monkeypatch.setenv("PIPELINE_API_KEY", KEY)


def hang_on_the_model(conn):
    started = asyncio.Event()

    async def never(model, messages, **kw):
        started.set()
        await asyncio.Event().wait()

    conn.llm.chat.completions.create = never
    return started


def terminate_flow(conn, start, headers=None):
    started = hang_on_the_model(conn)

    async def go():
        async with TestClient(TestServer(server.make_app(graph()))) as client:
            accepted = await start(client)
            body = await accepted.json()
            status_path = URL(body["status_query_get_uri"]).path
            await asyncio.wait_for(started.wait(), 10)
            denied = await client.post(f"{status_path}/terminate", headers={"x-api-key": "nope"})
            done = await client.post(f"{status_path}/terminate", headers=headers or {"x-api-key": KEY})
            again = await client.post(f"{status_path}/terminate", headers={"x-api-key": KEY})
            final = await (await client.get(status_path, headers={"x-api-key": KEY})).json()
            unknown = await client.post("/api/v2/lesson-plans/nope/terminate", headers={"x-api-key": KEY})
            return denied.status, (done.status, await done.json()), again.status, final, unknown.status

    return asyncio.run(go())


def test_a_running_plan_can_be_terminated_and_the_backend_hears_about_it(conn):
    async def start(client):
        return await client.post("/api/v2/lesson-plans", json=payload([section("a")]))

    denied, (status, body), again, final, unknown = terminate_flow(conn, start)
    assert denied == 401 and status == 200 and again == 409 and unknown == 404
    assert body["runtimeStatus"] == final["runtimeStatus"] == "Terminated"
    assert conn.posted[-1]["status"] == "FAILED" and "terminated" in conn.posted[-1]["output"]


def test_a_running_pipeline_can_be_terminated(conn):
    async def start(client):
        form = FormData()
        form.add_field("file", workbook(), filename="social.xlsx")
        form.add_field("params", json.dumps({"grade": "6", "subject": "social", "force_mode": "gpt", "workflow_template": TEMPLATE}))
        return await client.post("/api/v2/pipelines/period_plan", data=form, headers={"x-api-key": KEY})

    _, (status, body), again, final, _ = terminate_flow(conn, start)
    assert status == 200 and again == 409 and final["runtimeStatus"] == "Terminated"


def test_terminate_is_off_without_an_api_key(conn, monkeypatch):
    monkeypatch.delenv("PIPELINE_API_KEY")

    async def go():
        async with TestClient(TestServer(server.make_app(graph()))) as client:
            response = await client.post("/api/v2/lesson-plans/x/terminate")
            return response.status, await response.json()

    status, data = asyncio.run(go())
    assert status == 503 and "Terminate is off" in data["error"]
