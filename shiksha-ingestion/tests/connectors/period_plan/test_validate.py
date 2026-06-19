from __future__ import annotations

import json
from pathlib import Path

import pytest

from connectors.period_plan.validate import validate_file, validate_chapter_id_structure, validate_workflow_id_structure


def _write_json(path: Path, data: dict) -> Path:
    path.write_text(json.dumps(data), encoding="utf-8")
    return path


VALID_PAYLOAD = {
    "_id": "Board=SCERT/Medium=english/Grade=9/Subject=social/Number=1/Level=SUBTOPIC/Topics=Democracy",
    "user_id": "ADMIN",
    "created_at": 1700000000,
    "workflow_id": "telangana_social_chapter_lp_workflow",
    "chapter_id": "Board=BSE-TG,Medium=english,Grade=9,Subject=social,Number=1,Title=Democracy",
    "lp_level": "SUBTOPIC",
    "lp_type_english": "NONE",
    "subtopics": ["Democracy"],
    "learning_outcomes": ["Understand democracy"],
    "chapter_info": {"id": "x", "chapter_title": "Democracy", "index_path": "qdrant/..."},
    "workflow": {"_id": "wf-001", "sections": []},
}

VALID_RESULT = {
    "_id": "Board=SCERT/Medium=english/Grade=9/Subject=social/Number=1/Level=SUBTOPIC/Topics=Democracy",
    "created_at": 1700000000,
    "workflow_id": "telangana_social_chapter_lp_workflow",
    "chapter_id": "Board=BSE-TG,Medium=english,Grade=9,Subject=social,Number=1,Title=Democracy",
    "subtopics": ["Democracy"],
    "learning_outcomes": ["Understand democracy"],
    "lp_level": "SUBTOPIC",
    "lp_type_english": "NONE",
    "sections": [{"section_id": "intro", "section_title": "Introduction", "content": "Content here"}],
}


def test_validate_chapter_id_valid():
    assert validate_chapter_id_structure(
        "Board=BSE-TG,Medium=english,Grade=9,Subject=social,Number=1,Title=Democracy"
    ) == "Board=BSE-TG,Medium=english,Grade=9,Subject=social,Number=1,Title=Democracy"


def test_validate_chapter_id_wrong_parts():
    with pytest.raises(ValueError, match="6 comma-separated parts"):
        validate_chapter_id_structure("Board=X,Medium=Y")


def test_validate_workflow_id_valid():
    assert validate_workflow_id_structure("telangana_social_chapter_lp_workflow") == \
        "telangana_social_chapter_lp_workflow"


def test_validate_workflow_id_invalid_suffix():
    with pytest.raises(ValueError, match="must end with"):
        validate_workflow_id_structure("my-custom-flow")


def test_validate_file_payload_valid(tmp_path):
    p = _write_json(tmp_path / "p.json", VALID_PAYLOAD)
    ok, msg = validate_file(p, "payload")
    assert ok is True
    assert msg == ""


def test_validate_file_result_valid(tmp_path):
    p = _write_json(tmp_path / "r.json", VALID_RESULT)
    ok, msg = validate_file(p, "result")
    assert ok is True
    assert msg == ""


def test_validate_file_missing_field(tmp_path):
    bad = {**VALID_PAYLOAD}
    del bad["user_id"]
    p = _write_json(tmp_path / "bad.json", bad)
    ok, msg = validate_file(p, "payload")
    assert ok is False
    assert "user_id" in msg


def test_validate_file_auto_accepts_either(tmp_path):
    p = _write_json(tmp_path / "r.json", VALID_RESULT)
    ok, msg = validate_file(p, "auto")
    assert ok is True
