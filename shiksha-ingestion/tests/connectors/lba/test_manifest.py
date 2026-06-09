import json
import pytest
from pathlib import Path
from connectors.lba.manifest import Manifest
from connectors.lba.base_scraper import PDFEntry


def _entry(status="pending", board="karnataka", grade=6, subject="maths", medium="english"):
    return PDFEntry(
        board=board, grade=grade, subject=subject, medium=medium,
        source_url="https://example.com/x.pdf",
        local_path=f"data/{board}/{grade}th/{medium}/{subject}.pdf",
        status=status,
    )


def test_manifest_saves_and_loads(tmp_path):
    path = tmp_path / "manifest.json"
    m = Manifest(path)
    m.add(_entry("pending"))
    m.save()

    m2 = Manifest(path)
    m2.load()
    assert len(m2.entries) == 1
    assert m2.entries[0].status == "pending"


def test_entries_with_status(tmp_path):
    path = tmp_path / "manifest.json"
    m = Manifest(path)
    m.add(_entry("downloaded"))
    m.add(_entry("failed", grade=7))
    m.add(_entry("ingested", grade=8))

    result = m.entries_with_status("downloaded", "failed")
    assert len(result) == 2
    assert all(e.status in ("downloaded", "failed") for e in result)


def test_update_status(tmp_path):
    path = tmp_path / "manifest.json"
    m = Manifest(path)
    entry = _entry("downloaded")
    m.add(entry)
    m.update_status(entry, "ingested")
    assert m.entries[0].status == "ingested"


def test_load_missing_file_starts_empty(tmp_path):
    path = tmp_path / "does_not_exist.json"
    m = Manifest(path)
    m.load()
    assert m.entries == []


def test_no_duplicate_entries(tmp_path):
    path = tmp_path / "manifest.json"
    m = Manifest(path)
    e = _entry()
    m.add(e)
    m.add(e)  # same entry again
    assert len(m.entries) == 1
