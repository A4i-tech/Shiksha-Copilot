from __future__ import annotations

import copy
import json
import time
from pathlib import Path
from typing import Any

import yaml

from .config import PeriodPlanConfig


def _load_workflow_template(path: Path) -> dict[str, Any]:
    return dict(yaml.safe_load(path.read_text(encoding="utf-8")))


def _substitute_workflow(
    base_workflow: dict[str, Any],
    context_str: str,
    discourse_major: list[str],
    discourse_minor: list[str],
    topic_counter: int,
) -> dict[str, Any]:
    workflow = copy.deepcopy(base_workflow)
    if "sections" not in workflow:
        return workflow
    if topic_counter > 1:
        workflow["sections"] = [
            s for s in workflow["sections"] if s.get("id") != "lesson_mind_mapping"
        ]
    for section in workflow["sections"]:
        desc = section.get("description", "")
        desc = desc.replace("${READING_CONTENT}", context_str)
        desc = desc.replace("${DISCOURSE_TYPES_MAJOR}", "; ".join(discourse_major))
        desc = desc.replace("${DISCOURSE_TYPES}", "; ".join(discourse_minor))
        section["description"] = desc
    return workflow


def generate_for_curated_file(
    curated_path: Path,
    grade: str,
    subject: str,
    base_workflow: dict[str, Any],
    workflow_id: str,
    payloads_dir: Path,
    discourse_major: list[str],
    discourse_minor: list[str],
    skip_existing: bool = True,
) -> int:
    chapters: list[dict[str, Any]] = json.loads(curated_path.read_text(encoding="utf-8"))
    total = 0
    for chapter in chapters:
        chap_num = str(chapter.get("chapter_number"))
        chap_title = chapter.get("chapter_title", "").strip()
        base_index_path = chapter.get(
            "index_path",
            f"qdrant/SCERT/chapter_id:Medium=english,Grade={grade},Subject={subject},Number={chap_num}",
        )
        topic_groups: list[dict[str, Any]] = chapter.get("topic_groups", [])
        topic_counter = 1
        for group in topic_groups:
            group_topics: list[str] = group.get("topic", [])
            if not group_topics:
                continue
            t_title = " & ".join(group_topics).strip()
            t_los_raw = group.get("learning_outcome", [])
            topic_los: list[str] = t_los_raw if isinstance(t_los_raw, list) else [t_los_raw]
            t_los_str = ", ".join(topic_los)
            out_path = (
                payloads_dir / f"grade{grade}" / subject / str(chap_num) / f"{topic_counter}.json"
            )
            if skip_existing and out_path.exists():
                topic_counter += 1
                continue
            context_str = (
                f"CHAPTER: {chap_title}\nSUBTOPICS: {t_title}\nLEARNING OUTCOMES: {t_los_str}\n"
            )
            chapter_id_str = (
                f"Board=SCERT,Medium=english,Grade={grade},"
                f"Subject={subject},Number={chap_num},Title={chap_title}"
            )
            doc_id = (
                f"Board=SCERT/Medium=english/Grade={grade}/"
                f"Subject={subject}/Number={chap_num}/Level=SUBTOPIC/Topics={t_title}"
            )
            workflow_payload = _substitute_workflow(
                base_workflow, context_str, discourse_major, discourse_minor, topic_counter
            )
            payload: dict[str, Any] = {
                "_id": doc_id,
                "user_id": "ADMIN",
                "created_at": int(time.time()),
                "workflow_id": workflow_id,
                "chapter_id": chapter_id_str.replace("Board=SCERT", "Board=BSE-TG"),
                "lp_level": "SUBTOPIC",
                "lp_type_english": "NONE",
                "subtopics": group_topics,
                "learning_outcomes": topic_los,
                "chapter_info": {
                    "id": chapter_id_str,
                    "chapter_title": chap_title,
                    "index_path": base_index_path,
                },
                "workflow": workflow_payload,
            }
            out_path.parent.mkdir(parents=True, exist_ok=True)
            out_path.write_text(json.dumps(payload, indent=2, ensure_ascii=False), encoding="utf-8")
            print(f"    [Saved Payload] Grade {grade} Ch {chap_num} Period {topic_counter}")
            topic_counter += 1
            total += 1
    return total


def run(cfg: PeriodPlanConfig, run_dir: Path) -> int:
    curated_dir = run_dir / cfg.outputs.curated_dirname
    payloads_dir = run_dir / cfg.outputs.payloads_dirname
    template_path = Path(cfg.templates.workflow_template_path)
    base_workflow = _load_workflow_template(template_path)
    workflow_id = template_path.stem
    total = 0
    for _key, input_cfg in cfg.inputs.items():
        subject = input_cfg.subject
        for grade in input_cfg.grades:
            curated_path = curated_dir / f"grade{grade}" / f"{subject}.json"
            if not curated_path.exists():
                print(f"  [Skipping] Curated file not found: {curated_path}")
                continue
            print(f"  [Processing] Grade {grade} {subject}...")
            count = generate_for_curated_file(
                curated_path=curated_path,
                grade=grade,
                subject=subject,
                base_workflow=base_workflow,
                workflow_id=workflow_id,
                payloads_dir=payloads_dir,
                discourse_major=cfg.discourse_types.major,
                discourse_minor=cfg.discourse_types.minor,
                skip_existing=cfg.execution.skip_existing_payloads,
            )
            total += count
            print(f"  [Done] Grade {grade} {subject}: {count} payloads written")
    return total
