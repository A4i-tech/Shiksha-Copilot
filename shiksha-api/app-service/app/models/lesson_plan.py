from typing import Optional

from pydantic import BaseModel


class SectionEditRequest(BaseModel):
    index_path: Optional[str]
    section_id: str
    current_content: str | dict | list
    prompt: str


class PlanSectionInput(BaseModel):
    id: str
    title: str
    content: str | dict | list


class PlanEditRequest(BaseModel):
    index_path: Optional[str]
    sections: list[PlanSectionInput]
    learning_outcomes: list = []
    prompt: str
