import argparse
import asyncio
import hashlib
import json
import os
import sys
from pathlib import Path

import httpx
import period_plan_steps as steps
from omni_ingest.core.model import StepStatus
from omni_ingest.core.pipeline import IngestionContext, create_pipeline_from_config, register_step
from openai import AsyncAzureOpenAI
from qdrant_client import AsyncQdrantClient

PIPELINE = Path(__file__).with_name("period_plan.yaml")


def name_value(arg: str) -> tuple[str, str]:
    name, sep, value = arg.partition("=")
    if not sep:
        raise argparse.ArgumentTypeError(f"invalid --param '{arg}'. Use NAME=VALUE, for example top_k=5.")
    return name, value


def connect(out_dir: Path) -> steps.Connections:
    url = os.environ.get("WEBHOOK_URL")

    async def post_status(status: dict) -> None:
        if url:
            async with httpx.AsyncClient(timeout=30) as http:
                (await http.post(url, json=status)).raise_for_status()

    def target(plan_id: str) -> Path:
        return out_dir / f"{hashlib.sha256(plan_id.encode()).hexdigest()[:16]}.json"

    def save(plan_id: str, plan: dict) -> None:
        path = target(plan_id)
        tmp = path.with_suffix(".tmp")
        tmp.write_text(json.dumps(plan, indent=2, ensure_ascii=False), encoding="utf-8")
        os.replace(tmp, path)

    return steps.Connections(
        qdrant=AsyncQdrantClient(url=os.environ.get("QDRANT_URL", "http://localhost:6333"), api_key=os.environ.get("QDRANT_API_KEY")),
        llm=AsyncAzureOpenAI(azure_endpoint=os.environ["AZURE_OPENAI_API_BASE"], api_key=os.environ["AZURE_OPENAI_API_KEY"], api_version=os.environ.get("AZURE_OPENAI_API_VERSION", "2023-05-15")),
        post_status=post_status,
        is_done=lambda plan_id: target(plan_id).exists(),
        save=save,
    )


async def main() -> int:
    for var in ("AZURE_OPENAI_API_BASE", "AZURE_OPENAI_API_KEY"):
        if not os.environ.get(var):
            sys.exit(f"Environment variable {var} is not set. See the environment variable table in the README.")
    p = argparse.ArgumentParser()
    p.add_argument("input", type=Path, help="textbook PDF")
    p.add_argument("--workflow-template", type=Path, required=True, help="workflow template JSON file")
    p.add_argument("--out", type=Path, default=Path("period_plans"), help="folder for finished plans")
    p.add_argument("--concurrency", type=int, default=1, help="plans generated at the same time")
    p.add_argument("--param", action="append", default=[], metavar="NAME=VALUE", type=name_value, help="override a period_plan.yaml parameter, VALUE is JSON or text")
    args = p.parse_args()

    template = args.workflow_template.read_text(encoding="utf-8")
    if "_id" not in json.loads(template):
        sys.exit(f"Workflow template {args.workflow_template} has no top-level \"_id\". Add an \"_id\" to the JSON object.")
    config = {"workflow_template": template, "concurrency": args.concurrency}
    for name, value in args.param:
        try:
            config[name] = json.loads(value)
        except ValueError:
            config[name] = value
    config.setdefault("model", os.environ.get("AZURE_OPENAI_MODEL", "GPT-4.1"))
    config.setdefault("embed_model", os.environ.get("AZURE_OPENAI_EMBED_MODEL", "text-embedding-ada-002"))

    args.out.mkdir(parents=True, exist_ok=True)
    steps.CONN = connect(args.out)
    register_step("section_graph", steps.SectionGraph, override=True)
    runner = create_pipeline_from_config(PIPELINE, config_args=config)

    failed, pipeline_errors, ready, total = [], [], 0, 0
    async for ctx, results in runner.run_flattened(IngestionContext(resource=args.input)):
        pipeline_errors += [("pipeline", r.error) for r in results if r.status == StepStatus.FAILURE]
        plans = ctx.metadata.get("lesson_plans", {})
        total += len(plans)
        ready += sum(r["status"] in ("completed", "skipped") for r in plans.values())
        failed += [(plan_id, r["error"]) for plan_id, r in plans.items() if r["status"] == "failed"]
    for plan_id, error in failed + pipeline_errors:
        print(f"FAILED {plan_id}: {error}", file=sys.stderr)
    print(f"{ready}/{total} plans ready in {args.out}")
    return int(bool(failed or pipeline_errors))


if __name__ == "__main__":
    sys.exit(asyncio.run(main()))
