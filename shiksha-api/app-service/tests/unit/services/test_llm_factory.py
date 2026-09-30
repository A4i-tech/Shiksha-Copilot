import subprocess
import sys
import textwrap
from pathlib import Path
from unittest.mock import AsyncMock, Mock

import pytest
from llama_index.llms.openai import OpenAI, OpenAIResponses
from pydantic import BaseModel
from pydantic_ai.models.openai import OpenAIChatModel, OpenAIResponsesModel

from app.config import Settings, settings
from app.services import llm_factory

APP_SERVICE_DIR = Path(__file__).parent.parent.parent.parent


def _set(monkeypatch, **values):
    for name, value in values.items():
        monkeypatch.setattr(settings, name, value)


@pytest.mark.parametrize(
    "chat_api, chat_base_url, openai_base_url, expected",
    [
        (None, None, None, "responses"),
        (None, None, "http://vllm:8000/v1", "chat_completions"),
        (None, "http://chat:8000/v1", None, "chat_completions"),
        ("responses", None, "http://vllm:8000/v1", "responses"),
        ("chat_completions", None, None, "chat_completions"),
    ],
)
def test_chat_api_default_follows_base_url(monkeypatch, chat_api, chat_base_url, openai_base_url, expected):
    _set(monkeypatch, chat_api=chat_api, chat_base_url=chat_base_url, openai_base_url=openai_base_url)
    assert llm_factory.chat_api() == expected


def test_kind_base_url_falls_back_to_shared_url(monkeypatch):
    _set(monkeypatch, openai_base_url="http://shared/v1", chat_base_url=None, embedding_base_url="http://embed/v1")
    assert llm_factory.chat_base_url() == "http://shared/v1"
    assert llm_factory.embedding_base_url() == "http://embed/v1"


def test_settings_accept_openai_api_base_alias_and_empty_values(monkeypatch):
    monkeypatch.delenv("OPENAI_BASE_URL", raising=False)
    monkeypatch.setenv("OPENAI_API_BASE", "http://alias/v1")
    monkeypatch.setenv("CHAT_API", "")
    monkeypatch.setenv("LLM_CONTEXT_WINDOW", "")
    loaded = Settings(_env_file=None)
    assert loaded.openai_base_url == "http://alias/v1"
    assert loaded.chat_api is None
    assert loaded.llm_context_window is None


@pytest.mark.parametrize("api, expected", [("responses", OpenAIResponses), ("chat_completions", OpenAI)])
def test_make_llm_builds_class_for_chat_api(monkeypatch, api, expected):
    _set(monkeypatch, chat_api=api, openai_base_url="http://vllm:8000/v1", chat_base_url=None)
    llm = llm_factory.make_llm("gpt-5.6-luna")
    assert isinstance(llm, expected)
    assert isinstance(llm, OpenAIResponses) == (api == "responses")
    assert llm.api_base == "http://vllm:8000/v1"


@pytest.mark.parametrize("api", ["responses", "chat_completions"])
def test_llm_accepts_self_hosted_model_name(monkeypatch, api):
    _set(monkeypatch, chat_api=api, llm_context_window=8192)
    metadata = llm_factory.make_llm("Qwen/Qwen3-8B").metadata
    assert metadata.is_chat_model
    assert metadata.context_window == 8192


def test_make_embedding_accepts_self_hosted_model_name(monkeypatch):
    _set(monkeypatch, embed_model="BAAI/bge-m3", openai_base_url=None, embedding_base_url="http://embed/v1")
    embedding = llm_factory.make_embedding()
    assert embedding.model_name == "BAAI/bge-m3"
    assert embedding.api_base == "http://embed/v1"


@pytest.mark.parametrize("api, expected", [("responses", OpenAIResponsesModel), ("chat_completions", OpenAIChatModel)])
@pytest.mark.parametrize("name", ["gpt-5-nano", "openai:gpt-5-nano"])
def test_make_pydantic_model_builds_class_for_chat_api(monkeypatch, api, expected, name):
    _set(monkeypatch, chat_api=api, openai_base_url="http://vllm:8000/v1", chat_base_url=None)
    model = llm_factory.make_pydantic_model(name)
    assert type(model) is expected
    assert model.model_name == "gpt-5-nano"
    assert str(model.client.base_url).startswith("http://vllm:8000/v1")


def test_make_pydantic_model_leaves_other_providers_to_pydantic_ai():
    assert llm_factory.make_pydantic_model("anthropic:claude-x") == "anthropic:claude-x"


class _Reply(BaseModel):
    reply: str


@pytest.mark.parametrize("api", ["responses", "chat_completions"])
async def test_parse_structured_uses_endpoint_of_chat_api(monkeypatch, api):
    _set(monkeypatch, chat_api=api)
    client = Mock()
    client.responses.parse = AsyncMock(return_value=Mock(output_parsed=_Reply(reply="ok")))
    client.chat.completions.parse = AsyncMock(return_value=Mock(choices=[Mock(message=Mock(parsed=_Reply(reply="ok")))]))

    result = await llm_factory.parse_structured(client, "m", "system", "user", _Reply)

    assert result == _Reply(reply="ok")
    assert client.responses.parse.called == (api == "responses")
    assert client.chat.completions.parse.called == (api == "chat_completions")
    if api == "chat_completions":
        assert client.chat.completions.parse.call_args.kwargs["messages"] == [
            {"role": "system", "content": "system"},
            {"role": "user", "content": "user"},
        ]


async def test_parse_structured_rejects_unparsed_reply(monkeypatch):
    _set(monkeypatch, chat_api="chat_completions")
    client = Mock()
    client.chat.completions.parse = AsyncMock(return_value=Mock(choices=[Mock(message=Mock(parsed=None))]))
    with pytest.raises(RuntimeError, match="valid response"):
        await llm_factory.parse_structured(client, "m", "system", "user", _Reply)


def test_modules_import_without_llama_index_azure_openai_packages():
    script = textwrap.dedent(
        """
        import sys

        BLOCKED = ("llama_index.llms.azure_openai", "llama_index.embeddings.azure_openai")

        class Blocker:
            def find_spec(self, name, path=None, target=None):
                if name in BLOCKED:
                    raise ImportError(f"blocked {name}")

        sys.meta_path.insert(0, Blocker())
        import app.services.general_chat_service
        import app.services.lesson_chat_service
        import app.services.lesson_edit_service
        import app.services.question_paper_service
        """
    )
    result = subprocess.run([sys.executable, "-c", script], cwd=APP_SERVICE_DIR, capture_output=True, text=True, timeout=180)
    assert result.returncode == 0, result.stderr[-2000:]
