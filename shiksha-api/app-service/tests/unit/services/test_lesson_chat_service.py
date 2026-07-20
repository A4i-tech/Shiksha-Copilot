import pytest
from unittest.mock import Mock, AsyncMock, patch
from pathlib import Path
import sys

sys.path.insert(0, str(Path(__file__).parent.parent.parent.parent / "app"))

from app.services.lesson_chat_service import LessonChatService
from app.models.chat import LessonChatRequest, ConversationMessage, MessageRole


# Tests commented out due to service refactoring
class TestLessonChatServiceChapterParsing:
    """Test chapter ID parsing logic."""

    def test_extract_details_with_valid_chapter_id(self):
        """Test extracting details from valid chapter ID."""
        service = LessonChatService.__new__(LessonChatService)

        chapter_id = "Board=CBSE,Medium=English,Grade=10,Subject=Science,Number=6,Title=Life Processes"
        details = service._extract_details(chapter_id)

        assert details["BOARD"] == "CBSE"
        assert details["MEDIUM"] == "English"
        assert details["GRADE"] == "10"
        assert details["SUBJECT"] == "Science"
        assert details["CHAPTER_NUMBER"] == "6"
        assert details["CHAPTER_TITLE"] == "Life Processes"

    def test_extract_details_with_special_characters_in_title(self):
        """Test extracting details when title has special characters."""
        service = LessonChatService.__new__(LessonChatService)

        chapter_id = "Board=ICSE,Medium=Hindi,Grade=8,Subject=Math,Number=1,Title=Rational Numbers: Properties & Operations"
        details = service._extract_details(chapter_id)

        assert details["CHAPTER_TITLE"] == "Rational Numbers: Properties & Operations"

    def test_extract_details_raises_error_with_invalid_format(self):
        """Test error raised with invalid chapter ID format."""
        service = LessonChatService.__new__(LessonChatService)

        invalid_chapter_id = "InvalidFormat"

        with pytest.raises(ValueError, match="Invalid chapter_id format"):
            service._extract_details(invalid_chapter_id)


class TestLessonChatServiceCall:
    """Test LessonChatService __call__ method."""

    @pytest.mark.asyncio
    async def test_call_uses_cached_rag_adapter(self, sample_lesson_chat_request, mock_rag_adapter_cache):
        """Test service uses cached RAG adapter."""
        with patch("app.services.lesson_chat_service.PromptTemplate") as MockPromptTemplate, \
             patch("app.services.lesson_chat_service.RagAdapterCache", return_value=mock_rag_adapter_cache), \
             patch("app.services.lesson_chat_service.OpenAIResponses"), \
             patch("app.services.lesson_chat_service.OpenAIEmbedding"):

            mock_template = Mock()
            mock_template.get_prompt_with_variables = Mock(return_value="System prompt")
            MockPromptTemplate.return_value = mock_template

            # Mock adapter response
            mock_adapter = AsyncMock()
            mock_adapter.initiate_index = AsyncMock()
            mock_adapter.chat_with_index = AsyncMock(return_value={"response": "Test response", "source_nodes": []})
            mock_rag_adapter_cache.get = AsyncMock(return_value=mock_adapter)

            service = LessonChatService()

            result = await service(sample_lesson_chat_request)

            assert isinstance(result, dict)
            assert result["response"] == "Test response"
            mock_rag_adapter_cache.get.assert_called_once()

    @pytest.mark.asyncio
    async def test_call_builds_system_message_with_chapter_details(self, sample_lesson_chat_request, mock_rag_adapter_cache):
        """Test service builds system message with chapter details."""
        with patch("app.services.lesson_chat_service.PromptTemplate") as MockPromptTemplate, \
             patch("app.services.lesson_chat_service.RagAdapterCache", return_value=mock_rag_adapter_cache), \
             patch("app.services.lesson_chat_service.OpenAIResponses"), \
             patch("app.services.lesson_chat_service.OpenAIEmbedding"):

            mock_template = Mock()
            mock_template.get_prompt_with_variables = Mock(return_value="Teaching Science for Grade 10")
            MockPromptTemplate.return_value = mock_template

            mock_adapter = AsyncMock()
            mock_adapter.initiate_index = AsyncMock()
            mock_adapter.chat_with_index = AsyncMock(return_value={"response": "Test response", "source_nodes": []})
            mock_rag_adapter_cache.get = AsyncMock(return_value=mock_adapter)

            service = LessonChatService()

            await service(sample_lesson_chat_request)

            # Verify prompt was built with chapter variables
            mock_template.get_prompt_with_variables.assert_called_once()
            call_args = mock_template.get_prompt_with_variables.call_args
            assert call_args[0][0] == "lesson_chat"
            kwargs = call_args[1]
            assert kwargs["BOARD"] == "CBSE"
            assert kwargs["GRADE"] == "10"
            assert kwargs["SUBJECT"] == "Science"

    @pytest.mark.asyncio
    async def test_call_converts_messages_to_llamaindex_format(self, sample_lesson_chat_request, mock_rag_adapter_cache):
        """Test service converts messages to LlamaIndex ChatMessage format."""
        with patch("app.services.lesson_chat_service.PromptTemplate") as MockPromptTemplate, \
             patch("app.services.lesson_chat_service.RagAdapterCache", return_value=mock_rag_adapter_cache), \
             patch("app.services.lesson_chat_service.OpenAIResponses"), \
             patch("app.services.lesson_chat_service.OpenAIEmbedding"):

            mock_template = Mock()
            mock_template.get_prompt_with_variables = Mock(return_value="System prompt")
            MockPromptTemplate.return_value = mock_template

            mock_adapter = AsyncMock()
            mock_adapter.initiate_index = AsyncMock()
            mock_adapter.chat_with_index = AsyncMock(return_value={"response": "Test response", "source_nodes": []})
            mock_rag_adapter_cache.get = AsyncMock(return_value=mock_adapter)

            service = LessonChatService()

            await service(sample_lesson_chat_request)

            # Verify chat_with_index was called with correct format
            mock_adapter.chat_with_index.assert_called_once()
            call_args = mock_adapter.chat_with_index.call_args

            # Current message should be the last message content
            curr_message = call_args[1]["curr_message"]
            assert isinstance(curr_message, str)

            # Chat history should include system message and previous messages
            chat_history = call_args[1]["chat_history"]
            assert len(chat_history) > 0
            assert chat_history[0].role == "system"


class TestLessonChatServiceCleanup:
    """Test LessonChatService cleanup method."""

    @pytest.mark.asyncio
    async def test_cleanup_clears_rag_adapter_cache(self, mock_rag_adapter_cache):
        """Test cleanup clears RAG adapter cache."""
        with patch("app.services.lesson_chat_service.PromptTemplate"), \
             patch("app.services.lesson_chat_service.RagAdapterCache", return_value=mock_rag_adapter_cache), \
             patch("app.services.lesson_chat_service.OpenAIResponses"), \
             patch("app.services.lesson_chat_service.OpenAIEmbedding"):

            service = LessonChatService()

            await service.cleanup()

            mock_rag_adapter_cache.cleanup.assert_called_once()
