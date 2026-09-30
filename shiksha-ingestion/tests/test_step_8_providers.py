import importlib.util
import subprocess
import sys
import textwrap
from pathlib import Path

import httpx
import pytest
from llama_index.embeddings.openai import OpenAIEmbedding
from llama_index.llms.openai import OpenAI

INGESTION_DIR = Path(__file__).parent.parent
STEP_8_PATH = INGESTION_DIR / "pipeline_steps" / "step_8_create_indexes.py"
MOCK_URL = "http://localhost:8000/v1"

PROVIDER_VARS = (
    "CHAT_PROVIDER", "EMBEDDING_PROVIDER", "OPENAI_API_KEY", "OPENAI_BASE_URL", "CHAT_BASE_URL",
    "EMBEDDING_BASE_URL", "CHAT_MODEL", "EMBED_MODEL", "LLM_CONTEXT_WINDOW",
)


def _load_step_8():
    # load by path: pipeline_steps/__init__.py imports every other step
    spec = importlib.util.spec_from_file_location("step_8_create_indexes", STEP_8_PATH)
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module


@pytest.fixture
def step(monkeypatch):
    for name in PROVIDER_VARS:
        monkeypatch.delenv(name, raising=False)
    monkeypatch.setenv("OPENAI_API_KEY", "any")
    return _load_step_8().CreateIndexStep()


def test_default_provider_is_openai_and_needs_no_azure_package(step, monkeypatch):
    monkeypatch.setitem(sys.modules, "llama_index.embeddings.azure_openai", None)
    monkeypatch.setitem(sys.modules, "llama_index.llms.azure_openai", None)
    assert isinstance(step._embedding_llm(), OpenAIEmbedding)
    assert isinstance(step._completion_llm(), OpenAI)


def test_kind_base_url_falls_back_to_shared_url(step, monkeypatch):
    monkeypatch.setenv("OPENAI_BASE_URL", "http://shared/v1")
    monkeypatch.setenv("EMBEDDING_BASE_URL", "http://embed/v1")
    monkeypatch.setenv("EMBED_MODEL", "BAAI/bge-m3")
    embedding = step._embedding_llm()
    assert embedding.api_base == "http://embed/v1"
    assert embedding.model_name == "BAAI/bge-m3"
    assert step._completion_llm().api_base == "http://shared/v1"


def test_self_hosted_chat_model_name_has_metadata(step, monkeypatch):
    monkeypatch.setenv("CHAT_MODEL", "Qwen/Qwen3-8B")
    monkeypatch.setenv("LLM_CONTEXT_WINDOW", "8192")
    metadata = step._completion_llm().metadata
    assert metadata.context_window == 8192
    assert metadata.is_chat_model


@pytest.mark.parametrize("variable, method", [("CHAT_PROVIDER", "_completion_llm"), ("EMBEDDING_PROVIDER", "_embedding_llm")])
def test_unknown_provider_names_the_variable(step, monkeypatch, variable, method):
    monkeypatch.setenv(variable, "gemini")
    with pytest.raises(ValueError, match=f"{variable}=gemini.*openai or azure"):
        getattr(step, method)()


@pytest.mark.parametrize(
    "variable, method, module",
    [
        ("CHAT_PROVIDER", "_completion_llm", "llama_index.llms.azure_openai"),
        ("EMBEDDING_PROVIDER", "_embedding_llm", "llama_index.embeddings.azure_openai"),
    ],
)
def test_azure_without_package_tells_how_to_fix(step, monkeypatch, variable, method, module):
    monkeypatch.setenv(variable, "azure")
    monkeypatch.setitem(sys.modules, module, None)
    with pytest.raises(ImportError, match=f"{variable}=azure needs.*poetry install --extras azure.*{variable}=openai"):
        getattr(step, method)()


@pytest.mark.parametrize(
    "variable, method, module",
    [
        ("CHAT_PROVIDER", "_completion_llm", "llama_index.llms.azure_openai"),
        ("EMBEDDING_PROVIDER", "_embedding_llm", "llama_index.embeddings.azure_openai"),
    ],
)
def test_azure_with_package_builds_azure_client(step, monkeypatch, variable, method, module):
    pytest.importorskip(module)
    monkeypatch.setenv(variable, "azure")
    monkeypatch.setenv("AZURE_OPENAI_API_KEY", "key")
    monkeypatch.setenv("AZURE_OPENAI_ENDPOINT", "https://example.openai.azure.com/")
    client = getattr(step, method)()
    assert type(client).__module__.startswith(module)


def test_step_imports_without_llama_index_azure_openai_packages():
    script = textwrap.dedent(
        f"""
        import importlib.util, sys

        BLOCKED = ("llama_index.llms.azure_openai", "llama_index.embeddings.azure_openai")

        class Blocker:
            def find_spec(self, name, path=None, target=None):
                if name in BLOCKED:
                    raise ImportError(f"blocked {{name}}")

        sys.meta_path.insert(0, Blocker())
        spec = importlib.util.spec_from_file_location("step_8_create_indexes", r"{STEP_8_PATH}")
        spec.loader.exec_module(importlib.util.module_from_spec(spec))
        """
    )
    result = subprocess.run([sys.executable, "-c", script], cwd=INGESTION_DIR, capture_output=True, text=True, timeout=180)
    assert result.returncode == 0, result.stderr[-2000:]


def _mock_server_up() -> bool:
    try:
        return httpx.get("http://localhost:8000/health", timeout=2).status_code == 200
    except httpx.HTTPError:
        return False


@pytest.mark.skipif(not _mock_server_up(), reason="mock model server at http://localhost:8000 does not answer /health")
def test_openai_provider_embeds_single_text_and_batch_against_mock(step, monkeypatch):
    monkeypatch.setenv("OPENAI_BASE_URL", MOCK_URL)
    embedding = step._embedding_llm()

    single = embedding.get_text_embedding("same text")
    batch = embedding.get_text_embedding_batch(["same text", "other text"])

    assert len(single) == 1536
    assert [len(v) for v in batch] == [1536, 1536]
    assert batch[0] == pytest.approx(single)


@pytest.mark.skipif(not _mock_server_up(), reason="mock model server at http://localhost:8000 does not answer /health")
def test_openai_provider_completes_against_mock(step, monkeypatch):
    from llama_index.core.llms import ChatMessage

    monkeypatch.setenv("OPENAI_BASE_URL", MOCK_URL)
    monkeypatch.setenv("CHAT_MODEL", "gpt-4o-mini")
    assert step._completion_llm().chat([ChatMessage(role="user", content="hi")]).message.content == "ok"
