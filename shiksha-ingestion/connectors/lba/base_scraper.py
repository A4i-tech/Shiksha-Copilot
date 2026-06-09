from __future__ import annotations
from abc import ABC, abstractmethod
from dataclasses import asdict, dataclass
from pathlib import Path
from typing import Any
import httpx

SUBJECTS = ["maths", "science", "social_studies", "english"]
GRADES = list(range(5, 11))

@dataclass
class PDFEntry:
    board: str
    grade: int
    subject: str
    medium: str
    source_url: str
    local_path: str
    status: str = "pending"
    downloaded_at: str | None = None
    error: str | None = None

    def to_dict(self) -> dict[str, Any]:
        return asdict(self)

    @classmethod
    def from_dict(cls, d: dict[str, Any]) -> PDFEntry:
        return cls(**d)

class BaseLBAScraper(ABC):
    SUBJECTS = SUBJECTS
    GRADES = GRADES

    @abstractmethod
    async def discover_pdfs(self) -> list[PDFEntry]: ...

    async def download_all(self, output_dir: Path) -> list[PDFEntry]:
        entries = await self.discover_pdfs()
        async with httpx.AsyncClient(follow_redirects=True, timeout=60) as client:
            for entry in entries:
                dest = output_dir / entry.local_path
                if dest.exists():
                    entry.status = "downloaded"
                    continue
                dest.parent.mkdir(parents=True, exist_ok=True)
                try:
                    resp = await client.get(entry.source_url)
                    resp.raise_for_status()
                    dest.write_bytes(resp.content)
                    entry.status = "downloaded"
                except Exception as exc:
                    entry.status = "failed"
                    entry.error = str(exc)
        return entries
