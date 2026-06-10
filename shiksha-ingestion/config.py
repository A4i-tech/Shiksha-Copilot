import logging
from typing import Optional
from pydantic import Field, SecretStr
from pydantic_settings import BaseSettings, SettingsConfigDict

logger = logging.getLogger(__name__)


class IngestionSettings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

    # Azure OpenAI — required
    azure_openai_api_key: SecretStr = Field(description="Azure OpenAI API key")
    azure_openai_endpoint: str = Field(description="Azure OpenAI endpoint URL, e.g. https://<resource>.openai.azure.com/")
    azure_openai_api_version: str = Field(description="Azure OpenAI API version, e.g. 2024-08-01-preview")

    # Azure OpenAI — required
    azure_openai_model: str = Field(description="Azure OpenAI chat deployment name")
    azure_openai_embedding_model: str = Field(default="text-embedding-ada-002", description="Azure OpenAI embedding model name")
    azure_openai_embedding_deployment: str = Field(default="text-embedding-ada-002", description="Azure OpenAI embedding deployment name")

    # Qdrant — optional
    qdrant_url: str = Field(default="http://localhost:6333", description="Qdrant vector store URL")
    qdrant_api_key: Optional[SecretStr] = Field(default=None, description="Qdrant API key")

    # Neo4j (knowledge graph steps only) — optional
    neo4j_uri: Optional[str] = Field(default=None, description="Neo4j connection URI, e.g. bolt://localhost:7687")
    neo4j_user: Optional[str] = Field(default=None, description="Neo4j username")
    neo4j_password: Optional[SecretStr] = Field(default=None, description="Neo4j password")
    neo4j_clear_database: bool = Field(default=False, description="Clear Neo4j database before ingestion")


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
