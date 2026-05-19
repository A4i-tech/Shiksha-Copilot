import logging
from typing import Optional
from pydantic_settings import BaseSettings, SettingsConfigDict

logger = logging.getLogger(__name__)


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

    # Azure OpenAI — required
    azure_openai_api_key: str

    # Azure OpenAI — optional with defaults
    azure_openai_api_base: str = "https://api.openai.com"
    azure_openai_api_version: str = "2023-05-15"
    azure_openai_model: str = "gpt-4o"
    azure_openai_embed_model: str = "text-embedding-ada-002"

    # Blob Store — optional
    blob_store_connection_string: Optional[str] = None
    blob_store_url: Optional[str] = None

    # Qdrant — optional
    qdrant_url: str = "http://localhost:6333"
    qdrant_api_key: Optional[str] = None

    # Webhook — optional
    webhook_url: Optional[str] = None

    # Logging — optional
    log_level: str = "INFO"


settings = Settings()


def log_optional_env_status() -> None:
    optional_fields = [
        "blob_store_connection_string",
        "blob_store_url",
        "qdrant_api_key",
        "webhook_url",
    ]
    for field in optional_fields:
        if getattr(settings, field) is None:
            logger.info("Optional env not set: %s", field.upper())
