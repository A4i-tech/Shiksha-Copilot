from typing import Generic, TypeVar

from pydantic import BaseModel, Field


ContentT = TypeVar("ContentT", bound=str | dict[str, object] | list[object])

class SectionEditRequest(BaseModel, Generic[ContentT]):
    index_path: str | None = None
    section_id: str
    current_content: ContentT
    prompt: str


class PlanSectionInput(BaseModel, Generic[ContentT]):
    id: str
    title: str
    content: ContentT


class PlanEditRequest(BaseModel, Generic[ContentT]):
    index_path: str | None = None
    sections: list[PlanSectionInput[ContentT]]
    learning_outcomes: list[str] = Field(default_factory=list)
    prompt: str


class PlanEditRecordResponse(BaseModel):
    id: str
    content: str