"""Send period_plan.yaml payloads to the lesson-plan API and save each finished plan."""

import argparse
import hashlib
import json
import sys
import time
import urllib.error
import urllib.request
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path


def call(url, body=None, timeout=30):
    req = urllib.request.Request(url, json.dumps(body).encode() if body else None, {"Content-Type": "application/json"})
    with urllib.request.urlopen(req, timeout=timeout) as resp:
        return json.load(resp)


def run_one(payload, url, out_dir, interval, max_polls):
    out = out_dir / f"{hashlib.sha256(payload['_id'].encode()).hexdigest()[:16]}.json"
    if out.exists():  # idempotent re-run
        return payload["_id"], "skipped"
    try:
        status_url = call(url, payload)["status_query_get_uri"]
        for _ in range(max_polls):
            status = call(status_url)
            state = status.get("runtimeStatus")
            if state == "Completed":
                out.write_text(json.dumps(status["output"], indent=2, ensure_ascii=False), encoding="utf-8")
                return payload["_id"], "completed"
            if state in ("Failed", "Terminated"):
                return payload["_id"], f"{state}: {status.get('output')}"
            time.sleep(interval)
        return payload["_id"], f"still running after {max_polls * interval}s, raise --max-polls and re-run"
    except (urllib.error.URLError, KeyError, ValueError) as exc:
        return payload["_id"], f"request failed ({exc}), check --url and that the API is reachable"


def main():
    p = argparse.ArgumentParser(description=__doc__)
    p.add_argument("input", type=Path, help="omni-ingest json output of period_plan.yaml")
    p.add_argument("--url", required=True, help="lesson-plan API, e.g. https://<host>/api/v2/lesson-plans")
    p.add_argument("--out", type=Path, default=Path("period_plans"), help="folder for finished plans")
    p.add_argument("--concurrency", type=int, default=1)
    p.add_argument("--interval", type=int, default=10, help="seconds between status polls")
    p.add_argument("--max-polls", type=int, default=60)
    args = p.parse_args()

    data = json.loads(args.input.read_text(encoding="utf-8"))
    payloads = [x for run in data.get("runs", [data]) for x in run["metadata"]["payloads"]]
    args.out.mkdir(parents=True, exist_ok=True)
    with ThreadPoolExecutor(args.concurrency) as pool:
        results = list(pool.map(lambda x: run_one(x, args.url, args.out, args.interval, args.max_polls), payloads))
    failed = [(i, r) for i, r in results if r not in ("completed", "skipped")]
    for i, r in failed:
        print(f"FAILED {i}: {r}", file=sys.stderr)
    print(f"{len(results) - len(failed)}/{len(results)} plans ready in {args.out}")
    sys.exit(bool(failed))


if __name__ == "__main__":
    main()
