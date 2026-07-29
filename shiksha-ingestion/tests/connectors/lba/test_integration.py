"""
Integration test: one real PDF through extraction pipeline end-to-end.
Skipped unless env var LBA_INTEGRATION_TEST=1 is set.
"""
import os
import pytest
from pathlib import Path
from unittest.mock import AsyncMock, MagicMock

pytestmark = pytest.mark.skipif(
    os.environ.get("LBA_INTEGRATION_TEST") != "1",
    reason="Set LBA_INTEGRATION_TEST=1 to run integration tests",
)


@pytest.mark.asyncio
async def test_ingest_single_pdf(tmp_path):
    from connectors.lba.manifest import Manifest
    from connectors.lba.base_scraper import PDFEntry
    from connectors.lba.ingest import run_ingestion

    entry = PDFEntry(
        board="telangana",
        grade=5,
        subject="maths",
        medium="telugu",
        source_url="https://scert.telangana.gov.in/pdf/publication/ebooks2019/5TM_MAT.pdf",
        local_path=str(tmp_path / "5th" / "telugu" / "maths.pdf"),
        status="pending",
    )

    import httpx
    pdf_path = Path(entry.local_path)
    pdf_path.parent.mkdir(parents=True, exist_ok=True)
    async with httpx.AsyncClient(follow_redirects=True, timeout=60) as client:
        resp = await client.get(entry.source_url)
        resp.raise_for_status()
        pdf_path.write_bytes(resp.content)
    entry.status = "downloaded"

    manifest = Manifest(tmp_path / "manifest.json")
    manifest.add(entry)

    # run_ingestion(manifest, mongo_db, ...) takes a database handle, not a collection —
    # it does mongo_db["lba_questions"], mongo_db["chapters"], mongo_db["mastersubjects"].
    # Give each its own mock so assertions target what the code actually calls.
    mock_lba_questions = AsyncMock()
    mock_chapters = AsyncMock()
    mock_chapters.find_one = AsyncMock(return_value={"_id": "existing-chapter-id", "topics": "unit"})
    mock_mastersubjects = AsyncMock()
    mock_mastersubjects.find_one = AsyncMock(return_value={"_id": "existing-subject-id"})

    collections = {"lba_questions": mock_lba_questions, "chapters": mock_chapters, "mastersubjects": mock_mastersubjects}
    mock_db = MagicMock()
    mock_db.__getitem__ = MagicMock(side_effect=collections.__getitem__)

    await run_ingestion(manifest, mock_db)

    updated = manifest.entries_with_status("ingested")
    assert len(updated) == 1, (
        f"Expected ingested, got: {manifest.entries[0].status} / {manifest.entries[0].error}"
    )
    mock_lba_questions.bulk_write.assert_called()
