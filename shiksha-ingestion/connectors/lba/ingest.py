from __future__ import annotations

import asyncio
import base64
import hashlib
import json
import logging
from pathlib import Path
from typing import Any

from .base_scraper import PDFEntry
from .manifest import Manifest

log = logging.getLogger(__name__)

PAGES_PER_VISION_BATCH = 10
TEXT_CHUNK_SIZE = 60_000
TEXT_CHUNK_OVERLAP = 500

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


def _text_is_usable(text: str) -> bool:
    if not text or len(text) < 100:
        return False
    printable = sum(1 for c in text if c.isprintable() and ord(c) < 0x2000)
    return (printable / len(text)) > 0.5


def _iter_pdf_page_image_batches(pdf_path: Path, batch_size: int = PAGES_PER_VISION_BATCH):
    """Yields (start, end, total, images) batches covering every page of the PDF."""
    import fitz
    doc = fitz.open(str(pdf_path))
    try:
        total = doc.page_count
        for start in range(0, total, batch_size):
            end = min(start + batch_size, total)
            images = [base64.b64encode(doc[i].get_pixmap(dpi=150).tobytes("png")).decode() for i in range(start, end)]
            yield start, end, total, images
    finally:
        doc.close()


async def _create_with_retry(client, **kwargs):
    from openai import RateLimitError

    delay = 1
    for attempt in range(4):
        try:
            return await client.chat.completions.create(**kwargs)
        except RateLimitError:
            if attempt == 3:
                raise
            log.warning("Rate limited, retrying in %ds (attempt %d/4)", delay, attempt + 1)
            await asyncio.sleep(delay)
            delay *= 2


def _dedupe_questions(questions: list[dict[str, Any]]) -> list[dict[str, Any]]:
    """Drops duplicates caused by overlapping text chunks, keyed on normalized question text."""
    seen: set[str] = set()
    deduped = []
    for q in questions:
        key = " ".join(str(q.get("question", "")).split()).casefold()
        if key and key in seen:
            continue
        seen.add(key)
        deduped.append(q)
    return deduped


async def _extract_questions(pdf_path: Path, board: str, medium: str = "") -> list[dict[str, Any]]:
    import os
    import fitz
    from openai import AsyncOpenAI

    client = AsyncOpenAI(
        api_key=os.environ["OPENAI_API_KEY"],
        base_url=os.environ.get("OPENAI_BASE_URL"),
    )
    deployment = os.environ.get("AZURE_OPENAI_DEPLOYMENT_NAME", "gpt-4o")

    force_vision = medium.lower() in ("telugu", "kannada", "hindi")

    doc = fitz.open(str(pdf_path))
    raw_text = "".join(page.get_text() for page in doc)
    doc.close()

    all_questions: list[dict[str, Any]] = []

    if not force_vision and _text_is_usable(raw_text):
        log.info("_extract_questions: text path, %d chars", len(raw_text))
        step = TEXT_CHUNK_SIZE - TEXT_CHUNK_OVERLAP
        for start in range(0, len(raw_text), step):
            chunk = raw_text[start:start + TEXT_CHUNK_SIZE]
            r = await _create_with_retry(
                client,
                model=deployment,
                messages=[{"role": "user", "content": EXTRACTION_PROMPT_TEXT.format(text=chunk)}],
                response_format={"type": "json_object"},
            )
            raw = r.choices[0].message.content or "{}"
            try:
                d = json.loads(raw)
                chunk_qs = d.get("questions", []) if isinstance(d, dict) else []
                log.info("Chunk %d-%d: %d questions", start, start + TEXT_CHUNK_SIZE, len(chunk_qs))
                all_questions.extend(chunk_qs)
            except json.JSONDecodeError:
                log.warning("Failed to parse LLM JSON for chunk %d-%d of %s", start, start + TEXT_CHUNK_SIZE, pdf_path.name)
        all_questions = _dedupe_questions(all_questions)
    else:
        log.info("_extract_questions: vision path, medium=%s", medium)
        batches = list(_iter_pdf_page_image_batches(pdf_path))
        if not batches:
            log.warning("No pages rendered from %s", pdf_path)
            return []

        for start, end, total, images in batches:
            content: list[dict[str, Any]] = [{"type": "text", "text": EXTRACTION_PROMPT_VISION}]
            for img_b64 in images:
                content.append({
                    "type": "image_url",
                    "image_url": {"url": f"data:image/png;base64,{img_b64}", "detail": "high"},
                })

            resp = await _create_with_retry(
                client,
                model=deployment,
                messages=[{"role": "user", "content": content}],
                response_format={"type": "json_object"},
            )
            raw = resp.choices[0].message.content or "{}"
            try:
                d = json.loads(raw)
                batch_qs = d.get("questions", []) if isinstance(d, dict) else []
                log.info("Pages %d-%d/%d: %d questions", start + 1, end, total, len(batch_qs))
                all_questions.extend(batch_qs)
            except json.JSONDecodeError:
                log.warning("Vision LLM returned non-JSON for pages %d-%d of %s", start + 1, end, pdf_path.name)

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

def _load_question_type_labels() -> dict[str, str]:
    """Maps every valid answerType (canonical key or alias) → its display label.

    Loaded from question-bank-paper-config.json — the same source the backend's
    QUESTION_TYPE_META uses — so an LBA answerType is only ever considered valid
    if the backend would actually recognize it.
    """
    config_path = Path(__file__).resolve().parents[3] / "shiksha-website" / "shiksha-backend" / "config" / "question-bank-paper-config.json"
    try:
        config = json.loads(config_path.read_text(encoding="utf-8"))
        labels: dict[str, str] = {}
        for key, item in config["questionTypes"].items():
            labels[key] = item["label"]
            for alias in item.get("aliases", []):
                labels[alias] = item["label"]
        return labels
    except (OSError, KeyError, json.JSONDecodeError) as exc:
        log.warning("Could not load question-bank-paper-config.json (%s); answerType validation disabled", exc)
        return {}


# Every answerType accepted by the backend's QUESTION_TYPE_META (config keys + aliases).
# A question whose answerType isn't in here would crash paper generation, so it's dropped instead.
_LABEL_BY_ANSWER_TYPE: dict[str, str] = _load_question_type_labels()


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
        # board + isDeleted are part of the lookup (not just the insert) so a subject shared
        # across boards (e.g. a MasterSubject already listing BSE-TG) can never match — and
        # then overwrite — a KSEEB/CBSE chapter with the same topics/standard/medium.
        lookup_filter = {
            "topics": {"$regex": f"^{dash_pattern}$", "$options": "i"},
            "standard": entry.grade,
            "medium": entry.medium.lower(),
            "subjectId": subject_id,
            "board": canonical_board,
            "isDeleted": {"$ne": True},
        }
        existing = await coll.find_one(lookup_filter, {"_id": 1, "topics": 1})
        if existing:
            chapter_id_map[unit_name] = existing["_id"]
            log.info("Matched existing chapter '%s' (_id=%s)", existing.get("topics", unit_name), existing["_id"])
        else:
            # Create new doc using the LLM-extracted name. orderNumber only applies on insert —
            # it's first-appearance order in this run's LLM output, unstable run-to-run, and
            # must never clobber a chapter's real order on a match.
            insert_filter = {
                "topics": unit_name,
                "standard": entry.grade,
                "medium": entry.medium.lower(),
                "subjectId": subject_id,
                "board": canonical_board,
            }
            await coll.update_one(
                insert_filter,
                {"$setOnInsert": {"orderNumber": chapter_num, "subTopics": [], "isDeleted": False, "learningOutcomes": []}},
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
) -> dict[str, Any] | None:
    """Returns None when the LLM's answerType doesn't map to a backend-recognized type —
    inserting it anyway would crash paper generation the first time it's selected."""
    from datetime import datetime, timezone
    raw_answer_type = q.get("answerType", "")
    answer_type = _ANSWER_TYPE_CANONICAL.get(raw_answer_type, raw_answer_type)
    if _LABEL_BY_ANSWER_TYPE and answer_type not in _LABEL_BY_ANSWER_TYPE:
        log.warning("Dropping question with unrecognized answerType %r: %.80s", raw_answer_type, q.get("question", ""))
        return None

    now = datetime.now(timezone.utc)
    subject = _SUBJECT_CANONICAL.get(entry.subject, entry.subject)
    canonical_board = _BOARD_CANONICAL.get(entry.board.lower(), entry.board)
    text = q.get("question", "")

    try:
        marks_per_question = int(q.get("marks", 1))
    except (TypeError, ValueError):
        marks_per_question = 1

    # No difficulty signal from the extraction prompt yet, so LBA questions never match
    # a difficulty filter (dao/question.dao.js only applies the filter when non-empty).
    #
    # _id must be a valid ObjectId: managers/question.bank.manager.js:310 does
    # `new ObjectId(id)` when generating a paper from selected questions (dao/question.dao.js's
    # pool query uses .lean() with no cast, so that step alone won't catch a bad _id). Truncate
    # the hash to 24 hex chars rather than emit a real ObjectId, so re-ingestion stays idempotent.
    # unitName is part of the hash input so identical boilerplate questions ("Fill in the blanks",
    # "Answer the following") in different chapters don't collide onto the same _id.
    unit_name = q.get("unitName", "")
    doc: dict[str, Any] = {
        "_id": hashlib.sha256(f"{canonical_board}|{entry.grade}|{subject}|{entry.medium.lower()}|{unit_name}|{text}".encode()).hexdigest()[:24],
        "subject": subject,
        "medium": entry.medium.lower(),
        "class": str(entry.grade),
        "year": "2024-25",
        "examType": "LBA",
        "board": canonical_board,
        "chapter": {"title": q.get("unitName", ""), "chapterNumber": chapter_number},
        "chapterId": chapter_id,
        "groupHeading": _LABEL_BY_ANSWER_TYPE.get(answer_type, answer_type),
        "answerType": answer_type,
        "difficulty": "",
        "marksPerQuestion": marks_per_question,
        "text": text,
        "keyAnswer": ", ".join(q["keyAnswer"]) if isinstance(q.get("keyAnswer"), list) else q.get("keyAnswer", ""),
        "items": [],
        "correctOrderById": [],
        "correctOrderIndices": [],
        "options": _parse_options(q.get("options", [])) if answer_type == "mcq" else [],
        "pairs": [{"left": q.get("value1", ""), "right": q.get("value2", "")}] if answer_type == "match_the_following" else [],
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

            all_docs = [
                _to_mongo_doc(
                    q,
                    entry,
                    chapter_id=chapter_id_map.get((q.get("unitName") or "").strip()),
                    chapter_number=seen_order.get((q.get("unitName") or "").strip(), 0),
                )
                for q in questions
            ]
            docs = [d for d in all_docs if d is not None]
            skipped = len(all_docs) - len(docs)
            if docs:
                from pymongo import ReplaceOne
                await collection.bulk_write([ReplaceOne({"_id": d["_id"]}, d, upsert=True) for d in docs])
                log.info("Upserted %d questions from %s (%d skipped: unrecognized answerType)", len(docs), pdf_path.name, skipped)
            else:
                log.warning("No questions extracted from %s (%d skipped: unrecognized answerType)", pdf_path.name, skipped)
            manifest.update_status(entry, "ingested")
        except Exception as exc:
            log.exception("Error ingesting %s", pdf_path.name)
            manifest.update_status(entry, "failed", error=str(exc))

        manifest.save()

    log.info("Ingestion complete.")
