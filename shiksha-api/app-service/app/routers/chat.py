from collections.abc import AsyncIterable
from contextlib import asynccontextmanager
from typing import Any

from fastapi import APIRouter, Depends, FastAPI, HTTPException, Request, status
from app.models.chat import (
    ChatRequest,
    LessonChatRequest,
    LessonChatResponse,
)
from app.services.general_chat_service import GeneralChatService
import logging

from app.services.lesson_chat_service import LessonChatService

logger = logging.getLogger(__name__)

@asynccontextmanager
async def lifespan(app: FastAPI):
    app.state.general_chat_svc = GeneralChatService()
    app.state.lesson_chat_svc = LessonChatService()
    async with app.state.general_chat_svc, app.state.lesson_chat_svc:
        yield


router = APIRouter(prefix="/chat", tags=["Chat"], lifespan=lifespan)


def general_chat_svc(request: Request) -> GeneralChatService:
    return request.app.state.general_chat_svc


def lesson_chat_svc(request: Request) -> LessonChatService:
    return request.app.state.lesson_chat_svc


@router.post("/general", summary="General Educational Chat")
async def chat(request: ChatRequest, service: GeneralChatService = Depends(general_chat_svc)) -> AsyncIterable[dict[str, Any]]:
    """
    **General Educational Chat Endpoint**

    Process general educational queries using an AI assistant with comprehensive capabilities.
    """
    async for event in service(request.messages, user_id=request.user_id):
        yield event


@router.post("/lesson", summary="Lesson-Specific Educational Chat")
async def lesson_chat(request: LessonChatRequest, service: LessonChatService = Depends(lesson_chat_svc)) -> LessonChatResponse:
    """
    **Lesson-Specific Educational Chat Endpoint**

    Process lesson-specific educational queries with deep contextual understanding
    of chapter content and curriculum alignment.
    """
    try:
        response, references = await service(request)
        return LessonChatResponse(user_id=request.user_id, response=response, references=references)
    except ValueError as e:
        logger.error(f"Configuration error in lesson chat: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Configuration error: {str(e)}",
        ) from e
    except Exception as e:
        logger.error(f"Lesson chat failed for user {request.user_id}: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to process lesson chat request",
        ) from e
