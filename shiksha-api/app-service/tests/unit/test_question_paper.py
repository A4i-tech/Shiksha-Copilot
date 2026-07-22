import pytest

from app.models.question_paper import (
    Chapter,
    ChapterSubtopic,
    Content,
    GeneratedQuestionItem,
    GeneratedTemplate,
    MatchingListQuestion,
    QuestionBankPartsGenerationRequest,
    QuestionDistribution,
    QuestionType,
    TextQuestion,
)
from app.services.question_paper_service import QuestionPaperService


def make_request(unit_level="CHAPTER", units=("Chapter",)):
    subtopic = ChapterSubtopic(title="Subtopic", index_path="", learning_outcomes=[])
    chapter = Chapter(title="Chapter", index_path="", learning_outcomes=[], subtopics=[subtopic])
    distributions = [QuestionDistribution(unit_name=unit, objective="remember") for unit in units]
    template = GeneratedTemplate(type=QuestionType.ANSWER_SHORT, number_of_questions=len(units), marks_per_question=1, question_distribution=distributions)
    return QuestionBankPartsGenerationRequest(user_id="user", board="Board", medium="English", grade=1, subject="Science", unit_level=unit_level, chapters=[chapter], total_marks=len(units), template=[template])


@pytest.fixture
def service():
    service = QuestionPaperService.__new__(QuestionPaperService)
    service.max_questions_per_slot = 1
    return service


def generated(text):
    return GeneratedQuestionItem(unit_name="Chapter", type=QuestionType.ANSWER_SHORT, objective="remember", marks_per_question=1, item=TextQuestion(question=[Content.text(text)]))


def test_flattens_existing_questions(service):
    questions = [
        TextQuestion(question=[Content.text("Question"), Content(content_type="image/png", content=b"image")]),
        MatchingListQuestion(value1=[Content.text("Left")], value2=[Content.text("Right")]),
    ]
    assert service._flatten_questions(questions) == ["Question", "Left :: Right"]


@pytest.mark.parametrize(("unit_level", "unit"), [("CHAPTER", "Chapter"), ("SUBTOPIC", "Subtopic")])
def test_builds_and_chunks_generation_slots(service, unit_level, unit):
    slots = list(service._build_generation_slots(make_request(unit_level, (unit, unit))))
    assert [record.title for record, _ in slots] == [unit, unit]
    assert [[slot_id for slot_id, _, _ in batch] for _, batch in slots] == [[(0, 0)], [(0, 1)]]


def test_rejects_unknown_unit(service):
    with pytest.raises(ValueError, match="Unit Name `Missing`"):
        list(service._build_generation_slots(make_request(units=("Missing",))))


def test_builds_grammar_topics_from_flagged_chapters(service):
    request = make_request()
    request.chapters[0].is_grammar = True
    request.chapters[0].grammar_topics = [" Nouns ", "Verbs"]
    record = request.chapters[0].model_copy(update={"grammar_source_chapters": ["Story"]})
    service.prompts = {"grammar_context_prompt": "{GRAMMAR_TOPIC} from {CHAPTER_NAMES}"}
    assert service._get_grammar_topics(request, record) == "Nouns; Verbs from Story"
    request.chapters[0].is_grammar = False
    assert service._get_grammar_topics(request, record) == ""


def test_organizes_questions_by_template_order(service):
    request = make_request(units=("Chapter", "Chapter"))
    response = service._organize_questions_into_response(request, [((0, 1), generated("Second")), ((0, 0), generated("First"))])[0]
    assert response.number_of_questions == 2
    assert [question.question[0].content.decode() for question in response.questions] == ["First", "Second"]


def test_preserves_expected_count_for_partial_results(service):
    response = service._organize_questions_into_response(make_request(units=("Chapter", "Chapter")), [((0, 0), generated("First"))])[0]
    assert response.number_of_questions == 2
    assert len(response.questions) == 1
