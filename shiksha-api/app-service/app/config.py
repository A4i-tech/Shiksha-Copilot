from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import Optional


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

    app_name: str = "Shiksha Copilot API"
    version: str = "1.0.0"
    debug: bool = False
    host: str = "0.0.0.0"
    port: int = 8000
    transport: str = "http"

    # Logging Configuration
    log_level: str = "INFO"

    # Azure OpenAI Configuration
    azure_openai_api_key: Optional[str] = None
    azure_openai_endpoint: Optional[str] = None
    azure_openai_api_version: str = "2024-02-15-preview"
    azure_openai_deployment_name: Optional[str] = None
    azure_openai_embed_model: Optional[str] = None

    # Bing Search Configuration
    bing_api_key: Optional[str] = None

    # Blob Store Configuration
    blob_store_connection_string: Optional[str] = None
    blob_store_url: Optional[str] = None


settings = Settings()
