from typing import List
from pathlib import Path
import logging

from langfuse.openai import AsyncOpenAI
from langfuse import observe, get_client
import json
from openai.types.responses import ResponseOutputMessage, ResponseOutputText
from openai.types.responses.response import Response
from openai.types.responses.response_output_text import AnnotationURLCitation

from app.models.chat import ConversationMessage
from app.config import settings
from app.utils.prompt_template import PromptTemplate
from pydantic import validate_call

logger = logging.getLogger(__name__)


class GeneralChatService:
    """Service for handling chat interactions using OpenAI client."""

    def __init__(self):
        prompts_file_path = Path(__file__).parent.parent.parent / "prompts" / "chat_prompts.yaml"
        self.prompt_template = PromptTemplate(str(prompts_file_path))
        self.client = AsyncOpenAI()


    @validate_call
    @observe(name="Shiksha-QA")
    async def __call__(
        self,
        messages: List[ConversationMessage],
        user_id: str,
    ):
        try:
            get_client().update_current_trace(
                user_id=user_id,
                tags=["chat_type:general", "has_web_search:true"],
            )

            system_prompt = self.prompt_template.get_prompt("general_chat")
            if not system_prompt:
                raise ValueError("General chat prompt not found in chat_prompts.yaml")

            yield json.dumps({"type": "status", "message": "Thinking..."}) + "\n"

            # Format messages
            formatted_messages = [{"role": "system", "content": system_prompt}]
            for m in messages:
                role = m.role.value
                content = m.message
                formatted_messages.append({"role": role, "content": content})

            # Responses API with web search
            stream = await self.client.responses.create(
                model=settings.general_chat_model,
                input=formatted_messages,
                tools=[{"type": "web_search"}],
                stream=True,
            )

            final_response_obj = None

            async for event in stream:

                # Streaming text deltas
                if event.type == "response.output_text.delta":
                    yield json.dumps({
                        "type": "content",
                        "delta": event.delta
                    }) + "\n"

                # Final completed response (contains citations)
                elif event.type == "response.completed":
                    final_response_obj = event.response

            # Extract references AFTER stream ends
            if final_response_obj:
                references = self._extract_url_citations(final_response_obj)
                yield json.dumps({
                    "type": "references",
                    "data": references
                }) + "\n"

        except Exception as e:
            logger.error(f"Error in OpenAI chat: {e}", exc_info=True)
            yield json.dumps({
                "type": "error",
                "message": str(e)
            }) + "\n"

    def _extract_url_citations(self, response: Response) -> list:
        """
        Extract URL citations from OpenAI Responses API output annotations.

        The Responses API returns output items that may contain 'url_citation'
        annotations within message content blocks.

        Returns:
            List of dicts with 'title' and 'url' keys
        """
        references = []
        seen_urls = set()

        if not response.output:
            return references

        for item in response.output:
            if not isinstance(item, ResponseOutputMessage):
                continue
            
            for content_block in item.content:
                if not isinstance(content_block, ResponseOutputText):
                    continue
                
                # Check for annotations
                if not content_block.annotations:
                    continue

                for annotation in content_block.annotations:
                    if isinstance(annotation, AnnotationURLCitation):
                        url = annotation.url
                        title = annotation.title or url
                        if url and url not in seen_urls:
                            seen_urls.add(url)
                            references.append({"title": title, "url": url})

        return references

    async def cleanup(self):
        """
        Cleanup method for the service.
        """
        try:
            await self.client.close()
        except Exception as e:
            logger.error(f"Error during cleanup: {e}")


# Global instance
GENERAL_CHAT_SERVICE_INSTANCE = GeneralChatService()
