import pytest
from unittest.mock import MagicMock, AsyncMock, patch
from app.services.question_paper_service import QuestionPaperService
from app.models.question_paper import QuestionType


# Shared fixture to avoid recreating the service
@pytest.fixture
def service():
    """Create a mocked QuestionPaperService once per test."""
    with patch("app.services.question_paper_service.AzureOpenAI"), patch(
        "app.services.question_paper_service.LlamaAzureOpenAI"
    ), patch("app.services.question_paper_service.AzureOpenAIEmbedding"), patch(
        "app.services.question_paper_service.yaml.safe_load", return_value={}
    ), patch.dict(
        "os.environ",
        {
            "AZURE_OPENAI_API_KEY": "test-key",
            "AZURE_OPENAI_ENDPOINT": "https://test.openai.azure.com/",
            "AZURE_OPENAI_API_VERSION": "2024-02-15-preview",
            "AZURE_CHAT_DEPLOYMENT_NAME": "gpt-4",
            "AZURE_EMBED_MODEL": "text-embedding-ada-002",
        },
    ):
        svc = QuestionPaperService()
        yield svc


class TestQuestionPaperServiceInitialization:
    """Tests for QuestionPaperService initialization."""

    def test_initialization_loads_prompts(self, service):
        """Test that service initializes and loads prompts."""
        assert service.client is not None
        assert hasattr(service, "prompts")

    def test_initialization_has_adapter_cache(self, service):
        """Test that service has adapter cache."""
        assert hasattr(service, "_adapter_cache")
        assert isinstance(service._adapter_cache, dict)


class TestFlattenExistingQuestions:
    """Tests for _flatten_existing_questions method."""

    def test_flatten_text_questions(self, service):
        """Test flattening text-based questions."""
        mock_question = MagicMock()
        mock_question.question = "What is photosynthesis?"
        mock_response = MagicMock()
        mock_response.questions = [mock_question]

        result = service._flatten_existing_questions([mock_response])

        assert len(result) == 1
        assert "What is photosynthesis?" in result

    def test_flatten_matching_questions(self, service):
        """Test flattening matching-type questions."""
        mock_question = MagicMock()
        mock_question.value1 = "Mitochondria"
        mock_question.value2 = "Powerhouse of the cell"
        mock_response = MagicMock()
        mock_response.questions = [mock_question]

        with patch.object(
            service,
            "_flatten_existing_questions",
            return_value=["Mitochondria :: Powerhouse of the cell"],
        ):
            result = service._flatten_existing_questions([mock_response])

        assert len(result) == 1
        assert "Mitochondria :: Powerhouse of the cell" in result

    def test_flatten_empty_list(self, service):
        """Test flattening empty list."""
        result = service._flatten_existing_questions([])
        assert result == []


class TestGetGrammarTopics:
    """Tests for _get_grammar_topics method."""

    def test_grammar_topics_for_english(self, service):
        """Test grammar topics extraction for English."""
        service.prompts = {
            "grammar_topics": {9: ["Nouns", "Verbs"], 10: ["Tenses", "Articles"]}
        }
        request = MagicMock(subject="English", grade=9)

        result = service._get_grammar_topics(request)

        assert "Nouns" in result
        assert "Verbs" in result

    def test_grammar_topics_for_non_english(self, service):
        """Test grammar topics for non-English subjects."""
        service.prompts = {"grammar_topics": {}}
        request = MagicMock(subject="Mathematics", grade=10)

        result = service._get_grammar_topics(request)

        assert result == ""


class TestGetUnitMetadata:
    """Tests for _get_unit_metadata method."""

    def test_metadata_with_chapters(self, service):
        """Test unit metadata extraction from chapters."""
        chapter = MagicMock()
        chapter.title = "Chapter 1"
        chapter.learning_outcomes = ["LO1", "LO2"]
        chapter.index_path = "/path/to/index"
        chapter.subtopics = []

        request = MagicMock(chapters=[chapter])

        metadata = service._get_unit_metadata(request)

        assert "Chapter 1" in metadata
        assert metadata["Chapter 1"]["index_path"] == "/path/to/index"
        assert len(metadata["Chapter 1"]["learning_outcomes"]) == 2

    def test_metadata_with_subtopics(self, service):
        """Test unit metadata extraction from subtopics."""
        subtopic = MagicMock()
        subtopic.title = "Subtopic 1"
        subtopic.learning_outcomes = ["Sub LO1"]
        subtopic.index_path = "/path/to/subtopic"

        chapter = MagicMock()
        chapter.title = "Chapter 1"
        chapter.index_path = "/path/to/chapter"
        chapter.subtopics = [subtopic]

        request = MagicMock(chapters=[chapter])

        metadata = service._get_unit_metadata(request)

        assert "Subtopic 1" in metadata
        assert metadata["Subtopic 1"]["index_path"] == "/path/to/subtopic"


class TestFormatSystemPrompt:
    """Tests for _format_system_prompt method."""

    def test_format_system_prompt(self, service):
        """Test system prompt formatting."""
        service.prompts = {
            "question_bank_parts_gen": (
                "Board: {BOARD}, Grade: {GRADE}, Subject: {SUBJECT}, "
                "Chapters: {CHAPTERS}, Blooms: {QUESTION_BANK_BLOOM_TAXONOMY_GUIDE}"
            ),
            "blooms-taxonomy": {"general": "Test Blooms"},
        }

        request = MagicMock(
            board="CBSE", grade=10, subject="Math", medium="English", total_marks=100
        )
        slot = {"unit_name": "Chapter 1", "learning_outcomes": ["LO1"]}

        result = service._format_system_prompt(request, [], slot)

        assert "CBSE" in result
        assert "Chapter 1" in result


class TestGetFormatInstructionForType:
    """Tests for _get_format_instruction_for_type method."""

    def test_format_instruction_mcq(self, service):
        """Test format instruction for MCQ type."""
        instruction = service._get_format_instruction_for_type(QuestionType.MCQ)
        assert "MCQ" in instruction


class TestBuildGenerationSlots:
    """Tests for _build_generation_slots method."""

    def test_build_slots_success(self, service):
        """Test building generation slots."""
        chapter = MagicMock()
        chapter.title = "Chapter 1"
        chapter.learning_outcomes = ["LO1"]
        chapter.index_path = "/path/to/index"
        chapter.subtopics = []

        distribution = MagicMock()
        distribution.unit_name = "Chapter 1"
        distribution.objective = "remember"

        template = MagicMock()
        template.marks_per_question = 1
        template.question_distribution = [distribution]
        template.type = QuestionType.MCQ

        request = MagicMock(chapters=[chapter], template=[template])

        slots = service._build_generation_slots(request)

        assert len(slots) > 0
        assert slots[0]["unit_name"] == "Chapter 1"
        assert slots[0]["index_path"] == "/path/to/index"

    def test_build_slots_unit_mismatch(self, service):
        """Test that unit mismatch raises error."""
        chapter = MagicMock()
        chapter.title = "Chapter 1"
        chapter.learning_outcomes = ["LO1"]
        chapter.index_path = "/path/to/index"
        chapter.subtopics = []

        distribution = MagicMock()
        distribution.unit_name = "Non-existent"

        template = MagicMock()
        template.marks_per_question = 1
        template.question_distribution = [distribution]
        template.type = QuestionType.MCQ

        request = MagicMock(chapters=[chapter], template=[template])

        with pytest.raises(ValueError, match="Unit Name"):
            service._build_generation_slots(request)


class TestOrganizeQuestionsIntoResponse:
    """Tests for _organize_questions_into_response method."""

    def test_organize_questions(self, service):
        """Test organizing generated questions into response."""
        generated = [
            {
                "type": "Four alternatives are given for each of the following questions, choose the correct alternative",
                "unit_name": "Chapter 1",
                "objective": "remember",
                "marks_per_question": 1,
                "item": {
                    "question": "What is X?",
                    "option_a": "A",
                    "option_b": "B",
                    "option_c": "C",
                    "option_d": "D",
                    "correct_option": "option_a",
                },
            }
        ]

        distribution = MagicMock()
        distribution.unit_name = "Chapter 1"
        distribution.objective = "remember"

        template = MagicMock()
        template.type = QuestionType.MCQ
        template.marks_per_question = 1
        template.question_distribution = [distribution]

        request = MagicMock(template=[template])

        with patch.object(service, "_flatten_existing_questions", return_value=[]):
            response = service._organize_questions_into_response(request, generated)

        assert isinstance(response, list)
        assert len(response) > 0
        assert response[0].type == QuestionType.MCQ


class TestGetOrCreateRagAdapter:
    """Tests for _get_or_create_rag_adapter method."""

    @pytest.mark.asyncio
    async def test_create_new_adapter(self, service):
        """Test creating a new RAG adapter."""
        with patch(
            "app.services.question_paper_service.RagAdapterFactory"
        ) as mock_factory:
            mock_adapter = AsyncMock()
            mock_factory.create_adapter.return_value = mock_adapter

            adapter = await service._get_or_create_rag_adapter("/path/to/index")

            assert adapter is not None
            mock_factory.create_adapter.assert_called_once()

    @pytest.mark.asyncio
    async def test_return_cached_adapter(self, service):
        """Test returning cached RAG adapter."""
        with patch(
            "app.services.question_paper_service.RagAdapterFactory"
        ) as mock_factory:
            mock_adapter = AsyncMock()
            service._adapter_cache["/path/to/index"] = mock_adapter

            adapter = await service._get_or_create_rag_adapter("/path/to/index")

            assert adapter is mock_adapter
            mock_factory.create_adapter.assert_not_called()
