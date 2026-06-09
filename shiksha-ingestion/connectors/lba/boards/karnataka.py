from __future__ import annotations

import re
import httpx
from bs4 import BeautifulSoup

from ..base_scraper import BaseLBAScraper, PDFEntry

BASE_URL = "https://textbooks.karnataka.gov.in"
EBOOKS_URL = f"{BASE_URL}/textbooks/en/1000"

SUBJECT_PATTERNS: list[tuple[re.Pattern, str]] = [
    (re.compile(r"\bmath\b|\bmathematic", re.I), "maths"),
    (re.compile(r"\bscience\b", re.I), "science"),
    (re.compile(r"\bsocial\b", re.I), "social_studies"),
    (re.compile(r"\benglish\b", re.I), "english"),
]

TARGET_GRADES = set(range(5, 11))
TARGET_SUBJECTS = {"maths", "science", "social_studies", "english"}
TARGET_MEDIUMS = {"english", "kannada"}


def _normalise_subject(text: str) -> str | None:
    for pattern, subject in SUBJECT_PATTERNS:
        if pattern.search(text):
            return subject
    return None


def _detect_medium(combined: str) -> str | None:
    if "kannada" in combined or "_km_" in combined or "km_" in combined or "/km" in combined:
        return "kannada"
    if "english" in combined or "_em_" in combined or "em_" in combined or "/em" in combined:
        return "english"
    return None


def _resolve_url(href: str) -> str:
    href = href.strip().replace("\\", "/")
    if href.startswith("http"):
        return href
    return BASE_URL + "/" + href.lstrip("/")


class KarnatakaScraper(BaseLBAScraper):
    async def discover_pdfs(self) -> list[PDFEntry]:
        async with httpx.AsyncClient(follow_redirects=True, timeout=30) as client:
            resp = await client.get(EBOOKS_URL)
            resp.raise_for_status()
            html = resp.text

        soup = BeautifulSoup(html, "html.parser")
        entries: list[PDFEntry] = []
        seen: set[tuple] = set()

        for row in soup.find_all("tr"):
            cells = row.find_all("td")
            if not cells:
                continue

            grade_match = re.search(r"\b(\d+)\b", cells[0].get_text())
            if not grade_match:
                continue
            grade = int(grade_match.group(1))
            if grade not in TARGET_GRADES:
                continue

            for a in row.find_all("a", href=True):
                href = a["href"]
                if not href.lower().endswith(".pdf"):
                    continue

                link_text = a.get_text(strip=True)
                subject = _normalise_subject(link_text)
                if subject not in TARGET_SUBJECTS:
                    continue

                combined = (link_text + " " + href).lower()
                medium = _detect_medium(combined)
                if medium not in TARGET_MEDIUMS:
                    continue

                key = (grade, subject, medium)
                if key in seen:
                    continue
                seen.add(key)

                url = _resolve_url(href)
                local_path = f"data/karnataka/{grade}th/{medium}/{subject}.pdf"
                entries.append(PDFEntry(
                    board="karnataka",
                    grade=grade,
                    subject=subject,
                    medium=medium,
                    source_url=url,
                    local_path=local_path,
                ))

        return entries
