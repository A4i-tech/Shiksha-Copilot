from __future__ import annotations

import re
from bs4 import BeautifulSoup
from playwright.async_api import async_playwright

from ..base_scraper import BaseLBAScraper, PDFEntry

BASE_URL = "https://scert.telangana.gov.in"
EBOOKS_URL = f"{BASE_URL}/DisplayContent.aspx?encry=ammkNW4/gx+NeApstGPX+A=="

SUBJECT_PATTERNS: list[tuple[re.Pattern, str]] = [
    (re.compile(r"\bmat\b|\bmaths?\b|\bmathematic", re.I), "maths"),
    (re.compile(r"\bsci\b|\bscience\b|\bphy\b|\bbio\b", re.I), "science"),
    (re.compile(r"\bsoc\b|\bsocial\b", re.I), "social_studies"),
    (re.compile(r"\beng\b|\benglish\b", re.I), "english"),
]

TARGET_GRADES = set(range(5, 11))
TARGET_SUBJECTS = {"maths", "science", "social_studies", "english"}
TARGET_MEDIUMS = {"english", "telugu"}


def _normalise_subject(text: str) -> str | None:
    for pattern, subject in SUBJECT_PATTERNS:
        if pattern.search(text):
            return subject
    return None


def _detect_medium(combined: str) -> str | None:
    if "tm_" in combined or "_tm" in combined or "telugu" in combined:
        return "telugu"
    if "em_" in combined or "_em" in combined or "english" in combined:
        return "english"
    return None


def _resolve_url(href: str) -> str:
    href = href.strip().replace("\\", "/")
    if href.startswith("http"):
        return href
    return BASE_URL + "/" + href.lstrip("./")


class TelanganaScraperFromHTML:
    """Parses pre-fetched HTML. Used directly in tests and by TelanganaScraperLive."""

    def __init__(self, html: str) -> None:
        self.html = html

    def parse(self) -> list[PDFEntry]:
        soup = BeautifulSoup(self.html, "html.parser")
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
                local_path = f"data/telangana/{grade}th/{medium}/{subject}.pdf"
                entries.append(PDFEntry(
                    board="telangana",
                    grade=grade,
                    subject=subject,
                    medium=medium,
                    source_url=url,
                    local_path=local_path,
                ))

        return entries


# Known PDF URL pattern: https://scert.telangana.gov.in/pdf/publication/ebooks2019/<code>.pdf
# Code = <grade><medium_code>_<subject_code>
# Medium codes: TM = Telugu, EM = English
# Subject codes: MAT, SCI, SOC, ENG
# Grade 5 has no Science/Social (only Maths + English)
PDF_BASE = f"{BASE_URL}/pdf/publication/ebooks2019"

_SUBJECT_CODE = {
    "maths": "MAT",
    "science": "SCI",
    "social_studies": "SOC",
    "english": "ENG",
}
_MEDIUM_CODE = {"telugu": "TM", "english": "EM"}

# Subjects available per grade
_GRADE_SUBJECTS: dict[int, list[str]] = {
    5: ["maths", "english"],
    6: ["maths", "science", "social_studies", "english"],
    7: ["maths", "science", "social_studies", "english"],
    8: ["maths", "science", "social_studies", "english"],
    9: ["maths", "science", "social_studies", "english"],
    10: ["maths", "science", "social_studies", "english"],
}


class TelanganaScraperLive(BaseLBAScraper):
    """Builds PDF entries from known Telangana SCERT URL pattern.

    Avoids Playwright dependency — the SCERT page uses encrypted params
    that redirect to home; PDF URLs follow a stable pattern instead.
    """

    async def discover_pdfs(self) -> list[PDFEntry]:
        entries: list[PDFEntry] = []
        for grade, subjects in _GRADE_SUBJECTS.items():
            for subject in subjects:
                for medium in ("telugu", "english"):
                    code = f"{grade}{_MEDIUM_CODE[medium]}_{_SUBJECT_CODE[subject]}"
                    url = f"{PDF_BASE}/{code}.pdf"
                    local_path = f"data/telangana/{grade}th/{medium}/{subject}.pdf"
                    entries.append(PDFEntry(
                        board="telangana",
                        grade=grade,
                        subject=subject,
                        medium=medium,
                        source_url=url,
                        local_path=local_path,
                    ))
        return entries
