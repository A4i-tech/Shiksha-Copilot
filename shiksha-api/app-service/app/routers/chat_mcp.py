from fastmcp import FastMCP
from fastmcp.exceptions import ToolError
from app.services.general_chat_service import GENERAL_CHAT_SERVICE_INSTANCE
import logging
import uuid

from app.services.lesson_chat_service import LESSON_CHAT_SERVICE_INSTANCE
from app.models.chat import ConversationMessage, LessonChatRequest, MessageRole
from fastmcp.server import Context
from pydantic import Field

def get_user_id(ctx: Context) -> uuid.UUID:
    params = ctx.request_context.request.query_params
    if "user_id" in params:
        try:
            return uuid.UUID(params["user_id"])
        except ValueError:
            pass
    raise ToolError("Cannot proceed with requets due to missing or malformed 'user_id' param")

def router(mcp: FastMCP):
    logger = logging.getLogger(__name__)

    @mcp.tool(
        "chat_general",
        title="General chat endpoint",
        description="Handle general chat messages and return AI responses",
    )
    async def chat(message: str, context: Context) -> str:
        """
        General chat endpoint for handling user messages.

        Processes general educational queries using AI assistant with
        access to web search and video search capabilities.
        """
        user_id = str(get_user_id(context))
        try:
            logger.info(f"Processing general chat request for user: {user_id}")

            response_content = await GENERAL_CHAT_SERVICE_INSTANCE([
                ConversationMessage(role=MessageRole.USER, message=message)
            ])

            logger.info(f"Successfully processed general chat for user: {user_id}")

            return response_content

        except ValueError as e:
            logger.error(f"Configuration error in general chat: {e}")
            raise ToolError(f"Configuration error: {str(e)}")
        except Exception as e:
            logger.error(f"General chat failed for user {user_id}: {e}")
            raise ToolError("Failed to process chat request")


    @mcp.tool(
        "chat_lession",
        title="Lesson-specific chat endpoint",
        description="Handle lesson-specific chat messages with contextual understanding."
    )
    async def lesson_chat(
        chapter_id: str = Field(..., description="Identifier with board, medium, grade, subject, number and title"),
        chapter_index: str = Field(..., description="Path to the chapter index for retrieval"),
        message: str = Field(..., description="A query about the lesson"),
        context: Context = None
    ) -> str:
        """
        Lesson-specific chat endpoint for handling educational content queries.

        Processes lesson-specific queries with contextual understanding of the
        chapter content and educational context.
        """
        request = LessonChatRequest(
            user_id=str(get_user_id(context)),
            chapter_id=chapter_id,
            index_path=chapter_index,
            messages=[ConversationMessage(role=MessageRole.USER, message=message)]
        )
        try:
            logger.info(
                f"Processing lesson chat request for user: {request.user_id}, chapter: {request.chapter_id}"
            )

            response_content = await LESSON_CHAT_SERVICE_INSTANCE(request)

            logger.info(f"Successfully processed lesson chat for user: {request.user_id}")

            return response_content

        except ValueError as e:
            logger.error(f"Configuration error in lesson chat: {e}")
            raise ToolError(f"Configuration error: {str(e)}")
        except Exception as e:
            logger.error(f"Lesson chat failed for user {request.user_id}: {e}")
            raise ToolError("Failed to process lesson chat request")
