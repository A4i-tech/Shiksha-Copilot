import pytest
from pydantic import ValidationError
from app.models.question_paper import (
    QuestionType,
    QuestionBankMetadata,
    TextQuestion,
    FourOptionsQuestion,
    MatchPair,
    MatchingGroupQuestion,
)


class TestQuestionBankMetadata:
    """Tests for QuestionBankMetadata model."""

    def test_valid_metadata(self):
        """Test creating valid metadata."""
        metadata = QuestionBankMetadata(
            user_id="user123",
            subject="Mathematics",
            grade="10",
            unit_names=["Algebra", "Geometry"],
            school_name="Test School",
            examination_name="Final Exam",
        )
        assert metadata.user_id == "user123"
        assert metadata.subject == "Mathematics"
        assert metadata.grade == "10"
        assert len(metadata.unit_names) == 2
        assert metadata.school_name == "Test School"
        assert metadata.examination_name == "Final Exam"

    def test_metadata_with_empty_unit_names(self):
        """Test metadata with empty unit names list."""
        metadata = QuestionBankMetadata(
            user_id="user123",
            subject="Science",
            grade="9",
            unit_names=[],
            school_name="Test School",
            examination_name="Midterm",
        )
        assert len(metadata.unit_names) == 0

    def test_metadata_missing_required_field(self):
        """Test that missing required fields raise validation error."""
        with pytest.raises(ValidationError):
            QuestionBankMetadata(
                user_id="user123",
                subject="Mathematics",
                # Missing grade, unit_names, school_name, examination_name
            )


class TestTextQuestion:
    """Tests for TextQuestion model."""

    def test_text_question_with_content(self):
        """Test creating text question with content."""
        question = TextQuestion(question="What is photosynthesis?")
        assert question.question == "What is photosynthesis?"

    def test_text_question_empty_default(self):
        """Test that text question defaults to empty string."""
        question = TextQuestion()
        assert question.question == ""

    def test_text_question_long_text(self):
        """Test text question with long content."""
        long_text = "A" * 1000
        question = TextQuestion(question=long_text)
        assert len(question.question) == 1000


class TestFourOptionsQuestion:
    """Tests for FourOptionsQuestion model."""

    def test_valid_mcq(self):
        """Test creating valid MCQ."""
        question = FourOptionsQuestion(
            question="What is 2+2?", options=["3", "4", "5", "6"], answer="4"
        )
        assert question.question == "What is 2+2?"
        assert len(question.options) == 4
        assert question.answer == "4"

    def test_mcq_empty_defaults(self):
        """Test MCQ with default empty values."""
        question = FourOptionsQuestion()
        assert question.question == ""
        assert question.options == []
        assert question.answer == ""

    def test_mcq_with_more_than_four_options(self):
        """Test MCQ can have more than 4 options."""
        question = FourOptionsQuestion(
            question="Test", options=["A", "B", "C", "D", "E"], answer="A"
        )
        assert len(question.options) == 5

    def test_mcq_with_less_than_four_options(self):
        """Test MCQ can have less than 4 options."""
        question = FourOptionsQuestion(question="Test", options=["A", "B"], answer="A")
        assert len(question.options) == 2


class TestMatchingGroupQuestion:
    """Tests for MatchingGroupQuestion model."""

    def test_valid_matching_group(self):
        """Test creating valid matching group with pairs."""
        question = MatchingGroupQuestion(
            pairs=[MatchPair(left="Capital", right="Country")]
        )
        assert len(question.pairs) == 1
        assert question.pairs[0].left == "Capital"
        assert question.pairs[0].right == "Country"

    def test_matching_group_empty_defaults(self):
        """Test matching group with default empty pairs."""
        question = MatchingGroupQuestion()
        assert question.pairs == []

    def test_matching_group_with_multiple_pairs(self):
        """Test matching group with multiple pairs."""
        question = MatchingGroupQuestion(
            pairs=[MatchPair(left="A" * 100, right="B" * 100)]
        )
        assert len(question.pairs[0].left) == 100
        assert len(question.pairs[0].right) == 100


class TestQuestionType:
    """Tests for QuestionType enum."""

    def test_question_type_mcq(self):
        """Test MCQ question type."""
        assert QuestionType.MCQ.value.startswith("Four alternatives")
        assert QuestionType.MCQ._model == FourOptionsQuestion

    def test_question_type_fill_blanks(self):
        """Test fill in the blanks question type."""
        assert QuestionType.FILL_BLANKS.value.startswith("Fill in the blanks")
        assert QuestionType.FILL_BLANKS._model == TextQuestion

    def test_question_type_answer_word(self):
        """Test answer in word question type."""
        assert "word, phrase or sentence" in QuestionType.ANSWER_WORD.value
        assert QuestionType.ANSWER_WORD._model == TextQuestion

    def test_question_type_answer_short(self):
        """Test short answer question type."""
        assert "two or three sentences" in QuestionType.ANSWER_SHORT.value
        assert QuestionType.ANSWER_SHORT._model == TextQuestion

    def test_question_type_answer_general(self):
        """Test general answer question type."""
        assert QuestionType.ANSWER_GENERAL.value.startswith(
            "Answer the following questions"
        )
        assert QuestionType.ANSWER_GENERAL._model == TextQuestion

    def test_question_type_answer_long(self):
        """Test long answer question type."""
        assert "four or five sentences" in QuestionType.ANSWER_LONG.value
        assert QuestionType.ANSWER_LONG._model == TextQuestion

    def test_question_type_match_list(self):
        """Test match list question type."""
        assert QuestionType.MATCH_LIST.value.startswith("Match the following")
        assert QuestionType.MATCH_LIST._model == MatchingGroupQuestion

    def test_question_type_has_description(self):
        """Test that all question types have descriptions."""
        for qt in QuestionType:
            assert hasattr(qt, "description")
            assert len(qt.description) > 0

    def test_question_type_get_required_fields_mcq(self):
        """Test getting required fields for MCQ."""
        required = QuestionType.MCQ.get_required_fields()
        # FourOptionsQuestion has no required fields (all have defaults)
        assert isinstance(required, list)

    def test_question_type_get_required_fields_text(self):
        """Test getting required fields for text questions."""
        required = QuestionType.FILL_BLANKS.get_required_fields()
        # TextQuestion has no required fields (all have defaults)
        assert isinstance(required, list)

    def test_question_type_get_required_fields_matching(self):
        """Test getting required fields for matching questions."""
        required = QuestionType.MATCH_LIST.get_required_fields()
        # MatchingListQuestion has no required fields (all have defaults)
        assert isinstance(required, list)

    def test_all_question_types_are_unique(self):
        """Test that all question type values are unique."""
        values = [qt.value for qt in QuestionType]
        assert len(values) == len(set(values))
