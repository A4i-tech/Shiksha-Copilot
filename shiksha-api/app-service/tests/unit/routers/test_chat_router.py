import pytest
from fastapi.testclient import TestClient
from fastapi import FastAPI
from unittest.mock import AsyncMock, patch, MagicMock
from app.routers.chat import router
from app.models.chat import ChatResponse, LessonChatResponse, MessageRole


@pytest.fixture
def app():
    """Create a test FastAPI app with chat router."""
    test_app = FastAPI()
    test_app.include_router(router)
    return test_app


@pytest.fixture
def client(app):
    """Create a test client for the app."""
    return TestClient(app)


class TestGeneralChatEndpoint:
    """Tests for the general chat endpoint."""

    @patch("app.routers.chat.GENERAL_CHAT_SERVICE_INSTANCE")
    async def test_general_chat_success(self, mock_service, client):
        """Test successful general chat request."""

        # Arrange - make it return an awaitable
        async def mock_chat(*args, **kwargs):
            return "This is a test response"

        mock_service.side_effect = mock_chat

        request_data = {
            "user_id": "test-user-123",
            "messages": [{"role": "user", "message": "What is photosynthesis?"}],
        }

        # Act
        response = client.post("/chat", json=request_data)

        # Assert
        assert response.status_code == 200
        assert "user_id" in response.json()
        assert "response" in response.json()

    @patch("app.routers.chat.GENERAL_CHAT_SERVICE_INSTANCE")
    async def test_general_chat_empty_messages(self, mock_service, client):
        """Test general chat with empty messages list."""
        request_data = {"user_id": "test-user-123", "messages": []}

        response = client.post("/chat", json=request_data)

        # Should return error for empty messages
        assert response.status_code in [400, 422]

    @patch("app.routers.chat.GENERAL_CHAT_SERVICE_INSTANCE")
    async def test_general_chat_service_error(self, mock_service, client):
        """Test general chat when service raises an error."""
        mock_service.side_effect = Exception("Service error")

        request_data = {
            "user_id": "test-user-123",
            "messages": [{"role": "user", "message": "Test question"}],
        }

        response = client.post("/chat", json=request_data)

        # Should return 500 error
        assert response.status_code == 500

    def test_general_chat_invalid_json(self, client):
        """Test general chat with invalid JSON."""
        response = client.post("/chat", json={"invalid": "data"})

        # Should return validation error
        assert response.status_code == 422


class TestLessonChatEndpoint:
    """Tests for the lesson-specific chat endpoint."""

    @patch("app.routers.chat.LESSON_CHAT_SERVICE_INSTANCE")
    async def test_lesson_chat_success(self, mock_service, client):
        """Test successful lesson chat request."""

        # Arrange - make it return an awaitable
        async def mock_chat(*args, **kwargs):
            return "This is a lesson-specific response"

        mock_service.side_effect = mock_chat

        request_data = {
            "user_id": "test-user-123",
            "messages": [{"role": "user", "message": "Explain chapter 3"}],
            "chapter_id": "CBSE-English-10-Physics-3-Light",
            "index_path": "blob://container/path/to/index",
        }

        # Act
        response = client.post("/chat/lesson", json=request_data)

        # Assert
        assert response.status_code == 200
        assert "user_id" in response.json()
        assert "response" in response.json()

    @patch("app.routers.chat.LESSON_CHAT_SERVICE_INSTANCE")
    async def test_lesson_chat_with_all_params(self, mock_service, client):
        """Test lesson chat with all optional parameters."""

        # Make it return an awaitable
        async def mock_chat(*args, **kwargs):
            return "Detailed response"

        mock_service.side_effect = mock_chat

        request_data = {
            "user_id": "test-user-123",
            "messages": [{"role": "user", "message": "Test question"}],
            "chapter_id": "CBSE-English-10-Physics-3-Light-Reflection",
            "index_path": "qdrant://collection/physics",
        }

        response = client.post("/chat/lesson", json=request_data)

        assert response.status_code == 200

    def test_lesson_chat_missing_required_fields(self, client):
        """Test lesson chat without required fields."""
        request_data = {
            "user_id": "test-user-123",
            "messages": [{"role": "user", "message": "Test"}],
            # Missing chapter_id, index_path
        }

        response = client.post("/chat/lesson", json=request_data)

        # Should return validation error
        assert response.status_code == 422

    @patch("app.routers.chat.LESSON_CHAT_SERVICE_INSTANCE")
    async def test_lesson_chat_service_error(self, mock_service, client):
        """Test lesson chat when service raises an error."""
        mock_service.side_effect = Exception("Service error")

        request_data = {
            "user_id": "test-user-123",
            "messages": [{"role": "user", "message": "Test question"}],
            "chapter_id": "CBSE-English-10-Physics-3-Light",
            "index_path": "blob://container/path",
        }

        response = client.post("/chat/lesson", json=request_data)

        # Should return 500 error
        assert response.status_code == 500


class TestChatRouterConfiguration:
    """Tests for router configuration and metadata."""

    def test_router_prefix(self):
        """Test that router has correct prefix."""
        assert router.prefix == "/chat"

    def test_router_tags(self):
        """Test that router has correct tags."""
        assert "Chat" in router.tags

    def test_router_has_general_chat_endpoint(self, client):
        """Test that general chat endpoint exists."""
        response = client.post("/chat", json={"user_id": "test", "messages": []})
        # Should not be 404
        assert response.status_code != 404

    def test_router_has_lesson_chat_endpoint(self, client):
        """Test that lesson chat endpoint exists."""
        response = client.post(
            "/chat/lesson",
            json={
                "user_id": "test",
                "messages": [],
                "grade": 10,
                "subject": "Test",
                "chapter": "Test",
            },
        )
        # Should not be 404
        assert response.status_code != 404
