import uuid
from typing import List, Any
from langfuse import Langfuse
import config


class LangfuseEvalLogger:
    def __init__(self, eval_type: str):
        self.eval_type = eval_type
        self.dataset_name = f"ragas-{eval_type.replace('_', '-')}"
        self.client = Langfuse(
            secret_key=config.LANGFUSE_SECRET_KEY,
            public_key=config.LANGFUSE_PUBLIC_KEY,
            host=config.LANGFUSE_HOST,
        )

    def create_dataset(self, samples: List[dict]) -> None:
        """Upload input samples as a Langfuse dataset (idempotent)."""
        try:
            self.client.create_dataset(name=self.dataset_name)
        except Exception:
            pass  # dataset already exists

        for sample in samples:
            self.client.create_dataset_item(
                dataset_name=self.dataset_name,
                id=sample["id"],
                input=sample,
                expected_output=None,
            )
        print(f"[Langfuse] Dataset '{self.dataset_name}' ready ({len(samples)} items)")

    def log_run(
        self,
        run_name: str,
        outputs: List[dict],
        scores: Any,
    ) -> None:
        """
        Log model outputs + RAGAS scores as a Langfuse experiment run.

        scores: ragas EvaluationResult (behaves like a dict of metric -> list[float])
        """
        dataset = self.client.get_dataset(self.dataset_name)

        # Build score lookup: metric_name -> [score per sample]
        score_dict: dict[str, list] = {}
        if scores is not None:
            try:
                df = scores.to_pandas()
                for col in df.columns:
                    if col not in ("user_input", "response", "reference"):
                        score_dict[col] = df[col].tolist()
            except Exception as e:
                print(f"[WARN] Could not extract scores DataFrame: {e}")

        valid_outputs = [o for o in outputs if o["response"]]
        for idx, (item, output) in enumerate(zip(dataset.items, valid_outputs)):
            trace = self.client.trace(
                id=str(uuid.uuid4()),
                name=f"{run_name}-{self.eval_type}",
                input=output["user_input"],
                output=output["response"],
                metadata=output.get("metadata", {}),
                tags=[run_name, self.eval_type],
            )
            item.link(trace, run_name=run_name)

            for metric_name, values in score_dict.items():
                if idx < len(values) and values[idx] is not None:
                    trace.score(
                        name=metric_name,
                        value=float(values[idx]),
                        comment=f"RAGAS {metric_name} for {run_name}",
                    )

        self.client.flush()
        print(f"[Langfuse] Run '{run_name}' logged for dataset '{self.dataset_name}'")

    def print_comparison(self, results_by_model: dict[str, Any]) -> None:
        print(f"\n{'='*60}")
        print(f"RAGAS Evaluation Summary — {self.eval_type}")
        print(f"{'='*60}")
        for model_name, results in results_by_model.items():
            if results is None:
                print(f"  {model_name}: NO RESULTS")
                continue
            try:
                df = results.to_pandas()
                numeric_cols = df.select_dtypes("number").columns.tolist()
                print(f"\n  {model_name}:")
                for col in numeric_cols:
                    print(f"    {col}: {df[col].mean():.4f} (mean)")
            except Exception as e:
                print(f"  {model_name}: {e}")
        print()
