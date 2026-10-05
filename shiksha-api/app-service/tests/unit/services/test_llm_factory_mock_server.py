import json

import httpx
import pytest
from langfuse.openai import AsyncOpenAI
from llama_index.core.llms import ChatMessage

from app.config import settings
from app.models.chat import ConversationMessage, MessageRole
from app.services import llm_factory
from app.services.general_chat_service import GeneralChatService

MOCK_URL = "http://localhost:8000/v1"


def _mock_server_up() -> bool:
    try:
        return httpx.get("http://localhost:8000/health", timeout=2).status_code == 200
    except httpx.HTTPError:
        return False


pytestmark = pytest.mark.skipif(not _mock_server_up(), reason="mock model server at http://localhost:8000 does not answer /health")


@pytest.fixture
def sent_requests(monkeypatch):
    sent: list[httpx.Request] = []

    async def record(request: httpx.Request) -> None:
        sent.append(request)

    client = AsyncOpenAI(base_url=MOCK_URL, api_key="any", http_client=httpx.AsyncClient(event_hooks={"request": [record]}))
    monkeypatch.setattr("app.services.general_chat_service.make_openai_client", lambda: client)
    monkeypatch.setattr(settings, "openai_base_url", MOCK_URL)
    return sent


@pytest.mark.parametrize("api", ["responses", "chat_completions"])
async def test_general_chat_streams_text_through_both_backends(monkeypatch, sent_requests, api):
    monkeypatch.setattr(settings, "chat_api", api)
    service = GeneralChatService()

    events = [
        json.loads(line)
        async for line in service([ConversationMessage(role=MessageRole.USER, message="hello")], user_id="u1")
    ]
    await service.cleanup()

    assert "".join(e["delta"] for e in events if e["type"] == "content") == "ok"
    assert not [e for e in events if e["type"] == "error"]
    assert len(sent_requests) == 1
    body = json.loads(sent_requests[0].content)
    assert body["stream"] is True
    assert body["model"] == settings.general_chat_model
    if api == "responses":
        assert sent_requests[0].url.path == "/v1/responses"
        assert [t["type"] for t in body["tools"]] == ["web_search"]
        assert events[-1]["type"] == "references"
    else:
        assert sent_requests[0].url.path == "/v1/chat/completions"
        assert "tools" not in body
        assert "references" not in [e["type"] for e in events]
        assert body["messages"][-1] == {"role": "user", "content": "hello"}


async def test_embedding_returns_1536_vectors_for_single_text_and_batch(monkeypatch):
    monkeypatch.setattr(settings, "openai_base_url", MOCK_URL)
    monkeypatch.setattr(settings, "embedding_base_url", None)
    monkeypatch.setattr(settings, "embed_model", "text-embedding-ada-002")
    embedding = llm_factory.make_embedding()

    single = embedding.get_text_embedding("same text")
    batch = await embedding.aget_text_embedding_batch(["same text", "other text", "third text"])

    assert len(single) == 1536
    assert [len(v) for v in batch] == [1536] * 3
    assert batch[0] == pytest.approx(single)
    assert batch[0] != batch[1]


@pytest.mark.parametrize("api", ["responses", "chat_completions"])
async def test_llm_completes_with_both_chat_apis(monkeypatch, api):
    monkeypatch.setattr(settings, "openai_base_url", MOCK_URL)
    monkeypatch.setattr(settings, "chat_api", api)
    llm = llm_factory.make_llm("any-self-hosted-model")

    response = await llm.achat([ChatMessage(role="user", content="hi")])

    assert response.message.content == "ok"
