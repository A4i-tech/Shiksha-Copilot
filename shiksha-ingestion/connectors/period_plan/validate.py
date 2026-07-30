from __future__ import annotations

import json
import re
from pathlib import Path
from typing import Any, Literal

from pydantic import BaseModel, ConfigDict, Field, ValidationError, field_validator


def validate_chapter_id_structure(value: str) -> str:
    parts = value.split(",", 5)
    if len(parts) != 6:
        raise ValueError("must have 6 comma-separated parts: Board,Medium,Grade,Subject,Number,Title")
    expected_prefixes = ["Board=", "Medium=", "Grade=", "Subject=", "Number=", "Title="]
    for part, prefix in zip(parts, expected_prefixes, strict=True):
        if not part.startswith(prefix):
            raise ValueError(f"must contain '{prefix}' segment in order")
        if not part[len(prefix):].strip():
            raise ValueError(f"{prefix[:-1]} value must not be blank")
    return value


def validate_workflow_id_structure(value: str) -> str:
    if not re.match(r"^[a-z0-9][a-z0-9_-]*[a-z0-9]$", value):
        raise ValueError("must be lowercase alphanumeric with '-' or '_' separators")
    if not (value.endswith("-lesson-plan") or value.endswith("_lp_workflow")):
        raise ValueError("must end with '-lesson-plan' or '_lp_workflow'")
    return value


class OutputSection(BaseModel):
    model_config = ConfigDict(extra="forbid")
    section_id: str = Field(min_length=1)
    section_title: str = Field(min_length=1)
    content: str = Field(min_length=1)

    @field_validator("section_id", "section_title", "content")
    @classmethod
    def non_blank(cls, value: str) -> str:
        if not value.strip():
            raise ValueError("must not be blank")
        return value


class ChapterInfo(BaseModel):
    model_config = ConfigDict(extra="forbid")
    id: str = Field(min_length=1)
    chapter_title: str = Field(min_length=1)
    index_path: str = Field(min_length=1)


class WorkflowRef(BaseModel):
    model_config = ConfigDict(extra="allow", populate_by_name=True)
    id_: str = Field(alias="_id", min_length=1)


class PayloadModel(BaseModel):
    model_config = ConfigDict(extra="forbid", populate_by_name=True)
    id_: str = Field(alias="_id", min_length=1)
    user_id: str = Field(min_length=1)
    created_at: int = Field(gt=0)
    workflow_id: str = Field(min_length=1)
    chapter_id: str = Field(min_length=1)
    lp_level: str = Field(min_length=1)
    lp_type_english: str = Field(min_length=1)
    subtopics: list[str] = Field(min_length=1)
    learning_outcomes: list[str] = Field(min_length=1)
    chapter_info: ChapterInfo
    workflow: WorkflowRef

    @field_validator("id_", "user_id", "workflow_id", "chapter_id", "lp_level", "lp_type_english")
    @classmethod
    def non_blank(cls, value: str) -> str:
        if not value.strip():
            raise ValueError("must not be blank")
        return value

    @field_validator("chapter_id")
    @classmethod
    def chapter_id_structure(cls, value: str) -> str:
        return validate_chapter_id_structure(value)

    @field_validator("workflow_id")
    @classmethod
    def workflow_id_structure(cls, value: str) -> str:
        return validate_workflow_id_structure(value)

    @field_validator("subtopics", "learning_outcomes")
    @classmethod
    def list_values_non_blank(cls, values: list[str]) -> list[str]:
        if any((not isinstance(v, str)) or (not v.strip()) for v in values):
            raise ValueError("must contain non-blank strings only")
        return values


class ResultModel(BaseModel):
    model_config = ConfigDict(extra="forbid", populate_by_name=True)
    id_: str = Field(alias="_id", min_length=1)
    created_at: int = Field(gt=0)
    workflow_id: str = Field(min_length=1)
    chapter_id: str = Field(min_length=1)
    subtopics: list[str] = Field(min_length=1)
    learning_outcomes: list[str] = Field(min_length=1)
    lp_level: str = Field(min_length=1)
    lp_type_english: str = Field(min_length=1)
    sections: list[OutputSection] = Field(min_length=1)

    @field_validator("id_", "workflow_id", "chapter_id", "lp_level", "lp_type_english")
    @classmethod
    def non_blank(cls, value: str) -> str:
        if not value.strip():
            raise ValueError("must not be blank")
        return value

    @field_validator("chapter_id")
    @classmethod
    def chapter_id_structure(cls, value: str) -> str:
        return validate_chapter_id_structure(value)

    @field_validator("workflow_id")
    @classmethod
    def workflow_id_structure(cls, value: str) -> str:
        return validate_workflow_id_structure(value)

    @field_validator("subtopics", "learning_outcomes")
    @classmethod
    def list_values_non_blank(cls, values: list[str]) -> list[str]:
        if any((not isinstance(v, str)) or (not v.strip()) for v in values):
            raise ValueError("must contain non-blank strings only")
        return values


def _format_error(err: ValidationError) -> str:
    messages = []
    for e in err.errors():
        location = ".".join(str(p) for p in e.get("loc", []))
        messages.append(f"{location}: {e.get('msg', 'validation error')}")
    return "; ".join(messages)


def validate_file(path: Path, mode: Literal["payload", "result", "auto"]) -> tuple[bool, str]:
    try:
        data: Any = json.loads(path.read_text(encoding="utf-8"))
    except Exception as exc:
        return False, f"json parse error: {exc}"
    if not isinstance(data, dict):
        return False, "top-level JSON must be an object"
    if mode == "payload":
        try:
            PayloadModel.model_validate(data)
            return True, ""
        except ValidationError as exc:
            return False, _format_error(exc)
    if mode == "result":
        try:
            ResultModel.model_validate(data)
            return True, ""
        except ValidationError as exc:
            return False, _format_error(exc)
    try:
        PayloadModel.model_validate(data)
        return True, ""
    except ValidationError as payload_err:
        try:
            ResultModel.model_validate(data)
            return True, ""
        except ValidationError as result_err:
            return (
                False,
                f"payload schema: {_format_error(payload_err)} | result schema: {_format_error(result_err)}",
            )


def validate_dir(directory: Path, mode: Literal["payload", "result", "auto"] = "auto") -> tuple[int, int]:
    if not directory.exists():
        raise FileNotFoundError(f"Validation directory not found: {directory}")
    ok = fail = 0
    for f in sorted(directory.rglob("*.json")):
        valid, msg = validate_file(f, mode)
        if valid:
            ok += 1
        else:
            fail += 1
            print(f"  [INVALID] {f}: {msg}")
    return ok, fail


def validate_dirs(payloads_dir: Path, results_dir: Path) -> tuple[int, int]:
    p_ok, p_fail = validate_dir(payloads_dir, "payload")
    r_ok, r_fail = validate_dir(results_dir, "result")
    print(f"  Payloads: {p_ok} ok, {p_fail} failed")
    print(f"  Results:  {r_ok} ok, {r_fail} failed")
    return p_ok + r_ok, p_fail + r_fail
