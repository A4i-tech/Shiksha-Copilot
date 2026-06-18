import pytest
from unittest.mock import MagicMock, patch
from app.services.question_paper_service import QuestionPaperService
from app.models.question_paper import Chapter, GeneratedTemplate, MatchingListQuestion, QuestionDistribution, QuestionType, TextQuestion


# Shared fixture to avoid recreating the service
@pytest.fixture
def service():
    """Create a mocked QuestionPaperService once per test."""
    with patch("app.services.question_paper_service.AsyncAzureOpenAI"), patch(
        "app.services.question_paper_service.new_rag_llm"
    ), patch("app.services.question_paper_service.new_rag_embed"), patch(
        "app.services.question_paper_service.RagAdapterCache"
    ), patch(
        "app.services.question_paper_service.yaml.safe_load", return_value={}
    ):
        svc = QuestionPaperService()
        yield svc


class TestQuestionPaperServiceInitialization:
    """Tests for QuestionPaperService initialization."""

    def test_initialization_loads_prompts(self, service):
        """Test that service initializes and loads prompts."""
        assert service.client is not None
        assert hasattr(service, "prompts")


class TestFlattenExistingQuestions:
    """Tests for _flatten_existing_questions method."""

    def test_flatten_text_questions(self, service):
        """Test flattening text-based questions."""
        mock_response = MagicMock()
        mock_response.questions = [TextQuestion(question="What is photosynthesis?")]

        result = service._flatten_existing_questions([mock_response])

        assert len(result) == 1
        assert "What is photosynthesis?" in result

    def test_flatten_matching_questions(self, service):
        """Test flattening matching-type questions."""
        mock_response = MagicMock()
        mock_response.questions = [MatchingListQuestion(value1="Mitochondria", value2="Powerhouse of the cell")]

        result = service._flatten_existing_questions([mock_response])

        assert len(result) == 1
        assert "Mitochondria :: Powerhouse of the cell" in result

    def test_flatten_empty_list(self, service):
        """Test flattening empty list."""
        result = service._flatten_existing_questions([])
        assert result == []


class TestGetGrammarTopics:
    """Tests for _get_grammar_topics method."""

    def test_grammar_topics_from_flag_and_topics(self, service):
        """Grammar focus comes from the is_grammar flag and grammar_topics field,
        not the chapter title (which may be in any language)."""
        service.prompts = {
            "grammar_simple_prompt": "Cover following topics: {GRAMMAR_TOPIC}",
            "grammar_context_prompt": "Grammar topic: {GRAMMAR_TOPIC}, Chapters: {CHAPTER_NAMES}",
        }
        request = MagicMock()
        request.chapters = [
            Chapter(title="ಅಧ್ಯಾಯ ೩", index_path="", learning_outcomes=[],
                    is_grammar=True, grammar_topics=["Nouns", "Verbs"], subtopics=[]),
            Chapter(title="Photosynthesis", index_path="", learning_outcomes=[], subtopics=[]),
        ]

        record = Chapter(title="Photosynthesis", index_path="", learning_outcomes=[], subtopics=[])

        result = service._get_grammar_topics(request, record)

        assert "Nouns" in result
        assert "Verbs" in result

    def test_no_grammar_topics_when_no_grammar_chapter(self, service):
        """No grammar instruction is added when no chapter is flagged is_grammar."""
        service.prompts = {"grammar_simple_prompt": "Cover following topics: {GRAMMAR_TOPIC}"}
        request = MagicMock()
        request.chapters = [
            Chapter(title="Algebra", index_path="", learning_outcomes=[], subtopics=[]),
        ]

        record = Chapter(title="Algebra", index_path="", learning_outcomes=[], subtopics=[])

        result = service._get_grammar_topics(request, record)

        assert result == ""


class TestFormatSystemPrompt:
    """Tests for _format_system_prompt method."""

    def test_format_system_prompt(self, service):
        """Test system prompt formatting."""
        service.prompts = {
            "question_bank_parts_gen": (
                "Board: {BOARD}, Medium: {MEDIUM}, Grade: {GRADE}, Subject: {SUBJECT}, "
                "Total: {TOTAL_MARKS}, Chapters: {CHAPTERS}, LOs: {UNIT_WISE_LEARNING_OUTCOMES}, "
                "Existing: {EXISTING_QUESTIONS_JSON}, Blooms: {QUESTION_BANK_BLOOM_TAXONOMY_GUIDE}, "
                "Grammar: {GRAMMAR_TOPICS}"
            ),
            "blooms-taxonomy": {"general": "Test Blooms"},
        }

        request = MagicMock(board="CBSE", grade=10, subject="Math", medium="English", total_marks=100, chapters=[])
        record = Chapter(title="Chapter 1", index_path="", learning_outcomes=["LO1"], subtopics=[])
        template = GeneratedTemplate(
            type=QuestionType.MCQ,
            number_of_questions=1,
            marks_per_question=1,
            question_distribution=[QuestionDistribution(unit_name="Chapter 1", objective="remember")],
        )
        slot = [((0, 0), template, template.question_distribution[0])]

        result = service._format_system_prompt(request, [], record, slot)

        assert "CBSE" in result
        assert "Chapter 1" in result


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

        slots = list(service._build_generation_slots(request))

        assert len(slots) > 0
        record, questions = slots[0]
        assert record.title == "Chapter 1"
        assert record.index_path == "/path/to/index"
        assert questions == [((0, 0), template, distribution)]

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
            list(service._build_generation_slots(request))


class TestOrganizeQuestionsIntoResponse:
    """Tests for _organize_questions_into_response method."""

    def test_organize_questions(self, service):
        """Test organizing generated questions into response."""
        generated = [((0, 0), MagicMock(
            type=QuestionType.MCQ,
            unit_name="Chapter 1",
            objective="remember",
            marks_per_question=1,
            item={
                "question": "What is X?",
                "option_a": "A",
                "option_b": "B",
                "option_c": "C",
                "option_d": "D",
                "correct_option": "option_a",
            },
        ))]

        distribution = MagicMock()
        distribution.unit_name = "Chapter 1"
        distribution.objective = "remember"

        template = MagicMock()
        template.type = QuestionType.MCQ
        template.marks_per_question = 1
        template.question_distribution = [distribution]

        chapter = MagicMock()
        chapter.title = "Chapter 1"
        chapter.subtopics = []
        request = MagicMock(template=[template], chapters=[chapter])

        response = service._organize_questions_into_response(request, generated)

        assert isinstance(response, list)
        assert len(response) > 0
        assert response[0].type == QuestionType.MCQ
        assert len(response[0].questions) == 1
