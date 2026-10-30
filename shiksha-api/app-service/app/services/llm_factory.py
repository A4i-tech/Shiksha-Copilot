import logging
from typing import Any, AsyncIterator, Literal, Protocol

from langfuse.openai import AsyncOpenAI
from llama_index.core.base.embeddings.base import BaseEmbedding
from llama_index.core.llms import LLM, LLMMetadata
from llama_index.embeddings.openai import OpenAIEmbedding
from llama_index.llms.openai import OpenAI, OpenAIResponses
from openai.types.responses import ResponseOutputMessage, ResponseOutputText, ToolParam
from openai.types.responses.response import Response
from openai.types.responses.response_output_text import AnnotationURLCitation
from pydantic_ai.models import Model
from pydantic_ai.models.openai import OpenAIChatModel, OpenAIResponsesModel
from pydantic_ai.providers.openai import OpenAIProvider

from app.config import settings
from app.models.chat import Reference

logger = logging.getLogger(__name__)

DEFAULT_CONTEXT_WINDOW = 32768

ChatApi = Literal["responses", "chat_completions"]


def chat_base_url() -> str | None:
    return settings.chat_base_url or settings.openai_base_url


def embedding_base_url() -> str | None:
    return settings.embedding_base_url or settings.openai_base_url


def chat_api() -> ChatApi:
    if settings.chat_api:
        return settings.chat_api
    return "chat_completions" if chat_base_url() else "responses"


def make_openai_client() -> AsyncOpenAI:
    return AsyncOpenAI(base_url=chat_base_url())


class _SelfHostedMetadata:
    @property
    def metadata(self) -> LLMMetadata:
        try:
            return super().metadata  # type: ignore[misc]
        except ValueError:
            context_window = settings.llm_context_window or DEFAULT_CONTEXT_WINDOW
            logger.warning(
                "Using fallback LLMMetadata for model %s with context_window=%d",
                getattr(self, "model", "unknown"),
                context_window,
            )
            return LLMMetadata(
                context_window=context_window,
                num_output=-1,
                is_chat_model=True,
                is_function_calling_model=True,
                model_name=getattr(self, "model", "unknown"),
            )


class _ResponsesLLM(_SelfHostedMetadata, OpenAIResponses):
    pass


class _ChatCompletionsLLM(_SelfHostedMetadata, OpenAI):
    pass


def make_llm(model: str) -> LLM:
    if chat_api() == "responses":
        return _ResponsesLLM(model=model, api_base=chat_base_url())
    return _ChatCompletionsLLM(model=model, api_base=chat_base_url())


def make_embedding() -> BaseEmbedding:
    return OpenAIEmbedding(model_name=settings.embed_model, api_base=embedding_base_url())


def make_pydantic_model(name: str) -> Model:
    provider, has_provider, model_name = name.partition(":")
    if has_provider and provider != "openai":
        raise ValueError(f"Unsupported provider: {provider}")
    model_cls = OpenAIResponsesModel if chat_api() == "responses" else OpenAIChatModel
    return model_cls(model_name if has_provider else name, provider=OpenAIProvider(base_url=chat_base_url(), api_key=settings.openai_api_key or None))


class ChatBackend(Protocol):
    def stream(self, messages: list[dict[str, str]]) -> AsyncIterator[dict[str, Any]]: ...


class ResponsesBackend:
    def __init__(self, client: AsyncOpenAI, model: str):
        self.client = client
        self.model = model
        self.tools: list[ToolParam] = [
            {"type": "web_search", "user_location": {"type": "approximate", "country": "IN"}}
        ]

    async def stream(self, messages: list[dict[str, str]]) -> AsyncIterator[dict[str, Any]]:
        final_response = None
        stream = await self.client.responses.create(model=self.model, input=messages, tools=self.tools, stream=True)
        async for event in stream:
            if event.type == "response.output_text.delta":
                yield {"type": "content", "delta": event.delta}
            elif event.type == "response.completed":
                final_response = event.response

        if final_response:
            citations = _extract_url_citations(final_response)
            yield {"type": "references", "data": [c.model_dump() for c in citations]}


class ChatCompletionsBackend:
    def __init__(self, client: AsyncOpenAI, model: str):
        self.client = client
        self.model = model

    async def stream(self, messages: list[dict[str, str]]) -> AsyncIterator[dict[str, Any]]:
        stream = await self.client.chat.completions.create(model=self.model, messages=messages, stream=True)
        async for chunk in stream:
            if chunk.choices and chunk.choices[0].delta.content:
                yield {"type": "content", "delta": chunk.choices[0].delta.content}


def make_chat_backend(model: str, client: AsyncOpenAI | None = None) -> ChatBackend:
    c = client or make_openai_client()
    if chat_api() == "responses":
        return ResponsesBackend(c, model)
    logger.warning("Chat completions backend active; hosted tools such as web search are unavailable")
    return ChatCompletionsBackend(c, model)


def _extract_url_citations(response: Response) -> list[Reference]:
    references: list[Reference] = []
    seen_urls: set[str] = set()

    for item in response.output or []:
        if not isinstance(item, ResponseOutputMessage):
            continue
        for content_block in item.content:
            if not isinstance(content_block, ResponseOutputText):
                continue
            for annotation in content_block.annotations or []:
                if isinstance(annotation, AnnotationURLCitation) and annotation.url and annotation.url not in seen_urls:
                    seen_urls.add(annotation.url)
                    references.append(Reference(title=annotation.title or annotation.url, url=annotation.url))

    return references
