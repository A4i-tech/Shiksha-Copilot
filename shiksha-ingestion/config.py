import logging
from typing import Optional
from pydantic_settings import BaseSettings, SettingsConfigDict

logger = logging.getLogger(__name__)


class IngestionSettings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

    # Azure OpenAI — required
    azure_openai_api_key: str
    azure_openai_endpoint: str
    azure_openai_api_version: str

    # Azure OpenAI — optional with defaults
    azure_openai_model: str = "gpt-4o"
    azure_openai_embedding_model: str = "text-embedding-ada-002"
    azure_openai_embedding_deployment: str = "text-embedding-ada-002"

    # Qdrant — optional
    qdrant_url: str = "http://localhost:6333"
    qdrant_api_key: Optional[str] = None

    # Neo4j (knowledge graph steps only) — optional
    neo4j_uri: Optional[str] = None
    neo4j_user: Optional[str] = None
    neo4j_password: Optional[str] = None
    neo4j_clear_database: bool = False


settings = IngestionSettings()


def log_optional_env_status() -> None:
    optional_fields = [
        "qdrant_api_key",
        "neo4j_uri",
        "neo4j_user",
        "neo4j_password",
    ]
    for field in optional_fields:
        if getattr(settings, field) is None:
            logger.info("Optional env not set: %s", field.upper())
