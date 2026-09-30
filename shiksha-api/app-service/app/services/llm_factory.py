from typing import Any, AsyncIterator, Literal, Protocol, TypeVar

from langfuse.openai import AsyncOpenAI
from llama_index.core.llms import LLMMetadata
from llama_index.embeddings.openai import OpenAIEmbedding
from llama_index.llms.openai import OpenAI, OpenAIResponses
from openai.types.responses import ResponseOutputMessage, ResponseOutputText, ToolParam
from openai.types.responses.response import Response
from openai.types.responses.response_output_text import AnnotationURLCitation
from pydantic import BaseModel
from pydantic_ai.models import Model
from pydantic_ai.models.openai import OpenAIChatModel, OpenAIResponsesModel
from pydantic_ai.providers.openai import OpenAIProvider

from app.config import settings

T = TypeVar("T", bound=BaseModel)

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
            # llama-index knows only OpenAI model names, a self-hosted model name raises here
            return LLMMetadata(
                context_window=settings.llm_context_window or 32768,
                num_output=-1,
                is_chat_model=True,
                is_function_calling_model=True,
                model_name=self.model,  # type: ignore[attr-defined]
            )


class _ResponsesLLM(_SelfHostedMetadata, OpenAIResponses):
    pass


class _ChatCompletionsLLM(_SelfHostedMetadata, OpenAI):
    pass


def make_llm(model: str) -> OpenAIResponses | OpenAI:
    if chat_api() == "responses":
        return _ResponsesLLM(model=model, api_base=chat_base_url())  # pyright: ignore[reportCallIssue]
    return _ChatCompletionsLLM(model=model, api_base=chat_base_url())


def make_embedding() -> OpenAIEmbedding:
    # model_name lets a self-hosted model name through, `model` accepts OpenAI names only
    return OpenAIEmbedding(model_name=settings.embed_model, api_base=embedding_base_url())


def make_pydantic_model(name: str) -> Model | str:
    provider, has_provider, model_name = name.partition(":")
    if has_provider and provider != "openai":
        return name
    model_cls = OpenAIResponsesModel if chat_api() == "responses" else OpenAIChatModel
    return model_cls(model_name if has_provider else name, provider=OpenAIProvider(base_url=chat_base_url()))


async def parse_structured(client: AsyncOpenAI, model: str, system_prompt: str, user_message: str, response_format: type[T]) -> T:
    if chat_api() == "responses":
        response = await client.responses.parse(model=model, instructions=system_prompt, input=user_message, text_format=response_format)
        parsed = response.output_parsed
    else:
        completion = await client.chat.completions.parse(
            model=model,
            messages=[{"role": "system", "content": system_prompt}, {"role": "user", "content": user_message}],
            response_format=response_format,
        )
        parsed = completion.choices[0].message.parsed
    if parsed is None:
        raise RuntimeError("Did not retrieve a valid response from model")
    return parsed


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
        stream = await self.client.responses.create(model=self.model, input=messages, tools=self.tools, stream=True)  # type: ignore[arg-type]
        async for event in stream:
            if event.type == "response.output_text.delta":
                yield {"type": "content", "delta": event.delta}
            # the completed response carries the citations
            elif event.type == "response.completed":
                final_response = event.response

        if final_response:
            yield {"type": "references", "data": _extract_url_citations(final_response)}


class ChatCompletionsBackend:
    # No hosted tools here: web search exists only on the responses backend with public OpenAI.
    def __init__(self, client: AsyncOpenAI, model: str):
        self.client = client
        self.model = model

    async def stream(self, messages: list[dict[str, str]]) -> AsyncIterator[dict[str, Any]]:
        stream = await self.client.chat.completions.create(model=self.model, messages=messages, stream=True)  # type: ignore[arg-type]
        async for chunk in stream:
            if chunk.choices and chunk.choices[0].delta.content:
                yield {"type": "content", "delta": chunk.choices[0].delta.content}


def make_chat_backend(client: AsyncOpenAI, model: str) -> ChatBackend:
    backend = ResponsesBackend if chat_api() == "responses" else ChatCompletionsBackend
    return backend(client, model)


def _extract_url_citations(response: Response) -> list[dict[str, str]]:
    references: list[dict[str, str]] = []
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
                    references.append({"title": annotation.title or annotation.url, "url": annotation.url})

    return references
