import pytest
from unittest.mock import patch
from pathlib import Path
import sys

sys.path.insert(0, str(Path(__file__).parent.parent.parent.parent / "app"))

from app.services.lesson_chat_service import LessonChatService


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
