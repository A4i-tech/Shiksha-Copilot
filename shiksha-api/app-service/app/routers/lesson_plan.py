from contextlib import asynccontextmanager

from fastapi import APIRouter, Body, Depends, FastAPI, Request

from app.models.lesson_plan import PlanEditRequest, PlanEditRecordResponse, SectionEditRequest
from app.services.lesson_edit_service import LessonEditService
from pydantic import JsonValue


@asynccontextmanager
async def lifespan(app: FastAPI):
    async with LessonEditService() as app.state.lesson_edit_svc:
        yield


def svc(request: Request) -> LessonEditService:
    return request.app.state.lesson_edit_svc


router = APIRouter(prefix="/lesson-plan", tags=["Lesson Plan"], lifespan=lifespan)


@router.post("/section-edit", summary="Generate an AI-edited revision of a lesson plan section")
async def section_edit(body: SectionEditRequest = Body(...), service: LessonEditService = Depends(svc)) -> JsonValue:
    return await service.edit_section(body)


@router.post("/plan-edit", summary="Generate an AI-edited revision of the entire lesson plan")
async def plan_edit(body: PlanEditRequest = Body(...), service: LessonEditService = Depends(svc)) -> list[PlanEditRecordResponse]:
    return await service.edit_plan(body)
