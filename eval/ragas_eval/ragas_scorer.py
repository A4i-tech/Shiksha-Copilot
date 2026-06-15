"""Chunked RAGAS scoring for content-generation evaluation.

Maps content-generation outputs to RAGAS format:
  user_input         = formatted prompt sent to model
  retrieved_contexts = [section_description]  (spec = single retrieved chunk)
  response           = model output
  reference          = section_description    (spec = expected content direction)

Faithfulness and context_precision require retrieved_contexts.
Context_recall and answer_correctness require reference.
Both are satisfied by treating section_description as the ground-truth context.
"""

import math
from typing import List, Optional

from ragas import EvaluationDataset, SingleTurnSample, evaluate
from ragas.metrics import ContextPrecision, ContextRecall, Faithfulness, AnswerCorrectness
from ragas.llms import LangchainLLMWrapper
from ragas.embeddings import LangchainEmbeddingsWrapper
from langchain_openai import AzureChatOpenAI, AzureOpenAIEmbeddings

import config


def _build_judge_llm() -> LangchainLLMWrapper:
    cfg = config.GPT4O_CONFIG
    llm = AzureChatOpenAI(
        azure_deployment=cfg["deployment_name"],
        openai_api_key=cfg["api_key"],
        azure_endpoint=cfg["endpoint"],
        api_version=cfg["api_version"],
        temperature=0,
    )
    return LangchainLLMWrapper(llm)


def _build_embeddings() -> LangchainEmbeddingsWrapper:
    cfg = config.EMBEDDING_CONFIG
    embeddings = AzureOpenAIEmbeddings(
        azure_deployment=cfg["deployment_name"],
        openai_api_key=cfg["api_key"],
        azure_endpoint=cfg["endpoint"],
        api_version=cfg["api_version"],
    )
    return LangchainEmbeddingsWrapper(embeddings)


def _get_reference(sample: dict) -> str:
    """Best available reference from raw sample."""
    return (
        sample.get("section_description")
        or sample.get("passage")
        or sample.get("reference")
        or ""
    )


def _safe_float(val) -> Optional[float]:
    try:
        return round(float(val), 4) if val is not None else None
    except (TypeError, ValueError):
        return None


def score_with_ragas(
    outputs: List[dict],
    samples: List[dict],
    chunk_size: int = 5,
) -> List[dict]:
    """Return list of dicts (parallel to outputs) with RAGAS scores.

    Keys per dict: context_precision, context_recall, faithfulness, answer_correctness
    Failed/empty outputs get empty dict {}.
    """
    judge_llm = _build_judge_llm()
    embeddings = _build_embeddings()
    metrics = [
        ContextPrecision(llm=judge_llm),
        ContextRecall(llm=judge_llm),
        Faithfulness(llm=judge_llm),
        AnswerCorrectness(llm=judge_llm, embeddings=embeddings),
    ]

    valid_pairs: list[tuple[int, dict, dict]] = [
        (i, out, samp)
        for i, (out, samp) in enumerate(zip(outputs, samples))
        if out.get("response")
    ]

    per_sample: list[Optional[dict]] = [None] * len(outputs)
    n_chunks = math.ceil(len(valid_pairs) / chunk_size) if valid_pairs else 0

    for chunk_idx in range(n_chunks):
        chunk = valid_pairs[chunk_idx * chunk_size : (chunk_idx + 1) * chunk_size]
        print(f"    [RAGAS] chunk {chunk_idx + 1}/{n_chunks} ({len(chunk)} samples)...")

        ragas_samples = []
        for _, out, samp in chunk:
            ref = _get_reference(samp)
            context = ref if ref else out["user_input"]
            ragas_samples.append(
                SingleTurnSample(
                    user_input=out["user_input"],
                    retrieved_contexts=[context],
                    response=out["response"],
                    reference=context,
                )
            )

        dataset = EvaluationDataset(samples=ragas_samples)
        try:
            result = evaluate(dataset=dataset, metrics=metrics, llm=judge_llm)
            df = result.to_pandas()
            for local_i, (orig_idx, _, _) in enumerate(chunk):
                row = df.iloc[local_i]
                per_sample[orig_idx] = {
                    "context_precision": _safe_float(row.get("context_precision")),
                    "context_recall": _safe_float(row.get("context_recall")),
                    "faithfulness": _safe_float(row.get("faithfulness")),
                    "answer_correctness": _safe_float(row.get("answer_correctness")),
                }
        except Exception as e:
            print(f"    [RAGAS] chunk {chunk_idx + 1} failed: {e}")
            for orig_idx, _, _ in chunk:
                per_sample[orig_idx] = {}

    return [s if s is not None else {} for s in per_sample]
