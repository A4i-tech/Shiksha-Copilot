import os

from pydantic import BaseModel, Field, ValidationError, model_validator

README_NOTE = "See the environment variable table in the README."


class Settings(BaseModel):
    azure_openai_api_base: str = Field(min_length=1)
    azure_openai_api_key: str = Field(min_length=1)
    azure_openai_api_version: str = Field(min_length=1)
    qdrant_url: str = Field(min_length=1)
    qdrant_api_key: str = Field(min_length=1)
    azure_openai_base_model: str = ""
    webhook_url: str = ""
    webhook_secret: str = ""
    legacy_index_containers: str = ""
    blob_store_connection_string: str = ""
    blob_store_url: str = ""
    max_upload_mb: int = 25
    max_pipeline_runs: int = 2
    max_lesson_plan_runs: int = 10
    port: int = 8080
    log_level: str = "INFO"

    @model_validator(mode="after")
    def _need_secret(self) -> "Settings":
        if self.webhook_url and not self.webhook_secret:
            raise ValueError(
                f"Environment variable WEBHOOK_SECRET is not set. {README_NOTE}"
            )
        return self


def settings() -> Settings:
    try:
        return Settings.model_validate(
            {k.lower(): v for k, v in os.environ.items()}
        )
    except ValidationError as e:
        problems = []
        for x in e.errors():
            if not x["loc"]:
                problems.append(str(x["ctx"]["error"]))
                continue
            name = str(x["loc"][0]).upper()
            if x["type"] in ("missing", "string_too_short"):
                problems.append(
                    f"Environment variable {name} is not set. {README_NOTE}"
                )
            else:
                problems.append(
                    f"Environment variable {name} is not valid: {x['msg']}."
                )
        raise RuntimeError(" ".join(problems)) from e
