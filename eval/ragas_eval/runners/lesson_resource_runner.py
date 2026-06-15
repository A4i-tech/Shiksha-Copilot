from typing import List
from .base_runner import BaseRunner

_SYSTEM_PROMPT = """You are LessonPlanGPT, an AI tutor specialized in generating lesson-plan segments for real classroom use. When processing any segment-specific prompt, follow these guidelines:

1. **Purpose & Audience**
• Create student-appropriate content that teachers can deliver directly in K-12 classrooms.
• Focus on enhancing students' understanding and comprehension of the topics specified in the segment prompt.

2. **Tone & Style**
• Use simple, clear language that engages school-age learners.
• Maintain an encouraging, respectful, and motivating voice—avoid jargon and overly technical phrasing.

3. **Accuracy & Placeholders**
• Do not invent or hallucinate details—if the prompt refers to figures, diagrams, vocabulary, or data, use placeholders exactly as provided.
• Ensure all content is factually consistent and directly relevant to the topic in the prompt.

4. **Clarity & Conciseness**
• Keep each sentence focused and actionable.
• Respect any sentence or paragraph length requirements specified in the prompt.
• Ensure coherence, avoid repetition, and prioritize clear comprehension for students."""


def _build_user_prompt(sample: dict) -> str:
    los = "\n".join(f"- {lo}" for lo in sample["learning_outcomes"])
    lesson_type = sample.get("lesson_type", "PROSE")
    return (
        f"You are creating the '{sample['section_title']}' section of a resource plan for English subject.\n\n"
        f"=== CONTEXT ===\n"
        f"Grade: {sample['grade']}\n"
        f"Textbook: {sample.get('textbook', 'NCERT English')}\n"
        f"Lesson: {sample['lesson_title']} ({lesson_type})\n\n"
        f"=== LEARNING OUTCOMES ===\n"
        f"{los}\n===\n\n"
        f"# Current Section Description: {sample['section_description']}\n\n"
        f"Generate complete, classroom-ready content for this English resource plan section."
    )


class LessonResourceRunner(BaseRunner):
    async def run_single(self, sample: dict) -> dict:
        user_prompt = _build_user_prompt(sample)
        try:
            response = await self.call_model(_SYSTEM_PROMPT, user_prompt)
        except Exception as e:
            response = ""
            print(f"[ERROR] {sample['id']}: {e}")
        return {
            "id": sample["id"],
            "user_input": user_prompt,
            "response": response,
            "metadata": {
                "grade": sample["grade"],
                "lesson": sample["lesson_title"],
                "lesson_type": sample.get("lesson_type", "PROSE"),
                "section": sample["section_title"],
            },
        }

    def to_ragas_samples(self, outputs: List[dict]):
        from ragas import SingleTurnSample
        return [
            SingleTurnSample(user_input=o["user_input"], response=o["response"])
            for o in outputs
            if o["response"]
        ]
