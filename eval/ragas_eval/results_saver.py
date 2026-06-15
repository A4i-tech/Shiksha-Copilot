"""Save evaluation results to timestamped JSON under eval/ragas_eval/results/."""

import json
from datetime import datetime, timezone
from pathlib import Path
from typing import List

RESULTS_DIR = Path(__file__).parent / "results"


def save_run(
    eval_type: str,
    model_name: str,
    outputs: List[dict],
    scores: List[dict],
) -> Path:
    """
    outputs: list of {id, user_input, response, metadata}
    scores:  list parallel to outputs — {metric_name: float|None} per sample
    """
    RESULTS_DIR.mkdir(exist_ok=True)

    records = []
    for output, score in zip(outputs, scores):
        records.append({
            "id": output["id"],
            "user_input": output["user_input"],
            "response": output["response"],
            "metadata": output.get("metadata", {}),
            "scores": score,
        })

    # Summary: mean per metric across successful samples
    summary: dict[str, float] = {}
    all_metrics: set[str] = set()
    for s in scores:
        all_metrics.update(s.keys())

    for metric in all_metrics:
        values = [s[metric] for s in scores if s.get(metric) is not None]
        if values:
            summary[f"{metric}_mean"] = round(sum(values) / len(values), 4)

    ok = sum(1 for o in outputs if o["response"])
    payload = {
        "eval_type": eval_type,
        "model": model_name,
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "n_samples": len(outputs),
        "n_successful": ok,
        "summary": summary,
        "results": records,
    }

    ts = datetime.now(timezone.utc).strftime("%Y%m%dT%H%M%S")
    safe_model = model_name.replace(".", "_")
    out_path = RESULTS_DIR / f"{eval_type}_{safe_model}_{ts}.json"
    with open(out_path, "w", encoding="utf-8") as f:
        json.dump(payload, f, ensure_ascii=False, indent=2)

    print(f"  [SAVED] {out_path.name}")
    return out_path


def print_comparison(
    eval_type: str,
    model_names: List[str],
    scores_by_model: dict[str, List[dict]],
) -> None:
    # collect all metric names
    all_metrics: set[str] = set()
    means: dict[str, dict[str, float]] = {}

    for model, score_list in scores_by_model.items():
        means[model] = {}
        for s in score_list:
            all_metrics.update(s.keys())
        for metric in all_metrics:
            values = [s[metric] for s in score_list if s.get(metric) is not None]
            if values:
                means[model][metric] = round(sum(values) / len(values), 4)

    print(f"\n{'='*60}")
    print(f"Summary — {eval_type}")
    print(f"{'='*60}")
    col_w = 12
    header = f"{'Metric':<35}" + "".join(f"{m:>{col_w}}" for m in model_names)
    print(header)
    print("-" * len(header))
    for metric in sorted(all_metrics):
        row = f"{metric:<35}"
        for model in model_names:
            val = means.get(model, {}).get(metric)
            row += f"{val:>{col_w}.4f}" if val is not None else f"{'N/A':>{col_w}}"
        print(row)
    print()
