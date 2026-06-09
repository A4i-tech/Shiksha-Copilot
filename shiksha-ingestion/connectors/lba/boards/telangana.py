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


class TelanganaScraperLive(BaseLBAScraper):
    """Live scraper — uses Playwright to fetch the page, then delegates to TelanganaScraperFromHTML."""

    async def discover_pdfs(self) -> list[PDFEntry]:
        async with async_playwright() as p:
            browser = await p.chromium.launch(headless=True)
            page = await browser.new_page()
            await page.goto(EBOOKS_URL, wait_until="networkidle", timeout=60_000)
            html = await page.content()
            await browser.close()

        return TelanganaScraperFromHTML(html).parse()
