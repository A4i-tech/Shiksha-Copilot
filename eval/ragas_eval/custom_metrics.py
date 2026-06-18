"""
LLM-as-judge scoring using GPT-4o directly.
Replaces RAGAS — same metrics, no langchain/pydantic dependency.
"""

import asyncio
import json
import random
from typing import List
from openai import AsyncAzureOpenAI, RateLimitError, APITimeoutError
from tqdm.asyncio import tqdm as tqdm_async
import config

_JUDGE_CFG = config.GPT41_CONFIG
_SCORE_TIMEOUT = 60.0
_MAX_RETRIES = 5
_BASE_BACKOFF = 2.0
_INPUT_TRUNC = 800   # chars of user_input sent to judge
_RESPONSE_TRUNC = 1500  # chars of response sent to judge (non-QP)


_QP_RESPONSE_TRUNC = 4000  # chars for flattened QP plain text


def _prepare_response(response: str, eval_type: str) -> str:
    """For question_paper: flatten JSON questions into readable plain text for the judge."""
    if eval_type != "question_paper":
        return response[:_RESPONSE_TRUNC]

    try:
        data = json.loads(response)
        questions = data.get("questions", [])
    except Exception:
        return response[:_QP_RESPONSE_TRUNC]

    if not questions:
        return response[:_QP_RESPONSE_TRUNC]

    lines = []
    for i, q in enumerate(questions, 1):
        qtype = q.get("type", "")
        diff = q.get("difficulty", "")
        bloom = q.get("bloom_level", "")
        marks = q.get("marks", "")

        tag_parts = [p for p in [qtype, diff, bloom, f"{marks}m" if marks else ""] if p]
        tag = f"[{', '.join(tag_parts)}]" if tag_parts else ""

        lines.append(f"Q{i} {tag}: {q.get('question', '')}")

        # MCQ options
        options = q.get("options", [])
        if options:
            for opt in options:
                lines.append(f"   {opt}")

        answer = q.get("answer", "")
        if answer:
            lines.append(f"   Ans: {answer}")

        lines.append("")

    text = "\n".join(lines)
    return text[:_QP_RESPONSE_TRUNC]


def _get_client() -> AsyncAzureOpenAI:
    return AsyncAzureOpenAI(
        api_key=_JUDGE_CFG["api_key"],
        api_version=_JUDGE_CFG["api_version"],
        azure_endpoint=_JUDGE_CFG["endpoint"],
        timeout=_SCORE_TIMEOUT,
    )


async def _call_judge(client: AsyncAzureOpenAI, prompt: str, sem: asyncio.Semaphore) -> dict:
    for attempt in range(_MAX_RETRIES):
        try:
            async with sem:
                await asyncio.sleep(0.2)
                resp = await client.chat.completions.create(
                    model=_JUDGE_CFG["deployment_name"],
                    messages=[{"role": "user", "content": prompt}],
                    response_format={"type": "json_object"},
                    temperature=0,
                )
                return json.loads(resp.choices[0].message.content)
        except RateLimitError:
            wait = _BASE_BACKOFF ** attempt + random.uniform(0, 1)
            print(f"\n  [JUDGE 429] retry {attempt + 1}/{_MAX_RETRIES} in {wait:.1f}s", flush=True)
            await asyncio.sleep(wait)
        except (APITimeoutError, asyncio.TimeoutError):
            wait = _BASE_BACKOFF ** attempt
            print(f"\n  [JUDGE TIMEOUT] retry {attempt + 1}/{_MAX_RETRIES} in {wait:.1f}s", flush=True)
            await asyncio.sleep(wait)
        except Exception as e:
            print(f"\n  [JUDGE ERROR] {type(e).__name__}: {e}", flush=True)
            return {}
    return {}


_RELEVANCY_PROMPT = """\
Rate how relevant this AI-generated response is to the user's educational content request.

USER INPUT:
{user_input}

RESPONSE:
{response}

Return ONLY valid JSON (no markdown):
{{"score": <float 0.0–1.0>, "reason": "<one sentence>"}}

score=1.0: perfectly relevant. score=0.0: completely irrelevant."""

_ASPECT_PROMPT = """\
Evaluate this AI-generated educational content against the criterion below.

CRITERION: {definition}

USER INPUT:
{user_input}

RESPONSE:
{response}

Return ONLY valid JSON (no markdown):
{{"verdict": <true or false>, "reason": "<one sentence>"}}

verdict=true: response clearly meets the criterion. verdict=false: it does not."""


METRICS: dict[str, list[tuple[str, str]]] = {
    "lesson_plan": [
        ("response_relevancy", ""),
        ("pedagogical_soundness",
         "Does the response demonstrate sound pedagogical practices? It should include clear explanations, examples, and structured learning progression appropriate for K-12."),
        ("grade_appropriateness",
         "Is the language, complexity, and content depth appropriate for the specified grade level? Vocabulary and concept difficulty should match the grade."),
        ("curriculum_alignment",
         "Does the response directly address the stated learning outcomes and chapter topic? Content must be aligned to the specified curriculum goals."),
        ("classroom_practicality",
         "Can a teacher use this content directly in a classroom without significant modification? It should be actionable, clear, and practically implementable."),
    ],
    "lesson_resource": [
        ("response_relevancy", ""),
        ("resource_richness",
         "Does the response provide rich and varied teaching resources including activities, discussion questions, vocabulary work, or comprehension tasks?"),
        ("english_pedagogy",
         "Does the response follow best practices for English language teaching, including pre-reading activation, while-reading tasks, and post-reading consolidation?"),
        ("activity_quality",
         "Are the activities engaging, student-centered, and designed to develop language skills such as reading, writing, speaking, or listening?"),
        ("scaffolding_quality",
         "Does the response provide appropriate scaffolding for learners — guided questions, context building, and support before independent work?"),
    ],
    "question_paper": [
        ("response_relevancy", ""),
        ("bloom_taxonomy_coverage",
         "Do the generated questions span multiple levels of Bloom's Taxonomy (knowledge, understanding, application, analysis)? There must be a mix of cognitive levels."),
        ("question_quality",
         "Are the questions well-formed, unambiguous, and grammatically correct? MCQs should have one clearly correct answer and plausible distractors."),
        ("curriculum_coverage",
         "Do the questions cover the specified chapter topics and learning outcomes? Questions must be directly tied to the curriculum content provided."),
        ("difficulty_balance",
         "Is there an appropriate distribution across Easy, Average, and Difficult questions? A good paper should not be uniformly easy or uniformly hard."),
    ],
}


async def _score_one(
    client: AsyncAzureOpenAI,
    sem: asyncio.Semaphore,
    _sample_id: str,
    user_input: str,
    response: str,
    metrics: list[tuple[str, str]],
    eval_type: str = "",
) -> dict[str, float | None]:
    ui = user_input[:_INPUT_TRUNC]
    resp = _prepare_response(response, eval_type)

    per_metric_tasks = {}
    for name, definition in metrics:
        if name == "response_relevancy":
            prompt = _RELEVANCY_PROMPT.format(user_input=ui, response=resp)
        else:
            prompt = _ASPECT_PROMPT.format(definition=definition, user_input=ui, response=resp)
        per_metric_tasks[name] = asyncio.create_task(_call_judge(client, prompt, sem))

    results = await asyncio.gather(*per_metric_tasks.values(), return_exceptions=True)
    scores: dict[str, float | None] = {}
    for name, raw in zip(per_metric_tasks.keys(), results):
        if isinstance(raw, Exception) or not raw:
            scores[name] = None
        elif name == "response_relevancy":
            val = raw.get("score")
            scores[name] = float(val) if val is not None else None
        else:
            verdict = raw.get("verdict")
            scores[name] = 1.0 if verdict else 0.0
    return scores


async def score_outputs(
    outputs: List[dict],
    eval_type: str,
    max_concurrent: int = 5,
) -> List[dict[str, float | None]]:
    """Score all successful outputs. Returns list parallel to outputs (empty dict for failed)."""
    client = _get_client()
    sem = asyncio.Semaphore(max_concurrent)
    metrics = METRICS[eval_type]

    tasks = []
    indices = []
    for i, o in enumerate(outputs):
        if o["response"]:
            tasks.append(_score_one(client, sem, o["id"], o["user_input"], o["response"], metrics, eval_type))
            indices.append(i)

    scored: list[dict] = [{} for _ in outputs]
    if not tasks:
        return scored

    results = await tqdm_async.gather(
        *tasks,
        desc="  scoring",
        total=len(tasks),
        unit="sample",
        bar_format="{l_bar}{bar}| {n_fmt}/{total_fmt} [{elapsed}<{remaining}, {rate_fmt}]",
    )
    for idx, scores in zip(indices, results):
        scored[idx] = scores
    return scored
