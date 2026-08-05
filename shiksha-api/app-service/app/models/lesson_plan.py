from pydantic import BaseModel, Field, JsonValue


class SectionEditRequest(BaseModel):
    user_id: str
    index_path: str | None = None
    section_id: str
    current_content: JsonValue
    prompt: str


class PlanSectionInput(BaseModel):
    id: str
    title: str
    content: JsonValue


class PlanEditRequest(BaseModel):
    user_id: str
    index_path: str | None = None
    sections: list[PlanSectionInput]
    learning_outcomes: list[str] = Field(default_factory=list)
    prompt: str


class PlanEditRecordResponse(BaseModel):
    id: str
    content: JsonValue