from __future__ import annotations

import json
import re
from pathlib import Path
from typing import Any

import pandas as pd

from .config import ExcelInputConfig


def _get_chapter_number(text: str) -> int | None:
    m = re.search(r"\d+", str(text))
    return int(m.group()) if m else None


def process_subject_grade(config: ExcelInputConfig, grade: str, output_dir: Path) -> Path:
    if grade not in config.sheet_map:
        raise ValueError(f"Grade {grade!r} not in sheet_map for subject {config.subject!r}")

    sheet_name = config.sheet_map[grade]
    xls = pd.ExcelFile(config.file_path, engine="openpyxl")
    matching_sheet = next(
        (name for name in xls.sheet_names if name.lower() == sheet_name.lower()), None
    )
    if matching_sheet is None:
        raise ValueError(
            f"Sheet {sheet_name!r} not found in {config.file_path}. "
            f"Available: {xls.sheet_names}"
        )

    df = pd.read_excel(config.file_path, sheet_name=matching_sheet, engine="openpyxl")
    df.columns = df.columns.str.strip().str.replace(" ", "_").str.lower()

    for col in ("chapter_number", "chapter_title", "period"):
        df[col] = df[col].ffill()

    chapters: list[dict[str, Any]] = []

    for (chap_num, chap_title), chap_df in df.groupby(
        ["chapter_number", "chapter_title"], sort=False
    ):
        num = _get_chapter_number(str(chap_num))
        chapter: dict[str, Any] = {
            "chapter_title": chap_title,
            "chapter_number": num,
            "index_path": (
                f"qdrant/SCERT/chapter_id:"
                f"Medium=english,Grade={grade},Subject={config.subject},Number={num}"
            ),
            "topic_groups": [],
        }

        for _, period_df in chap_df.groupby("period", sort=False):
            topic_list = (
                period_df["topic"].dropna().astype(str).str.strip().tolist()
            )
            topic_list = [t for t in topic_list if t.lower() not in ("nan", "")]
            if not topic_list:
                continue
            outcomes = (
                period_df["learning_outcomes"].dropna().astype(str).str.strip().tolist()
            )
            chapter["topic_groups"].append({"topic": topic_list, "learning_outcome": outcomes})

        chapters.append(chapter)

    out_path = output_dir / f"grade{grade}" / f"{config.subject}.json"
    out_path.parent.mkdir(parents=True, exist_ok=True)
    out_path.write_text(json.dumps(chapters, indent=2, ensure_ascii=False), encoding="utf-8")
    return out_path


def run(config: ExcelInputConfig, output_dir: Path) -> list[Path]:
    written: list[Path] = []
    for grade in config.grades:
        if grade not in config.sheet_map:
            print(f"  [Skipping] Grade {grade} not in sheet_map")
            continue
        path = process_subject_grade(config, grade, output_dir)
        print(f"  [Written] {path}")
        written.append(path)
    return written
