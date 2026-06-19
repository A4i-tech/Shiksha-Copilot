from __future__ import annotations

import json
from pathlib import Path

import pandas as pd
import pytest

from connectors.period_plan.config import ExcelInputConfig
from connectors.period_plan.excel_to_curated import _get_chapter_number, process_subject_grade


def test_get_chapter_number_extracts_first_digit_sequence():
    assert _get_chapter_number("Chapter 3: Motion") == 3
    assert _get_chapter_number("10") == 10
    assert _get_chapter_number("no digits") is None


def test_process_subject_grade_writes_json(tmp_path):
    df = pd.DataFrame({
        "chapter_number": [1, 1, 1],
        "chapter_title": ["Motion", "Motion", "Motion"],
        "period": [1, 1, 2],
        "topic": ["Speed", None, "Velocity"],
        "learning_outcomes": ["Understand speed", "Define speed formula", "Define velocity"],
    })
    xl_path = tmp_path / "science.xlsx"
    df.to_excel(xl_path, sheet_name="Grade 9", index=False)

    cfg = ExcelInputConfig(
        subject="science",
        file_path=xl_path,
        sheet_map={"9": "Grade 9"},
        grades=["9"],
    )
    out = process_subject_grade(cfg, "9", tmp_path)
    assert out.exists()
    chapters = json.loads(out.read_text())
    assert len(chapters) == 1
    assert chapters[0]["chapter_title"] == "Motion"
    assert len(chapters[0]["topic_groups"]) == 2


def test_process_subject_grade_raises_for_missing_grade(tmp_path):
    df = pd.DataFrame({"chapter_number": [1], "chapter_title": ["X"], "period": [1], "topic": ["T"], "learning_outcomes": ["L"]})
    xl_path = tmp_path / "s.xlsx"
    df.to_excel(xl_path, sheet_name="G9", index=False)
    cfg = ExcelInputConfig(subject="sci", file_path=xl_path, sheet_map={"9": "G9"}, grades=["9"])
    with pytest.raises(ValueError, match="not in sheet_map"):
        process_subject_grade(cfg, "10", tmp_path)
