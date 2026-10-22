import asyncio
import hmac
import json
import logging
import os
import tempfile
import uuid
from pathlib import Path
from typing import Any, Awaitable

import yaml
from aiohttp import web
from omni_ingest.core.model import StepStatus
from omni_ingest.core.pipeline import IngestionContext, create_pipeline_from_config

import period_plan_runner as runner
import period_plan_steps as steps

log = logging.getLogger(__name__)
CHECKLIST_TIMEOUT_SECONDS = 300
APP_DIR = Path(__file__).parent
GRAPH = web.AppKey("graph", steps.SectionGraph)
GATE = web.AppKey("gate", asyncio.Semaphore)
RUNS = web.AppKey("runs", dict)
TASKS = web.AppKey("tasks", dict)


def fail(message: str, status: int) -> web.Response:
    return web.json_response({"error": message}, status=status)


def bad_request(message: str) -> web.HTTPBadRequest:
    return web.HTTPBadRequest(text=json.dumps({"error": message}), content_type="application/json")


async def read_input(request: web.Request) -> tuple[dict, steps.LessonPlanGenerationInput]:
    try:
        raw = await request.json()
        return raw, steps.LessonPlanGenerationInput.model_validate(raw)
    except ValueError as e:
        raise bad_request(steps.reason(e)) from e


def launch(app: web.Application, instance_id: str, job: Awaitable[tuple[bool, Any]]) -> None:
    runs = app[RUNS]
    runs[instance_id] = {"instance_id": instance_id, "runtimeStatus": "Running", "output": None}
    log.info("Run %s started", instance_id)

    async def work() -> None:
        try:
            ok, output = await job
        except asyncio.CancelledError:
            runs[instance_id].update(runtimeStatus="Terminated", output="The run was terminated.")
            raise
        except Exception as e:  # a crash must not leave the run on "Running" forever
            ok, output = False, f"{type(e).__name__}: {e}"
        runs[instance_id].update(runtimeStatus="Completed" if ok else "Failed", output=output)
        log.info("Run %s ended as %s", instance_id, runs[instance_id]["runtimeStatus"])

    task = asyncio.create_task(work())
    app[TASKS][instance_id] = task
    task.add_done_callback(lambda _: app[TASKS].pop(instance_id, None))


def accepted(request: web.Request, instance_id: str, status_path: str) -> web.Response:
    return web.json_response({"instance_id": instance_id, "status_query_get_uri": str(request.url.with_path(f"{status_path}/{instance_id}"))}, status=202)


async def generate(request: web.Request) -> web.Response:
    raw, _ = await read_input(request)
    instance_id = uuid.uuid4().hex

    async def job() -> tuple[bool, Any]:
        result = await request.app[GRAPH]._plan(raw, instance_id)
        return result["status"] == "completed", result.get("plan") or result.get("error")

    launch(request.app, instance_id, job())
    return accepted(request, instance_id, request.path.rstrip("/"))


async def checklist(request: web.Request) -> web.Response:
    raw, inp = await read_input(request)
    if not inp.start_from_section_id:
        raise bad_request("start_from_section_id is required for checklist mode")
    if inp.start_from_section_id not in {s.id for s in inp.workflow.sections}:
        raise bad_request(f"Section ID '{inp.start_from_section_id}' not found in workflow")
    try:
        # The checklist is sync and the backend does not know its instance id, so it posts no webhook status.
        result = await asyncio.wait_for(request.app[GRAPH]._plan(raw, uuid.uuid4().hex, webhook=False), CHECKLIST_TIMEOUT_SECONDS)
    except asyncio.TimeoutError:
        return fail(f"The checklist did not finish in {CHECKLIST_TIMEOUT_SECONDS} seconds. Try again.", 504)
    if result["status"] != "completed":
        return fail(result["error"], 500)
    return web.json_response(result["plan"])


async def status(request: web.Request) -> web.Response:
    run = request.app[RUNS].get(request.match_info["instance_id"])
    if run is None:
        return fail("No run with this instance_id. The server keeps runs only until it restarts.", 404)
    return web.json_response(run)


async def pipeline_status(request: web.Request) -> web.Response:
    if denied := unauthorized(request, "Pipeline run status"):
        return denied
    return await status(request)


async def terminate(request: web.Request) -> web.Response:
    if denied := unauthorized(request, "Terminate"):
        return denied
    instance_id = request.match_info["instance_id"]
    run, task = request.app[RUNS].get(instance_id), request.app[TASKS].get(instance_id)
    if run is None:
        return fail("No run with this instance_id. The server keeps runs only until it restarts.", 404)
    if task is None:
        return fail(f"The run is already {run['runtimeStatus']}.", 409)
    task.cancel()
    await asyncio.gather(task, return_exceptions=True)
    return web.json_response(run)


def flows() -> dict[str, dict]:
    return {p.stem: (yaml.safe_load(p.read_text(encoding="utf-8")).get("parameters") or {}).get("properties", {}) for p in sorted(APP_DIR.glob("*.yaml"))}


async def list_flows(request: web.Request) -> web.Response:
    return web.json_response({name: {key: {"default": spec.get("default"), "description": spec.get("description")} for key, spec in params.items()} for name, params in flows().items()})


def unauthorized(request: web.Request, feature: str) -> web.Response | None:
    key = os.environ.get("PIPELINE_API_KEY")
    if not key:
        return fail(f"{feature} is off. Set PIPELINE_API_KEY on the service to turn it on.", 503)
    if not hmac.compare_digest(request.headers.get("x-api-key", "").encode(), key.encode()):
        return fail("The x-api-key header is missing or wrong.", 401)
    return None


async def run_pipeline(request: web.Request) -> web.Response:
    if denied := unauthorized(request, "Pipeline runs"):
        return denied
    flow, known = request.match_info["flow"], flows()
    if flow not in known:
        return fail(f"No flow named '{flow}'. Flows: {', '.join(known)}.", 404)
    form = await request.post()
    upload = form.get("file")
    if not hasattr(upload, "file"):
        raise bad_request("Send the input file in the multipart field 'file'.")
    try:
        params = json.loads(form.get("params") or "{}")
    except ValueError as e:
        raise bad_request(f"The multipart field 'params' is not valid JSON: {e}") from e
    if not isinstance(params, dict):
        raise bad_request("The multipart field 'params' must be a JSON object.")
    if unknown := sorted(set(params) - set(known[flow])):
        raise bad_request(f"Flow '{flow}' has no parameter {', '.join(unknown)}. Parameters: {', '.join(known[flow])}.")
    params = {name: runner.typed(known[flow], name, value) for name, value in params.items()}
    config = {**runner.model_defaults(), **params}
    if "source" in known[flow]:
        config.setdefault("source", "xlsx" if upload.filename.lower().endswith(".xlsx") else "pdf")
    if "webhook" in known[flow]:
        config.setdefault("webhook", False)  # batch plans are unknown to the backend, so they post no status
    try:
        pipeline = create_pipeline_from_config(APP_DIR / f"{flow}.yaml", config_args=config)
    except ValueError as e:
        raise bad_request(str(e)[:300]) from e
    data, name = upload.file.read(), Path(upload.filename).name or "input"

    async def job() -> tuple[bool, Any]:
        async with request.app[GATE]:
            with tempfile.TemporaryDirectory() as tmp:
                path = Path(tmp) / name
                path.write_bytes(data)
                outputs, errors = [], []
                # run_flattened waits for the whole pipeline when its consumer is cancelled, so Terminate would hang
                async for ctx in pipeline.flatten(IngestionContext(resource=path)):
                    results = await pipeline.run(ctx)
                    errors += [r.error for r in results if r.status == StepStatus.FAILURE]
                    errors += [f"{plan_id}: {r['error']}" for plan_id, r in ctx.metadata.get("lesson_plans", {}).items() if r["status"] == "failed"]
                    outputs.append(ctx.metadata)
        return not errors, {"outputs": outputs, "errors": errors}

    instance_id = uuid.uuid4().hex
    launch(request.app, instance_id, job())
    return accepted(request, instance_id, "/api/v2/pipelines/runs")


def make_app(graph: steps.SectionGraph) -> web.Application:
    steps.register()  # the pipeline route builds flows that use the custom steps
    app = web.Application(client_max_size=int(os.environ.get("MAX_UPLOAD_MB", "25")) * 1024 * 1024)
    app[GRAPH], app[RUNS], app[TASKS] = graph, {}, {}
    app[GATE] = asyncio.Semaphore(int(os.environ.get("MAX_PIPELINE_RUNS", "2")))
    app.router.add_post("/api/v2/lesson-plans", generate)
    app.router.add_post("/api/v2/lesson-plans/", generate)  # callers use both spellings of this path
    app.router.add_post("/api/v2/lesson-plans/checklist", checklist)
    app.router.add_get("/api/v2/lesson-plans/{instance_id}", status)
    app.router.add_post("/api/v2/lesson-plans/{instance_id}/terminate", terminate)
    app.router.add_get("/api/v2/pipelines", list_flows)
    app.router.add_post("/api/v2/pipelines/{flow}", run_pipeline)
    app.router.add_get("/api/v2/pipelines/runs/{instance_id}", pipeline_status)
    app.router.add_post("/api/v2/pipelines/runs/{instance_id}/terminate", terminate)
    return app


def build_graph() -> steps.SectionGraph:
    steps.CONN = runner.connect()
    steps.register()
    pipeline = create_pipeline_from_config(runner.PIPELINE, config_args={"workflow_template": "{}", **runner.model_defaults()})
    return next(step for step in pipeline.steps if isinstance(step, steps.SectionGraph))


if __name__ == "__main__":
    logging.basicConfig(level=os.environ.get("LOG_LEVEL", "INFO"), format="%(asctime)s %(levelname)s %(name)s: %(message)s")
    web.run_app(make_app(build_graph()), port=int(os.environ.get("PORT", "8080")))
