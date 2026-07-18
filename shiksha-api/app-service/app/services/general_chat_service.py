from typing import List
from pathlib import Path
import logging

from langfuse.openai import AsyncOpenAI
from langfuse import propagate_attributes
import json
from openai.types.responses import ResponseOutputMessage, ResponseOutputText, ToolParam
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
        prompt_template = PromptTemplate(str(prompts_file_path))
        system_prompt = prompt_template.get_prompt("general_chat")
        if not system_prompt:
            raise ValueError("General chat prompt not found in chat_prompts.yaml")
        self.system_prompt = system_prompt
        self.client = AsyncOpenAI()
        self.tools: list[ToolParam] = [
            {"type": "web_search", "user_location": {"type": "approximate", "country": "IN"}}
        ]


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

            final_response_obj = None
            # we deliberately use trace_name="Shiksha-QA" over @observe() here cause the latter
            # spams LF 'output' with each individual event yielded by this streaming function
            with propagate_attributes(trace_name="Shiksha-QA", user_id=user_id, tags=["chat_type:general"]):
                stream = await self.client.responses.create(model=settings.general_chat_model, input=formatted_messages, tools=self.tools, stream=True)
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
