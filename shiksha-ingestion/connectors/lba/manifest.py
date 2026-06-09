from __future__ import annotations

import json
from pathlib import Path

from .base_scraper import PDFEntry


class Manifest:
    def __init__(self, path: Path) -> None:
        self.path = path
        self.entries: list[PDFEntry] = []

    def load(self) -> None:
        if not self.path.exists():
            self.entries = []
            return
        data = json.loads(self.path.read_text(encoding="utf-8"))
        self.entries = [PDFEntry.from_dict(d) for d in data]

    def save(self) -> None:
        self.path.parent.mkdir(parents=True, exist_ok=True)
        self.path.write_text(
            json.dumps([e.to_dict() for e in self.entries], indent=2, ensure_ascii=False),
            encoding="utf-8",
        )

    def add(self, entry: PDFEntry) -> None:
        key = (entry.board, entry.grade, entry.subject, entry.medium)
        for existing in self.entries:
            if (existing.board, existing.grade, existing.subject, existing.medium) == key:
                return
        self.entries.append(entry)

    def entries_with_status(self, *statuses: str) -> list[PDFEntry]:
        return [e for e in self.entries if e.status in statuses]

    def update_status(self, entry: PDFEntry, status: str, error: str | None = None) -> None:
        entry.status = status
        if error is not None:
            entry.error = error
