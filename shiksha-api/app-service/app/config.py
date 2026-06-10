import pathlib
from string import Template

from dotenv import load_dotenv
from pydantic import Field, PositiveInt
from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import Any, Literal, Optional

import yaml


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

with (root_dir / "config.yaml").open(encoding="utf-8") as f:
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
