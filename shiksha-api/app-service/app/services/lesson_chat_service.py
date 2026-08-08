import logging
import re
from app.config import settings
from app.models.chat import LessonChatRequest, Reference
from app.services.rag_adapter_cache import RagAdapterCache
from app.utils.utils import load_yaml_prompts
from llama_index.core.llms import ChatMessage, MessageRole
from langfuse import observe, propagate_attributes
from llama_index.embeddings.openai import OpenAIEmbedding
from llama_index.llms.openai import OpenAIResponses
from llama_index.core.utils import truncate_text

logger = logging.getLogger(__name__)

_PV_ALL = (  # prompt vars
    _PV_BOARD := "BOARD",
    _PV_MEDIUM := "MEDIUM",
    _PV_GRADE := "GRADE",
    _PV_SUBJECT := "SUBJECT",
    _PV_CHAPTER_NUMBER := "CHAPTER_NUMBER",
    _PV_CHAPTER_TITLE := "CHAPTER_TITLE"
)


class LessonChatService:
    """Service for handling lesson chat interactions using RAGWrapper."""

    def __init__(self):
        prompts = load_yaml_prompts("chat_prompts.yaml")
        self._prompt = prompts["lesson_chat"]
        self._prompt.format_map({v: "" for v in _PV_ALL})

        self._rag_llm = OpenAIResponses(model=settings.lesson_chat_model)
        self._rag_embed = OpenAIEmbedding(model=settings.embed_model)
        self._rags = RagAdapterCache(RagAdapterCache.from_factory)

    async def __aenter__(self):
        return self

    async def __aexit__(self, exc_type, exc_value, traceback):
        await self.cleanup()

    @observe(name="Shiksha-QA")
    async def __call__(self, request: LessonChatRequest) -> tuple[str, list[Reference]]:
        chapter_details = self._extract_details(request.chapter_id)
        rag_adapter = await self._rags.get(request.index_path, self._rag_llm, self._rag_embed)
        system_message = self._prompt.format_map(chapter_details)
        chat_messages = [
            ChatMessage(role=message.role.value, content=message.message)
            for message in request.messages
        ]

        # Build chat history with system message and previous messages
        chat_history = [
            ChatMessage(role=MessageRole.SYSTEM, content=system_message)
        ] + chat_messages[:-1]

        with propagate_attributes(user_id=request.user_id, tags=[
            "chat_type:lesson",
            f"board:{chapter_details['BOARD']}",
            f"grade:{chapter_details['GRADE']}",
            f"subject:{chapter_details['SUBJECT']}",
        ]):
            result = await rag_adapter.chat_with_index(curr_message=chat_messages[-1].content, chat_history=chat_history)

        return result.response, [
            Reference(title="Textbook", text=truncate_text(node.node.get_content(), 200), url=None)
            for node in result.source_nodes
        ]

    def _extract_details(self, chapter_id: str):
        pattern = r"Board=(?P<board>[^,]+),Medium=(?P<medium>[^,]+),Grade=(?P<grade>[^,]+),Subject=(?P<subject>[^,]+),Number=(?P<number>[^,]+),Title=(?P<title>.+)"
        if match := re.match(pattern, chapter_id):
            return {
                _PV_BOARD: match.group("board"),
                _PV_MEDIUM: match.group("medium"),
                _PV_GRADE: match.group("grade"),
                _PV_SUBJECT: match.group("subject"),
                _PV_CHAPTER_NUMBER: match.group("number"),
                _PV_CHAPTER_TITLE: match.group("title"),
            }

        raise ValueError(f"Invalid chapter_id format: {chapter_id}")

    async def cleanup(self) -> None:
        """Clear the RAG adapter cache and associated resources."""
        await self._rags.cleanup()
