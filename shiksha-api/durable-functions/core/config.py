import logging
from typing import Optional
from pydantic import Field, SecretStr
from pydantic_settings import BaseSettings, SettingsConfigDict

logger = logging.getLogger(__name__)


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

    # Azure OpenAI — required
    azure_openai_api_key: SecretStr = Field(description="Azure OpenAI API key")

    # Azure OpenAI — optional with defaults
    azure_openai_api_base: str = Field(default="https://api.openai.com", description="Azure OpenAI base URL, e.g. https://<resource>.openai.azure.com/")
    azure_openai_api_version: str = Field(default="2023-05-15", description="Azure OpenAI API version, e.g. 2024-08-01-preview")
    azure_openai_model: str = Field(default="gpt-4o", description="Azure OpenAI chat deployment name")
    azure_openai_embed_model: str = Field(default="text-embedding-ada-002", description="Azure OpenAI embedding deployment name")

    # Blob Store — optional
    blob_store_connection_string: Optional[SecretStr] = Field(default=None, description="Azure Blob Storage connection string")
    blob_store_url: Optional[str] = Field(default=None, description="Azure Blob Storage URL")

    # Qdrant — optional
    qdrant_url: str = Field(default="http://localhost:6333", description="Qdrant vector store URL")
    qdrant_api_key: Optional[SecretStr] = Field(default=None, description="Qdrant API key")

    # Webhook — optional
    webhook_url: Optional[str] = Field(default=None, description="Webhook URL for posting generation status updates")

    # Logging
    log_level: str = Field(default="INFO", description="Logging level, e.g. DEBUG, INFO, WARNING")


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
