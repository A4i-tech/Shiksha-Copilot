import io
import json

from fastmcp import FastMCP
from fastmcp.exceptions import ToolError
import logging
import uuid

from app.services.general_chat_service import GeneralChatService
from app.services.lesson_chat_service import LessonChatService
from app.services.lesson_edit_service import LessonEditService
from app.models.chat import ConversationMessage, LessonChatRequest, MessageRole
from app.models.lesson_plan import SectionEditRequest
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


def get_services(ctx: Context) -> tuple[GeneralChatService, LessonChatService]:
    state = ctx.request_context.request.app.state
    return state.general_chat_svc, state.lesson_chat_svc


def get_lesson_edit_service(ctx: Context) -> LessonEditService:
    return ctx.request_context.request.app.state.lesson_edit_svc

def router(mcp: FastMCP):
    logger = logging.getLogger(__name__)

    @mcp.tool
    async def chat_general(
        message: str = Field(description="A general educational query"),
        context: Context = Field(...)
    ) -> str:
        """
        General chat endpoint for handling user messages.

        Processes general educational queries using AI assistant with
        access to web search and video search capabilities.
        """
        user_id = str(get_user_id(context))
        try:
            general_chat_svc, _ = get_services(context)
            logger.info(f"Processing general chat request for user: {user_id}")

            content = io.StringIO()
            async for event_raw in general_chat_svc([
                ConversationMessage(role=MessageRole.USER, message=message)
            ], user_id=user_id):
                event = json.loads(event_raw)
                if event["type"] == "content":
                    content.write(event["delta"])
                elif event["type"] == "error":
                    raise ToolError(event["data"])

            logger.info(f"Successfully processed general chat for user: {user_id}")

            return content.getvalue()

        except ValueError as e:
            logger.error(f"Configuration error in general chat: {e}")
            raise ToolError(f"Configuration error: {str(e)}")
        except Exception as e:
            logger.error(f"General chat failed for user {user_id}: {e}")
            raise ToolError("Failed to process chat request")


    @mcp.tool
    async def chat_lesson(
        chapter_id: str = Field(..., description="Identifier with board, medium, grade, subject, number and title"),
        chapter_index: str = Field(..., description="Path to the chapter index for retrieval"),
        message: str = Field(..., description="A query about the lesson"),
        context: Context = Field(...)
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
            _, lesson_chat_svc = get_services(context)
            logger.info(
                f"Processing lesson chat request for user: {request.user_id}, chapter: {request.chapter_id}"
            )

            response_content = await lesson_chat_svc(request)

            logger.info(f"Successfully processed lesson chat for user: {request.user_id}")

            return response_content[0]

        except ValueError as e:
            logger.error(f"Configuration error in lesson chat: {e}")
            raise ToolError(f"Configuration error: {str(e)}")
        except Exception as e:
            logger.error(f"Lesson chat failed for user {request.user_id}: {e}")
            raise ToolError("Failed to process lesson chat request")


    @mcp.tool
    async def enhance_lesson_section(
        chapter_index: str = Field(..., description="Path to the chapter index for RAG grounding"),
        section_id: str = Field(..., description="Identifier of the lesson plan section to revise"),
        current_content: str = Field(..., description="The section's current content — plain text, or a JSON-encoded object for structured sections"),
        is_plain_text: bool = Field(..., description="True if current_content is plain text, false if it is JSON-encoded"),
        prompt: str = Field(..., description="The teacher's requested change to the section"),
        context: Context = Field(...)
    ) -> str:
        """
        Propose an AI-revised version of a lesson plan section, grounded in the chapter's source material.

        This is a suggestion only: it does not save anything. Present the proposed content to the
        teacher so they can review and apply it themselves in the lesson plan editor.
        """
        user_id = str(get_user_id(context))
        service = get_lesson_edit_service(context)

        content: str | dict = current_content
        if not is_plain_text:
            try:
                content = json.loads(current_content)
            except json.JSONDecodeError:
                raise ToolError("current_content is not valid JSON but is_plain_text was false")

        try:
            request = SectionEditRequest(
                index_path=chapter_index,
                section_id=section_id,
                current_content=content,
                prompt=prompt,
            )
            proposed = await service.edit_section(request)

            return proposed if isinstance(proposed, str) else json.dumps(proposed, ensure_ascii=False)

        except Exception as e:
            logger.error(f"Lesson section enhance failed for user {user_id}: {e}")
            raise ToolError("Failed to process lesson section enhance request")
