import json
from typing import List
from .base_runner import BaseRunner

_SYSTEM_PROMPT = """You are a specialist in educational assessment design with advanced expertise in Bloom's Taxonomy and question generation. Your task is to generate a bank of unique, high-quality questions that are aligned with the provided learning outcomes and cognitive objectives.

IMPORTANT: Under no circumstances should any generated question be similar to any other generated question. This means:
- No direct repetition (identical wording).
- No reworded or slightly modified versions.
- No conceptual overlap (questions using the same method, formula, or reasoning).

## Examination Details are provided in the user message.

## Output Format
Return a JSON object with this structure:
{
  "questions": [
    {
      "type": "MCQ|FILL_BLANKS|ANSWER_SHORT|ANSWER_LONG",
      "question": "Question text",
      "answer": "Correct answer",
      "options": ["A) ...", "B) ...", "C) ...", "D) ..."],
      "difficulty": "Easy|Average|Difficult",
      "bloom_level": "Knowledge|Understanding|Application|Analysis|Synthesis|Evaluation"
    }
  ]
}
For MCQ: include options and set answer to the correct option letter (A/B/C/D).
For other types: omit options."""


def _build_user_prompt(sample: dict) -> str:
    dist = sample["question_distribution"]
    dist_lines = []
    total = 0
    for qtype, info in dist.items():
        dist_lines.append(f"- {qtype}: {info['count']} questions × {info['marks']} mark(s) each")
        total += info["count"] * info["marks"]

    los = "\n".join(f"- {lo}" for lo in sample["learning_outcomes"])
    distribution_str = "\n".join(dist_lines)

    return (
        f"## Examination Details\n"
        f"- Board: {sample['board']}\n"
        f"- Medium: {sample['medium']}\n"
        f"- Grade: {sample['grade']}\n"
        f"- Subject: {sample['subject']}\n"
        f"- Chapter: {sample['chapter_title']}\n"
        f"- Total Marks: {sample['total_marks']}\n\n"
        f"## Learning Outcomes\n{los}\n\n"
        f"## Question Distribution\n{distribution_str}\n\n"
        f"Generate all {sum(info['count'] for info in dist.values())} questions now. "
        f"Ensure variety in difficulty levels and Bloom's taxonomy coverage."
    )


class QuestionPaperRunner(BaseRunner):
    async def run_single(self, sample: dict) -> dict:
        user_prompt = _build_user_prompt(sample)
        try:
            response = await self.call_model(
                _SYSTEM_PROMPT,
                user_prompt,
                response_format={"type": "json_object"},
            )
        except Exception as e:
            response = ""
            print(f"[ERROR] {sample['id']}: {e}")
        return {
            "id": sample["id"],
            "user_input": user_prompt,
            "response": response,
            "metadata": {
                "grade": sample["grade"],
                "subject": sample["subject"],
                "chapter": sample["chapter_title"],
                "board": sample["board"],
                "total_marks": sample["total_marks"],
            },
        }

    def to_ragas_samples(self, outputs: List[dict]):
        from ragas import SingleTurnSample
        ragas_samples = []
        for o in outputs:
            if not o["response"]:
                continue
            try:
                parsed = json.loads(o["response"])
                readable = json.dumps(parsed, indent=2)
            except Exception:
                readable = o["response"]
            ragas_samples.append(
                SingleTurnSample(user_input=o["user_input"], response=readable)
            )
        return ragas_samples
