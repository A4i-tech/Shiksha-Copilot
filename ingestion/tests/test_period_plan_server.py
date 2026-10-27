import asyncio
import json
import logging

import pytest
from aiohttp import FormData
from aiohttp.test_utils import TestClient, TestServer
from yarl import URL

import period_plan_server as server
import period_plan_steps as steps
from conftest import KEY, TEMPLATE, graph, payload, section, workbook

PARAMS = {
    "grade": "6",
    "subject": "social",
    "force_mode": "gpt",
    "workflow_template": TEMPLATE,
}
PIPELINES = "/api/v2/pipelines"
PLANS = "/api/v2/lesson-plans"
SECRET = "teacher-secret-42"


ACTIVE = {}


@pytest.fixture(autouse=True)
def active(conn):
    ACTIVE["conn"] = conn


def serving():
    return TestClient(TestServer(server.make_app(graph(ACTIVE["conn"]))))


def upload(params=None, content=None, send_file=True, params_filename=None):
    form = FormData()
    if send_file:
        form.add_field(
            "file",
            workbook() if content is None else content,
            filename="social.xlsx",
        )
    text = PARAMS if params is None else params
    form.add_field(
        "params",
        text if isinstance(text, str) else json.dumps(text),
        filename=params_filename,
        content_type="application/json" if params_filename else None,
    )
    return form


def call(method, path, body=None, form=None, headers=None, wait=False):
    async def go():
        async with serving() as client:
            response = await client.request(
                method,
                path,
                json=body,
                data=form,
                headers={"x-api-key": KEY, **(headers or {})},
            )
            data = await response.json()
            if wait:
                await asyncio.gather(*client.server.app[server.TASKS].values())
                data["run"] = await (
                    await client.get(
                        URL(data["status_query_get_uri"]).path,
                        headers={"x-api-key": KEY},
                    )
                ).json()
            return response.status, data

    return asyncio.run(go())


def checklist_payload(**kw):
    lesson_plan = {
        "sections": [
            {"section_id": "a", "section_title": "A", "content": "OLD-A"}
        ]
    }
    return payload(
        [section("a"), section("b", ["a"])],
        start_from_section_id="b",
        lesson_plan=lesson_plan,
        **kw,
    )


def hang_on_the_model(conn):
    started = asyncio.Event()

    async def never(model, messages, **kw):
        started.set()
        await asyncio.Event().wait()

    conn.llm.chat.completions.create = never
    return started


def terminate_flow(conn, start):
    started = hang_on_the_model(conn)

    async def go():
        async with serving() as client:
            accepted = await start(client)
            body = await accepted.json()
            status_path = URL(body["status_query_get_uri"]).path
            await asyncio.wait_for(started.wait(), 10)
            denied = await client.post(
                f"{status_path}/terminate", headers={"x-api-key": "nope"}
            )
            done = await client.post(
                f"{status_path}/terminate", headers={"x-api-key": KEY}
            )
            again = await client.post(
                f"{status_path}/terminate", headers={"x-api-key": KEY}
            )
            final = await (
                await client.get(status_path, headers={"x-api-key": KEY})
            ).json()
            unknown = await client.post(
                f"{PLANS}/nope/terminate", headers={"x-api-key": KEY}
            )
            return (
                denied.status,
                (done.status, await done.json()),
                again.status,
                final,
                unknown.status,
            )

    return asyncio.run(go())


def test_generate_returns_202_then_posts_statuses_under_the_instance_id(conn):
    status, data = call("POST", PLANS, payload([section("a")]), wait=True)
    assert status == 202
    assert [p["status"] for p in conn.posted] == [
        "PENDING",
        "RUNNING",
        "COMPLETED",
    ]
    assert {p["instance_id"] for p in conn.posted} == {data["instance_id"]}
    assert data["instance_id"] != "plan-1"
    assert data["run"]["runtimeStatus"] == "Completed"
    assert data["run"]["output"]["_id"] == data["instance_id"]


def test_generate_stays_202_when_the_webhook_receiver_fails(conn):
    async def broken(status):
        raise ConnectionError("receiver down")

    conn.post_status = broken
    status, data = call("POST", PLANS, payload([section("a")]), wait=True)
    assert status == 202
    assert data["run"]["runtimeStatus"] == "Completed"


def test_generate_also_accepts_the_trailing_slash(conn):
    status, data = call("POST", PLANS + "/", payload([section("a")]), wait=True)
    assert status == 202
    assert data["run"]["runtimeStatus"] == "Completed"


def test_a_plan_that_fails_while_running_is_reported_by_status_and_webhook(
    conn,
):
    conn.llm.reply = lambda prompt, kw: "null"
    status, data = call("POST", PLANS, payload([section("a")]), wait=True)
    assert status == 202
    assert data["run"]["runtimeStatus"] == "Failed"
    assert conn.posted[-1]["status"] == "FAILED"
    assert "JSON null" in data["run"]["output"]


def test_a_crashed_job_is_logged_and_ends_failed_with_its_type_and_message(
    conn, monkeypatch, caplog
):
    async def crash(self, raw, plan_id="", webhook=True):
        raise RuntimeError("boom")

    monkeypatch.setattr(steps.SectionGraph, "plan", crash)
    with caplog.at_level(logging.ERROR, logger="period_plan_server"):
        status, data = call("POST", PLANS, payload([section("a")]), wait=True)
    assert status == 202
    assert data["run"]["runtimeStatus"] == "Failed"
    assert data["run"]["output"] == "RuntimeError: boom"
    assert f"Run {data['instance_id']} crashed" in caplog.text


@pytest.mark.parametrize(
    "raw, message",
    [
        (payload([section("a", ["missing"])]), "'missing'"),
        (
            payload(
                [section("a"), section("b", ["a"])],
                start_from_section_id="b",
                lesson_plan={"sections": []},
            ),
            "Missing dependency content",
        ),
        (
            payload(
                [section("a")],
                start_from_section_id="a",
                lesson_plan={
                    "sections": [
                        {
                            "section_id": "a",
                            "section_title": "A",
                            "content": None,
                        }
                    ]
                },
            ),
            "no content for sections ['a']",
        ),
    ],
)
@pytest.mark.parametrize("path", [PLANS, PLANS + "/checklist"])
def test_a_workflow_that_cannot_run_is_400_and_starts_nothing(
    conn, path, raw, message
):
    status, data = call("POST", path, raw)
    assert status == 400
    assert message in data["error"]
    assert "instance_id" not in data
    assert conn.posted == []
    assert conn.llm.prompts == []


def test_generate_rejects_an_invalid_body_with_400(conn):
    status, data = call("POST", PLANS, {"lp_level": "CHAPTER"})
    assert status == 400
    assert "workflow" in data["error"]
    assert conn.posted == []


def test_a_bad_request_body_is_not_echoed_back(conn):
    status, data = call(
        "POST", PLANS, {"user_id": SECRET, "lp_level": "CHAPTER"}
    )
    assert status == 400
    assert "workflow" in data["error"]
    assert SECRET not in data["error"]


def test_unknown_instance_id_is_404(conn):
    status, data = call("GET", f"{PLANS}/nope")
    assert status == 404
    assert "instance_id" in data["error"]


def test_checklist_returns_the_plan_directly_and_posts_no_status(conn):
    conn.llm.reply = lambda p, kw: "NEW"
    status, data = call("POST", f"{PLANS}/checklist", checklist_payload())
    assert status == 200
    assert {s["section_id"]: s["content"] for s in data["sections"]} == {
        "a": "OLD-A",
        "b": "NEW",
    }
    assert conn.posted == []


def test_checklist_requires_a_known_start_section(conn):
    status, data = call("POST", f"{PLANS}/checklist", payload([section("a")]))
    assert status == 400
    assert (
        data["error"] == "start_from_section_id is required for checklist mode"
    )
    status, data = call(
        "POST",
        f"{PLANS}/checklist",
        payload([section("a")], start_from_section_id="zz"),
    )
    assert status == 400
    assert "Section ID 'zz' not found in workflow" in data["error"]


def test_checklist_failure_is_500_with_the_reason(conn):
    conn.llm.reply = lambda p, kw: "null"
    status, data = call("POST", f"{PLANS}/checklist", checklist_payload())
    assert status == 500
    assert "JSON null" in data["error"]


def test_checklist_timeout_is_504(conn, monkeypatch):
    monkeypatch.setattr(server, "CHECKLIST_TIMEOUT_SECONDS", 0)
    status, data = call("POST", f"{PLANS}/checklist", checklist_payload())
    assert status == 504
    assert "did not finish" in data["error"]


def test_finished_runs_are_dropped_oldest_first(conn, monkeypatch):
    monkeypatch.setattr(server, "MAX_RETAINED_RUNS", 2)

    async def go():
        async with serving() as client:
            ids = []
            for _ in range(4):
                response = await client.post(
                    PLANS, json=payload([section("a")])
                )
                ids.append((await response.json())["instance_id"])
                await asyncio.gather(*client.server.app[server.TASKS].values())
            return [(await client.get(f"{PLANS}/{i}")).status for i in ids]

    assert asyncio.run(go()) == [404, 404, 200, 200]


def test_flows_are_listed_with_their_parameters():
    status, data = call("GET", PIPELINES)
    assert status == 200
    assert {"period_plan", "chapter"} <= set(data)
    assert {"source", "grade", "subject", "workflow_template"} <= set(
        data["period_plan"]
    )


def test_workbook_upload_runs_the_named_flow_and_returns_the_plans(conn):
    status, data = call(
        "POST", f"{PIPELINES}/period_plan", form=upload(), wait=True
    )
    assert status == 202
    assert data["status_query_get_uri"].endswith(
        f"{PIPELINES}/runs/{data['instance_id']}"
    )
    assert data["run"]["runtimeStatus"] == "Completed"
    (output,) = data["run"]["output"]["outputs"]
    assert data["run"]["output"]["errors"] == []
    assert len(output["payloads"]) == 3
    assert {r["status"] for r in output["lesson_plans"].values()} == {
        "completed"
    }
    assert all(r["plan"]["sections"] for r in output["lesson_plans"].values())
    assert conn.posted == []


def test_webhook_is_opt_in_for_a_batch_run(conn):
    call(
        "POST",
        f"{PIPELINES}/period_plan",
        form=upload(PARAMS | {"webhook": True}),
        wait=True,
    )
    assert {p["status"] for p in conn.posted} == {
        "PENDING",
        "RUNNING",
        "COMPLETED",
    }


def test_run_that_fails_reports_the_reason_in_status(conn):
    status, data = call(
        "POST",
        f"{PIPELINES}/period_plan",
        form=upload({k: v for k, v in PARAMS.items() if k != "subject"}),
        wait=True,
    )
    assert status == 202
    assert data["run"]["runtimeStatus"] == "Failed"
    assert any("--param subject" in e for e in data["run"]["output"]["errors"])


def test_pipeline_route_accepts_a_numeric_grade(conn):
    status, data = call(
        "POST",
        f"{PIPELINES}/period_plan",
        form=upload(PARAMS | {"grade": 6}),
        wait=True,
    )
    assert status == 202
    assert data["run"]["runtimeStatus"] == "Completed"


def test_pipeline_route_caps_concurrency():
    status, data = call(
        "POST",
        f"{PIPELINES}/period_plan",
        form=upload(PARAMS | {"concurrency": 1000}),
    )
    assert status == 400
    assert "maximum" in data["error"]


def test_params_may_arrive_as_a_file_part(conn):
    status, data = call(
        "POST",
        f"{PIPELINES}/period_plan",
        form=upload(params_filename="params.json"),
        wait=True,
    )
    assert status == 202
    assert data["run"]["runtimeStatus"] == "Completed"


def test_two_periods_with_the_same_topic_title_fail_the_run_instead_of_overwriting(  # noqa: E501
    conn,
):
    rows = [
        (
            "Chapter Number",
            "Chapter title",
            "Period",
            "Topic",
            "Learning outcomes",
        ),
        (18, "Devotion", 1, "Hindu", "LO a"),
        (None, None, 2, "Hindu", "LO b"),
    ]
    status, data = call(
        "POST",
        f"{PIPELINES}/period_plan",
        form=upload(content=workbook(rows)),
        wait=True,
    )
    assert status == 202
    assert data["run"]["runtimeStatus"] == "Failed"
    assert any("same _id" in e for e in data["run"]["output"]["errors"])


def test_runs_are_off_without_an_api_key(monkeypatch):
    monkeypatch.delenv("PIPELINE_API_KEY")
    status, data = call("POST", f"{PIPELINES}/period_plan", form=upload())
    assert status == 503
    assert "PIPELINE_API_KEY" in data["error"]


def test_wrong_api_key_is_401():
    status, data = call(
        "POST",
        f"{PIPELINES}/period_plan",
        form=upload(),
        headers={"x-api-key": "nope"},
    )
    assert status == 401
    assert "x-api-key" in data["error"]


def test_unknown_flow_is_404_and_lists_the_flows():
    status, data = call("POST", f"{PIPELINES}/nope", form=upload())
    assert status == 404
    assert "period_plan" in data["error"]


def test_flow_name_cannot_reach_other_files():
    status, _ = call("POST", f"{PIPELINES}/..%2Fetc%2Fpasswd", form=upload())
    assert status == 404


def test_unknown_parameter_is_400_and_names_the_valid_ones():
    status, data = call(
        "POST",
        f"{PIPELINES}/period_plan",
        form=upload(PARAMS | {"gradee": "6"}),
    )
    assert status == 400
    assert "Additional properties are not allowed" in data["error"]
    assert "'gradee' was unexpected" in data["error"]


def test_missing_file_and_bad_params_are_400():
    status, data = call(
        "POST", f"{PIPELINES}/period_plan", form=upload(send_file=False)
    )
    assert status == 400
    assert "'file'" in data["error"]
    status, data = call(
        "POST", f"{PIPELINES}/period_plan", form=upload("{not json")
    )
    assert status == 400
    assert "not valid JSON" in data["error"]
    status, data = call("POST", f"{PIPELINES}/period_plan", form=upload("[1]"))
    assert status == 400
    assert "JSON object" in data["error"]


def test_pipeline_run_status_needs_the_api_key_but_lesson_plan_status_stays_open():  # noqa: E501
    status, _ = call(
        "GET", f"{PIPELINES}/runs/x", headers={"x-api-key": "wrong"}
    )
    assert status == 401
    status, _ = call("GET", f"{PLANS}/x", headers={"x-api-key": "wrong"})
    assert status == 404


def test_a_running_plan_can_be_terminated_and_the_backend_hears_about_it(conn):
    async def start(client):
        return await client.post(PLANS, json=payload([section("a")]))

    denied, (status, body), again, final, unknown = terminate_flow(conn, start)
    assert denied == 401
    assert status == 200
    assert again == 409
    assert unknown == 404
    assert body["runtimeStatus"] == "Terminated"
    assert final["runtimeStatus"] == "Terminated"
    assert conn.posted[-1]["status"] == "FAILED"
    assert "terminated" in conn.posted[-1]["output"]


def test_a_running_pipeline_can_be_terminated(conn):
    async def start(client):
        return await client.post(
            f"{PIPELINES}/period_plan",
            data=upload(),
            headers={"x-api-key": KEY},
        )

    _, (status, _), again, final, _ = terminate_flow(conn, start)
    assert status == 200
    assert again == 409
    assert final["runtimeStatus"] == "Terminated"


def test_terminate_is_off_without_an_api_key(monkeypatch):
    monkeypatch.delenv("PIPELINE_API_KEY")
    status, data = call("POST", f"{PLANS}/x/terminate")
    assert status == 503
    assert "Terminate is off" in data["error"]


def test_the_server_will_not_start_without_a_webhook_url(
    azure_env, monkeypatch
):
    monkeypatch.delenv("WEBHOOK_URL", raising=False)
    with pytest.raises(RuntimeError, match="WEBHOOK_URL"):
        server.build_graph()


def test_the_server_builds_its_graph_when_the_environment_is_set(
    azure_env, monkeypatch
):
    monkeypatch.setenv("WEBHOOK_URL", "http://backend/hook")
    assert isinstance(server.build_graph(), steps.SectionGraph)
