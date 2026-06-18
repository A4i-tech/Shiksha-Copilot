"""
Re-upload saved eval results to Langfuse.

Reads result JSON files from results/ and calls log_experiment_run,
which filters NaN scores. Use after a run where Langfuse upload
failed or produced "API errors occurred: Bad request".

Usage:
    # backfill all results, skip already-uploaded runs
    poetry run python backfill_langfuse.py --skip-uploaded

    # backfill specific file(s)
    poetry run python backfill_langfuse.py results/lesson_resource_gpt-4o_20260617T*.json --skip-uploaded

    # dry-run: show status of each file without uploading
    poetry run python backfill_langfuse.py --dry-run --skip-uploaded

    # force re-upload everything (default without --skip-uploaded)
    poetry run python backfill_langfuse.py
"""

import argparse
import json
import logging
import sys
from pathlib import Path

from langfuse import Langfuse

import config
from langfuse_logger import LangfuseEvalLogger

RESULTS_DIR = Path(__file__).parent / "results"


def _make_client() -> Langfuse:
    return Langfuse(
        secret_key=config.LANGFUSE_SECRET_KEY,
        public_key=config.LANGFUSE_PUBLIC_KEY,
        host=config.LANGFUSE_HOST,
    )


def _run_exists(client: Langfuse, dataset_name: str, run_name: str) -> bool:
    lf_log = logging.getLogger("langfuse")
    prev = lf_log.level
    lf_log.setLevel(logging.CRITICAL)
    try:
        client.get_dataset_run(dataset_name, run_name)
        return True
    except Exception:
        return False
    finally:
        lf_log.setLevel(prev)


def _backfill_run_name(model_name: str, ts_file: str) -> str:
    return f"{model_name.replace('.', '_')}-{ts_file}-backfill"


def _dataset_name(eval_type: str) -> str:
    return f"ragas-{eval_type.replace('_', '-')}"


def load_result_file(path: Path) -> dict:
    with open(path, encoding="utf-8") as f:
        return json.load(f)


def backfill_file(path: Path, dry_run: bool, skip_uploaded: bool, client: Langfuse) -> None:
    data = load_result_file(path)

    eval_type = data["eval_type"]
    model_name = data["model"]
    ts_file = path.stem.split("_")[-1]  # rightmost segment is timestamp
    run_name = _backfill_run_name(model_name, ts_file)
    dataset = _dataset_name(eval_type)

    n_ragas = sum(
        1 for rec in data["results"]
        if any(v is not None for v in rec.get("ragas_scores", {}).values())
    )
    print(f"  {path.name}")
    print(f"    eval_type={eval_type} model={model_name} samples={len(data['results'])} ragas={n_ragas}")
    print(f"    run_name={run_name}")

    if skip_uploaded:
        exists = _run_exists(client, dataset, run_name)
        print(f"    langfuse run exists: {exists}")
        if exists:
            print("    [SKIP] already uploaded")
            return

    if dry_run:
        print("    [DRY RUN] would upload")
        return

    outputs, scores, ragas_scores = [], [], []
    for rec in data["results"]:
        outputs.append({
            "id": rec["id"],
            "user_input": rec["user_input"],
            "response": rec["response"],
            "metadata": rec.get("metadata", {}),
        })
        scores.append(rec.get("scores", {}))
        ragas_scores.append(rec.get("ragas_scores", {}))

    logger = LangfuseEvalLogger(eval_type)
    logger.log_experiment_run(run_name, outputs, scores, ragas_scores)
    logger.print_dataset_url()


def main() -> None:
    parser = argparse.ArgumentParser(description="Backfill Langfuse from saved result JSONs")
    parser.add_argument(
        "files",
        nargs="*",
        help="Result JSON paths (default: all non-langfuse_ files in results/)",
    )
    parser.add_argument(
        "--skip-uploaded",
        action="store_true",
        help="Check Langfuse and skip runs that already exist",
    )
    parser.add_argument("--dry-run", action="store_true", help="Print plan without uploading")
    args = parser.parse_args()

    if args.files:
        paths = [Path(f) for f in args.files]
    else:
        paths = sorted(
            p for p in RESULTS_DIR.glob("*.json")
            if not p.name.startswith("langfuse_")
        )

    if not paths:
        print("No result files found.")
        sys.exit(0)

    client = _make_client()

    print(f"Langfuse host : {config.LANGFUSE_HOST}")
    print(f"Files         : {len(paths)}")
    print(f"Skip uploaded : {args.skip_uploaded}")
    print(f"Dry run       : {args.dry_run}\n")

    for p in paths:
        try:
            backfill_file(p, dry_run=args.dry_run, skip_uploaded=args.skip_uploaded, client=client)
        except Exception as e:
            print(f"  ERROR {p.name}: {e}")
        print()

    print("Done.")


if __name__ == "__main__":
    main()
