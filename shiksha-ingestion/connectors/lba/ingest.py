from __future__ import annotations

import base64
import json
import logging
from pathlib import Path
from typing import Any

try:
    from omni_ingest.core.model import (
        KnowledgeItem,
        ResolvedResource,
        Step,
        StepResult,
        StepStatus,
    )
    from omni_ingest.core.pipeline import IngestionContext, PipelineRunner, register_step
    _OMNI_AVAILABLE = True
except Exception:
    _OMNI_AVAILABLE = False
    KnowledgeItem = None  # type: ignore[assignment,misc]
    ResolvedResource = None  # type: ignore[assignment,misc]
    Step = object  # type: ignore[assignment,misc]
    StepResult = None  # type: ignore[assignment,misc]
    StepStatus = None  # type: ignore[assignment,misc]
    IngestionContext = None  # type: ignore[assignment,misc]
    PipelineRunner = None  # type: ignore[assignment,misc]
    def register_step(*a, **kw): pass  # type: ignore[misc]

from pydantic import BaseModel

from .base_scraper import PDFEntry
from .manifest import Manifest

log = logging.getLogger(__name__)

MAX_PAGES = 10

EXTRACTION_PROMPT_TEXT = """You are extracting practice questions from a state board school textbook.

Textbook exercises appear in these sections: "Do This", "Try This", "Exercise", "Think & Discuss",
numbered problems (1. 2. 3. ...), lettered sub-questions (a) b) c) ...), word problems, fill-in-the-blank
sentences with blanks shown as ___, and MCQ-style questions with options like (i)(ii)(iii) or A/B/C/D.

Extract EVERY such question or sub-question. For each one return a JSON object with EXACTLY these fields:
- answerType: one of "mcq", "fill_in_the_blank", "answer_very_short", "answer_short", "answer_medium", "answer_long", "matching"
- question: full question text including any relevant context (copy exactly, do not paraphrase)
- options: list of option strings (MCQ only; empty list otherwise)
- value1: left-side item text (MATCHING only; omit for other types)
- value2: right-side matching text (MATCHING only; omit for other types)
- keyAnswer: correct answer if determinable from context, else ""
- marks: marks allocated as integer (default 1 if not shown)
- unitName: chapter or lesson name nearest to this question
- objective: learning objective if explicitly stated (omit if absent)

Return {{"questions": [...]}}. There will always be questions — this is a textbook full of exercises.

Content:
{text}"""

EXTRACTION_PROMPT_VISION = """These are pages from a state board textbook (may be in Telugu or English).
Extract all assessment questions visible in these pages.
For each question return a JSON object with EXACTLY these fields:
- answerType: one of "mcq", "fill_in_the_blank", "answer_very_short", "answer_short", "answer_medium", "answer_long", "matching"
- question: full question text (transliterate Telugu to English if needed, or keep original script)
- options: list of option strings (MCQ only; empty list otherwise)
- value1: left-side item text (MATCHING only; omit for other types)
- value2: right-side matching text (MATCHING only; omit for other types)
- keyAnswer: correct answer string
- marks: marks allocated as integer (default 1 if not shown)
- unitName: chapter or lesson name visible near this question group
- objective: learning objective text if explicitly stated (omit if absent)

Return {{"questions": [...]}}. If no questions found return {{"questions": []}}."""


class _NullStore:
    async def create_pipeline_run(self, tenant_id, pipeline_version_id, source_uri, id=None):
        from uuid import uuid4
        return id or uuid4()

    async def update_pipeline_run(self, run_id, status, completed_at=None, error=None):
        pass

    async def create_step_run(self, run_id, step_name):
        from uuid import uuid4
        return uuid4()

    async def update_step_run(self, step_id, status, metadata=None, error=None):
        pass


def _pdf_pages_to_images(pdf_path: Path, max_pages: int = MAX_PAGES) -> list[str]:
    import fitz
    doc = fitz.open(str(pdf_path))
    images: list[str] = []
    for i, page in enumerate(doc):
        if i >= max_pages:
            break
        pix = page.get_pixmap(dpi=150)
        images.append(base64.b64encode(pix.tobytes("png")).decode())
    doc.close()
    return images


def _text_is_usable(text: str) -> bool:
    if not text or len(text) < 100:
        return False
    printable = sum(1 for c in text if c.isprintable() and ord(c) < 0x2000)
    return (printable / len(text)) > 0.5


class LBAExtractionStep(BaseModel, Step):
    """OmniIngest pipeline step: extracts LBA questions via Azure OpenAI (text or vision path)."""

    medium: str = ""
    chunk_size: int = 60_000

    async def run(self, ctx: IngestionContext[ResolvedResource]) -> StepResult:
        import os
        from openai import AsyncAzureOpenAI

        client = AsyncAzureOpenAI(
            api_key=os.environ["AZURE_OPENAI_API_KEY"],
            azure_endpoint=os.environ["AZURE_OPENAI_ENDPOINT"],
            api_version=os.environ.get("AZURE_OPENAI_API_VERSION", "2025-04-01-preview"),
        )
        deployment = os.environ.get("AZURE_OPENAI_DEPLOYMENT_NAME", "gpt-4o")

        force_vision = self.medium.lower() in ("telugu", "kannada", "hindi")
        text = ctx.resource.content
        all_questions: list[dict[str, Any]] = []

        if not force_vision and _text_is_usable(text):
            log.info("LBAExtractionStep: text path, %d chars", len(text))
            for start in range(0, len(text), self.chunk_size):
                chunk = text[start:start + self.chunk_size]
                r = await client.chat.completions.create(
                    model=deployment,
                    messages=[{"role": "user", "content": EXTRACTION_PROMPT_TEXT.format(text=chunk)}],
                    response_format={"type": "json_object"},
                )
                raw = r.choices[0].message.content or "{}"
                try:
                    d = json.loads(raw)
                    chunk_qs = d.get("questions", []) if isinstance(d, dict) else []
                    log.info("Chunk %d-%d: %d questions", start, start + self.chunk_size, len(chunk_qs))
                    all_questions.extend(chunk_qs)
                except json.JSONDecodeError:
                    pass
        else:
            log.info("LBAExtractionStep: vision path, medium=%s", self.medium)
            images = _pdf_pages_to_images(Path(ctx.resource.uri))
            if not images:
                log.warning("No pages rendered from %s", ctx.resource.uri)
                ctx.items = []
                return StepResult(status=StepStatus.SUCCESS, items=[], metadata={"question_count": 0})

            content: list[dict[str, Any]] = [{"type": "text", "text": EXTRACTION_PROMPT_VISION}]
            for img_b64 in images:
                content.append({
                    "type": "image_url",
                    "image_url": {"url": f"data:image/png;base64,{img_b64}", "detail": "high"},
                })

            resp = await client.chat.completions.create(
                model=deployment,
                messages=[{"role": "user", "content": content}],
                response_format={"type": "json_object"},
            )
            raw = resp.choices[0].message.content or "{}"
            try:
                d = json.loads(raw)
                all_questions = d.get("questions", []) if isinstance(d, dict) else []
            except json.JSONDecodeError:
                log.warning("Vision LLM returned non-JSON for %s", ctx.resource.uri)

        ctx.items = [
            KnowledgeItem(
                source_uri=ctx.resource.uri,
                content=q.get("question", ""),
                metadata=q,
            )
            for q in all_questions
        ]

        log.info("LBAExtractionStep: extracted %d questions", len(ctx.items))
        return StepResult(
            status=StepStatus.SUCCESS,
            items=ctx.items,
            metadata={"question_count": len(ctx.items)},
        )


register_step("lba_extraction", LBAExtractionStep)


async def _extract_questions(pdf_path: Path, board: str, medium: str = "") -> list[dict[str, Any]]:
    import os
    import fitz
    from openai import AsyncOpenAI

    client = AsyncOpenAI(
        api_key=os.environ["OPENAI_API_KEY"],
        base_url=os.environ.get("OPENAI_BASE_URL"),
    )
    deployment = os.environ.get("AZURE_OPENAI_DEPLOYMENT_NAME", "gpt-4o")
    chunk_size = 60_000

    force_vision = medium.lower() in ("telugu", "kannada", "hindi")

    doc = fitz.open(str(pdf_path))
    raw_text = "".join(page.get_text() for page in doc)
    doc.close()

    all_questions: list[dict[str, Any]] = []

    if not force_vision and _text_is_usable(raw_text):
        log.info("_extract_questions: text path, %d chars", len(raw_text))
        for start in range(0, len(raw_text), chunk_size):
            chunk = raw_text[start:start + chunk_size]
            r = await client.chat.completions.create(
                model=deployment,
                messages=[{"role": "user", "content": EXTRACTION_PROMPT_TEXT.format(text=chunk)}],
                response_format={"type": "json_object"},
            )
            raw = r.choices[0].message.content or "{}"
            try:
                d = json.loads(raw)
                chunk_qs = d.get("questions", []) if isinstance(d, dict) else []
                log.info("Chunk %d-%d: %d questions", start, start + chunk_size, len(chunk_qs))
                all_questions.extend(chunk_qs)
            except json.JSONDecodeError:
                pass
    else:
        log.info("_extract_questions: vision path, medium=%s", medium)
        images = _pdf_pages_to_images(pdf_path)
        if not images:
            log.warning("No pages rendered from %s", pdf_path)
            return []

        content: list[dict[str, Any]] = [{"type": "text", "text": EXTRACTION_PROMPT_VISION}]
        for img_b64 in images:
            content.append({
                "type": "image_url",
                "image_url": {"url": f"data:image/png;base64,{img_b64}", "detail": "high"},
            })

        resp = await client.chat.completions.create(
            model=deployment,
            messages=[{"role": "user", "content": content}],
            response_format={"type": "json_object"},
        )
        raw = resp.choices[0].message.content or "{}"
        try:
            d = json.loads(raw)
            all_questions = d.get("questions", []) if isinstance(d, dict) else []
        except json.JSONDecodeError:
            log.warning("Vision LLM returned non-JSON for %s", pdf_path)

    log.info("_extract_questions: extracted %d questions", len(all_questions))
    return all_questions


# Maps LLM-returned answerType → backend canonical key (QUESTION_TYPE_DETAILS keys in question-bank-paper-config.json)
_ANSWER_TYPE_CANONICAL: dict[str, str] = {
    "mcq": "mcq",
    "fill_in_the_blank": "fill_in_the_blank",
    "fill_in_the_blanks": "fill_in_the_blank",
    "answer_fill_in_the_blank": "fill_in_the_blank",
    "answer_very_short": "ANSWER_VERY_SHORT",
    "answer_short": "ANSWER_SHORT",
    "answer_medium": "answer_medium",
    "answer_long": "long_answer",
    "matching": "match_the_following",
}

_GROUP_HEADING: dict[str, str] = {
    "mcq": "Multiple Choice Questions",
    "fill_in_the_blank": "Fill in the Blanks",
    "ANSWER_VERY_SHORT": "Very Short Answer",
    "ANSWER_SHORT": "Short Answer",
    "answer_medium": "Medium Answer",
    "long_answer": "Long Answer",
    "match_the_following": "Matching",
}


def _parse_options(raw: list) -> list[dict[str, str]]:
    """Convert ['A. Rome', 'B. Delhi'] → [{'label':'A','text':'Rome'}, ...]"""
    import re
    result = []
    fallback_labels = ["A", "B", "C", "D", "E"]
    for i, opt in enumerate(raw):
        m = re.match(r'^[\(\[]?([A-Ea-e])[\)\].\s]+(.+)$', str(opt).strip())
        if m:
            result.append({"label": m.group(1).upper(), "text": m.group(2).strip()})
        else:
            label = fallback_labels[i] if i < len(fallback_labels) else str(i + 1)
            result.append({"label": label, "text": str(opt).strip()})
    return result


_SUBJECT_CANONICAL: dict[str, str] = {
    "social_studies": "social_science",
    "maths": "maths",
    "science": "science",
    "english": "English",
}

_BOARD_CANONICAL: dict[str, str] = {
    "telangana": "BSE-TG",
}

# Maps canonical subject → display names to search in MasterSubject collection
_SUBJECT_DISPLAY_NAMES: dict[str, list[str]] = {
    "social_science": ["Social Science", "Social", "social_science"],
    "maths": ["Mathematics", "Maths", "Math"],
    "science": ["Science"],
    "English": ["English"],
}


async def _resolve_or_create_master_subject(mongo_db, subject: str, board: str):
    """Find or create a MasterSubject doc for this subject+board. Returns ObjectId."""
    import re
    from bson import ObjectId

    coll = mongo_db["mastersubjects"]
    canonical_board = _BOARD_CANONICAL.get(board.lower(), board)
    name_variants = _SUBJECT_DISPLAY_NAMES.get(subject, [subject])

    for name in name_variants:
        doc = await coll.find_one({
            "$or": [
                {"name": {"$regex": f"^{re.escape(name)}$", "$options": "i"}},
                {"subjectName": {"$regex": f"^{re.escape(name)}$", "$options": "i"}},
            ],
            "boards": canonical_board,
            "isDeleted": {"$ne": True},
        })
        if doc:
            log.info("Found MasterSubject '%s' _id=%s", doc.get("name"), doc["_id"])
            return doc["_id"]

    display_name = subject.replace("_", " ").title()
    result = await coll.insert_one({
        "subjectName": display_name,
        "name": display_name,
        "sem": 1,
        "boards": [canonical_board],
        "applicableClasses": [],
        "isDeleted": False,
    })
    log.info("Created MasterSubject '%s' _id=%s", display_name, result.inserted_id)
    return result.inserted_id


def _normalize_dashes(s: str) -> str:
    """Replace en-dash/em-dash with regular hyphen for comparison."""
    return s.replace("–", "-").replace("—", "-")


async def _upsert_chapters(mongo_db, questions: list[dict], entry: PDFEntry) -> dict[str, Any]:
    """Upsert chapters into the chapters collection. Returns {unitName: ObjectId} map."""
    import re
    coll = mongo_db["chapters"]
    canonical_board = _BOARD_CANONICAL.get(entry.board.lower(), entry.board)
    subject = _SUBJECT_CANONICAL.get(entry.subject, entry.subject)
    subject_id = await _resolve_or_create_master_subject(mongo_db, subject, entry.board)

    seen_order: dict[str, int] = {}
    for q in questions:
        unit = (q.get("unitName") or "").strip()
        if unit and unit not in seen_order:
            seen_order[unit] = len(seen_order) + 1

    chapter_id_map: dict[str, Any] = {}
    for unit_name, chapter_num in seen_order.items():
        # Build a regex that matches both hyphen and en/em-dash variants so we
        # don't create duplicate docs when the LLM normalizes dashes differently
        # from what's already stored.
        normalized = _normalize_dashes(unit_name)
        dash_pattern = re.escape(normalized).replace(r"\-", r"[\-–—]")
        lookup_filter = {
            "topics": {"$regex": f"^{dash_pattern}$", "$options": "i"},
            "standard": entry.grade,
            "medium": entry.medium.lower(),
            "subjectId": subject_id,
        }
        existing = await coll.find_one(lookup_filter, {"_id": 1, "topics": 1})
        if existing:
            # Update order on existing doc; use its exact topics string as key
            await coll.update_one(
                {"_id": existing["_id"]},
                {"$set": {"orderNumber": chapter_num, "board": canonical_board}},
            )
            chapter_id_map[unit_name] = existing["_id"]
            log.info("Matched existing chapter '%s' (_id=%s)", existing.get("topics", unit_name), existing["_id"])
        else:
            # Create new doc using the LLM-extracted name
            insert_filter = {
                "topics": unit_name,
                "standard": entry.grade,
                "medium": entry.medium.lower(),
                "subjectId": subject_id,
            }
            await coll.update_one(
                insert_filter,
                {
                    "$set": {"orderNumber": chapter_num, "board": canonical_board},
                    "$setOnInsert": {"subTopics": [], "isDeleted": False, "learningOutcomes": []},
                },
                upsert=True,
            )
            doc = await coll.find_one(insert_filter, {"_id": 1})
            chapter_id_map[unit_name] = doc["_id"]
            log.info("Created chapter '%s' → _id=%s", unit_name, doc["_id"])

    return chapter_id_map


def _to_mongo_doc(
    q: dict[str, Any],
    entry: PDFEntry,
    chapter_id: Any = None,
    chapter_number: int = 0,
) -> dict[str, Any]:
    from datetime import datetime, timezone
    raw_answer_type = q.get("answerType", "")
    answer_type = _ANSWER_TYPE_CANONICAL.get(raw_answer_type, raw_answer_type)
    now = datetime.now(timezone.utc)
    subject = _SUBJECT_CANONICAL.get(entry.subject, entry.subject)
    canonical_board = _BOARD_CANONICAL.get(entry.board.lower(), entry.board)

    doc: dict[str, Any] = {
        "subject": subject,
        "medium": entry.medium.lower(),
        "class": str(entry.grade),
        "year": "2024-25",
        "examType": "LBA",
        "board": canonical_board,
        "chapter": {"title": q.get("unitName", ""), "chapterNumber": chapter_number},
        "chapterId": chapter_id,
        "groupHeading": _GROUP_HEADING.get(answer_type, answer_type),
        "answerType": answer_type,
        "difficulty": "",
        "marksPerQuestion": q.get("marks", 1),
        "text": q.get("question", ""),
        "keyAnswer": ", ".join(q["keyAnswer"]) if isinstance(q.get("keyAnswer"), list) else q.get("keyAnswer", ""),
        "items": [],
        "correctOrderById": [],
        "correctOrderIndices": [],
        "options": _parse_options(q.get("options", [])) if answer_type == "mcq" else [],
        "pairs": [{"value1": q.get("value1", ""), "value2": q.get("value2", "")}] if answer_type == "matching" else [],
        "createdAt": now,
        "updatedAt": now,
        "__v": 0,
    }
    return doc


async def run_ingestion(
    manifest: Manifest,
    mongo_db,
    data_dir: Path | None = None,
    collection_name: str = "lba_questions",
) -> None:
    collection = mongo_db[collection_name]
    pending = manifest.entries_with_status("downloaded", "failed")
    log.info("Entries to ingest: %d", len(pending))

    for entry in pending:
        pdf_path = (data_dir / entry.local_path) if data_dir else Path(entry.local_path)
        if not pdf_path.exists():
            log.warning("PDF not found: %s", pdf_path)
            manifest.update_status(entry, "failed", error="PDF file missing")
            manifest.save()
            continue

        log.info("Ingesting %s", pdf_path)
        try:
            questions = await _extract_questions(pdf_path, entry.board, medium=entry.medium)

            chapter_id_map = await _upsert_chapters(mongo_db, questions, entry)

            seen_order: dict[str, int] = {}
            for q in questions:
                unit = (q.get("unitName") or "").strip()
                if unit and unit not in seen_order:
                    seen_order[unit] = len(seen_order) + 1

            docs = [
                _to_mongo_doc(
                    q,
                    entry,
                    chapter_id=chapter_id_map.get((q.get("unitName") or "").strip()),
                    chapter_number=seen_order.get((q.get("unitName") or "").strip(), 0),
                )
                for q in questions
            ]
            if docs:
                await collection.insert_many(docs)
                log.info("Inserted %d questions from %s", len(docs), pdf_path.name)
            else:
                log.warning("No questions extracted from %s", pdf_path.name)
            manifest.update_status(entry, "ingested")
        except Exception as exc:
            log.exception("Error ingesting %s", pdf_path.name)
            manifest.update_status(entry, "failed", error=str(exc))

        manifest.save()

    log.info("Ingestion complete.")
