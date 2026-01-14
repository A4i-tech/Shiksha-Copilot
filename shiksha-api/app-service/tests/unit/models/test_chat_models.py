"""
Unit tests for Chat models (chat.py).

Tests cover:
- MessageRole enum
- ConversationMessage validation
- ChatRequest validation
- LessonChatRequest validation
- Response models
"""

import pytest
from pydantic import ValidationError
from pathlib import Path
import sys

sys.path.insert(0, str(Path(__file__).parent.parent.parent.parent / "app"))

from app.models.chat import (
    MessageRole,
    ConversationMessage,
    ChatRequest,
    ChatResponse,
    LessonChatRequest,
    LessonChatResponse
)


class TestMessageRole:
    """Test MessageRole enum."""

    def test_message_role_values(self):
        """Test MessageRole has correct values."""
        assert MessageRole.USER.value == "user"
        assert MessageRole.ASSISTANT.value == "assistant"
        assert MessageRole.SYSTEM.value == "system"


class TestConversationMessage:
    """Test ConversationMessage model."""

    def test_valid_conversation_message(self):
        """Test creating valid ConversationMessage."""
        message = ConversationMessage(
            role=MessageRole.USER,
            message="What is photosynthesis?"
        )

        assert message.role == MessageRole.USER
        assert message.message == "What is photosynthesis?"

    def test_conversation_message_with_string_role(self):
        """Test ConversationMessage accepts string role."""
        message = ConversationMessage(
            role="user",
            message="Test message"
        )

        assert message.role == MessageRole.USER

    def test_conversation_message_allows_empty_message(self):
        """Test ConversationMessage allows empty message (no validation on message content)."""
        # Pydantic does not reject empty strings by default unless explicitly validated
        message = ConversationMessage(
            role=MessageRole.USER,
            message=""
        )
        assert message.message == ""
        assert message.role == MessageRole.USER

    def test_conversation_message_rejects_invalid_role(self):
        """Test ConversationMessage rejects invalid role."""
        with pytest.raises(ValidationError):
            ConversationMessage(
                role="invalid_role",
                message="Test"
            )


class TestChatRequest:
    """Test ChatRequest model."""

    def test_valid_chat_request(self):
        """Test creating valid ChatRequest."""
        messages = [
            ConversationMessage(role=MessageRole.USER, message="Hello"),
            ConversationMessage(role=MessageRole.ASSISTANT, message="Hi!"),
            ConversationMessage(role=MessageRole.USER, message="How are you?")
        ]

        request = ChatRequest(
            user_id="test-user-123",
            messages=messages
        )

        assert request.user_id == "test-user-123"
        assert len(request.messages) == 3

    def test_chat_request_rejects_empty_messages(self):
        """Test ChatRequest rejects empty messages list."""
        with pytest.raises(ValidationError):
            ChatRequest(
                user_id="test-user-123",
                messages=[]
            )

    def test_chat_request_requires_user_id(self):
        """Test ChatRequest requires user_id."""
        with pytest.raises(ValidationError):
            ChatRequest(
                messages=[ConversationMessage(role=MessageRole.USER, message="Test")]
            )


class TestChatResponse:
    """Test ChatResponse model."""

    def test_valid_chat_response(self):
        """Test creating valid ChatResponse."""
        response = ChatResponse(
            user_id="test-user-123",
            response="This is the AI response."
        )

        assert response.user_id == "test-user-123"
        assert response.response == "This is the AI response."

    def test_chat_response_requires_fields(self):
        """Test ChatResponse requires all fields."""
        with pytest.raises(ValidationError):
            ChatResponse(user_id="test-user-123")


class TestLessonChatRequest:
    """Test LessonChatRequest model."""

    def test_valid_lesson_chat_request(self):
        """Test creating valid LessonChatRequest."""
        messages = [ConversationMessage(role=MessageRole.USER, message="What is respiration?")]

        request = LessonChatRequest(
            user_id="test-user-123",
            chapter_id="Board=CBSE,Medium=English,Grade=10,Subject=Science,Number=6,Title=Life Processes",
            index_path="blob/test-container/test-index",
            messages=messages
        )

        assert request.user_id == "test-user-123"
        assert request.chapter_id.startswith("Board=CBSE")
        assert request.index_path == "blob/test-container/test-index"
        assert len(request.messages) == 1

    def test_lesson_chat_request_requires_chapter_id(self):
        """Test LessonChatRequest requires chapter_id."""
        with pytest.raises(ValidationError):
            LessonChatRequest(
                user_id="test-user-123",
                index_path="blob/test/index",
                messages=[ConversationMessage(role=MessageRole.USER, message="Test")]
            )

    def test_lesson_chat_request_requires_index_path(self):
        """Test LessonChatRequest requires index_path."""
        with pytest.raises(ValidationError):
            LessonChatRequest(
                user_id="test-user-123",
                chapter_id="Board=CBSE,Medium=English,Grade=10,Subject=Science,Number=1,Title=Test",
                messages=[ConversationMessage(role=MessageRole.USER, message="Test")]
            )


class TestLessonChatResponse:
    """Test LessonChatResponse model."""

    def test_valid_lesson_chat_response(self):
        """Test creating valid LessonChatResponse."""
        response = LessonChatResponse(
            user_id="test-user-123",
            response="This is the lesson-specific response."
        )

        assert response.user_id == "test-user-123"
        assert response.response == "This is the lesson-specific response."
