import json
import logging
from typing import Any

from langfuse.openai import AsyncAzureOpenAI  # noqa: F401 — enables langfuse auto-tracing

from app.config import settings

logger = logging.getLogger(__name__)


class LessonEditService:
    """Service for AI-assisted revision of a single lesson plan section."""

    def __init__(self):
        self.client = AsyncAzureOpenAI(
            api_key=settings.azure_openai_api_key,
            api_version=settings.azure_openai_api_version,
            azure_endpoint=settings.azure_openai_endpoint,
        )
        if settings.azure_openai_deployment_name is None:
            raise RuntimeError("OpenAI deployment model must be specified")
        self.chat_deployment = settings.azure_openai_deployment_name

    async def _generate(self, instructions: str, input_text: str) -> str:
        response = await self.client.responses.create(
            model=self.chat_deployment,
            instructions=instructions,
            input=input_text,
            temperature=0.3,
        )
        return response.output_text

    async def edit_section(self, current_content: Any, output_format: str, prompt: str) -> Any:
        is_plain = output_format == "plain_text"

        if is_plain:
            instructions = (
                "You are an assistant helping a teacher revise one section of a lesson plan. "
                "Apply the requested change to the current content. "
                "Return ONLY the revised section content as plain text — no commentary, no markdown fences."
            )
            input_text = f"Current content:\n{current_content}\n\nRequested change:\n{prompt}"
        else:
            instructions = (
                "You are an assistant helping a teacher revise one section of a lesson plan. "
                "The current content is a JSON structure. Apply the requested change while preserving "
                "the exact same JSON structure and keys. "
                "Return ONLY valid JSON — no commentary, no markdown fences."
            )
            input_text = (
                f"Current content (JSON):\n{json.dumps(current_content, ensure_ascii=False)}\n\n"
                f"Requested change:\n{prompt}"
            )

        text = await self._generate(instructions, input_text)

        if is_plain:
            return text

        try:
            return json.loads(text)
        except (json.JSONDecodeError, TypeError):
            logger.warning(
                "LessonEditService: model returned non-JSON output for a json_* section; returning original content unchanged"
            )
            return current_content

    async def edit_plan(self, sections: list[dict], learning_outcomes: list, prompt: str) -> list[dict]:
        instructions = (
            "You are an assistant helping a teacher revise an entire lesson plan based on their feedback. "
            "You will be given the plan's sections (each with id, title, outputFormat, content) and the "
            "teacher's requested change. Decide which sections actually need to change to satisfy the "
            "request, and return ONLY those sections. For each returned section, preserve its 'id' exactly "
            "and keep its content in the same shape as the input (plain text stays plain text; JSON keeps "
            "the same JSON structure and keys). Do not include sections that don't need any change. "
            "Return ONLY a valid JSON array of objects, each with 'id' and 'content' — no commentary, "
            "no markdown fences."
        )
        input_text = (
            f"Learning outcomes:\n{json.dumps(learning_outcomes, ensure_ascii=False)}\n\n"
            f"Sections (JSON):\n{json.dumps(sections, ensure_ascii=False)}\n\n"
            f"Teacher's requested change:\n{prompt}"
        )

        text = await self._generate(instructions, input_text)

        try:
            result = json.loads(text)
            if not isinstance(result, list):
                return []
            return [item for item in result if isinstance(item, dict) and "id" in item and "content" in item]
        except (json.JSONDecodeError, TypeError):
            logger.warning(
                "LessonEditService: model returned non-JSON output for a plan edit; returning no changes"
            )
            return []
