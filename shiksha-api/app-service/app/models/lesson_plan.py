from typing import Any, Optional

from pydantic import BaseModel


class SectionEditRequest(BaseModel):
    index_path: Optional[str]
    section_id: str
    current_content: Any
    prompt: str


class PlanSectionInput(BaseModel):
    id: str
    title: str
    content: Any


class PlanEditRequest(BaseModel):
    index_path: Optional[str]
    sections: list[PlanSectionInput]
    learning_outcomes: list = []
    prompt: str
