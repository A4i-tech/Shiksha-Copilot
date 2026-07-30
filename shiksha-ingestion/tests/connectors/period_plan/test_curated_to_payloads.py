from __future__ import annotations

import json
from pathlib import Path

import pytest
import yaml

from connectors.period_plan.config import PeriodPlanConfig, DiscourseTypesConfig, ExecutionConfig
from connectors.period_plan.curated_to_payloads import generate_for_curated_file, _substitute_workflow


SAMPLE_CHAPTER = [
    {
        "chapter_title": "Democracy",
        "chapter_number": 1,
        "index_path": "qdrant/SCERT/chapter_id:Medium=english,Grade=9,Subject=social,Number=1",
        "topic": [],
        "topic_groups": [
            {"topic": ["What is Democracy"], "learning_outcome": ["Define democracy"]},
            {"topic": ["Types of Democracy"], "learning_outcome": ["List types"]},
        ],
    }
]

SAMPLE_WORKFLOW = {
    "_id": "wf-001",
    "sections": [
        {"id": "lesson_mind_mapping", "description": "${READING_CONTENT}"},
        {"id": "intro", "description": "${DISCOURSE_TYPES_MAJOR} / ${DISCOURSE_TYPES}"},
    ],
}


def test_substitute_workflow_replaces_placeholders():
    result = _substitute_workflow(SAMPLE_WORKFLOW, "CHAPTER: X", ["Lab"], ["Quiz"], 1)
    assert "CHAPTER: X" in result["sections"][0]["description"]
    assert "Lab" in result["sections"][1]["description"]
    assert "Quiz" in result["sections"][1]["description"]


def test_substitute_workflow_drops_mind_mapping_after_first():
    result = _substitute_workflow(SAMPLE_WORKFLOW, "X", ["Lab"], ["Quiz"], 2)
    section_ids = [s["id"] for s in result["sections"]]
    assert "lesson_mind_mapping" not in section_ids


def test_generate_for_curated_file_writes_payloads(tmp_path):
    curated_path = tmp_path / "social.json"
    curated_path.write_text(json.dumps(SAMPLE_CHAPTER), encoding="utf-8")

    cfg = PeriodPlanConfig.model_construct(
        discourse_types=DiscourseTypesConfig(major=["Lab Report"], minor=["Quiz"]),
        execution=ExecutionConfig(skip_existing_payloads=False),
    )
    payloads_dir = tmp_path / "payloads"
    count = generate_for_curated_file(
        curated_path=curated_path,
        grade="9",
        subject="social",
        cfg=cfg,
        base_workflow=SAMPLE_WORKFLOW,
        payloads_dir=payloads_dir,
    )
    assert count == 2
    payload_files = list(payloads_dir.rglob("*.json"))
    assert len(payload_files) == 2
    first = json.loads(sorted(payload_files)[0].read_text())
    assert first["lp_level"] == "SUBTOPIC"
    assert "Board=BSE-TG" in first["chapter_id"]
    assert "Board=BSE-TG" in first["chapter_info"]["id"]


def test_generate_skips_existing(tmp_path):
    curated_path = tmp_path / "social.json"
    curated_path.write_text(json.dumps(SAMPLE_CHAPTER), encoding="utf-8")
    payloads_dir = tmp_path / "payloads"
    first_out = payloads_dir / "grade9" / "social" / "1" / "1.json"
    first_out.parent.mkdir(parents=True)
    first_out.write_text("{}", encoding="utf-8")

    cfg = PeriodPlanConfig.model_construct(
        discourse_types=DiscourseTypesConfig(major=["Lab"], minor=["Quiz"]),
        execution=ExecutionConfig(skip_existing_payloads=True),
    )
    count = generate_for_curated_file(
        curated_path=curated_path,
        grade="9",
        subject="social",
        cfg=cfg,
        base_workflow=SAMPLE_WORKFLOW,
        payloads_dir=payloads_dir,
    )
    assert count == 1
