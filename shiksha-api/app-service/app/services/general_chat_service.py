import logging

from app.utils.utils import load_yaml_prompts
from langfuse.openai import AsyncOpenAI
from langfuse import observe, propagate_attributes
from openai.types.responses import ResponseOutputTextAnnotationAddedEvent, ResponseTextDeltaEvent, ToolParam
from openai.types.responses.response_output_text import Annotation, AnnotationURLCitation

from app.models.chat import ConversationMessage
from app.config import settings
from pydantic import TypeAdapter, validate_call

logger = logging.getLogger(__name__)
_annotation_adapter = TypeAdapter(Annotation)

class GeneralChatService:
    """Service for handling chat interactions using OpenAI client."""

    def __init__(self):
        prompts = load_yaml_prompts("chat_prompts.yaml")
        self.system_prompt = prompts["general_chat"]
        self.client = AsyncOpenAI()
        self.tools: list[ToolParam] = [
            {"type": "web_search", "user_location": {"type": "approximate", "country": "IN"}}
        ]

    async def __aenter__(self):
        return self

    async def __aexit__(self, exc_type, exc_value, traceback):
        await self.cleanup()

    async def cleanup(self):
        await self.client.close()

    @validate_call
    @observe(name="Shiksha-QA", capture_output=False)
    async def __call__(self, messages: list[ConversationMessage], user_id: str):
        formatted_messages = [{"role": "system", "content": self.system_prompt}, *({"role": m.role.value, "content": m.message} for m in messages)]
        seen_urls = set()

        with propagate_attributes(user_id=user_id, tags=["chat_type:general"]):
            yield {"event": "status", "data": "Thinking"}
            try:
                stream = await self.client.responses.create(model=settings.general_chat_model, input=formatted_messages, tools=self.tools, stream=True)
                async for event in stream:
                    match event:
                        case ResponseTextDeltaEvent(delta=delta):
                            yield {"event": "content", "data": delta}
                        case ResponseOutputTextAnnotationAddedEvent(annotation=annotation):
                            annotation = _annotation_adapter.validate_python(annotation)
                            if isinstance(annotation, AnnotationURLCitation) and annotation.url not in seen_urls:
                                seen_urls.add(annotation.url)
                                yield {"event": "reference", "data": {"title": annotation.title, "url": annotation.url}}
            except Exception as e:
                logger.error(f"Error in OpenAI chat: {e}", exc_info=True)
                yield {"event": "error", "data": str(e)}
