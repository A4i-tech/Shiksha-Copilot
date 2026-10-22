import asyncio
import io
import json
import sys
from pathlib import Path
from types import SimpleNamespace
from uuid import uuid4

import pytest
from omni_ingest.core.model import StepStatus
from omni_ingest.core.pipeline import IngestionContext, create_pipeline_from_config
from openpyxl import Workbook

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))

import period_plan_steps as steps  # noqa: E402
from test_period_plan import conn  # noqa: E402,F401

TEMPLATE = {
    "_id": "wf-social",
    "name": "t",
    "description": "t",
    "sections": [
        {"id": "lesson_mind_mapping", "title": "Mind map", "description": "Map ${READING_CONTENT}", "mode": "gpt", "dependencies": []},
        {"id": "section_engage", "title": "Engage", "description": "Engage with ${DISCOURSE_TYPES_MAJOR}", "mode": "gpt", "dependencies": []},
    ],
}
ROWS = [
    ("Chapter Number ", "Chapter title", "Period ", "Topic", "Learning outcomes"),
    (None, None, None, "stray row before any chapter", "ignored"),
    (18, "Devotion", 1, " Hindu", " LO a"),
    (None, None, None, "Christian", "LO b"),
    (None, None, 2, "Sikh", "LO c"),
    (19.0, "Rivers", 1, "Rivers intro", "LO d"),
    (None, None, 3, "", None),
]
PAYLOAD_STEP = "Build one API payload per chapter/topic-group, substituting the workflow template"
SHARED_SHAPE_STEP = "Put the extracted chapters into the shared chapter shape"


def workbook(rows=ROWS, sheet="Grade 6") -> bytes:
    book = Workbook()
    book.active.title = sheet
    for row in rows:
        book.active.append(row)
    buffer = io.BytesIO()
    book.save(buffer)
    return buffer.getvalue()


def chapters(content=None, **kw):
    step = steps.XlsxChapters(**{"grade": "6", "subject": "social", **kw})
    return step._chapters(step._rows(content or workbook()))


def test_periods_group_topics_and_blank_cells_continue_the_value_above():
    result = chapters()
    assert [(c["no"], c["name"]) for c in result] == [(18, "Devotion"), (19, "Rivers")]
    assert result[0]["topic_groups"] == [
        {"topics": ["Hindu", "Christian"], "learning_outcomes": ["LO a", "LO b"]},
        {"topics": ["Sikh"], "learning_outcomes": ["LO c"]},
    ]
    assert result[1]["topic_groups"] == [{"topics": ["Rivers intro"], "learning_outcomes": ["LO d"]}]
    assert {k: v for k, v in result[0].items() if k != "topic_groups"} == {"board": "BSE-TG", "medium": "english", "grade": "6", "subject": "social", "no": 18, "name": "Devotion"}


def test_a_period_with_outcomes_but_no_topic_is_an_error_not_a_silent_drop():
    rows = [ROWS[0], (18, "Devotion", 1, "Hindu", "LO a"), (None, None, 2, "", "LO with no topic")]
    with pytest.raises(ValueError, match="Chapter 18, period 2 has learning outcomes but no topic"):
        chapters(workbook(rows))


@pytest.mark.parametrize("grade", ["6", "Grade 6", "grade 6"])
def test_sheet_is_found_by_grade_number_or_name(grade):
    assert len(chapters(grade=grade)) == 2


def test_unknown_grade_lists_the_sheets():
    with pytest.raises(ValueError, match="No sheet for grade '9'.*Grade 6"):
        chapters(grade="9")


def test_missing_column_is_named():
    with pytest.raises(ValueError, match="no column for learning_outcomes"):
        chapters(workbook([("Chapter Number", "Chapter title", "Period", "Topic"), (1, "a", 1, "b")]))


def test_grade_and_subject_are_required():
    ctx = SimpleNamespace(items=[SimpleNamespace(raw_content=workbook())], metadata={})
    result = asyncio.run(steps.XlsxChapters(grade="", subject="").run(ctx))
    assert result.status == StepStatus.FAILURE and "grade and subject" in result.error
    assert "period_chapters" not in ctx.metadata


def pipeline(**config):
    steps.register()
    return create_pipeline_from_config(ROOT / "period_plan.yaml", config_args={"workflow_template": json.dumps(TEMPLATE), "force_mode": "gpt", "model": "m", "embed_model": "e", **config})


def run(runner, resource):
    async def go():
        async for ctx, results in runner.run_flattened(IngestionContext(resource=resource)):
            return ctx, results

    return asyncio.run(go())


def write_workbook(tmp_path):
    path = tmp_path / "social.xlsx"
    path.write_bytes(workbook())
    return path


def test_workbook_runs_the_whole_pipeline_to_finished_plans(conn, tmp_path):
    ctx, results = run(pipeline(source="xlsx", grade="6", subject="social"), write_workbook(tmp_path))

    assert [r.error for r in results if r.status == StepStatus.FAILURE] == []
    payloads = ctx.metadata["payloads"]
    assert [p["subtopics"] for p in payloads] == [["Hindu", "Christian"], ["Sikh"], ["Rivers intro"]]
    first = payloads[0]
    assert first["chapter_info"] == {
        "id": "Board=BSE-TG,Medium=english,Grade=6,Subject=social,Number=18,Title=Devotion",
        "chapter_title": "Devotion",
        "index_path": "qdrant/BSE-TG/chapter_id:Medium=english,Grade=6,Subject=social,Number=18",
    }
    assert first["_id"] == "Board=BSE-TG/Medium=english/Grade=6/Subject=social/Number=18/Level=SUBTOPIC/Topics=Hindu & Christian"
    assert (first["lp_level"], first["workflow_id"], first["learning_outcomes"]) == ("SUBTOPIC", "wf-social", ["LO a", "LO b"])
    assert "CHAPTER: Devotion\nSUBTOPICS: Hindu & Christian\nLEARNING OUTCOMES: LO a, LO b" in first["workflow"]["sections"][0]["description"]
    assert [s["id"] for s in first["workflow"]["sections"]] == ["lesson_mind_mapping", "section_engage"]
    assert [s["id"] for s in payloads[1]["workflow"]["sections"]] == ["section_engage"]
    assert {r["status"] for r in ctx.metadata["lesson_plans"].values()} == {"completed"}
    assert len(conn.saved) == 3


def test_workbook_run_skips_every_pdf_step(conn, tmp_path):
    _, results = run(pipeline(source="xlsx", grade="6", subject="social"), write_workbook(tmp_path))
    assert [r.status for r in results].count(StepStatus.SKIPPED) == 7


def test_workbook_without_subject_fails_the_run_with_the_fix(conn, tmp_path):
    _, results = run(pipeline(source="xlsx", grade="6"), write_workbook(tmp_path))
    assert any(r.status == StepStatus.FAILURE and "--param subject" in r.error for r in results)


def test_pdf_chapters_reach_the_same_payload_shape():
    runner = pipeline(source="pdf")
    by_description = {runner.step_descriptions.get(id(s)): s for s in runner.steps}
    item = SimpleNamespace(
        id=uuid4(),
        source_uri="x",
        metadata={
            "record": {"no": 7, "name": "Light"},
            "chapter": {
                "topics": [{"title": "Reflection", "learning_outcomes": ["LO r"]}, {"title": "Mirrors", "learning_outcomes": ["LO m", "LO r"]}],
                "topic_groups": [{"topics": ["Reflection", "Mirrors"]}],
            },
        },
    )
    ctx = SimpleNamespace(items=[item], metadata={"shiksha_chapter": {"board": "BSE-TG", "medium": "English", "grade": 6, "subject_norm": "science"}})
    for description in (SHARED_SHAPE_STEP, PAYLOAD_STEP):
        assert asyncio.run(by_description[description].run(ctx)).status == StepStatus.SUCCESS
    (payload,) = ctx.metadata["payloads"]
    assert payload["chapter_info"]["index_path"] == "qdrant/BSE-TG/chapter_id:Medium=english,Grade=6,Subject=science,Number=7"
    assert (payload["subtopics"], payload["learning_outcomes"]) == (["Reflection", "Mirrors"], ["LO m", "LO r"])
    assert payload["_id"] == "Board=BSE-TG/Medium=english/Grade=6/Subject=science/Number=7/Level=SUBTOPIC/Topics=Reflection & Mirrors"
