"""Send period-plan payloads produced by the period_plan_chapter_grouping
omni-ingest profile to the lesson-plan Durable Functions API, and poll each
job to completion.

This is a small, deterministic wrapper -- not part of OmniIngest, since
POST-then-poll-until-terminal-state needs precise timing and exact status
matching, which is safer as real Python than as an LLM tool-call loop or a
new OmniIngest agent. See docs/period_plan.md for the full pipeline.

Usage::

    omni-ingest ingestion/profiles/period_plan_chapter_grouping.yaml \\
        --input workbook.xlsx --output run.json \\
        --grade "Grade 6" --subject math \\
        --workflow-template "$(python -c 'import json,sys;print(json.dumps(json.load(open(sys.argv[1]))))' workflow.json)"

    python ingestion/period_plan_api_runner.py \\
        --input run.json --config ingestion/config/period_plan_api.yaml \\
        --output-dir runs/period_plan/results
"""

from __future__ import annotations

import argparse
import asyncio
import json
from pathlib import Path
from typing import Any

import aiohttp
import yaml
from pydantic import BaseModel, Field


class ApiConfig(BaseModel):
    url: str
    post_timeout_secs: float = Field(default=30.0)
    poll_timeout_secs: float = Field(default=30.0)
    poll_interval_secs: float = Field(default=10.0)
    max_poll_retries: int = Field(default=60)
    concurrency: int = Field(default=4)

    @classmethod
    def from_yaml(cls, path: Path) -> ApiConfig:
        return cls.model_validate(yaml.safe_load(path.read_text(encoding="utf-8")))


async def run_payload(session: aiohttp.ClientSession, payload: dict[str, Any], cfg: ApiConfig) -> dict[str, Any]:
    """POSTs one payload, then polls its status_query_get_uri to a terminal state."""
    payload_id = payload.get("_id", "<unknown>")
    result: dict[str, Any] = {"_id": payload_id, "status": "failed", "message": "", "output": None}

    async with session.post(cfg.url, json=payload, timeout=aiohttp.ClientTimeout(total=cfg.post_timeout_secs)) as resp:
        if resp.status == 400:
            result["message"] = f"Bad Request: {await resp.text()}"
            return result
        resp.raise_for_status()
        start_response = await resp.json()

    status_uri = start_response.get("status_query_get_uri")
    if not status_uri:
        result["message"] = "No status_query_get_uri in start response"
        return result

    for _ in range(cfg.max_poll_retries):
        await asyncio.sleep(cfg.poll_interval_secs)
        try:
            async with session.get(status_uri, timeout=aiohttp.ClientTimeout(total=cfg.poll_timeout_secs)) as status_resp:
                status_resp.raise_for_status()
                status_data = await status_resp.json()
        except Exception as exc:  # transient network error; keep polling
            result["message"] = f"poll error (retrying): {type(exc).__name__}: {exc}"
            continue

        runtime_status = status_data.get("runtimeStatus")
        if runtime_status == "Completed":
            result["status"] = "completed"
            result["message"] = ""
            result["output"] = status_data.get("output", status_data)
            return result
        if runtime_status in ("Failed", "Terminated"):
            result["message"] = f"{runtime_status}: {status_data.get('output', 'no details')}"
            return result

    result["message"] = f"timed out after {cfg.max_poll_retries} polls"
    return result


async def run_all(payloads: list[dict[str, Any]], cfg: ApiConfig) -> list[dict[str, Any]]:
    connector = aiohttp.TCPConnector(limit=cfg.concurrency)
    async with aiohttp.ClientSession(connector=connector) as session:
        return await asyncio.gather(*(run_payload(session, p, cfg) for p in payloads))


def _parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--input", required=True, type=Path, help="omni-ingest --output JSON file containing metadata.payloads")
    parser.add_argument("--config", required=True, type=Path, help="ApiConfig yaml (see config/period_plan_api.example.yaml)")
    parser.add_argument("--output-dir", required=True, type=Path, help="Directory to write one result JSON file per payload")
    return parser.parse_args()


def main() -> None:
    args = _parse_args()
    cfg = ApiConfig.from_yaml(args.config)
    run_data = json.loads(args.input.read_text(encoding="utf-8"))
    payloads: list[dict[str, Any]] = run_data.get("metadata", {}).get("payloads", [])
    if not payloads:
        print(f"No payloads found in {args.input} (metadata.payloads is empty)")
        return

    results = asyncio.run(run_all(payloads, cfg))

    args.output_dir.mkdir(parents=True, exist_ok=True)
    failed = 0
    for result in results:
        (args.output_dir / f"{result['_id'].replace('/', '_')}.json").write_text(json.dumps(result, indent=2, ensure_ascii=False), encoding="utf-8")
        status = "OK" if result["status"] == "completed" else f"FAILED: {result['message']}"
        print(f"  [{status}] {result['_id']}")
        if result["status"] != "completed":
            failed += 1

    print(f"\n{len(results) - failed}/{len(results)} completed, {failed} failed.")
    raise SystemExit(1 if failed else 0)


if __name__ == "__main__":
    main()
