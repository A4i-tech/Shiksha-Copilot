import pytest
from connectors.lba.base_scraper import PDFEntry, BaseLBAScraper
from pathlib import Path


def test_pdf_entry_defaults():
    entry = PDFEntry(
        board="karnataka",
        grade=6,
        subject="maths",
        medium="english",
        source_url="https://example.com/maths.pdf",
        local_path="data/karnataka/6th/english/maths.pdf",
    )
    assert entry.status == "pending"
    assert entry.downloaded_at is None
    assert entry.error is None


def test_pdf_entry_to_dict_roundtrip():
    entry = PDFEntry(
        board="telangana",
        grade=9,
        subject="science",
        medium="telugu",
        source_url="https://example.com/sci.pdf",
        local_path="data/telangana/9th/telugu/science.pdf",
        status="downloaded",
    )
    d = entry.to_dict()
    restored = PDFEntry.from_dict(d)
    assert restored.board == entry.board
    assert restored.grade == entry.grade
    assert restored.status == entry.status


def test_base_scraper_is_abstract():
    with pytest.raises(TypeError):
        BaseLBAScraper()  # cannot instantiate abstract class
