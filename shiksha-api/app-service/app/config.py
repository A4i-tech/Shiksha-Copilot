import logging
import pathlib
from string import Template

from dotenv import load_dotenv
from pydantic import Field, PositiveInt, SecretStr
from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import Any, Literal, Optional

import yaml

logger = logging.getLogger(__name__)


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

    # Application
    app_name: str = Field(default="Shiksha Copilot API", description="Application name")
    build: Optional[str] = Field(default=None, alias="SHIKSHA_COPILOT_BUILD", description="Build identifier, e.g. git SHA")
    version: str = Field(default="1.0.1", description="Application version")
    debug: bool = Field(default=False, description="Enable debug mode")
    host: str = Field(default="0.0.0.0", description="Host to bind the server to")
    port: int = Field(default=8000, description="Port to bind the server to")

    # Logging
    log_level: str = Field(default="INFO", description="Logging level, e.g. DEBUG, INFO, WARNING")

    # Azure OpenAI — required
    azure_openai_api_key: SecretStr = Field(description="Azure OpenAI API key")
    azure_openai_endpoint: str = Field(description="Azure OpenAI endpoint URL, e.g. https://<resource>.openai.azure.com/")
    azure_openai_api_version: str = Field(description="Azure OpenAI API version, e.g. 2024-08-01-preview")
    azure_openai_deployment_name: str = Field(description="Azure OpenAI chat deployment name, e.g. gpt-4o")
    azure_openai_embed_model: str = Field(description="Azure OpenAI embedding deployment name, e.g. text-embedding-ada-002")
    azure_chat_deployment_name: str = Field(description="Azure OpenAI deployment name used for general chat")

    # Azure AI Project — optional
    azure_project_endpoint: Optional[str] = Field(default=None, description="Azure AI Foundry project endpoint for tracing/evals")
    azure_bing_grounding_connection_id: Optional[str] = Field(default=None, description="Azure AI connection ID for Bing grounding")

    # Blob Store — optional
    blob_store_connection_string: Optional[SecretStr] = Field(default=None, description="Azure Blob Storage connection string")
    blob_store_url: Optional[str] = Field(default=None, description="Azure Blob Storage URL")

    # Qdrant — optional
    qdrant_url: Optional[str] = Field(default=None, description="Qdrant vector store URL, e.g. http://localhost:6333")
    qdrant_api_key: Optional[SecretStr] = Field(default=None, description="Qdrant API key")

    # Translator — optional
    translator_key: Optional[SecretStr] = Field(default=None, description="Azure Translator API key")
    translator_region: Optional[str] = Field(default=None, description="Azure Translator region, e.g. eastus")
    translator_endpoint: Optional[str] = Field(default=None, description="Azure Translator endpoint URL")

    # Presentation Configuration
    pres_captioner: str = "openai:gpt-5-nano"
    pres_planner: str = "openai:gpt-5-nano"
    pres_designer: str = "openai:gpt-5-nano"
    pres_finalizer: str = "openai:gpt-5-nano"
    pres_max_auto_retries: PositiveInt = 5
    pres_max_file_conversions: PositiveInt = 2
    pres_max_instruction_size: PositiveInt = 1000
    pres_max_jobs_per_user: PositiveInt | Literal[-1] = 1
    pres_max_slide_count: PositiveInt = 20
    pres_max_tasks_designer: PositiveInt = 3
    pres_max_tasks_planner: PositiveInt = 2
    pres_max_tasks_finalizer: PositiveInt = 2
    pres_mongodb_url: str = "mongodb://localhost:27017/shiksha_viz"
    pres_sse_buffer_limit: PositiveInt = 512
    pres_storage_filesystem: str = "file"
    pres_storage_root: str = "shiksha-copilot-presentations"
    pres_storage_options: dict[str, Any] = Field(default_factory=dict)
    pres_upload_max_filesize: int = 5_242_880  # 5 MiB
    pres_do_transform: bool = True

    # Commons
    youtube_api_key: str | None = None


load_dotenv()
settings = Settings()

if settings.debug:
    import logfire
    logfire.configure()
    logfire.instrument_pydantic_ai()

root_dir = pathlib.Path(__file__).resolve().parents[1]
assets_dir = root_dir / "assets"

with (root_dir / "config.yaml").open() as f:
    _data = yaml.safe_load(f)

CAPTIONER_SYSTEM_PROMPT = Template(_data["captioner-system-prompt"].strip())
PLANNER_SYSTEM_PROMPT = Template(_data["planner-system-prompt"].strip())
PLANNER_USER_PROMPT = Template(_data["planner-user-prompt"].strip())
DESIGNER_SYSTEM_PROMPT = Template(_data["designer-system-prompt"].strip())
DESIGNER_FIRST_SLIDE_PROMPT = Template(_data["designer-first-slide-prompt"].strip())
DESIGNER_BODY_SLIDE_PROMPT = Template(_data["designer-body-slide-prompt"].strip())
FINALIZER_SYSTEM_PROMPT = Template(_data["finalizer-system-prompt"].strip())
FINALIZER_BROWSE_PROMPT = Template(_data["finalizer-browse-prompt"].strip())
FINALIZER_REVIEW_PROMPT = Template(_data["finalizer-review-prompt"].strip())
FINALIZER_ADD_SLIDE_PROMPT = Template(_data["finalizer-add-slide-prompt"].strip())


def log_optional_env_status() -> None:
    optional_fields = [
        "azure_project_endpoint",
        "azure_bing_grounding_connection_id",
        "blob_store_connection_string",
        "blob_store_url",
        "qdrant_url",
        "qdrant_api_key",
        "translator_key",
        "translator_region",
        "translator_endpoint",
    ]
    for field in optional_fields:
        if getattr(settings, field) is None:
            logger.info("Optional env not set: %s", field.upper())
