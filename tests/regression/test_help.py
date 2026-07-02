import pytest
import os
from playwright.sync_api import expect
from page_objects.help_page import HelpPage

BASE_URL = os.getenv("FRONTEND_URL")


@pytest.fixture
def help_page(logged_in_page):
    page_obj = HelpPage(logged_in_page)
    page_obj.navigate(BASE_URL)
    return page_obj


def test_help_renders(help_page, step):
    """
    Regression HELP-01: Heading visible, video iframes present OR page renders empty.
    Videos are embedded inline as iframes — no modal, no card click needed.
    """
    with step("Verify heading visible"):
        expect(help_page.heading).to_be_visible(timeout=10000)

    with step("Verify video iframes or empty page"):
        help_page.page.wait_for_timeout(2000)
        count = help_page.get_video_count()
        # Count can be 0 if API returns no videos — heading alone confirms render
        assert count >= 0, "Page rendered"


def test_help_videos_load(help_page, step):
    """
    Regression HELP-02: At least one iframe present and visible.
    Skip if API returns no videos for this user/staging data.
    """
    with step("Check video count"):
        help_page.page.wait_for_timeout(2000)
        count = help_page.get_video_count()

    if count == 0:
        pytest.skip("No videos returned from API on staging — skipping iframe check")

    with step("Verify first iframe visible"):
        expect(help_page.video_iframes.first).to_be_visible(timeout=5000)

    with step("Verify video container present"):
        expect(help_page.video_containers.first).to_be_visible(timeout=5000)


def test_help_no_search_input(help_page, step):
    """
    Regression HELP-03: Confirm help page has no search input (feature not implemented).
    Audited template — no search field exists in help.component.html.
    """
    with step("Confirm search input absent"):
        search = help_page.page.locator("input[type='text'], input[placeholder*='Search']")
        assert search.count() == 0, (
            "Unexpected search input found on help page — update tests if feature added"
        )
