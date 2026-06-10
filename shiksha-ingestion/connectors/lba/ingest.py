from __future__ import annotations

import json
import logging
from pathlib import Path
from typing import Any

from .base_scraper import PDFEntry
from .manifest import Manifest

log = logging.getLogger(__name__)

EXTRACTION_PROMPT = """Extract all assessment questions from this state board textbook content.
For each question return a JSON object with EXACTLY these fields:
- answerType: one of "mcq", "fill_in_the_blank", "answer_very_short", "answer_short", "answer_medium", "answer_long", "matching"
- question: full question text
- options: list of option strings with labels e.g. ["A. Rome", "B. Delhi"] (MCQ only; empty list otherwise)
- value1: left-side item text (MATCHING only; omit for other types)
- value2: right-side matching text (MATCHING only; omit for other types)
- keyAnswer: correct answer string
- marks: marks allocated as integer (default 1 if not shown)
- unitName: chapter or lesson name visible near this question group
- objective: learning objective text if explicitly stated (omit if absent)

Return {{"questions": [...]}}. If no questions found return {{"questions": []}}.

Content:
{text}"""


async def _pdf_to_markdown(pdf_path: Path) -> str:
    # Try OmniIngest first; fall back to pymupdf for direct text extraction
    try:
        from omni_ingest.agent.cleaning import MarkdownCleaningAgent
        from omni_ingest.core.model import IngestionContext
        agent = MarkdownCleaningAgent()
        ctx = IngestionContext(resource=pdf_path, domain_profile="education_lba")
        await agent.run(ctx)
        if ctx.text:
            return ctx.text
    except Exception:
        pass

    try:
        import fitz  # pymupdf
        doc = fitz.open(str(pdf_path))
        pages = [page.get_text() for page in doc]
        doc.close()
        return "\n\n".join(pages)
    except Exception as exc:
        log.warning("pymupdf extraction failed for %s: %s", pdf_path, exc)
        return ""


async def _extract_questions(markdown: str, board: str) -> list[dict[str, Any]]:
    import os
    from openai import AsyncAzureOpenAI
    client = AsyncAzureOpenAI(
        api_key=os.environ["AZURE_OPENAI_API_KEY"],
        azure_endpoint=os.environ["AZURE_OPENAI_ENDPOINT"],
        api_version=os.environ.get("AZURE_OPENAI_API_VERSION", "2025-04-01-preview"),
    )
    deployment = os.environ.get("AZURE_OPENAI_DEPLOYMENT_NAME", "gpt-4o")
    resp = await client.chat.completions.create(
        model=deployment,
        messages=[{"role": "user", "content": EXTRACTION_PROMPT.format(text=markdown[:8000])}],
        response_format={"type": "json_object"},
    )
    raw = resp.choices[0].message.content or "{}"
    try:
        data = json.loads(raw)
        return data.get("questions", []) if isinstance(data, dict) else []
    except json.JSONDecodeError:
        log.warning("LLM returned non-JSON for board=%s", board)
        return []


def _to_mongo_doc(q: dict[str, Any], entry: PDFEntry) -> dict[str, Any]:
    doc: dict[str, Any] = {
        "board": entry.board,
        "subject": entry.subject,
        "medium": entry.medium,
        "class": str(entry.grade),
        "answerType": q.get("answerType", ""),
        "question": q.get("question", ""),
        "keyAnswer": q.get("keyAnswer", ""),
        "marks": q.get("marks", 1),
        "unitName": q.get("unitName", ""),
    }
    if q.get("objective"):
        doc["objective"] = q["objective"]
    answer_type = q.get("answerType", "")
    if answer_type == "mcq":
        doc["options"] = q.get("options", [])
    if answer_type == "matching":
        doc["value1"] = q.get("value1", "")
        doc["value2"] = q.get("value2", "")
    return doc


async def run_ingestion(manifest: Manifest, mongo_collection) -> None:
    """Extract questions from downloaded PDFs and insert into MongoDB."""
    pending = manifest.entries_with_status("downloaded", "failed")
    log.info("Entries to ingest: %d", len(pending))

    for entry in pending:
        pdf_path = Path(entry.local_path)
        if not pdf_path.exists():
            log.warning("PDF not found: %s", pdf_path)
            manifest.update_status(entry, "failed", error="PDF file missing")
            manifest.save()
            continue

        log.info("Ingesting %s", pdf_path)
        try:
            markdown = await _pdf_to_markdown(pdf_path)
            if not markdown:
                raise ValueError("Empty markdown — PDF may be image-based or corrupt")

            questions = await _extract_questions(markdown, entry.board)
            docs = [_to_mongo_doc(q, entry) for q in questions]
            if docs:
                await mongo_collection.insert_many(docs)
                log.info("Inserted %d questions from %s", len(docs), pdf_path.name)
            else:
                log.warning("No questions extracted from %s", pdf_path.name)

            manifest.update_status(entry, "ingested")
        except Exception as exc:
            log.exception("Error ingesting %s", pdf_path.name)
            manifest.update_status(entry, "failed", error=str(exc))

        manifest.save()

    log.info("Ingestion complete.")
