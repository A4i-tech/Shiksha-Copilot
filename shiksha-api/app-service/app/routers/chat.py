from fastapi import APIRouter, HTTPException, status
from fastapi.responses import StreamingResponse
from app.models.chat import (
    ChatRequest,
    LessonChatRequest,
    LessonChatResponse,
    Reference,
)
from app.services.general_chat_service import GENERAL_CHAT_SERVICE_INSTANCE
import logging

from app.services.lesson_chat_service import LESSON_CHAT_SERVICE_INSTANCE

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/chat", tags=["Chat"])


@router.post("/general", summary="General Educational Chat")
async def chat(request: ChatRequest):
    """
    **General Educational Chat Endpoint**

    Process general educational queries using an AI assistant with comprehensive capabilities.
    """
    try:
        return StreamingResponse(
            GENERAL_CHAT_SERVICE_INSTANCE(request.messages, user_id=request.user_id),
            media_type="text/event-stream"
        )
    except ValueError as e:
        logger.error(f"Configuration error in general chat: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Configuration error: {str(e)}",
        ) from e
    except Exception as e:
        logger.error(f"General chat failed for user {request.user_id}: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to process chat request",
        ) from e


@router.post("/lesson", summary="Lesson-Specific Educational Chat")
async def lesson_chat(request: LessonChatRequest) -> LessonChatResponse:
    """
    **Lesson-Specific Educational Chat Endpoint**

    Process lesson-specific educational queries with deep contextual understanding
    of chapter content and curriculum alignment.
    """
    try:
        response_content = await LESSON_CHAT_SERVICE_INSTANCE(request)
        return LessonChatResponse(
            user_id=request.user_id,
            response=response_content["response"],
            references=[Reference(**ref) for ref in response_content.get("references", [])],
        )
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
