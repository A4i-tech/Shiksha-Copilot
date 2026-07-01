from __future__ import annotations

import base64
import json
import logging
from pathlib import Path
from typing import Any

from omni_ingest.core.model import (
    IngestionContext,
    KnowledgeItem,
    ResolvedResource,
    Step,
    StepResult,
    StepStatus,
)
from omni_ingest.core.pipeline import PipelineRunner, register_step
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
    from omni_ingest.agent.cleaning import MarkdownCleaningAgent
    from omni_ingest.parser import parse

    with open(pdf_path, "rb") as f:
        raw_text, metadata = await parse(str(pdf_path), f)

    resource = ResolvedResource(uri=str(pdf_path), content=raw_text, metadata=metadata)
    ctx = IngestionContext(resource=resource, store=_NullStore())

    force_vision = medium.lower() in ("telugu", "kannada", "hindi")
    steps: list[Step] = []
    if not force_vision:
        steps.append(MarkdownCleaningAgent())
    steps.append(LBAExtractionStep(medium=medium))

    runner = PipelineRunner(steps=steps)
    await runner.run(ctx)

    return [item.metadata for item in ctx.items]


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


async def run_ingestion(manifest: Manifest, mongo_collection, data_dir: Path | None = None) -> None:
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
