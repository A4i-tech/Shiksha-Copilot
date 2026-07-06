from contextlib import asynccontextmanager
from typing import Any, Optional

from fastapi import APIRouter, Body, Depends, FastAPI, Request
from pydantic import BaseModel

from app.services.lesson_edit_service import LessonEditService


@asynccontextmanager
async def lifespan(app: FastAPI):
    app.state.lesson_edit_svc = LessonEditService()
    yield
    await app.state.lesson_edit_svc.cleanup()


def svc(request: Request) -> LessonEditService:
    return request.app.state.lesson_edit_svc


router = APIRouter(prefix="/lesson-plan", tags=["Lesson Plan"], lifespan=lifespan)


class SectionEditRequest(BaseModel):
    index_path: Optional[str] = None
    section_id: str
    current_content: Any
    prompt: str


@router.post("/section-edit", summary="Generate an AI-edited revision of a lesson plan section")
async def section_edit(body: SectionEditRequest = Body(...), service: LessonEditService = Depends(svc)):
    proposed = await service.edit_section(body.current_content, body.prompt, body.index_path)
    return {"proposed_content": proposed}


class PlanSectionInput(BaseModel):
    id: str
    title: str
    content: Any


class PlanEditRequest(BaseModel):
    index_path: Optional[str] = None
    sections: list[PlanSectionInput]
    learning_outcomes: list = []
    prompt: str


@router.post("/plan-edit", summary="Generate an AI-edited revision of the entire lesson plan")
async def plan_edit(body: PlanEditRequest = Body(...), service: LessonEditService = Depends(svc)):
    proposed = await service.edit_plan(
        [s.model_dump() for s in body.sections], body.learning_outcomes, body.prompt, body.index_path
    )
    return {"proposed_sections": proposed}
