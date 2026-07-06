from contextlib import asynccontextmanager
from typing import Any, Optional

from fastapi import APIRouter, Body, Depends, FastAPI, Request
from pydantic import BaseModel

from app.services.lesson_edit_service import LessonEditService


@asynccontextmanager
async def lifespan(app: FastAPI):
    app.state.lesson_edit_svc = LessonEditService()
    yield


def svc(request: Request) -> LessonEditService:
    return request.app.state.lesson_edit_svc


router = APIRouter(prefix="/lesson-plan", tags=["Lesson Plan"], lifespan=lifespan)


class SectionEditRequest(BaseModel):
    lessonId: Optional[str] = None
    sectionId: str
    currentContent: Any
    outputFormat: str
    prompt: str


@router.post("/section-edit", summary="Generate an AI-edited revision of a lesson plan section")
async def section_edit(body: SectionEditRequest = Body(...), service: LessonEditService = Depends(svc)):
    proposed = await service.edit_section(body.currentContent, body.outputFormat, body.prompt)
    return {"proposed_content": proposed}


class PlanSectionInput(BaseModel):
    id: str
    title: str
    outputFormat: str
    content: Any


class PlanEditRequest(BaseModel):
    lessonId: Optional[str] = None
    sections: list[PlanSectionInput]
    learningOutcomes: list = []
    prompt: str


@router.post("/plan-edit", summary="Generate an AI-edited revision of the entire lesson plan")
async def plan_edit(body: PlanEditRequest = Body(...), service: LessonEditService = Depends(svc)):
    proposed = await service.edit_plan(
        [s.model_dump() for s in body.sections], body.learningOutcomes, body.prompt
    )
    return {"proposed_sections": proposed}
