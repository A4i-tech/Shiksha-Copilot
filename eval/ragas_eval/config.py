import os
from pathlib import Path
from dotenv import load_dotenv

# App-level secrets (Azure OpenAI keys etc.)
_APP_ENV = Path(__file__).parent.parent.parent / "shiksha-api" / "app-service" / ".env"
load_dotenv(dotenv_path=_APP_ENV)

# eval/.env — Langfuse keys + any overrides (takes precedence)
_EVAL_ENV = Path(__file__).parent.parent / ".env"
load_dotenv(dotenv_path=_EVAL_ENV, override=True)

AZURE_OPENAI_ENDPOINT = os.getenv("AZURE_OPENAI_ENDPOINT", "")

# GPT4O_CONFIG = {
#     "api_key": os.getenv("OLD_AZURE_OPENAI_API_KEY", ""),
#     "api_version": os.getenv("OLD_AZURE_OPENAI_API_VERSION", "2025-04-01-preview"),
#     "deployment_name": os.getenv("OLD_AZURE_OPENAI_DEPLOYMENT_NAME", "gpt-4o"),
#     "endpoint": AZURE_OPENAI_ENDPOINT,
#     "label": "gpt-4o",
# }

# GPT51_CONFIG = {
#     "api_key": os.getenv("AZURE_OPENAI_API_KEY", ""),
#     "api_version": os.getenv("AZURE_OPENAI_API_VERSION", "2025-03-01-preview"),
#     "deployment_name": os.getenv("AZURE_OPENAI_DEPLOYMENT_NAME", "gpt-5.1"),
#     "endpoint": AZURE_OPENAI_ENDPOINT,
#     "label": "gpt-5.1",
# }

_OLD_KEY = os.getenv("OLD_AZURE_OPENAI_API_KEY", "")
_OLD_VERSION = os.getenv("OLD_AZURE_OPENAI_API_VERSION", "2025-04-01-preview")

GPT41_CONFIG = {
    "api_key": _OLD_KEY,
    "api_version": _OLD_VERSION,
    "deployment_name": "gpt-4.1",
    "endpoint": AZURE_OPENAI_ENDPOINT,
    "label": "gpt-4.1",
}

GPT41_MINI_CONFIG = {
    "api_key": _OLD_KEY,
    "api_version": _OLD_VERSION,
    "deployment_name": "gpt-4.1-mini",
    "endpoint": AZURE_OPENAI_ENDPOINT,
    "label": "gpt-4.1-mini",
}

GPT41_NANO_CONFIG = {
    "api_key": _OLD_KEY,
    "api_version": _OLD_VERSION,
    "deployment_name": "gpt-4.1-nano",
    "endpoint": AZURE_OPENAI_ENDPOINT,
    "label": "gpt-4.1-nano",
}

MODELS = {
    "gpt-4.1": GPT41_CONFIG,
    "gpt-4.1-mini": GPT41_MINI_CONFIG,
    "gpt-4.1-nano": GPT41_NANO_CONFIG,
}

LANGFUSE_SECRET_KEY = os.getenv("LANGFUSE_SECRET_KEY", "")
LANGFUSE_PUBLIC_KEY = os.getenv("LANGFUSE_PUBLIC_KEY", "")
LANGFUSE_HOST = (
    os.getenv("LANGFUSE_HOST")
    or os.getenv("LANGFUSE_BASE_URL", "https://cloud.langfuse.com")
)

EMBEDDING_CONFIG = {
    "api_key": os.getenv("AZURE_OPENAI_API_KEY", ""),
    "api_version": os.getenv("AZURE_OPENAI_API_VERSION", "2025-03-01-preview"),
    "deployment_name": os.getenv("AZURE_OPENAI_EMBED_MODEL", "text-embedding-3-small"),
    "endpoint": AZURE_OPENAI_ENDPOINT,
}

SAMPLES_DIR = Path(__file__).parent / "sample_datasets"
MAX_CONCURRENT_CALLS = 5
