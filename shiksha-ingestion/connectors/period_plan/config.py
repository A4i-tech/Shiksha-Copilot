from __future__ import annotations

from pathlib import Path
from typing import Any

import yaml
from pydantic import BaseModel, Field


class ExcelInputConfig(BaseModel):
    subject: str
    file_path: Path
    sheet_map: dict[str, str]
    grades: list[str]


class TemplatesConfig(BaseModel):
    workflow_template_path: Path


class ApiConfig(BaseModel):
    url: str = "http://localhost:7071/api/v2/lesson-plans"
    post_timeout_secs: int = 30
    poll_timeout_secs: int = 30
    poll_interval_secs: int = 10
    max_poll_retries: int = 60
    concurrency: int = 1


class OutputsConfig(BaseModel):
    run_root: Path = Path("runs/period_plan_generation")
    curated_dirname: str = "curated"
    payloads_dirname: str = "payloads"
    results_dirname: str = "results"
    reports_dirname: str = "reports"


class ExecutionConfig(BaseModel):
    skip_existing_payloads: bool = True
    skip_existing_results: bool = True
    validate_payloads: bool = True
    validate_results: bool = True


class DiscourseTypesConfig(BaseModel):
    major: list[str] = Field(
        default_factory=lambda: ["Lab Report", "Project Work", "Field Trip Report", "Model Making"]
    )
    minor: list[str] = Field(
        default_factory=lambda: ["Concept Map", "Flow Chart", "Diagram", "Data Table", "Quiz"]
    )


class PeriodPlanConfig(BaseModel):
    flow_id: str = "period_plan_generation_v1"
    description: str = ""
    inputs: dict[str, ExcelInputConfig]
    templates: TemplatesConfig
    api: ApiConfig = Field(default_factory=ApiConfig)
    outputs: OutputsConfig = Field(default_factory=OutputsConfig)
    execution: ExecutionConfig = Field(default_factory=ExecutionConfig)
    discourse_types: DiscourseTypesConfig = Field(default_factory=DiscourseTypesConfig)

    @classmethod
    def from_yaml(cls, path: Path | str) -> "PeriodPlanConfig":
        p = Path(path)
        data: dict[str, Any] = yaml.safe_load(p.read_text(encoding="utf-8"))
        return cls.model_validate(data)
