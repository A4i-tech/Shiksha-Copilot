from pathlib import Path
import logging
import re
from app.config import settings
from app.models.chat import LessonChatRequest, Reference
from app.services.rag_adapter_cache import RagAdapterCache
from app.utils.prompt_template import PromptTemplate
from llama_index.core.llms import ChatMessage
from langfuse import observe, propagate_attributes
from llama_index.embeddings.openai import OpenAIEmbedding
from llama_index.llms.openai import OpenAIResponses
from llama_index.core.base.response.schema import Response
from llama_index.core.utils import truncate_text

logger = logging.getLogger(__name__)


class LessonChatService:
    """Service for handling lesson chat interactions using RAGWrapper."""

    def __init__(self):
        """Initialize the lesson chat service with LLM models and blob store."""
        # Initialize prompt template with the chat prompts file
        prompts_file_path = Path(__file__).parent.parent.parent / "prompts" / "chat_prompts.yaml"
        self._prompt_template = PromptTemplate(str(prompts_file_path))

        self._rag_llm = OpenAIResponses(model=settings.lesson_chat_model)
        self._rag_embed = OpenAIEmbedding(model=settings.embed_model)
        self._rags = RagAdapterCache(RagAdapterCache.from_factory)

    async def __aenter__(self):
        return self

    async def __aexit__(self, exc_type, exc_value, traceback):
        await self.cleanup()

    @observe(name="Shiksha-QA")
    async def __call__(self, request: LessonChatRequest) -> tuple[str, list[Reference]]:
        """
        Process a lesson chat request and return the response.

        Args:
            request: The lesson chat request containing messages and index path

        Returns:
            dict: Contains 'response' (str) and 'references' (list of dicts)
        """
        chapter_details = self._extract_details(request.chapter_id)
        try:
            # Get or create cached RAG adapter instance
            rag_adapter = await self._rags.get(request.index_path, self._rag_llm, self._rag_embed)

            # Build system message using already-extracted chapter details
            system_message = self._prompt_template.get_prompt_with_variables(
                "lesson_chat", **chapter_details
            )

            # Convert request messages to chat format
            chat_messages = [
                ChatMessage(role=message.role.value, content=message.message)
                for message in request.messages
            ]

            # Build chat history with system message and previous messages
            chat_history = [
                ChatMessage(role="system", content=system_message)
            ] + chat_messages[:-1]

            # Get response from RAG system using current message and chat history
            with propagate_attributes(user_id=request.user_id, tags=[
                "chat_type:lesson",
                f"board:{chapter_details['BOARD']}",
                f"grade:{chapter_details['GRADE']}",
                f"subject:{chapter_details['SUBJECT']}",
            ]):
                result = await rag_adapter.chat_with_index(curr_message=chat_messages[-1].content, chat_history=chat_history)

            assert isinstance(result, Response)
            return result.response or "", [
                Reference(title="Textbook", text=truncate_text(node.node.get_content(), 200), url=None)
                for node in result.source_nodes
            ]
        except Exception as e:
            logger.error(f"Error in lesson chat service: {e}", exc_info=True)
            raise

    def _extract_details(self, chapter_id: str):
        """
        Extract chapter details from the chapter ID string.

        Args:
            chapter_id: Formatted string containing chapter metadata

        Returns:
            dict: Dictionary with extracted chapter details (board, medium, grade, etc.)

        Raises:
            ValueError: If chapter_id format is invalid
        """
        # Define regex pattern to parse chapter ID format
        pattern = r"Board=(?P<board>[^,]+),Medium=(?P<medium>[^,]+),Grade=(?P<grade>[^,]+),Subject=(?P<subject>[^,]+),Number=(?P<number>[^,]+),Title=(?P<title>.+)"
        match = re.match(pattern, chapter_id)

        if match:
            return {
                "BOARD": match.group("board"),
                "MEDIUM": match.group("medium"),
                "GRADE": match.group("grade"),
                "SUBJECT": match.group("subject"),
                "CHAPTER_NUMBER": match.group("number"),
                "CHAPTER_TITLE": match.group("title"),
            }
        else:
            raise ValueError(f"Invalid chapter_id format: {chapter_id}")

    async def cleanup(self) -> None:
        """Clear the RAG adapter cache and associated resources."""
        await self._rags.cleanup()
