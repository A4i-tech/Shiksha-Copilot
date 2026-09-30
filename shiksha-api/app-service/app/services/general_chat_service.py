from typing import List
from pathlib import Path
import logging

from langfuse import propagate_attributes
import json

from app.models.chat import ConversationMessage
from app.config import settings
from app.services.llm_factory import make_chat_backend, make_openai_client
from app.utils.prompt_template import PromptTemplate
from pydantic import validate_call

logger = logging.getLogger(__name__)


class GeneralChatService:
    """Service for handling chat interactions using OpenAI client."""

    def __init__(self):
        prompts_file_path = Path(__file__).parent.parent.parent / "prompts" / "chat_prompts.yaml"
        prompt_template = PromptTemplate(str(prompts_file_path))
        system_prompt = prompt_template.get_prompt("general_chat")
        if not system_prompt:
            raise ValueError("General chat prompt not found in chat_prompts.yaml")
        self.system_prompt = system_prompt
        self.client = make_openai_client()
        self.backend = make_chat_backend(self.client, settings.general_chat_model)

    async def __aenter__(self):
        return self

    async def __aexit__(self, exc_type, exc_value, traceback):
        await self.cleanup()


    @validate_call
    async def __call__(self, messages: List[ConversationMessage], user_id: str):
        try:
            yield json.dumps({"type": "status", "message": "Thinking..."}) + "\n"

            # Format messages
            formatted_messages = [{"role": "system", "content": self.system_prompt}]
            for m in messages:
                role = m.role.value
                content = m.message
                formatted_messages.append({"role": role, "content": content})

            # we deliberately use trace_name="Shiksha-QA" over @observe() here cause the latter
            # spams LF 'output' with each individual event yielded by this streaming function
            with propagate_attributes(trace_name="Shiksha-QA", user_id=user_id, tags=["chat_type:general"]):
                async for event in self.backend.stream(formatted_messages):
                    yield json.dumps(event) + "\n"

        except Exception as e:
            logger.error(f"Error in OpenAI chat: {e}", exc_info=True)
            yield json.dumps({
                "type": "error",
                "message": str(e)
            }) + "\n"

    async def cleanup(self):
        """
        Cleanup method for the service.
        """
        try:
            await self.client.close()
        except Exception as e:
            logger.error(f"Error during cleanup: {e}")
