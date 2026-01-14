"""
Unit tests for GeneralChatService (general_chat_service.py).

Tests cover:
- Service initialization
- Prompt loading from YAML
- Azure OpenAI Responses API integration
- Conversation formatting
- Error handling
"""

import pytest
from unittest.mock import Mock, AsyncMock, patch, MagicMock
from pathlib import Path
import sys

sys.path.insert(0, str(Path(__file__).parent.parent.parent.parent / "app"))

from app.services.general_chat_service import GeneralChatService
from app.models.chat import ConversationMessage, MessageRole


class TestGeneralChatServiceInitialization:
    """Test GeneralChatService initialization."""

    def test_initialization_loads_prompt_template(self, mock_settings):
        """Test service initialization loads prompt template."""
        with patch("app.services.general_chat_service.settings", mock_settings), \
             patch("app.services.general_chat_service.PromptTemplate") as MockPromptTemplate, \
             patch("app.services.general_chat_service.AzureOpenAI"):
            mock_template = Mock()
            MockPromptTemplate.return_value = mock_template

            service = GeneralChatService()

            MockPromptTemplate.assert_called_once()
            assert service.prompt_template == mock_template

    def test_initialization_creates_azure_openai_client(self, mock_settings):
        """Test service initialization creates Azure OpenAI client."""
        with patch("app.services.general_chat_service.settings", mock_settings), \
             patch("app.services.general_chat_service.PromptTemplate"), \
             patch("app.services.general_chat_service.AzureOpenAI") as MockAzureOpenAI:
            mock_client = Mock()
            MockAzureOpenAI.return_value = mock_client

            service = GeneralChatService()

            MockAzureOpenAI.assert_called_once_with(
                api_key=mock_settings.azure_openai_api_key,
                api_version=mock_settings.azure_openai_api_version,
                azure_endpoint=mock_settings.azure_openai_endpoint
            )
            assert service.client == mock_client

    def test_initialization_raises_error_when_api_key_missing(self):
        """Test initialization raises error when API key is missing."""
        mock_settings = Mock()
        mock_settings.azure_openai_api_key = None

        with patch("app.services.general_chat_service.settings", mock_settings), \
             patch("app.services.general_chat_service.PromptTemplate"):
            with pytest.raises(ValueError, match="AZURE_OPENAI_API_KEY"):
                GeneralChatService()

    def test_initialization_raises_error_when_endpoint_missing(self):
        """Test initialization raises error when endpoint is missing."""
        mock_settings = Mock()
        mock_settings.azure_openai_api_key = "test-key"
        mock_settings.azure_openai_endpoint = None

        with patch("app.services.general_chat_service.settings", mock_settings), \
             patch("app.services.general_chat_service.PromptTemplate"):
            with pytest.raises(ValueError, match="AZURE_OPENAI_ENDPOINT"):
                GeneralChatService()


class TestGeneralChatServiceCall:
    """Test GeneralChatService __call__ method."""

    @pytest.mark.asyncio
    async def test_call_with_single_message(self, mock_settings, mock_azure_openai_client, sample_chat_messages):
        """Test calling service with a single message."""
        with patch("app.services.general_chat_service.settings", mock_settings), \
             patch("app.services.general_chat_service.PromptTemplate") as MockPromptTemplate, \
             patch("app.services.general_chat_service.AzureOpenAI", return_value=mock_azure_openai_client):

            # Setup prompt template
            mock_template = Mock()
            mock_template.get_prompt = Mock(return_value="You are a helpful assistant.")
            MockPromptTemplate.return_value = mock_template

            # Setup Azure OpenAI response - use spec to properly mock attributes
            expected_output = "Photosynthesis is the process by which plants convert light energy into chemical energy."
            mock_response = Mock()
            mock_response.configure_mock(output_text=expected_output)
            mock_azure_openai_client.responses.create.return_value = mock_response

            service = GeneralChatService()
            messages = [sample_chat_messages[0]]  # Only first message

            result = await service(messages)

            # Result should be the output_text or fallback message
            assert isinstance(result, str)
            assert len(result) > 0
            mock_azure_openai_client.responses.create.assert_called_once()
            call_args = mock_azure_openai_client.responses.create.call_args

            assert call_args[1]["model"] == mock_settings.azure_chat_deployment_name
            assert call_args[1]["tools"] == [{"type": "web_search"}]

    @pytest.mark.asyncio
    async def test_call_with_conversation_history(self, mock_settings, mock_azure_openai_client, sample_chat_messages):
        """Test calling service with conversation history."""
        with patch("app.services.general_chat_service.settings", mock_settings), \
             patch("app.services.general_chat_service.PromptTemplate") as MockPromptTemplate, \
             patch("app.services.general_chat_service.AzureOpenAI", return_value=mock_azure_openai_client):

            mock_template = Mock()
            mock_template.get_prompt = Mock(return_value="You are a helpful assistant.")
            MockPromptTemplate.return_value = mock_template

            expected_output = "Detailed explanation of photosynthesis..."
            mock_response = Mock()
            mock_response.configure_mock(output_text=expected_output)
            mock_azure_openai_client.responses.create.return_value = mock_response

            service = GeneralChatService()

            result = await service(sample_chat_messages)

            # Result should be a string
            assert isinstance(result, str)
            assert len(result) > 0
            # Verify input includes conversation history
            call_args = mock_azure_openai_client.responses.create.call_args
            input_text = call_args[1]["input"]
            assert "Chat History" in input_text
            assert "Current Message" in input_text

    @pytest.mark.asyncio
    async def test_call_formats_messages_correctly(self, mock_settings, mock_azure_openai_client):
        """Test service formats messages correctly."""
        with patch("app.services.general_chat_service.settings", mock_settings), \
             patch("app.services.general_chat_service.PromptTemplate") as MockPromptTemplate, \
             patch("app.services.general_chat_service.AzureOpenAI", return_value=mock_azure_openai_client):

            mock_template = Mock()
            mock_template.get_prompt = Mock(return_value="System prompt")
            MockPromptTemplate.return_value = mock_template

            mock_response = Mock()
            mock_response.output_text = "Response"
            mock_azure_openai_client.responses.create.return_value = mock_response

            service = GeneralChatService()

            messages = [
                ConversationMessage(role=MessageRole.USER, message="Hello"),
                ConversationMessage(role=MessageRole.ASSISTANT, message="Hi there!"),
                ConversationMessage(role=MessageRole.USER, message="How are you?")
            ]

            await service(messages)

            # Verify formatted messages structure
            call_args = mock_azure_openai_client.responses.create.call_args
            input_text = call_args[1]["input"]

            assert "System: System prompt" in input_text
            assert "Role: user" in input_text
            assert "Message: Hello" in input_text

    @pytest.mark.asyncio
    async def test_call_handles_missing_output_text(self, mock_settings, mock_azure_openai_client):
        """Test service handles response without output_text attribute."""
        with patch("app.services.general_chat_service.settings", mock_settings), \
             patch("app.services.general_chat_service.PromptTemplate") as MockPromptTemplate, \
             patch("app.services.general_chat_service.AzureOpenAI", return_value=mock_azure_openai_client):

            mock_template = Mock()
            mock_template.get_prompt = Mock(return_value="System prompt")
            MockPromptTemplate.return_value = mock_template

            # Response without output_text but with output
            mock_response = Mock(spec=[])  # Empty spec so it doesn't have output_text
            mock_response.output = [
                {"content": [{"type": "output_text", "text": "Extracted text"}]}
            ]
            mock_azure_openai_client.responses.create.return_value = mock_response

            service = GeneralChatService()
            messages = [ConversationMessage(role=MessageRole.USER, message="Test")]

            result = await service(messages)

            # Should extract from output or return fallback
            assert isinstance(result, str)
            assert len(result) > 0

    @pytest.mark.asyncio
    async def test_call_returns_default_message_when_no_content(self, mock_settings, mock_azure_openai_client):
        """Test service returns default message when no content found."""
        with patch("app.services.general_chat_service.settings", mock_settings), \
             patch("app.services.general_chat_service.PromptTemplate") as MockPromptTemplate, \
             patch("app.services.general_chat_service.AzureOpenAI", return_value=mock_azure_openai_client):

            mock_template = Mock()
            mock_template.get_prompt = Mock(return_value="System prompt")
            MockPromptTemplate.return_value = mock_template

            # Response with no usable content
            mock_response = Mock(spec=[])  # Empty spec so it doesn't have output_text
            mock_response.output = []
            mock_azure_openai_client.responses.create.return_value = mock_response

            service = GeneralChatService()
            messages = [ConversationMessage(role=MessageRole.USER, message="Test")]

            result = await service(messages)

            assert result == "I'm sorry, but I couldn't find an appropriate response."

    @pytest.mark.asyncio
    async def test_call_raises_error_on_azure_failure(self, mock_settings, mock_azure_openai_client):
        """Test service raises error when Azure OpenAI call fails."""
        with patch("app.services.general_chat_service.settings", mock_settings), \
             patch("app.services.general_chat_service.PromptTemplate") as MockPromptTemplate, \
             patch("app.services.general_chat_service.AzureOpenAI", return_value=mock_azure_openai_client):

            mock_template = Mock()
            mock_template.get_prompt = Mock(return_value="System prompt")
            MockPromptTemplate.return_value = mock_template

            # Simulate Azure OpenAI error
            mock_azure_openai_client.responses.create.side_effect = Exception("API Error")

            service = GeneralChatService()
            messages = [ConversationMessage(role=MessageRole.USER, message="Test")]

            with pytest.raises(Exception, match="API Error"):
                await service(messages)

    @pytest.mark.asyncio
    async def test_call_loads_prompt_from_template(self, mock_settings, mock_azure_openai_client):
        """Test service loads prompt from template file."""
        with patch("app.services.general_chat_service.settings", mock_settings), \
             patch("app.services.general_chat_service.PromptTemplate") as MockPromptTemplate, \
             patch("app.services.general_chat_service.AzureOpenAI", return_value=mock_azure_openai_client):

            mock_template = Mock()
            mock_template.get_prompt = Mock(return_value="Custom system prompt")
            MockPromptTemplate.return_value = mock_template

            mock_response = Mock()
            mock_response.output_text = "Response"
            mock_azure_openai_client.responses.create.return_value = mock_response

            service = GeneralChatService()
            messages = [ConversationMessage(role=MessageRole.USER, message="Test")]

            await service(messages)

            # Verify prompt was loaded with correct key
            mock_template.get_prompt.assert_called_once_with("general_chat")

    @pytest.mark.asyncio
    async def test_call_raises_error_when_prompt_not_found(self, mock_settings, mock_azure_openai_client):
        """Test service raises error when prompt is not found in template."""
        with patch("app.services.general_chat_service.settings", mock_settings), \
             patch("app.services.general_chat_service.PromptTemplate") as MockPromptTemplate, \
             patch("app.services.general_chat_service.AzureOpenAI", return_value=mock_azure_openai_client):

            mock_template = Mock()
            mock_template.get_prompt = Mock(return_value=None)
            MockPromptTemplate.return_value = mock_template

            service = GeneralChatService()
            messages = [ConversationMessage(role=MessageRole.USER, message="Test")]

            with pytest.raises(ValueError, match="General chat prompt not found"):
                await service(messages)


class TestGeneralChatServiceCleanup:
    """Test GeneralChatService cleanup method."""

    @pytest.mark.asyncio
    async def test_cleanup_method_exists(self, mock_settings):
        """Test cleanup method can be called."""
        with patch("app.services.general_chat_service.settings", mock_settings), \
             patch("app.services.general_chat_service.PromptTemplate"), \
             patch("app.services.general_chat_service.AzureOpenAI"):

            service = GeneralChatService()

            # Should not raise errors
            await service.cleanup()
