import os

import aiohttp
import pytest

from app.models.question_paper import (
    Chapter,
    ChapterSubtopic,
    GeneratedTemplate,
    QuestionBankPartsGenerationRequest,
    QuestionDistribution,
    QuestionType,
)


def request(unit="Photosynthesis"):
    return QuestionBankPartsGenerationRequest(
        user_id="integration-test",
        board="CBSE",
        medium="English",
        grade=6,
        subject="Science",
        unit_level="CHAPTER",
        chapters=[Chapter(
            title="Photosynthesis",
            index_path="",
            learning_outcomes=["Explain how green plants make food using sunlight."],
            subtopics=[],
        )],
        total_marks=1,
        template=[GeneratedTemplate(
            type=QuestionType.MCQ,
            number_of_questions=1,
            marks_per_question=1,
            question_distribution=[QuestionDistribution(unit_name=unit, objective="remember")],
        )],
    )


def chapter_rag_request():
    return QuestionBankPartsGenerationRequest(
        user_id="integration-test",
        board="BSE-TG",
        medium="English",
        grade=7,
        subject="Science",
        unit_level="CHAPTER",
        chapters=[Chapter(
            title="Food components",
            index_path="qdrant/SCERT/chapter_id:Medium=english,Grade=7,Subject=science,Number=1",
            learning_outcomes=["Explains the functions of nutrients in food."],
            subtopics=[],
        )],
        total_marks=1.5,
        template=[GeneratedTemplate(
            type=question_type,
            number_of_questions=1,
            marks_per_question=marks,
            question_distribution=[QuestionDistribution(unit_name="Food components", objective="Application")],
        ) for question_type, marks in [(QuestionType.MCQ, 0.5), (QuestionType.FILL_BLANKS, 1)]],
    )


def subtopic_rag_request():
    index_path = "qdrant/SCERT/chapter_id:Medium=english,Grade=10,Subject=math,Number=1"
    return QuestionBankPartsGenerationRequest(
        user_id="integration-test",
        board="BSE-TG",
        medium="English",
        grade=10,
        subject="Math",
        unit_level="SUBTOPIC",
        chapters=[Chapter(
            title="Real Numbers",
            index_path=index_path,
            learning_outcomes=["States the Fundamental Theorem of Arithmetic."],
            subtopics=[ChapterSubtopic(
                title="1.2. The Fundamental theorem of Arithmetic",
                index_path=index_path,
                learning_outcomes=["Express composite numbers as products of prime factors."],
            )],
        )],
        total_marks=4,
        template=[GeneratedTemplate(
            type=QuestionType.ANSWER_SHORT,
            number_of_questions=1,
            marks_per_question=4,
            question_distribution=[QuestionDistribution(
                unit_name="1.2. The Fundamental theorem of Arithmetic",
                objective="Understanding",
            )],
        )],
    )


def grammar_request():
    return QuestionBankPartsGenerationRequest(
        user_id="integration-test",
        board="BSE-TG",
        medium="English",
        grade=7,
        subject="English",
        unit_level="CHAPTER",
        chapters=[Chapter(
            title="Grammar",
            index_path="",
            learning_outcomes=[],
            is_grammar=True,
            grammar_topics=["Nouns"],
            subtopics=[],
        )],
        total_marks=1,
        template=[GeneratedTemplate(
            type=QuestionType.GRAMMAR_MCQ,
            number_of_questions=1,
            marks_per_question=1,
            question_distribution=[QuestionDistribution(unit_name="Grammar", objective="Application")],
        )],
    )


@pytest.mark.integration
async def test_question_types():
    async with aiohttp.ClientSession() as client:
        async with client.get(f'{os.environ["SHIKSHA_BASE_URL"].rstrip("/")}/question-paper/question-types', params={"subject": "Science"}) as response:
            response.raise_for_status()
            result = await response.json()
    types = list(QuestionType)
    assert [item["key"] for item in result] == [question_type.name for question_type in types]
    assert [item["value"] for item in result] == [question_type.value for question_type in types]
    assert [item["name"] for item in result] == [question_type.display_name for question_type in types]


@pytest.mark.integration
async def test_question_paper_generation():
    async with aiohttp.ClientSession() as client:
        async with client.post(f'{os.environ["SHIKSHA_BASE_URL"].rstrip("/")}/question-paper/by-parts', json=request().model_dump(mode="json")) as response:
            response.raise_for_status()
            result = await response.json()
    assert result["metadata"]["user_id"] == "integration-test"
    assert result["metadata"]["unit_names"] == ["Photosynthesis"]
    assert result["questions"][0]["type"] == QuestionType.MCQ
    assert result["questions"][0]["number_of_questions"] == 1
    assert len(result["questions"][0]["questions"]) == 1
    assert len(result["questions"][0]["questions"][0]["options"]) == 4


@pytest.mark.integration
async def test_chapter_rag_generation():
    async with aiohttp.ClientSession() as client:
        async with client.post(f'{os.environ["SHIKSHA_BASE_URL"].rstrip("/")}/question-paper/by-parts', json=chapter_rag_request().model_dump(mode="json")) as response:
            response.raise_for_status()
            result = await response.json()
    assert result["metadata"]["unit_names"] == ["Food components"]
    assert [section["type"] for section in result["questions"]] == [QuestionType.MCQ, QuestionType.FILL_BLANKS]
    assert [section["number_of_questions"] for section in result["questions"]] == [1, 1]
    assert [len(section["questions"]) for section in result["questions"]] == [1, 1]
    assert len(result["questions"][0]["questions"][0]["options"]) == 4


@pytest.mark.integration
async def test_subtopic_rag_generation():
    async with aiohttp.ClientSession() as client:
        async with client.post(f'{os.environ["SHIKSHA_BASE_URL"].rstrip("/")}/question-paper/by-parts', json=subtopic_rag_request().model_dump(mode="json")) as response:
            response.raise_for_status()
            result = await response.json()
    assert result["metadata"]["unit_names"] == ["Real Numbers"]
    assert result["questions"][0]["type"] == QuestionType.ANSWER_SHORT
    assert result["questions"][0]["number_of_questions"] == 1
    assert len(result["questions"][0]["questions"]) == 1


@pytest.mark.integration
async def test_grammar_generation():
    async with aiohttp.ClientSession() as client:
        async with client.post(f'{os.environ["SHIKSHA_BASE_URL"].rstrip("/")}/question-paper/by-parts', json=grammar_request().model_dump(mode="json")) as response:
            response.raise_for_status()
            result = await response.json()
    assert result["questions"][0]["type"] == QuestionType.GRAMMAR_MCQ
    assert result["questions"][0]["number_of_questions"] == 1
    assert len(result["questions"][0]["questions"]) == 1
    assert len(result["questions"][0]["questions"][0]["options"]) == 4


@pytest.mark.integration
async def test_question_paper_rejects_unknown_unit():
    async with aiohttp.ClientSession() as client:
        async with client.post(f'{os.environ["SHIKSHA_BASE_URL"].rstrip("/")}/question-paper/by-parts', json=request("Missing").model_dump(mode="json")) as response:
            result = await response.json()
    assert response.status == 400
    assert "Unit Name `Missing`" in result["detail"]
