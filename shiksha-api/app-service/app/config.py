from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import Optional


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

    app_name: str = "Shiksha Copilot API"
    build: Optional[str] = Field(default=None, alias="SHIKSHA_COPILOT_BUILD")
    version: str = "1.0.1"
    debug: bool = False
    host: str = "0.0.0.0"
    port: int = 8000

    # Logging Configuration
    log_level: str = "INFO"

    # Azure OpenAI Configuration
    azure_openai_api_key: Optional[str] = None
    azure_openai_endpoint: Optional[str] = None
    azure_openai_api_version: Optional[str] = None
    azure_openai_deployment_name: Optional[str] = None
    azure_openai_embed_model: Optional[str] = None
    azure_chat_deployment_name : Optional[str] = None

    # Azure AI Project Configuration
    azure_project_endpoint: Optional[str] = None
    azure_bing_grounding_connection_id: Optional[str] = None

    # Blob Store Configuration
    blob_store_connection_string: Optional[str] = None
    blob_store_url: Optional[str] = None

    qdrant_url: Optional[str] = None
    qdrant_api_key: Optional[str] = None

    # Translator Configuration
    translator_key: Optional[str] = None
    translator_region: Optional[str] = None
    translator_endpoint: Optional[str] = None


settings = Settings()
