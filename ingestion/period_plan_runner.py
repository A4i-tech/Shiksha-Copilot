import argparse
import asyncio
import hashlib
import hmac
import json
import os
import sys
import time
from pathlib import Path
from typing import Any

import httpx
import yaml
from langfuse.openai import AsyncAzureOpenAI
from omni_ingest.core.model import StepStatus
from omni_ingest.core.pipeline import (
    IngestionContext,
    PipelineRunner,
    create_pipeline_from_config,
)
from qdrant_client import AsyncQdrantClient

import period_plan_steps as steps
from period_plan_settings import settings

STATUS_ATTEMPTS = 6  # waits 1+2+4+8+16 s, long enough for the plan record
APP_DIR = Path(__file__).parent
PIPELINE = APP_DIR / "period_plan.yaml"


def read_yaml(path: Path) -> dict:
    return yaml.safe_load(path.read_text(encoding="utf-8"))


FLOWS = {
    p.stem: read_yaml(p)["parameters"]["properties"]
    for p in sorted(APP_DIR.glob("*.yaml"))
}
PARAMETERS = FLOWS[PIPELINE.stem]
SECTION_GRAPH = next(
    s["config"]
    for s in read_yaml(PIPELINE)["steps"]
    if s["agent"] == "section_graph"
)


def coerce(properties: dict, name: str, value: Any) -> Any:
    """Give a value the type that the yaml declares."""
    if name not in properties:
        raise ValueError(
            f"Unknown parameter '{name}'. Use one of: {', '.join(properties)}."
        )
    if properties[name]["type"] == "string":
        if isinstance(value, str):
            return value
        return (
            json.dumps(value) if isinstance(value, (dict, list)) else str(value)
        )
    if not isinstance(value, str):
        return value
    try:
        return json.loads(value)
    except ValueError as e:
        raise ValueError(
            f"The value of '{name}' must be valid JSON, for example top_k=5."
        ) from e


def name_value(arg: str) -> tuple[str, Any]:
    name, sep, value = arg.partition("=")
    if not sep:
        raise argparse.ArgumentTypeError(
            f"invalid --param '{arg}'. Use NAME=VALUE, for example top_k=5."
        )
    try:
        return name, coerce(PARAMETERS, name, value)
    except ValueError as e:
        raise argparse.ArgumentTypeError(f"invalid --param '{arg}'. {e}") from e


def model_defaults() -> dict[str, str]:
    return {
        "model": os.environ.get(
            "AZURE_OPENAI_MODEL", PARAMETERS["model"]["default"]
        ),
        "embed_model": os.environ.get(
            "AZURE_OPENAI_EMBED_MODEL", PARAMETERS["embed_model"]["default"]
        ),
    }


def build_pipeline(
    flow: str,
    params: dict[str, Any],
    input_name: str,
    conn: steps.Connections,
) -> PipelineRunner:
    properties = FLOWS[flow]
    config = {
        k: v for k, v in model_defaults().items() if k in properties
    } | params
    if "source" in properties:
        config.setdefault(
            "source", "xlsx" if input_name.lower().endswith(".xlsx") else "pdf"
        )
    pipeline = create_pipeline_from_config(
        APP_DIR / f"{flow}.yaml", config_args=config
    )
    for step in pipeline.steps:
        if isinstance(step, steps.SectionGraph):
            step.conn = conn
    return pipeline


async def run_pipeline(
    pipeline: PipelineRunner, path: Path
) -> tuple[list[dict], list[str]]:
    outputs, errors = [], []
    makes_plans = any(isinstance(s, steps.SectionGraph) for s in pipeline.steps)
    async for ctx in pipeline.flatten(IngestionContext(resource=path)):
        results = await pipeline.run(ctx)
        failures = [r.error for r in results if r.status == StepStatus.FAILURE]
        errors += failures
        output = ctx.metadata
        # a failed step stops the run before section_graph sets the plans
        if makes_plans and not failures:
            plans = ctx.metadata["lesson_plans"]
            errors += [
                f"{plan_id}: {r.error}"
                for plan_id, r in plans.items()
                if r.status == steps.PlanStatus.FAILED
            ]
            output = output | {
                "lesson_plans": {
                    k: r.model_dump(mode="json") for k, r in plans.items()
                }
            }
        outputs.append(output)
    return outputs, errors


def retryable(e: Exception) -> bool:
    if not isinstance(e, httpx.HTTPStatusError):
        return isinstance(e, httpx.TransportError)
    code = e.response.status_code
    # 404: the backend has not saved the plan record yet
    return code in (404, 429) or code >= 500


def connect(out_dir: Path | None = None) -> steps.Connections:
    cfg = settings()

    async def post_status(status: steps.Status) -> None:
        if not cfg.webhook_url:
            return
        body = status.model_dump_json().encode()

        async def post_once() -> None:
            stamp = str(int(time.time()))
            sign = hmac.new(
                cfg.webhook_secret.encode(),
                stamp.encode() + b"." + body,
                hashlib.sha256,
            )
            headers = {
                "Content-Type": "application/json",
                "X-Webhook-Timestamp": stamp,
                "X-Webhook-Signature": sign.hexdigest(),
            }
            reply = await http.post(
                cfg.webhook_url, content=body, headers=headers
            )
            reply.raise_for_status()

        async with httpx.AsyncClient(timeout=30) as http:
            # a brief outage must not lose COMPLETED or FAILED
            await steps.retry(
                post_once, STATUS_ATTEMPTS, retryable, "post the plan status"
            )

    def target(plan_id: str) -> Path:
        return (
            out_dir
            / f"{hashlib.sha256(plan_id.encode()).hexdigest()[:16]}.json"
        )

    def save(plan_id: str, plan: dict) -> None:
        path = target(plan_id)
        tmp = path.with_suffix(".tmp")
        tmp.write_text(
            json.dumps(plan, indent=2, ensure_ascii=False), encoding="utf-8"
        )
        os.replace(tmp, path)

    return steps.Connections(
        qdrant=AsyncQdrantClient(
            url=cfg.qdrant_url, api_key=cfg.qdrant_api_key
        ),
        llm=AsyncAzureOpenAI(
            azure_endpoint=cfg.azure_openai_api_base,
            api_key=cfg.azure_openai_api_key,
            api_version=cfg.azure_openai_api_version,
        ),
        post_status=post_status,
        is_done=lambda plan_id: (
            out_dir is not None and target(plan_id).exists()
        ),
        save=save if out_dir else lambda *_: None,
    )


async def main() -> int:
    p = argparse.ArgumentParser()
    p.add_argument(
        "input",
        type=Path,
        help="textbook PDF, or a learning-outcome xlsx workbook",
    )
    p.add_argument(
        "--workflow-template",
        type=Path,
        required=True,
        help="workflow template JSON file",
    )
    p.add_argument(
        "--out",
        type=Path,
        default=Path("period_plans"),
        help="folder for finished plans",
    )
    p.add_argument(
        "--concurrency",
        type=int,
        default=1,
        help="plans generated at the same time",
    )
    p.add_argument(
        "--param",
        action="append",
        default=[],
        metavar="NAME=VALUE",
        type=name_value,
        help=(
            "override a period_plan.yaml parameter. A string parameter keeps "
            "VALUE as text. Any other parameter reads VALUE as JSON."
        ),
    )
    args = p.parse_args()

    template = args.workflow_template.read_text(encoding="utf-8")
    try:
        steps.Workflow.model_validate_json(template)
    except ValueError as e:
        sys.exit(
            f"Workflow template {args.workflow_template} is not valid: "
            f"{steps.reason(e)}"
        )
    params = {"workflow_template": template, "concurrency": args.concurrency}
    params.update(args.param)
    args.out.mkdir(parents=True, exist_ok=True)
    try:
        pipeline = build_pipeline(
            PIPELINE.stem, params, args.input.name, connect(args.out)
        )
    except (RuntimeError, ValueError) as e:
        sys.exit(str(e))
    outputs, errors = await run_pipeline(pipeline, args.input)
    plans = [
        p
        for o in outputs
        if "lesson_plans" in o
        for p in o["lesson_plans"].values()
    ]
    ready = sum(
        p["status"] in (steps.PlanStatus.COMPLETED, steps.PlanStatus.SKIPPED)
        for p in plans
    )
    for error in errors:
        print(f"FAILED {error}", file=sys.stderr)
    print(f"{ready}/{len(plans)} plans ready in {args.out}")
    return int(bool(errors))


if __name__ == "__main__":
    sys.exit(asyncio.run(main()))
