import pytest
from unittest.mock import AsyncMock, patch
from app.routers.question_paper import translate_json


class TestTranslateJsonEndpoint:
    """Tests for the /question-paper/translate-json endpoint."""

    @pytest.mark.asyncio
    async def test_translate_json_same_language(self):
        """Test translation when source and target languages match."""
        request_data = {
            "target_language": "English",
            "json_data": {
                "title": "Science Exam",
                "instructions": "Answer all questions.",
            },
        }

        with patch("app.routers.question_paper.detect", return_value="en"):
            response = await translate_json(**request_data)

        assert response == request_data["json_data"]

    @pytest.mark.asyncio
    async def test_translate_json_with_language_map(self):
        """Test translation with mapped language codes."""
        request_data = {
            "target_language": "Kannada",
            "json_data": {
                "title": "Test",
                "parts": [{"questions": [{"question_text": "What is this?"}]}],
            },
        }

        with patch("app.routers.question_paper.detect", return_value="en"), patch(
            "app.routers.question_paper.TranslationService.translate_json_async",
            new_callable=AsyncMock,
            return_value=request_data["json_data"],
        ):
            response = await translate_json(**request_data)

        assert isinstance(response, dict)

    @pytest.mark.asyncio
    async def test_translate_json_invalid_language(self):
        """Test translation with unmapped language name returns 200 (mocked no-op)."""
        request_data = {
            "target_language": "Unmapped Language",
            "json_data": {"title": "Test"},
        }
        with patch(
            "app.routers.question_paper.TranslationService.translate_json_async",
            new_callable=AsyncMock,
            return_value=request_data["json_data"],
        ):
            response = await translate_json(**request_data)

        assert response == request_data["json_data"]

    @pytest.mark.asyncio
    async def test_translate_json_empty_json_data(self):
        """Test translation with empty JSON data."""
        request_data = {"target_language": "English", "json_data": {}}

        response = await translate_json(**request_data)

        assert response == {}

    @pytest.mark.asyncio
    async def test_translate_json_nested_structure(self):
        """Test translation with deeply nested JSON structure (structure preserved)."""
        request_data = {
            "target_language": "Hindi",
            "json_data": {
                "parts": [
                    {
                        "part_name": "Part A",
                        "questions": [
                            {
                                "question_text": "What is photosynthesis?",
                                "options": ["Option A", "Option B"],
                            }
                        ],
                    }
                ]
            },
        }
        json_data = request_data["json_data"]
        with patch(
            "app.routers.question_paper.TranslationService.translate_json_async",
            new_callable=AsyncMock,
            return_value=json_data,
        ):
            response = await translate_json(**request_data)

        assert response["parts"][0]["part_name"] == "Part A"


class TestHelperFunctions:
    """Tests for module-level helper functions."""

    def test_get_sample_text_from_dict(self):
        """Test extracting sample text from nested dict."""
        from app.utils.utils import get_sample_text

        data = {"instructions": "This is a test instruction", "title": "Test"}

        result = next(get_sample_text(data))
        assert "test instruction" in result.lower()

    def test_get_sample_text_from_list(self):
        """Test extracting sample text from list."""
        from app.utils.utils import get_sample_text

        data = [
            {"question_text": "What is this test question?"},
            {"answer": "This is an answer"},
        ]

        result = next(get_sample_text(data))
        assert "test question" in result.lower()

    def test_get_sample_text_empty_data(self):
        """Test with empty data structure."""
        from app.utils.utils import get_sample_text

        assert next(get_sample_text({}), None) is None
        assert next(get_sample_text([]), None) is None

    def test_get_sample_text_prioritizes_instructions(self):
        """Test that instructions field is prioritized."""
        from app.utils.utils import get_sample_text

        data = {
            "title": "Short",
            "instructions": "This is a longer instruction text with multiple words",
        }

        result = next(get_sample_text(data))
        assert "longer instruction" in result.lower()


class TestLanguageMapping:
    """Tests for language code mapping."""

    def test_language_map_complete(self):
        """Test that language map contains expected languages."""
        from app.routers.question_paper import LANGUAGE_MAP

        expected_languages = ["english", "kannada", "hindi", "telugu", "tamil"]
        for lang in expected_languages:
            assert lang in LANGUAGE_MAP
            assert isinstance(LANGUAGE_MAP[lang], str)

    def test_language_map_iso_codes(self):
        """Test that language map values are valid ISO 639-1 codes."""
        from app.routers.question_paper import LANGUAGE_MAP

        iso_codes = {"en", "kn", "hi", "te", "ta", "ml", "mr", "bn", "gu", "pa", "ur"}
        for code in LANGUAGE_MAP.values():
            assert code in iso_codes
