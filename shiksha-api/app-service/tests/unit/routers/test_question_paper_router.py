import pytest
from fastapi.testclient import TestClient
from unittest.mock import patch
from app.main import app


client = TestClient(app)


@pytest.fixture
def mock_question_paper_service():
    """Mock the QuestionPaperService."""
    with patch(
        "app.routers.question_paper.QUESTION_PAPER_SERVICE_INSTANCE"
    ) as mock_service:
        yield mock_service


class TestTranslateJsonEndpoint:
    """Tests for the /question-paper/translate_json endpoint."""

    def test_translate_json_same_language(self, mock_question_paper_service):
        """Test translation when source and target languages match."""
        request_data = {
            "target_language": "English",
            "json_data": {
                "title": "Science Exam",
                "instructions": "Answer all questions.",
            },
        }

        response = client.post("/question-paper/translate_json", json=request_data)

        assert response.status_code == 200
        assert response.json()["translated_json"] == request_data["json_data"]

    def test_translate_json_with_language_map(self, mock_question_paper_service):
        """Test translation with mapped language codes."""
        request_data = {
            "target_language": "Kannada",
            "json_data": {
                "title": "Test",
                "parts": [{"questions": [{"question_text": "What is this?"}]}],
            },
        }

        response = client.post("/question-paper/translate_json", json=request_data)

        assert response.status_code == 200
        data = response.json()
        assert "translated_json" in data
        assert isinstance(data["translated_json"], dict)

    def test_translate_json_missing_fields(self):
        """Test translation request with missing required fields."""
        request_data = {
            "target_language": "Kannada"
            # Missing json_data
        }

        response = client.post("/question-paper/translate_json", json=request_data)

        assert response.status_code == 422  # Validation error

    def test_translate_json_invalid_language(self, mock_question_paper_service):
        """Test translation with unmapped language name."""
        request_data = {
            "target_language": "Unmapped Language",
            "json_data": {"title": "Test"},
        }

        response = client.post("/question-paper/translate_json", json=request_data)

        assert response.status_code == 200
        # Should still work, just with unmapped language code

    def test_translate_json_empty_json_data(self, mock_question_paper_service):
        """Test translation with empty JSON data."""
        request_data = {"target_language": "English", "json_data": {}}

        response = client.post("/question-paper/translate_json", json=request_data)

        assert response.status_code == 200
        assert response.json()["translated_json"] == {}

    def test_translate_json_nested_structure(self, mock_question_paper_service):
        """Test translation with deeply nested JSON structure."""
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

        response = client.post("/question-paper/translate_json", json=request_data)

        assert response.status_code == 200
        data = response.json()
        assert data["translated_json"]["parts"][0]["part_name"] == "Part A"


class TestHelperFunctions:
    """Tests for module-level helper functions."""

    def test_get_sample_text_from_dict(self):
        """Test extracting sample text from nested dict."""
        from app.routers.question_paper import get_sample_text

        data = {"instructions": "This is a test instruction", "title": "Test"}

        result = get_sample_text(data)
        assert "test instruction" in result.lower()

    def test_get_sample_text_from_list(self):
        """Test extracting sample text from list."""
        from app.routers.question_paper import get_sample_text

        data = [
            {"question_text": "What is this test question?"},
            {"answer": "This is an answer"},
        ]

        result = get_sample_text(data)
        assert "test question" in result.lower()

    def test_get_sample_text_empty_data(self):
        """Test with empty data structure."""
        from app.routers.question_paper import get_sample_text

        assert get_sample_text({}) == ""
        assert get_sample_text([]) == ""

    def test_get_sample_text_prioritizes_instructions(self):
        """Test that instructions field is prioritized."""
        from app.routers.question_paper import get_sample_text

        data = {
            "title": "Short",
            "instructions": "This is a longer instruction text with multiple words",
        }

        result = get_sample_text(data)
        assert "longer instruction" in result.lower()

    def test_translate_json_placeholder(self):
        """Test that translate_json is a placeholder function."""
        from app.routers.question_paper import translate_json

        input_data = {"key": "value"}
        result = translate_json(input_data)

        # Should return the same data (skeleton/placeholder function)
        assert result == input_data


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
