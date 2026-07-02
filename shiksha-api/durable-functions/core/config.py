import os
from typing import Dict, Any


class Config:
    """Configuration class for the lesson plan workflow system"""

    # Application Environment
    APP_ENV = os.environ.get("APP_ENV", "local").lower()

    # OpenAI configuration
    AZURE_OPENAI_API_BASE = os.environ.get(
        "AZURE_OPENAI_API_BASE", "https://api.openai.com"
    )
    AZURE_OPENAI_API_KEY = os.environ.get("AZURE_OPENAI_API_KEY")
    AZURE_OPENAI_API_VERSION = os.environ.get("AZURE_OPENAI_API_VERSION", "2023-05-15")
    AZURE_OPENAI_MODEL = os.environ.get("AZURE_OPENAI_MODEL", "GPT-4.1")
    AZURE_OPENAI_EMBED_MODEL = os.environ.get(
        "AZURE_OPENAI_EMBED_MODEL", "text-embedding-ada-002"
    )
    BLOB_STORE_CONNECTION_STRING = os.environ.get("BLOB_STORE_CONNECTION_STRING", None)
    BLOB_STORE_URL = os.environ.get("BLOB_STORE_URL", None)
    WEBHOOK_URL = os.environ.get("WEBHOOK_URL", None)
    QDRANT_URL = os.environ.get("QDRANT_URL", "http://localhost:6333")
    QDRANT_API_KEY = os.environ.get("QDRANT_API_KEY", None)

    # Langfuse configuration (optional — no-op when absent)
    LANGFUSE_SECRET_KEY = os.environ.get("LANGFUSE_SECRET_KEY")
    LANGFUSE_PUBLIC_KEY = os.environ.get("LANGFUSE_PUBLIC_KEY")
    LANGFUSE_HOST = os.environ.get("LANGFUSE_HOST")
