import pytest
from pathlib import Path
from connectors.lba.boards.telangana import TelanganaScraperFromHTML
from connectors.lba.base_scraper import PDFEntry

FIXTURE = Path(__file__).parent / "fixtures" / "telangana_ebooks.html"


def test_discover_pdfs_from_html_returns_entries():
    html = FIXTURE.read_text(encoding="utf-8", errors="replace")
    scraper = TelanganaScraperFromHTML(html)
    entries = scraper.parse()
    assert len(entries) > 0
    assert all(isinstance(e, PDFEntry) for e in entries)
    assert all(e.board == "telangana" for e in entries)


def test_discover_pdfs_covers_target_grades():
    html = FIXTURE.read_text(encoding="utf-8", errors="replace")
    scraper = TelanganaScraperFromHTML(html)
    entries = scraper.parse()
    grades_found = {e.grade for e in entries}
    assert grades_found.issuperset({5, 6, 7, 8, 9, 10})


def test_discover_pdfs_covers_both_mediums():
    html = FIXTURE.read_text(encoding="utf-8", errors="replace")
    scraper = TelanganaScraperFromHTML(html)
    entries = scraper.parse()
    mediums_found = {e.medium for e in entries}
    assert "english" in mediums_found
    assert "telugu" in mediums_found


def test_local_path_format():
    html = FIXTURE.read_text(encoding="utf-8", errors="replace")
    scraper = TelanganaScraperFromHTML(html)
    entries = scraper.parse()
    for e in entries:
        assert e.local_path.startswith("data/telangana/")
        assert e.local_path.endswith(".pdf")


def test_source_urls_are_absolute():
    html = FIXTURE.read_text(encoding="utf-8", errors="replace")
    scraper = TelanganaScraperFromHTML(html)
    entries = scraper.parse()
    for e in entries:
        assert e.source_url.startswith("https://")
