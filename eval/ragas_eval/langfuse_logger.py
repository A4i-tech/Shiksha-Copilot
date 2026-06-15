"""Langfuse Experiments integration.

Creates a dataset in Langfuse, then for each eval run:
  - Creates one trace per sample (input + output)
  - Links trace to dataset item as an experiment run
  - Attaches custom judge scores + RAGAS scores to each trace

Results appear in Langfuse UI: Datasets → <dataset-name> → Experiments tab.
"""

import uuid
from datetime import datetime
from typing import List, Optional
from langfuse import Langfuse
import config


def _parse_dt(val: str) -> Optional[datetime]:
    if not val:
        return None
    try:
        return datetime.fromisoformat(val)
    except Exception:
        return None


class LangfuseEvalLogger:
    def __init__(self, eval_type: str):
        self.eval_type = eval_type
        self.dataset_name = f"ragas-{eval_type.replace('_', '-')}"
        self.client = Langfuse(
            secret_key=config.LANGFUSE_SECRET_KEY,
            public_key=config.LANGFUSE_PUBLIC_KEY,
            host=config.LANGFUSE_HOST,
        )

    def ensure_dataset(self, samples: List[dict]) -> None:
        """Upload input samples as Langfuse dataset items (idempotent by item id)."""
        try:
            self.client.create_dataset(name=self.dataset_name)
        except Exception:
            pass  # already exists

        for sample in samples:
            try:
                self.client.create_dataset_item(
                    dataset_name=self.dataset_name,
                    id=sample["id"],
                    input=sample,
                    expected_output=None,
                )
            except Exception:
                pass  # item already exists — skip

        print(f"[Langfuse] Dataset '{self.dataset_name}' ready ({len(samples)} items)")

    def log_experiment_run(
        self,
        run_name: str,
        outputs: List[dict],
        custom_scores: List[dict],
        ragas_scores: List[dict] | None = None,
    ) -> None:
        """
        Upload one experiment run to Langfuse.

        run_name      : unique name shown in Experiments tab (e.g. "gpt-5_1-20260615T074436")
        outputs       : [{id, user_input, response, metadata}, ...] parallel
        custom_scores : [{metric: float|None, ...}, ...] parallel to outputs
        ragas_scores  : [{context_precision, context_recall, faithfulness,
                          answer_correctness}, ...] parallel to outputs
        """
        ragas_scores = ragas_scores or [{} for _ in outputs]

        try:
            dataset = self.client.get_dataset(self.dataset_name)
            item_map = {item.id: item for item in dataset.items}
        except Exception as e:
            print(f"[Langfuse] ERROR: could not fetch dataset '{self.dataset_name}': {e}")
            return

        uploaded = 0
        for output, c_score, r_score in zip(outputs, custom_scores, ragas_scores):
            if not output.get("response"):
                continue

            item = item_map.get(output["id"])
            if item is None:
                print(f"[Langfuse] WARN: item '{output['id']}' not in dataset — skipping")
                continue

            meta = output.get("metadata", {})
            call_start = _parse_dt(meta.get("call_start", ""))
            call_end = _parse_dt(meta.get("call_end", ""))

            trace = self.client.trace(
                id=str(uuid.uuid4()),
                name=f"{run_name}/{self.eval_type}",
                input=output["user_input"],
                output=output["response"],
                metadata=meta,
                tags=[run_name, self.eval_type],
                user_id=self.eval_type,
                start_time=call_start,
                end_time=call_end,
            )
            item.link(trace, run_name=run_name)

            # Generation observation — feeds Model Usage, Model costs, latency panels
            if call_start and call_end:
                trace.generation(
                    name="llm-generation",
                    model=meta.get("model_name", ""),
                    model_parameters={"temperature": 0},
                    input=[
                        {"role": "user", "content": output["user_input"]},
                    ],
                    output=output["response"],
                    usage={
                        "input": meta.get("prompt_tokens", 0),
                        "output": meta.get("completion_tokens", 0),
                        "total": meta.get("total_tokens", 0),
                        "unit": "TOKENS",
                    },
                    start_time=call_start,
                    end_time=call_end,
                )

            for metric, value in c_score.items():
                if value is not None:
                    trace.score(
                        name=metric,
                        value=float(value),
                        comment="custom-judge",
                    )

            for metric, value in r_score.items():
                if value is not None:
                    trace.score(
                        name=f"ragas_{metric}",
                        value=float(value),
                        comment="RAGAS",
                    )

            uploaded += 1

        self.client.flush()
        print(f"[Langfuse] Run '{run_name}' — {uploaded} traces in '{self.dataset_name}'")

    def print_dataset_url(self) -> None:
        base = config.LANGFUSE_HOST.rstrip("/")
        print(f"[Langfuse] View: {base}/datasets/{self.dataset_name}/runs")
