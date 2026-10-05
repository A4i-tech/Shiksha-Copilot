import json
import os
import subprocess
import sys
from types import SimpleNamespace
from unittest.mock import AsyncMock

import httpx
import pytest
from pydantic import ValidationError

from app.config import Settings, settings
from app.services.translation import factory
from app.services.translation.base import TranslationProviderError
from app.services.translation.noop import NoOpTranslator
from app.services.translation.openai import OpenAITranslator

MOCK_URL = "http://localhost:8000/v1"


def _stub(content: str) -> OpenAITranslator:
    create = AsyncMock(return_value=SimpleNamespace(choices=[SimpleNamespace(message=SimpleNamespace(content=content))]))
    client = SimpleNamespace(chat=SimpleNamespace(completions=SimpleNamespace(create=create)))
    return OpenAITranslator(model="m", client=client)


@pytest.fixture
def mock_server_translator():
    try:
        httpx.get(f"{MOCK_URL}/models", timeout=2).raise_for_status()
    except httpx.HTTPError:
        pytest.skip(f"mock translation server does not answer at {MOCK_URL}")
    return OpenAITranslator(model="mock-chat", base_url=MOCK_URL, api_key="any")


async def test_mock_single(mock_server_translator):
    assert await mock_server_translator.translate_async("hello", "en", "kn") == "[mock] hello"


async def test_mock_batch_keeps_order(mock_server_translator):
    out = await mock_server_translator.translate_batch_async(["a", "b", "c"], "auto", "hi")
    assert out == ["[mock] a", "[mock] b", "[mock] c"]


async def test_mock_empty_strings_skip_server(mock_server_translator):
    out = await mock_server_translator.translate_batch_async(["a", "", "  ", "b"], "en", "te")
    assert out == ["[mock] a", "", "  ", "[mock] b"]
    assert await mock_server_translator.translate_batch_async([], "en", "te") == []


async def test_all_empty_sends_nothing():
    t = _stub("{}")
    assert await t.translate_batch_async(["", " "], "en", "te") == ["", " "]
    t._client.chat.completions.create.assert_not_called()


async def test_request_follows_wire_contract():
    t = _stub(json.dumps({"translations": ["x"]}))
    await t.translate_async("héllo", None, "kn")
    kwargs = t._client.chat.completions.create.call_args.kwargs
    assert kwargs["temperature"] == 0
    assert kwargs["response_format"] == {"type": "json_object"}
    assert kwargs["messages"][1]["content"] == '{"texts": ["héllo"]}'
    assert "Detect the source language" in kwargs["messages"][0]["content"]
    assert "Kannada (kn)" in kwargs["messages"][0]["content"]


@pytest.mark.parametrize("reply", [
    json.dumps({"translations": ["only one"]}),
    json.dumps({"translations": "text"}),
    json.dumps({"translations": [None, "b"]}),
    json.dumps({"other": []}),
    "not json",
    "[]",
])
async def test_bad_reply_raises(reply):
    with pytest.raises(TranslationProviderError):
        await _stub(reply).translate_batch_async(["a", "b"], "en", "te")


@pytest.fixture
def azure_settings(monkeypatch):
    monkeypatch.setattr(settings, "translator_key", "k")
    monkeypatch.setattr(settings, "translator_region", "r")
    monkeypatch.setattr(settings, "translator_endpoint", "https://example.test")


def test_simple_openai(monkeypatch):
    monkeypatch.setattr(settings, "translation_provider", "openai")
    monkeypatch.setattr(settings, "translation_model", "m")
    assert isinstance(factory.simple()("te"), OpenAITranslator)


def test_simple_azure(monkeypatch, azure_settings):
    pytest.importorskip("azure.ai.translation.text")
    from app.services.translation.azure import AzureTranslator
    monkeypatch.setattr(settings, "translation_provider", "azure")
    assert isinstance(factory.simple()("te"), AzureTranslator)


def test_simple_azure_unconfigured_falls_back_to_noop(monkeypatch):
    monkeypatch.setattr(settings, "translation_provider", "azure")
    monkeypatch.setattr(settings, "translator_key", None)
    assert isinstance(factory.simple()("te"), NoOpTranslator)


def _make(**kw):
    return Settings(_env_file=None, openai_api_key="k", **kw)


def test_config_rejects_unknown_provider():
    with pytest.raises(ValidationError, match="translation_provider"):
        _make(translation_provider="google", translation_model="m")


def test_config_openai_needs_model():
    with pytest.raises(ValidationError, match="TRANSLATION_MODEL"):
        _make(translation_provider="openai", translation_model=" ")


def test_config_azure_needs_azure_settings():
    with pytest.raises(ValidationError, match="TRANSLATOR_REGION"):
        _make(translation_provider="azure", translator_key="k", translator_region=None, translator_endpoint="e")


def test_config_valid():
    assert _make(translation_provider="openai", translation_model="m").translation_provider == "openai"
    assert _make(translation_provider="azure", translator_key="k", translator_region="r", translator_endpoint="e").translation_provider == "azure"


def test_app_starts_with_azure_package_blocked():
    code = (
        "import sys\n"
        "class Block:\n"
        "    def find_spec(self, name, path=None, target=None):\n"
        "        if name == 'azure.ai.translation' or name.startswith('azure.ai.translation.'):\n"
        "            raise ImportError('blocked ' + name)\n"
        "sys.meta_path.insert(0, Block())\n"
        "import app.main\n"
        "from app.services.translation import factory\n"
        "assert factory.simple()('te').__class__.__name__ == 'OpenAITranslator'\n"
        "assert not [m for m in sys.modules if m.startswith('azure.ai.translation')]\n"
    )
    env = {**os.environ, "TRANSLATION_PROVIDER": "openai", "TRANSLATION_MODEL": "m", "OPENAI_API_KEY": "sk-x", "DEBUG": "false"}
    root = os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(__file__))))
    r = subprocess.run([sys.executable, "-c", code], cwd=root, env=env, capture_output=True, text=True)
    assert r.returncode == 0, r.stderr[-2000:]
