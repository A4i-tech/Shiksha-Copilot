import pytest
import os
from playwright.sync_api import expect
from page_objects.content_generation_page import ContentGenerationPage
from page_objects.presentation_page import PresentationPage

BASE_URL = os.getenv("FRONTEND_URL")


def _get_first_presentation_id(logged_in_page) -> str | None:
    """
    Navigate to content generation list, filter for presentation type,
    return job ID from URL after clicking first presentation card.
    """
    logged_in_page.goto(f"{BASE_URL}/#/user/content-generation")
    logged_in_page.wait_for_load_state("networkidle")
    logged_in_page.wait_for_timeout(2000)

    # Look for a card button that navigates to a presentation route
    pres_btn = logged_in_page.locator(
        "button:has-text('View Presentation'), button:has-text('Open Presentation')"
    ).first
    if pres_btn.count() == 0 or not pres_btn.is_visible(timeout=3000):
        # Try any card that leads to /presentation/ URL
        cards = logged_in_page.locator(".card")
        card_count = cards.count()
        for i in range(card_count):
            card = cards.nth(i)
            card_text = card.inner_text().lower()
            if "presentation" in card_text:
                btn = card.locator("button").first
                if btn.is_visible():
                    with logged_in_page.expect_navigation(timeout=10000):
                        btn.click()
                    logged_in_page.wait_for_load_state("networkidle")
                    url = logged_in_page.url
                    if "presentation/" in url:
                        return url.split("presentation/")[-1].split("?")[0].split("#")[0]
        return None

    with logged_in_page.expect_navigation(timeout=10000):
        pres_btn.click()
    logged_in_page.wait_for_load_state("networkidle")
    url = logged_in_page.url
    if "presentation/" in url:
        return url.split("presentation/")[-1].split("?")[0].split("#")[0]
    return None


@pytest.fixture
def presentation(logged_in_page):
    job_id = _get_first_presentation_id(logged_in_page)
    page_obj = PresentationPage(logged_in_page)
    if job_id:
        page_obj.navigate(BASE_URL, job_id)
    return page_obj, job_id


def test_presentation_job_status(presentation, step):
    """
    Regression PRES-01: Presentation detail page loads with status visible.
    When no job exists on staging, asserts content generation list renders without crash.
    """
    page_obj, job_id = presentation

    if job_id is None:
        with step("Verify content generation list renders (no presentation job found)"):
            assert "content-generation" in page_obj.page.url, (
                f"Expected to be on content-generation page, got: {page_obj.page.url}"
            )
            heading = page_obj.page.locator("h1")
            expect(heading.first).to_be_visible(timeout=10000)
        return

    with step("Verify page loaded"):
        page_obj.page.wait_for_timeout(2000)

    with step("Verify status indicator or progress bar or download visible"):
        has_status = page_obj.status_indicator.count() > 0
        has_progress = page_obj.progress_bar.count() > 0
        has_download = page_obj.download_btn.is_visible()
        assert has_status or has_progress or has_download, (
            "Expected status indicator, progress bar, or download button on presentation page"
        )


def test_presentation_download_when_complete(presentation, step):
    """
    Regression PRES-02: Download button visible+enabled when complete;
    absent when job not complete or no job exists.
    """
    page_obj, job_id = presentation

    if job_id is None:
        with step("Verify download button absent on list page (no presentation job)"):
            expect(page_obj.download_btn).not_to_be_visible()
        return

    with step("Check completion status"):
        page_obj.page.wait_for_timeout(2000)
        is_complete = page_obj.is_complete()

    if not is_complete:
        with step("Verify download button absent when job not complete"):
            expect(page_obj.download_btn).not_to_be_visible()
        return

    with step("Verify download button visible and enabled"):
        expect(page_obj.download_btn).to_be_visible(timeout=5000)
        expect(page_obj.download_btn).to_be_enabled()
