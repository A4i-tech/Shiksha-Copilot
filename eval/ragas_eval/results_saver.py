"""Save evaluation results to timestamped JSON under eval/ragas_eval/results/.

Two files are written per run when RAGAS scores are present:
  {eval_type}_{model}_{ts}.json          — full results (custom + RAGAS scores)
  langfuse_{eval_type}_{model}_{ts}.json — Langfuse score upload payload
"""

import json
from datetime import datetime, timezone
from pathlib import Path
from typing import List

RESULTS_DIR = Path(__file__).parent / "results"

RAGAS_METRICS = ("context_precision", "context_recall", "faithfulness", "answer_correctness")


def save_run(
    eval_type: str,
    model_name: str,
    outputs: List[dict],
    scores: List[dict],
    ragas_scores: List[dict] | None = None,
) -> Path:
    """
    outputs      : list of {id, user_input, response, metadata}
    scores       : parallel list — {metric_name: float|None} per sample (custom judge)
    ragas_scores : parallel list — {context_precision, context_recall, faithfulness, answer_correctness}
    """
    RESULTS_DIR.mkdir(exist_ok=True)
    ragas_scores = ragas_scores or [{} for _ in outputs]

    records = []
    for output, score, ragas in zip(outputs, scores, ragas_scores):
        records.append({
            "id": output["id"],
            "user_input": output["user_input"],
            "response": output["response"],
            "metadata": output.get("metadata", {}),
            "scores": score,
            "ragas_scores": ragas,
        })

    # Summary: mean per metric across successful samples
    summary: dict[str, float] = {}
    all_custom_metrics: set[str] = set()
    for s in scores:
        all_custom_metrics.update(s.keys())
    for metric in all_custom_metrics:
        values = [s[metric] for s in scores if s.get(metric) is not None]
        if values:
            summary[f"{metric}_mean"] = round(sum(values) / len(values), 4)

    ragas_summary: dict[str, float] = {}
    for metric in RAGAS_METRICS:
        values = [r[metric] for r in ragas_scores if r.get(metric) is not None]
        if values:
            ragas_summary[f"{metric}_mean"] = round(sum(values) / len(values), 4)

    ok = sum(1 for o in outputs if o["response"])
    now = datetime.now(timezone.utc)
    ts = now.isoformat()
    ts_file = now.strftime("%Y%m%dT%H%M%S")
    safe_model = model_name.replace(".", "_")

    payload = {
        "eval_type": eval_type,
        "model": model_name,
        "timestamp": ts,
        "n_samples": len(outputs),
        "n_successful": ok,
        "summary": summary,
        "ragas_summary": ragas_summary,
        "results": records,
    }

    out_path = RESULTS_DIR / f"{eval_type}_{safe_model}_{ts_file}.json"
    with open(out_path, "w", encoding="utf-8") as f:
        json.dump(payload, f, ensure_ascii=False, indent=2)
    print(f"  [SAVED] {out_path.name}")

    if any(r for r in ragas_scores if r):
        _save_langfuse_upload(eval_type, model_name, safe_model, ts_file, ts, records, ragas_summary)

    return out_path


def _save_langfuse_upload(
    eval_type: str,
    model_name: str,
    safe_model: str,
    ts_file: str,
    ts: str,
    records: List[dict],
    ragas_summary: dict,
) -> None:
    """Write Langfuse-compatible score payload for batch upload via langfuse_logger."""
    run_name = f"{safe_model}-{ts_file}"
    dataset_name = f"ragas-{eval_type.replace('_', '-')}"

    langfuse_scores = []
    for rec in records:
        item_id = rec["id"]
        for metric in RAGAS_METRICS:
            val = rec["ragas_scores"].get(metric)
            if val is not None:
                langfuse_scores.append({
                    "dataset_item_id": item_id,
                    "run_name": run_name,
                    "name": metric,
                    "value": val,
                    "dataType": "NUMERIC",
                    "comment": f"RAGAS {metric}",
                })

    langfuse_payload = {
        "dataset": dataset_name,
        "run_name": run_name,
        "eval_type": eval_type,
        "model": model_name,
        "timestamp": ts,
        "ragas_summary": ragas_summary,
        "scores": langfuse_scores,
    }

    lf_path = RESULTS_DIR / f"langfuse_{eval_type}_{safe_model}_{ts_file}.json"
    with open(lf_path, "w", encoding="utf-8") as f:
        json.dump(langfuse_payload, f, ensure_ascii=False, indent=2)
    print(f"  [LANGFUSE] {lf_path.name}")


def print_comparison(
    eval_type: str,
    model_names: List[str],
    scores_by_model: dict[str, List[dict]],
) -> None:
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
