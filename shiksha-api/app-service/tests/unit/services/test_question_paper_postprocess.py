from unittest.mock import AsyncMock, MagicMock

import pytest

from app.models.question_paper import (
    Content,
    FourOptionsQuestion,
    GeneratedQuestionItem,
    McqOption,
    TextQuestion,
    readable_strings,
)
from app.services.question_paper_service import QuestionPaperService, validate_tex

GOOD = r"The area is \(A = \pi r^2\)."
BAD = r"The area is \(A = \pi r^2 square units."
FIXED = r"The area is \(A = \pi r^2\) square units."


def make_record(text: str, slot=(0, 0)):
    item = GeneratedQuestionItem(
        unit_name="unit",
        type="ANSWER_SHORT",
        objective="objective",
        marks_per_question=1,
        item=TextQuestion(question=[Content.text(text)]),
    )
    return slot, item


def question_text(record) -> str:
    return record[1].item.question[0].content.decode()


def make_service(parse: AsyncMock) -> QuestionPaperService:
    service = QuestionPaperService.__new__(QuestionPaperService)  # skip __init__ (settings, prompt files, rag cache)
    service.postprocess_prompt = "fix the defects"
    service.postprocessors = [validate_tex]
    service.client = MagicMock()
    service.client.responses.parse = parse
    return service


def fixing_response(fmt, fixes: dict[int, str]):
    """Build a parsed response in which only the given schema fields (by position) are changed."""
    values = {key: None for key in fmt.model_fields}
    for index, text in fixes.items():
        values[list(fmt.model_fields)[index]] = TextQuestion(question=[Content.text(text)])
    return MagicMock(output_parsed=fmt(**values))


class TestValidateTexPostprocessor:
    def test_clean_paper_has_no_defects(self):
        assert validate_tex([make_record(GOOD)]) == []

    def test_reports_index_of_each_bad_question(self):
        paper = [make_record(GOOD), make_record(BAD), make_record(BAD)]
        assert [i for i, _ in validate_tex(paper)] == [1, 2]

    def test_checks_every_text_field_of_a_question(self):
        item = FourOptionsQuestion(
            question=[Content.text(GOOD)],
            options=[McqOption(label=l, text=[Content.text(BAD if l == "D" else GOOD)]) for l in "ABCD"],
            answer=[Content.text(GOOD)],
            keyAnswer=[Content.text("B")],
        )
        record = ((0, 0), GeneratedQuestionItem(unit_name="u", type="MCQ", objective="o", marks_per_question=1, item=item))
        assert len(validate_tex([record])) == 1

    def test_image_content_is_ignored(self):
        item = TextQuestion(question=[Content(content_type="image/png", content=BAD.encode())])
        assert list(readable_strings(item)) == []

    def test_non_utf8_text_is_skipped_not_raised(self):
        item = TextQuestion(question=[Content(content_type="text/plain", content=b"\x80\x81"), Content.text(GOOD)])
        assert list(readable_strings(item)) == [GOOD]


class TestPostprocess:
    async def test_clean_paper_makes_no_llm_call(self):
        parse = AsyncMock()
        paper = [make_record(GOOD)]

        result = await make_service(parse)._postprocess(paper)

        assert result == paper
        parse.assert_not_awaited()

    async def test_bad_question_is_replaced_and_others_are_untouched(self):
        async def parse(**kwargs):
            return fixing_response(kwargs["text_format"], {0: FIXED})  # the schema holds only the failing question

        service = make_service(AsyncMock(side_effect=parse))
        result = await service._postprocess([make_record(GOOD, (0, 0)), make_record(BAD, (0, 1))])

        assert service.client.responses.parse.await_count == 1
        assert [question_text(r) for r in result] == [GOOD, FIXED]

    async def test_feedback_names_the_failing_question_only(self):
        async def parse(**kwargs):
            return fixing_response(kwargs["text_format"], {})

        service = make_service(AsyncMock(side_effect=parse))
        await service._postprocess([make_record(GOOD), make_record(BAD)])

        feedback = service.client.responses.parse.await_args_list[0].kwargs["input"]
        assert feedback.count("- Question") == 1
        assert "TeX error" in feedback

    async def test_schema_only_contains_still_failing_questions(self):
        schemas = []

        async def parse(**kwargs):
            fmt = kwargs["text_format"]
            schemas.append(len(fmt.model_fields))
            return fixing_response(fmt, {0: FIXED} if len(schemas) == 1 else {})  # fix the first bad one only

        service = make_service(AsyncMock(side_effect=parse))
        await service._postprocess([make_record(BAD, (0, 0)), make_record(GOOD, (0, 1)), make_record(BAD, (0, 2))], max_iters=2)

        assert schemas == [2, 1]  # good question never sent; fixed question not re-sent on iteration 2

    async def test_unfixed_question_is_dropped_after_max_iters(self):
        async def parse(**kwargs):
            return fixing_response(kwargs["text_format"], {})  # model changes nothing

        service = make_service(AsyncMock(side_effect=parse))
        result = await service._postprocess([make_record(GOOD, (0, 0)), make_record(BAD, (0, 1))], max_iters=3)

        assert service.client.responses.parse.await_count == 3
        assert [r[0] for r in result] == [(0, 0)]

    async def test_last_attempt_is_revalidated(self):
        calls = 0

        async def parse(**kwargs):
            nonlocal calls
            calls += 1
            return fixing_response(kwargs["text_format"], {0: FIXED if calls == 2 else BAD})

        service = make_service(AsyncMock(side_effect=parse))
        result = await service._postprocess([make_record(BAD)], max_iters=2)

        assert [question_text(r) for r in result] == [FIXED]

    async def test_repair_call_failure_does_not_raise(self):
        parse = AsyncMock(side_effect=RuntimeError("model unavailable"))

        result = await make_service(parse)._postprocess([make_record(GOOD, (0, 0)), make_record(BAD, (0, 1))], max_iters=3)

        assert parse.await_count == 3  # a failed attempt still counts as an iteration
        assert [r[0] for r in result] == [(0, 0)]

    async def test_unparseable_response_does_not_raise(self):
        parse = AsyncMock(return_value=MagicMock(output_parsed=None))

        result = await make_service(parse)._postprocess([make_record(BAD)], max_iters=2)

        assert result == []

    async def test_temperature_is_not_sent(self):
        async def parse(**kwargs):
            return fixing_response(kwargs["text_format"], {0: FIXED})

        service = make_service(AsyncMock(side_effect=parse))
        await service._postprocess([make_record(BAD)])

        assert "temperature" not in service.client.responses.parse.await_args.kwargs
