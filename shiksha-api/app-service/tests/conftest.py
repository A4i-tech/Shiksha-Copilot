import pytest
import os
import sys
from pathlib import Path
from unittest.mock import Mock, AsyncMock

# Add app directory to Python path
app_dir = Path(__file__).parent.parent / "app"
sys.path.insert(0, str(app_dir))

from llama_index.core import MockEmbedding
from llama_index.core.llms import MockLLM


if not os.getenv("OPENAI_API_KEY"):
    os.environ["OPENAI_API_KEY"] = "sk-xxxx"

os.environ["DEBUG"] = "false"


@pytest.fixture
def mock_settings():
    """Mock settings for tests."""
    mock = Mock()
    mock.app_name = "Test Shiksha API"
    mock.version = "1.0.0-test"
    mock.debug = True
    mock.host = "localhost"
    mock.port = 8000
    mock.log_level = "INFO"

    # OpenAI settings
    mock.embed_model = "text-embedding-ada-002"
    mock.general_chat_model = "gpt-4-chat"
    mock.lesson_chat_model = "gpt-4-lesson"
    mock.question_paper_model = "gpt-4-question-paper"

    # Blob Store settings
    mock.blob_store_connection_string = "DefaultEndpointsProtocol=https;AccountName=test;AccountKey=test"
    mock.blob_store_url = "https://test.blob.core.windows.net"

    # Qdrant settings
    mock.qdrant_url = "http://localhost:6333"
    mock.qdrant_api_key = "test-qdrant-key"

    return mock


@pytest.fixture
def mock_completion_llm():
    """Mock completion LLM for tests."""
    return MockLLM()


@pytest.fixture
def mock_embedding_llm():
    """Mock embedding LLM for tests."""
    return MockEmbedding(embed_dim=1536)


@pytest.fixture
def mock_openai_client():
    """Mock OpenAI client."""
    client = Mock()

    # Mock responses API - responses.create is synchronous, not async
    responses_mock = Mock()
    responses_mock.create = Mock()
    client.responses = responses_mock

    # Mock chat completions - also synchronous
    chat_completions_mock = Mock()
    chat_completions_mock.create = Mock()
    client.chat = Mock()
    client.chat.completions = chat_completions_mock

    return client


@pytest.fixture
def mock_blob_store():
    """Mock BlobStore for tests."""
    blob_store = AsyncMock()
    blob_store.download_blobs_to_folder = AsyncMock(return_value=[
        "/tmp/test_index/doc1.json",
        "/tmp/test_index/doc2.json"
    ])
    return blob_store


@pytest.fixture
def sample_chat_messages():
    """Sample chat messages for tests."""
    from app.models.chat import ConversationMessage, MessageRole

    return [
        ConversationMessage(role=MessageRole.USER, message="What is photosynthesis?"),
        ConversationMessage(role=MessageRole.ASSISTANT, message="Photosynthesis is the process by which plants make food."),
        ConversationMessage(role=MessageRole.USER, message="Can you explain in more detail?")
    ]


@pytest.fixture
def sample_chapter_id():
    """Sample chapter ID for tests."""
    return "Board=CBSE,Medium=English,Grade=10,Subject=Science,Number=6,Title=Life Processes"


@pytest.fixture
def sample_lesson_chat_request(sample_chat_messages, sample_chapter_id):
    """Sample lesson chat request for tests."""
    from app.models.chat import LessonChatRequest

    return LessonChatRequest(
        user_id="test-user-123",
        chapter_id=sample_chapter_id,
        index_path="blob/test-container/test-index",
        messages=sample_chat_messages
    )


@pytest.fixture
def sample_question_bank_request():
    """Sample question bank generation request."""
    from app.models.question_paper import (
        QuestionBankPartsGenerationRequest,
        Chapter,
        GeneratedTemplate,
        QuestionType,
        QuestionDistribution
    )

    chapters = [
        Chapter(
            title="Life Processes",
            learning_outcomes=["Understand respiration", "Understand nutrition"],
            subtopics=["Respiration in Plants", "Respiration in Animals"],
            index_path="blob/test-container/science-chapter6"
        )
    ]

    templates = [
        GeneratedTemplate(
            type=QuestionType.MCQ,
            marks_per_question=1,
            number_of_questions=10,
            unit=1,
            question_distribution=[QuestionDistribution(unit_name="test-unit", objective="Knowledge")]
        ),
        GeneratedTemplate(
            type=QuestionType.ANSWER_SHORT,
            marks_per_question=3,
            number_of_questions=5,
            unit=1,
            question_distribution=[QuestionDistribution(unit_name="test-unit", objective="Knowledge")]
        )
    ]

    return QuestionBankPartsGenerationRequest(
        user_id="test-user-123",
        board="CBSE",
        medium="English",
        grade=10,
        unit_level="CHAPTER",
        subject="Science",
        chapters=chapters,
        total_marks=25,
        template=templates
    )


@pytest.fixture
def mock_rag_ops():
    """Mock RAG operations for tests."""
    rag_ops = AsyncMock()
    rag_ops.chat_with_index = AsyncMock(return_value="This is a test response from RAG.")
    rag_ops.index_exists = AsyncMock(return_value=True)
    return rag_ops


@pytest.fixture
def mock_prompt_template():
    """Mock PromptTemplate for tests."""
    template = Mock()
    template.get_prompt = Mock(return_value="You are a helpful educational assistant.")
    template.get_prompt_with_variables = Mock(return_value="You are teaching {SUBJECT} for {GRADE}.")
    return template


@pytest.fixture
async def mock_rag_adapter(mock_completion_llm, mock_embedding_llm, mock_rag_ops):
    """Mock RAG adapter for tests."""
    adapter = AsyncMock()
    adapter.completion_llm = mock_completion_llm
    adapter.embedding_llm = mock_embedding_llm
    adapter._rag_ops = mock_rag_ops
    adapter.initialize = AsyncMock(return_value=mock_rag_ops)
    adapter.initiate_index = AsyncMock()
    adapter.cleanup = AsyncMock()
    adapter.chat_with_index = AsyncMock(return_value="Test RAG response")
    adapter.index_exists = AsyncMock(return_value=True)
    return adapter


@pytest.fixture
def mock_rag_adapter_cache(mock_rag_adapter):
    """Mock RAG adapter cache for tests."""
    cache = AsyncMock()
    cache.get_or_create_adapter = AsyncMock(return_value=mock_rag_adapter)
    cache.cleanup = AsyncMock()
    return cache


# Async test helpers
@pytest.fixture
def event_loop():
    """Create an event loop for async tests."""
    import asyncio
    loop = asyncio.new_event_loop()
    yield loop
    loop.close()
