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


# Confirmed-working PDF URLs on SCERT Telangana (verified via HEAD requests).
# Pattern: https://scert.telangana.gov.in/pdf/publication/ebooks2019/<grade>th class <subject> <medium>.pdf
# Only grades 5-7 maths confirmed available; other subjects/grades return HTML 404.
PDF_BASE = f"{BASE_URL}/pdf/publication/ebooks2019"

# (grade, subject, medium_label, medium_key)
_CONFIRMED_PDFS: list[tuple[int, str, str, str]] = [
    (5, "maths", "em", "english"),
    (5, "maths", "tm", "telugu"),
    (6, "maths", "em", "english"),
    (6, "maths", "tm", "telugu"),
    (7, "maths", "em", "english"),
    (7, "maths", "tm", "telugu"),
]


class TelanganaScraperLive(BaseLBAScraper):
    """Builds PDF entries from confirmed Telangana SCERT URLs.

    Avoids Playwright — the SCERT page redirects to home via encrypted params.
    Only includes PDFs verified to exist (content-type: application/pdf).
    Add entries to _CONFIRMED_PDFS as more URLs are discovered.
    """

    async def discover_pdfs(self) -> list[PDFEntry]:
        entries: list[PDFEntry] = []
        for grade, subject, med_label, med_key in _CONFIRMED_PDFS:
            url = f"{PDF_BASE}/{grade}th%20class%20{subject}%20{med_label}.pdf"
            local_path = f"data/telangana/{grade}th/{med_key}/{subject}.pdf"
            entries.append(PDFEntry(
                board="telangana",
                grade=grade,
                subject=subject,
                medium=med_key,
                source_url=url,
                local_path=local_path,
            ))
        return entries
