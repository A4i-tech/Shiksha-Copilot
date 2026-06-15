"""
Model evaluation: GPT-4o vs GPT-5.1 (local run, no RAGAS/Langfuse)
Scoring via GPT-4o-as-judge using custom_metrics.py.
Results saved to eval/ragas_eval/results/ as timestamped JSON.

Usage:
    poetry run python evaluate.py                          # all 3 types, both models
    poetry run python evaluate.py --type lesson_plan       # single type
    poetry run python evaluate.py --models gpt-4o          # single model
    poetry run python evaluate.py --limit 10               # quick smoke-test
    poetry run python evaluate.py --skip-scoring           # save raw outputs only
"""

import asyncio
import argparse
import json
import time
from typing import List

import config
from runners.lesson_plan_runner import LessonPlanRunner
from runners.lesson_resource_runner import LessonResourceRunner
from runners.question_paper_runner import QuestionPaperRunner
from custom_metrics import score_outputs
from results_saver import save_run, print_comparison

RUNNER_MAP = {
    "lesson_plan": LessonPlanRunner,
    "lesson_resource": LessonResourceRunner,
    "question_paper": QuestionPaperRunner,
}

DATASET_FILES = {
    "lesson_plan": "lesson_plan_samples.json",
    "lesson_resource": "lesson_resource_samples.json",
    "question_paper": "question_paper_samples.json",
}


def load_samples(eval_type: str, limit: int) -> List[dict]:
    path = config.SAMPLES_DIR / DATASET_FILES[eval_type]
    with open(path, "r", encoding="utf-8") as f:
        samples = json.load(f)
    return samples[:limit]


async def run_one_model(eval_type: str, model_name: str, samples: List[dict]) -> List[dict]:
    print(f"\n>>> [{eval_type}] Session: {model_name} — {len(samples)} samples")
    Runner = RUNNER_MAP[eval_type]
    runner = Runner(model_name=model_name)
    t0 = time.monotonic()
    outputs = await runner.run_batch(samples, desc=model_name)
    elapsed = time.monotonic() - t0
    ok = sum(1 for o in outputs if o["response"])
    avg_chars = int(sum(len(o["response"]) for o in outputs if o["response"]) / max(ok, 1))
    print(f"    {ok}/{len(outputs)} ok | {elapsed:.1f}s | ~{elapsed/max(ok,1):.1f}s/sample | avg {avg_chars} chars")
    return outputs


async def run_eval_type(
    eval_type: str,
    model_names: List[str],
    limit: int,
    skip_scoring: bool,
) -> None:
    samples = load_samples(eval_type, limit)
    print(f"\n{'='*60}")
    print(f"Eval type : {eval_type}")
    print(f"Models    : {model_names}")
    print(f"Samples   : {len(samples)}")
    print(f"{'='*60}")

    all_scores: dict[str, List[dict]] = {}

    for model_name in model_names:
        outputs = await run_one_model(eval_type, model_name, samples)

        scores: List[dict] = [{} for _ in outputs]
        if not skip_scoring:
            print(f"    Scoring with GPT-4o judge...")
            t0 = time.monotonic()
            scores = await score_outputs(outputs, eval_type)
            elapsed = time.monotonic() - t0
            print(f"    Scoring done in {elapsed:.1f}s")

        save_run(eval_type, model_name, outputs, scores)
        all_scores[model_name] = scores

    if not skip_scoring:
        print_comparison(eval_type, model_names, all_scores)


def main():
    parser = argparse.ArgumentParser(description="GPT-4o vs GPT-5.1 evaluation — results saved to JSON")
    parser.add_argument(
        "--type",
        choices=list(RUNNER_MAP.keys()) + ["all"],
        default="all",
        dest="eval_type",
    )
    parser.add_argument(
        "--models",
        nargs="+",
        default=["gpt-4o", "gpt-5.1"],
        choices=list(config.MODELS.keys()),
    )
    parser.add_argument("--limit", type=int, default=60)
    parser.add_argument("--skip-scoring", action="store_true", help="Skip judge scoring — output only")
    args = parser.parse_args()

    eval_types = list(RUNNER_MAP.keys()) if args.eval_type == "all" else [args.eval_type]
    for et in eval_types:
        asyncio.run(run_eval_type(et, args.models, args.limit, args.skip_scoring))

    print("\nDone. Results in eval/ragas_eval/results/")


if __name__ == "__main__":
    main()
