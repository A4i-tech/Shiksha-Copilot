import asyncio
import hmac
import json
import logging
import os
import sys
import tempfile
import uuid
from collections.abc import Awaitable
from pathlib import Path
from typing import Any

from aiohttp import web

import period_plan_runner as runner
import period_plan_steps as steps

log = logging.getLogger(__name__)
CHECKLIST_TIMEOUT_SECONDS = 200  # Azure App Service cuts a request at ~230 s
MAX_RETAINED_RUNS = 200
PIPELINE_RUNS_PATH = "/api/v2/pipelines/runs"
NO_RUN = (
    "No run with this instance_id. "
    "The server keeps runs only until it restarts."
)
GRAPH = web.AppKey("graph", steps.SectionGraph)
GATE = web.AppKey("gate", asyncio.Semaphore)
PLAN_GATE = web.AppKey("plan_gate", asyncio.Semaphore)
RUNS = web.AppKey("runs", dict)
TASKS = web.AppKey("tasks", dict)


def fail(message: str, status: int) -> web.HTTPException:
    error = web.HTTPException(
        text=json.dumps({"error": message}), content_type="application/json"
    )
    error.set_status(status)
    return error


async def read_input(
    request: web.Request,
) -> steps.LessonPlanGenerationInput:
    try:
        return steps.LessonPlanGenerationInput.model_validate(
            await request.json()
        )
    except ValueError as e:
        raise fail(steps.reason(e), 400) from e


def launch(
    app: web.Application, instance_id: str, job: Awaitable[tuple[bool, Any]]
) -> None:
    runs = app[RUNS]
    runs[instance_id] = {
        "instance_id": instance_id,
        "runtimeStatus": "Running",
        "output": None,
    }
    finished = [k for k, r in runs.items() if r["runtimeStatus"] != "Running"]
    for old in finished[: max(0, len(runs) - MAX_RETAINED_RUNS)]:
        del runs[old]
    log.info("Run %s started", instance_id)

    async def work() -> None:
        try:
            ok, output = await job
        except asyncio.CancelledError:
            runs[instance_id].update(
                runtimeStatus="Terminated", output="The run was terminated."
            )
            raise
        except Exception as e:
            log.exception("Run %s crashed", instance_id)
            ok, output = False, f"{type(e).__name__}: {e}"
        runs[instance_id].update(
            runtimeStatus="Completed" if ok else "Failed", output=output
        )
        log.info(
            "Run %s ended as %s",
            instance_id,
            runs[instance_id]["runtimeStatus"],
        )

    task = asyncio.create_task(work())
    app[TASKS][instance_id] = task
    task.add_done_callback(lambda _: app[TASKS].pop(instance_id, None))


def accepted(
    request: web.Request, instance_id: str, status_path: str
) -> web.Response:
    return web.json_response(
        {
            "instance_id": instance_id,
            "status_query_get_uri": str(
                request.url.with_path(f"{status_path}/{instance_id}")
            ),
        },
        status=202,
    )


async def generate(request: web.Request) -> web.Response:
    inp = await read_input(request)
    instance_id = uuid.uuid4().hex

    async def job() -> tuple[bool, Any]:
        async with request.app[PLAN_GATE]:
            result = await request.app[GRAPH].plan(
                inp.model_copy(update={"lp_id": instance_id})
            )
        ok = result.status == steps.PlanStatus.COMPLETED
        return ok, result.plan if ok else result.error

    launch(request.app, instance_id, job())
    return accepted(request, instance_id, request.path.rstrip("/"))


async def checklist(request: web.Request) -> web.Response:
    inp = await read_input(request)
    if not inp.start_from_section_id:
        raise fail("start_from_section_id is required for checklist mode", 400)
    graph = request.app[GRAPH].model_copy(update={"webhook": False})
    try:
        result = await asyncio.wait_for(
            graph.plan(inp.model_copy(update={"lp_id": uuid.uuid4().hex})),
            CHECKLIST_TIMEOUT_SECONDS,
        )
    except asyncio.TimeoutError:
        raise fail(
            f"The checklist did not finish in {CHECKLIST_TIMEOUT_SECONDS} "
            "seconds. Try again.",
            504,
        ) from None
    if result.status != steps.PlanStatus.COMPLETED:
        raise fail(result.error, 500)
    return web.json_response(result.plan)


async def status(request: web.Request) -> web.Response:
    run = request.app[RUNS].get(request.match_info["instance_id"])
    if run is None:
        raise fail(NO_RUN, 404)
    return web.json_response(run)


async def pipeline_status(request: web.Request) -> web.Response:
    authorize(request, "Pipeline run status")
    return await status(request)


async def terminate(request: web.Request) -> web.Response:
    authorize(request, "Terminate")
    instance_id = request.match_info["instance_id"]
    run, task = (
        request.app[RUNS].get(instance_id),
        request.app[TASKS].get(instance_id),
    )
    if run is None:
        raise fail(NO_RUN, 404)
    if task is None:
        raise fail(f"The run is already {run['runtimeStatus']}.", 409)
    task.cancel()
    await asyncio.gather(task, return_exceptions=True)
    return web.json_response(run)


async def list_flows(request: web.Request) -> web.Response:
    return web.json_response(runner.FLOWS)


def authorize(request: web.Request, feature: str) -> None:
    key = os.environ.get("PIPELINE_API_KEY")
    if not key:
        raise fail(
            f"{feature} is off. Set PIPELINE_API_KEY on the service to turn "
            "it on.",
            503,
        )
    if not hmac.compare_digest(
        request.headers.get("x-api-key", "").encode(), key.encode()
    ):
        raise fail("The x-api-key header is missing or wrong.", 401)


async def run_pipeline(request: web.Request) -> web.Response:
    authorize(request, "Pipeline runs")
    flow = request.match_info["flow"]
    if flow not in runner.FLOWS:
        raise fail(
            f"No flow named '{flow}'. Flows: {', '.join(runner.FLOWS)}.", 404
        )
    form = await request.post()
    upload = form.get("file")
    if not hasattr(upload, "file"):
        raise fail("Send the input file in the multipart field 'file'.", 400)
    text = form.get("params") or "{}"
    if hasattr(text, "file"):
        text = text.file.read().decode("utf-8", "replace")
    try:
        params = json.loads(text)
    except ValueError as e:
        raise fail(
            f"The multipart field 'params' is not valid JSON: {e}", 400
        ) from e
    if not isinstance(params, dict):
        raise fail("The multipart field 'params' must be a JSON object.", 400)
    properties = runner.FLOWS[flow]
    if "webhook" in properties:
        params.setdefault("webhook", False)
    try:
        pipeline = runner.build_pipeline(
            flow,
            {k: runner.coerce(properties, k, v) for k, v in params.items()},
            upload.filename,
            request.app[GRAPH].conn,
        )
    except ValueError as e:
        raise fail(str(e), 400) from e
    data, name = upload.file.read(), Path(upload.filename).name or "input"

    async def job() -> tuple[bool, Any]:
        async with request.app[GATE]:
            with tempfile.TemporaryDirectory() as tmp:
                path = Path(tmp) / name
                path.write_bytes(data)
                outputs, errors = await runner.run_pipeline(pipeline, path)
        return not errors, {"outputs": outputs, "errors": errors}

    instance_id = uuid.uuid4().hex
    launch(request.app, instance_id, job())
    return accepted(request, instance_id, PIPELINE_RUNS_PATH)


def make_app(graph: steps.SectionGraph) -> web.Application:
    app = web.Application(
        client_max_size=int(os.environ.get("MAX_UPLOAD_MB", "25")) * 1024 * 1024
    )
    app[GRAPH], app[RUNS], app[TASKS] = graph, {}, {}
    app[GATE] = asyncio.Semaphore(int(os.environ.get("MAX_PIPELINE_RUNS", "2")))
    app[PLAN_GATE] = asyncio.Semaphore(
        int(os.environ.get("MAX_LESSON_PLAN_RUNS", "10"))
    )
    app.router.add_post("/api/v2/lesson-plans", generate)
    app.router.add_post("/api/v2/lesson-plans/", generate)
    app.router.add_post("/api/v2/lesson-plans/checklist", checklist)
    app.router.add_get("/api/v2/lesson-plans/{instance_id}", status)
    app.router.add_post(
        "/api/v2/lesson-plans/{instance_id}/terminate", terminate
    )
    app.router.add_get("/api/v2/pipelines", list_flows)
    app.router.add_post("/api/v2/pipelines/{flow}", run_pipeline)
    app.router.add_get(f"{PIPELINE_RUNS_PATH}/{{instance_id}}", pipeline_status)
    app.router.add_post(
        f"{PIPELINE_RUNS_PATH}/{{instance_id}}/terminate", terminate
    )
    return app


def build_graph() -> steps.SectionGraph:
    if not os.environ.get("WEBHOOK_URL"):
        raise RuntimeError(
            "Environment variable WEBHOOK_URL is not set. The server needs it "
            "to report plan status. See the environment variable table in the "
            "README."
        )
    defaults = runner.model_defaults()
    return steps.SectionGraph(
        model=defaults["model"],
        prompts=runner.SECTION_GRAPH["prompts"],
        retrieve=steps.QdrantRetrieve(embed_model=defaults["embed_model"]),
        conn=runner.connect(),
    )


if __name__ == "__main__":
    logging.basicConfig(
        level=os.environ.get("LOG_LEVEL", "INFO"),
        format="%(asctime)s %(levelname)s %(name)s: %(message)s",
    )
    try:
        graph = build_graph()
    except RuntimeError as e:
        sys.exit(str(e))
    web.run_app(make_app(graph), port=int(os.environ.get("PORT", "8080")))
