"""Period plan generation connector for Shiksha-Copilot.

Usage:
    python -m connectors.period_plan --profile profiles/period_plan_generation_v1.yaml run
    python -m connectors.period_plan --profile period_plan_generation_v1 excel-to-curated
    python -m connectors.period_plan --profile period_plan_generation_v1 curated-to-payloads
    python -m connectors.period_plan --profile period_plan_generation_v1 api
    python -m connectors.period_plan --profile period_plan_generation_v1 validate
"""
from __future__ import annotations

import argparse
import datetime
import sys
from pathlib import Path
from typing import Any

from . import api_runner, curated_to_payloads, excel_to_curated, manifest, validate
from .config import PeriodPlanConfig

_PROFILES_DIR = Path(__file__).parent / "profiles"


def _resolve_profile(profile_arg: str) -> Path:
    p = Path(profile_arg)
    if p.exists():
        return p
    name = profile_arg if profile_arg.endswith((".yaml", ".yml")) else f"{profile_arg}.yaml"
    for candidate in (Path("profiles") / name, _PROFILES_DIR / name):
        if candidate.exists():
            return candidate
    raise FileNotFoundError(f"Profile not found: {profile_arg!r}")


def _make_run_id(cfg: PeriodPlanConfig) -> str:
    ts = datetime.datetime.now().strftime("%Y%m%d_%H%M%S")
    subjects = "_".join(sorted({v.subject for v in cfg.inputs.values()}))
    grades = "_".join(sorted({g for v in cfg.inputs.values() for g in v.grades}))
    return f"{ts}_{subjects}_{grades}"


def _now_iso() -> str:
    return datetime.datetime.now().isoformat()


def cmd_excel_to_curated(cfg: PeriodPlanConfig, run_dir: Path) -> None:
    print("\n=== Step A: Excel -> Curated JSON ===")
    curated_dir = run_dir / cfg.outputs.curated_dirname
    for key, input_cfg in cfg.inputs.items():
        print(f"[{key}] subject={input_cfg.subject} grades={input_cfg.grades}")
        excel_to_curated.run(input_cfg, curated_dir)


def cmd_curated_to_payloads(cfg: PeriodPlanConfig, run_dir: Path) -> int:
    print("\n=== Step B: Curated JSON -> Payloads ===")
    return curated_to_payloads.run(cfg, run_dir)


def cmd_api(cfg: PeriodPlanConfig, run_dir: Path) -> list[dict[str, Any]]:
    print("\n=== Step C: API Run ===")
    payloads_dir = run_dir / cfg.outputs.payloads_dirname
    results_dir = run_dir / cfg.outputs.results_dirname
    return api_runner.run(payloads_dir, results_dir, cfg.api, skip_existing=cfg.execution.skip_existing_results)


def cmd_validate(cfg: PeriodPlanConfig, run_dir: Path) -> tuple[int, int]:
    print("\n=== Step D: Validate ===")
    payloads_dir = run_dir / cfg.outputs.payloads_dirname
    results_dir = run_dir / cfg.outputs.results_dirname
    return validate.validate_dirs(payloads_dir, results_dir)


def cmd_run(cfg: PeriodPlanConfig, run_dir: Path) -> int:
    steps_summary: dict[str, Any] = {}
    cmd_excel_to_curated(cfg, run_dir)
    steps_summary["excel_to_curated"] = "completed"
    payload_count = cmd_curated_to_payloads(cfg, run_dir)
    steps_summary["curated_to_payloads"] = {"payloads_generated": payload_count}
    if cfg.execution.validate_payloads:
        p_ok, p_fail = validate.validate_dir(run_dir / cfg.outputs.payloads_dirname, "payload")
        print(f"  Payload validation: {p_ok} ok, {p_fail} failed")
        steps_summary["validate_payloads"] = {"ok": p_ok, "failed": p_fail}
        if p_fail > 0:
            print(f"  [WARNING] {p_fail} invalid payloads; continuing with API run.")
    api_results = cmd_api(cfg, run_dir)
    failed_records = [
        {"file_path": r["file_path"], "error_message": r["message"], "timestamp": _now_iso()}
        for r in api_results
        if r["status"] != "completed"
    ]
    steps_summary["api_runner"] = {
        "total": len(api_results),
        "completed": sum(1 for r in api_results if r["status"] == "completed"),
        "failed": len(failed_records),
    }
    if failed_records:
        csv_path = manifest.write_failed_csv(run_dir, failed_records, cfg.outputs.reports_dirname)
        print(f"  Failures written to: {csv_path}")
    if cfg.execution.validate_results:
        r_ok, r_fail = validate.validate_dir(run_dir / cfg.outputs.results_dirname, "result")
        print(f"  Result validation: {r_ok} ok, {r_fail} failed")
        steps_summary["validate_results"] = {"ok": r_ok, "failed": r_fail}
    manifest_path = manifest.write_manifest(
        run_dir, run_dir.name, cfg.model_dump(mode="json"), steps_summary, cfg.outputs.reports_dirname
    )
    print(f"\nManifest written to: {manifest_path}")
    return len(failed_records)


def main() -> None:
    parser = argparse.ArgumentParser(
        prog="python -m connectors.period_plan",
        description="Period plan generation connector for Shiksha-Copilot.",
    )
    parser.add_argument("--profile", required=True, metavar="PROFILE")
    parser.add_argument("--run-root", default=None, metavar="DIR")
    sub = parser.add_subparsers(dest="command", required=True)
    sub.add_parser("run")
    sub.add_parser("excel-to-curated")
    sub.add_parser("curated-to-payloads")
    sub.add_parser("api")
    sub.add_parser("validate")
    args = parser.parse_args()
    try:
        profile_path = _resolve_profile(args.profile)
    except FileNotFoundError as exc:
        print(f"[ERROR] {exc}", file=sys.stderr)
        sys.exit(1)
    cfg = PeriodPlanConfig.from_yaml(profile_path)
    if args.run_root:
        run_dir = Path(args.run_root)
    else:
        run_id = _make_run_id(cfg)
        run_dir = Path(cfg.outputs.run_root) / run_id
    run_dir.mkdir(parents=True, exist_ok=True)
    print(f"Run directory: {run_dir}")
    if args.command == "run":
        sys.exit(1 if cmd_run(cfg, run_dir) > 0 else 0)
    elif args.command == "excel-to-curated":
        cmd_excel_to_curated(cfg, run_dir)
    elif args.command == "curated-to-payloads":
        print(f"\nGenerated {cmd_curated_to_payloads(cfg, run_dir)} payload files.")
    elif args.command == "api":
        results = cmd_api(cfg, run_dir)
        failed = [r for r in results if r["status"] != "completed"]
        if failed:
            manifest.write_failed_csv(
                run_dir,
                [{"file_path": r["file_path"], "error_message": r["message"], "timestamp": _now_iso()} for r in failed],
                cfg.outputs.reports_dirname,
            )
        sys.exit(1 if failed else 0)
    elif args.command == "validate":
        ok, fail = cmd_validate(cfg, run_dir)
        sys.exit(1 if fail > 0 else 0)


if __name__ == "__main__":
    main()
