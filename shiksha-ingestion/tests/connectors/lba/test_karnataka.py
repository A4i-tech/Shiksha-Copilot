import pytest
from pathlib import Path
from unittest.mock import AsyncMock, patch, MagicMock
from connectors.lba.boards.karnataka import KarnatakaScraper
from connectors.lba.base_scraper import PDFEntry

FIXTURE = Path(__file__).parent / "fixtures" / "karnataka_ebooks.html"


@pytest.mark.asyncio
async def test_discover_pdfs_returns_pdf_entries():
    html = FIXTURE.read_text(encoding="utf-8", errors="replace")
    with patch("httpx.AsyncClient") as mock_client_cls:
        mock_resp = MagicMock()
        mock_resp.text = html
        mock_resp.raise_for_status = MagicMock()
        mock_client = AsyncMock()
        mock_client.__aenter__ = AsyncMock(return_value=mock_client)
        mock_client.__aexit__ = AsyncMock(return_value=False)
        mock_client.get = AsyncMock(return_value=mock_resp)
        mock_client_cls.return_value = mock_client

        scraper = KarnatakaScraper()
        entries = await scraper.discover_pdfs()

    assert len(entries) > 0
    assert all(isinstance(e, PDFEntry) for e in entries)
    assert all(e.board == "karnataka" for e in entries)


@pytest.mark.asyncio
async def test_discover_pdfs_covers_target_grades():
    html = FIXTURE.read_text(encoding="utf-8", errors="replace")
    with patch("httpx.AsyncClient") as mock_client_cls:
        mock_resp = MagicMock()
        mock_resp.text = html
        mock_resp.raise_for_status = MagicMock()
        mock_client = AsyncMock()
        mock_client.__aenter__ = AsyncMock(return_value=mock_client)
        mock_client.__aexit__ = AsyncMock(return_value=False)
        mock_client.get = AsyncMock(return_value=mock_resp)
        mock_client_cls.return_value = mock_client

        scraper = KarnatakaScraper()
        entries = await scraper.discover_pdfs()

    grades_found = {e.grade for e in entries}
    assert grades_found.issuperset({5, 6, 7, 8, 9, 10})


@pytest.mark.asyncio
async def test_discover_pdfs_covers_both_mediums():
    html = FIXTURE.read_text(encoding="utf-8", errors="replace")
    with patch("httpx.AsyncClient") as mock_client_cls:
        mock_resp = MagicMock()
        mock_resp.text = html
        mock_resp.raise_for_status = MagicMock()
        mock_client = AsyncMock()
        mock_client.__aenter__ = AsyncMock(return_value=mock_client)
        mock_client.__aexit__ = AsyncMock(return_value=False)
        mock_client.get = AsyncMock(return_value=mock_resp)
        mock_client_cls.return_value = mock_client

        scraper = KarnatakaScraper()
        entries = await scraper.discover_pdfs()

    mediums_found = {e.medium for e in entries}
    assert "english" in mediums_found
    assert "kannada" in mediums_found


@pytest.mark.asyncio
async def test_local_path_format():
    html = FIXTURE.read_text(encoding="utf-8", errors="replace")
    with patch("httpx.AsyncClient") as mock_client_cls:
        mock_resp = MagicMock()
        mock_resp.text = html
        mock_resp.raise_for_status = MagicMock()
        mock_client = AsyncMock()
        mock_client.__aenter__ = AsyncMock(return_value=mock_client)
        mock_client.__aexit__ = AsyncMock(return_value=False)
        mock_client.get = AsyncMock(return_value=mock_resp)
        mock_client_cls.return_value = mock_client

        scraper = KarnatakaScraper()
        entries = await scraper.discover_pdfs()

    for e in entries:
        assert e.local_path.startswith("data/karnataka/")
        assert e.local_path.endswith(".pdf")
