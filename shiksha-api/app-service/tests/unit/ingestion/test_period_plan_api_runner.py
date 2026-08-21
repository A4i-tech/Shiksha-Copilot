"""Unit test for period_plan_api_runner against a tiny stdlib mock of the
Azure Durable Functions POST+poll contract (start -> status_query_get_uri ->
poll until runtimeStatus is Completed/Failed).
"""

from __future__ import annotations

import asyncio
import importlib.util
import json
import sys
import threading
import time
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path

MODULE_PATH = Path(__file__).resolve().parents[3] / "ingestion" / "period_plan_api_runner.py"
spec = importlib.util.spec_from_file_location("period_plan_api_runner", MODULE_PATH)
period_plan_api_runner = importlib.util.module_from_spec(spec)
sys.modules["period_plan_api_runner"] = period_plan_api_runner
spec.loader.exec_module(period_plan_api_runner)

ApiConfig = period_plan_api_runner.ApiConfig
run_all = period_plan_api_runner.run_all

_STARTED_AT: dict[str, float] = {}
_COMPLETE_AFTER_SECS = 0.3


class _MockDurableHandler(BaseHTTPRequestHandler):
    def log_message(self, format: str, *args: object) -> None:
        pass

    def _send_json(self, obj: dict) -> None:
        body = json.dumps(obj).encode()
        self.send_response(200)
        self.send_header("Content-Type", "application/json")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def do_POST(self) -> None:
        length = int(self.headers.get("Content-Length", 0))
        payload = json.loads(self.rfile.read(length) or b"{}")
        job_id = payload.get("_id", "job-1")
        if job_id == "bad-request":
            self.send_response(400)
            body = b"missing field"
            self.send_header("Content-Length", str(len(body)))
            self.end_headers()
            self.wfile.write(body)
            return
        _STARTED_AT[job_id] = time.time()
        self._send_json({"status_query_get_uri": f"{self.server.base_url}/status/{job_id}"})  # type: ignore[attr-defined]

    def do_GET(self) -> None:
        job_id = self.path.rsplit("/", 1)[-1]
        if job_id == "always-fails":
            self._send_json({"runtimeStatus": "Failed", "output": "boom"})
            return
        elapsed = time.time() - _STARTED_AT.get(job_id, time.time())
        if elapsed < _COMPLETE_AFTER_SECS:
            self._send_json({"runtimeStatus": "Running"})
        else:
            self._send_json({"runtimeStatus": "Completed", "output": {"_id": job_id, "sections": []}})


def _start_mock_server() -> ThreadingHTTPServer:
    server = ThreadingHTTPServer(("127.0.0.1", 0), _MockDurableHandler)
    server.base_url = f"http://127.0.0.1:{server.server_port}"  # type: ignore[attr-defined]
    threading.Thread(target=server.serve_forever, daemon=True).start()
    return server


def test_period_plan_api_runner_completes_and_fails():
    server = _start_mock_server()
    try:
        cfg = ApiConfig(url=f"{server.base_url}/api/v2/lesson-plans", poll_interval_secs=0.1, max_poll_retries=20)
        payloads = [
            {"_id": "job-ok"},
            {"_id": "always-fails"},
            {"_id": "bad-request"},
        ]
        results = asyncio.run(run_all(payloads, cfg))
    finally:
        server.shutdown()

    by_id = {r["_id"]: r for r in results}
    assert by_id["job-ok"]["status"] == "completed"
    assert by_id["job-ok"]["output"]["_id"] == "job-ok"
    assert by_id["always-fails"]["status"] == "failed"
    assert "Failed" in by_id["always-fails"]["message"]
    assert by_id["bad-request"]["status"] == "failed"
    assert "Bad Request" in by_id["bad-request"]["message"]
