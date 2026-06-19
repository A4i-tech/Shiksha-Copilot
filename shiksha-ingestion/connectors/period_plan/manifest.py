from __future__ import annotations

import csv
import datetime
import json
from pathlib import Path
from typing import Any


def write_manifest(
    run_dir: Path,
    run_id: str,
    config_snapshot: dict[str, Any],
    steps: dict[str, Any],
    reports_dirname: str = "reports",
) -> Path:
    reports_dir = run_dir / reports_dirname
    reports_dir.mkdir(parents=True, exist_ok=True)
    manifest: dict[str, Any] = {
        "run_id": run_id,
        "completed_at": datetime.datetime.now().isoformat(),
        "config": config_snapshot,
        "steps": steps,
    }
    path = reports_dir / "manifest.json"
    path.write_text(json.dumps(manifest, indent=2, ensure_ascii=False), encoding="utf-8")
    return path


def write_failed_csv(
    run_dir: Path,
    failed_records: list[dict[str, Any]],
    reports_dirname: str = "reports",
) -> Path | None:
    if not failed_records:
        return None
    reports_dir = run_dir / reports_dirname
    reports_dir.mkdir(parents=True, exist_ok=True)
    path = reports_dir / "failed.csv"
    with path.open("w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=["file_path", "error_message", "timestamp"])
        writer.writeheader()
        writer.writerows(failed_records)
    return path
