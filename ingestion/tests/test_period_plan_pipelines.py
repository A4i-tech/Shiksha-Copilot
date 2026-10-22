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
from test_period_plan import conn, graph  # noqa: E402,F401
from test_period_plan_xlsx import TEMPLATE, workbook  # noqa: E402

KEY = "secret-key"
PARAMS = {"grade": "6", "subject": "social", "force_mode": "gpt", "workflow_template": TEMPLATE}


@pytest.fixture(autouse=True)
def api_key(monkeypatch):
    monkeypatch.setenv("PIPELINE_API_KEY", KEY)


def call(method, path, params=PARAMS, filename="social.xlsx", content=None, headers=None, wait=False, send_file=True):
    async def go():
        async with TestClient(TestServer(server.make_app(graph()))) as client:
            form = FormData()
            if send_file:
                form.add_field("file", workbook() if content is None else content, filename=filename)
            if params is not None:
                form.add_field("params", params if isinstance(params, str) else json.dumps(params))
            kwargs = {"data": form} if method == "POST" else {}
            response = await client.request(method, path, headers={"x-api-key": KEY} | (headers or {}), **kwargs)
            data = await response.json()
            if wait:
                await asyncio.gather(*client.server.app[server.TASKS].values())
                data["run"] = await (await client.get(URL(data["status_query_get_uri"]).path, headers={"x-api-key": KEY})).json()
            return response.status, data

    return asyncio.run(go())


def test_flows_are_listed_with_their_parameters():
    status, data = call("GET", "/api/v2/pipelines")
    assert status == 200 and {"period_plan", "chapter"} <= set(data)
    assert {"source", "grade", "subject", "workflow_template"} <= set(data["period_plan"])


def test_workbook_upload_runs_the_named_flow_and_returns_the_plans(conn):
    status, data = call("POST", "/api/v2/pipelines/period_plan", wait=True)
    assert status == 202 and data["status_query_get_uri"].endswith(f"/api/v2/pipelines/runs/{data['instance_id']}")
    assert data["run"]["runtimeStatus"] == "Completed"
    (output,) = data["run"]["output"]["outputs"]
    assert data["run"]["output"]["errors"] == []
    assert len(output["payloads"]) == 3 and {r["status"] for r in output["lesson_plans"].values()} == {"completed"}
    assert all(p["sections"] for p in (r["plan"] for r in output["lesson_plans"].values()))
    assert conn.posted == []


def test_webhook_is_opt_in_for_a_batch_run(conn):
    call("POST", "/api/v2/pipelines/period_plan", params=PARAMS | {"webhook": True}, wait=True)
    assert {p["status"] for p in conn.posted} == {"PENDING", "RUNNING", "COMPLETED"}


def test_run_that_fails_reports_the_reason_in_status(conn):
    status, data = call("POST", "/api/v2/pipelines/period_plan", params={k: v for k, v in PARAMS.items() if k != "subject"}, wait=True)
    assert status == 202 and data["run"]["runtimeStatus"] == "Failed"
    assert any("--param subject" in e for e in data["run"]["output"]["errors"])


def test_runs_are_off_without_an_api_key(monkeypatch):
    monkeypatch.delenv("PIPELINE_API_KEY")
    status, data = call("POST", "/api/v2/pipelines/period_plan")
    assert status == 503 and "PIPELINE_API_KEY" in data["error"]


def test_wrong_api_key_is_401():
    status, data = call("POST", "/api/v2/pipelines/period_plan", headers={"x-api-key": "nope"})
    assert status == 401 and "x-api-key" in data["error"]


def test_unknown_flow_is_404_and_lists_the_flows():
    status, data = call("POST", "/api/v2/pipelines/nope")
    assert status == 404 and "period_plan" in data["error"]


def test_flow_name_cannot_reach_other_files():
    status, _ = call("POST", "/api/v2/pipelines/..%2Fetc%2Fpasswd")
    assert status == 404


def test_unknown_parameter_is_400_and_names_the_valid_ones():
    status, data = call("POST", "/api/v2/pipelines/period_plan", params=PARAMS | {"gradee": "6"})
    assert status == 400 and "gradee" in data["error"] and "grade" in data["error"]


def test_missing_file_and_bad_params_are_400():
    status, data = call("POST", "/api/v2/pipelines/period_plan", send_file=False)
    assert status == 400 and "'file'" in data["error"]
    status, data = call("POST", "/api/v2/pipelines/period_plan", params="{not json")
    assert status == 400 and "not valid JSON" in data["error"]
    status, data = call("POST", "/api/v2/pipelines/period_plan", params="[1]")
    assert status == 400 and "JSON object" in data["error"]
