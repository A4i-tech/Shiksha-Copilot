import pytest
import os
from playwright.sync_api import expect
from page_objects.generation_status_page import GenerationStatusPage

BASE_URL = os.getenv("FRONTEND_URL")

# Status values from lesson-content-list.component.html template
KNOWN_STATUSES = {"running", "completed", "failed", "regenerated"}


@pytest.fixture
def gen_status(logged_in_page):
    page_obj = GenerationStatusPage(logged_in_page)
    page_obj.navigate(BASE_URL)
    return page_obj


def test_status_list_renders(gen_status, step):
    """
    Regression GS-01: Page loads, 'Generation Status' heading visible,
    cards present OR empty state shown.
    """
    with step("Verify heading visible"):
        expect(gen_status.heading).to_be_visible(timeout=10000)

    with step("Verify cards or empty state"):
        gen_status.page.wait_for_timeout(2000)
        card_count = gen_status.get_card_count()
        if card_count == 0:
            expect(gen_status.empty_msg).to_be_visible()
        else:
            assert card_count > 0


def test_status_badge_types(gen_status, step):
    """
    Regression GS-02: Status badges show recognized values when jobs exist;
    empty state container renders correctly when no jobs.
    Template shows badge only when item.isCompleted is false.
    Status values: running / completed / failed / regenerated.
    """
    with step("Check card count"):
        gen_status.page.wait_for_timeout(2000)
        card_count = gen_status.get_card_count()

    if card_count == 0:
        with step("Verify empty state container structure"):
            empty_container = gen_status.page.locator("div.rounded-xl.bg-white.border")
            expect(empty_container.first).to_be_visible()
            expect(gen_status.empty_msg).to_be_visible()
        return

    with step("Collect badge texts"):
        badge_texts = gen_status.get_badge_texts()

    with step("Verify recognized status values or no badges (all completed)"):
        # Badges only render when item.isCompleted === false.
        # If all items are fully completed, no badges appear — that is valid.
        normalized = {t.lower() for t in badge_texts if t.strip()}
        unrecognized = normalized - KNOWN_STATUSES
        assert not unrecognized, (
            f"Unrecognized status badge text found: {unrecognized}"
        )


def test_status_header_icon_renders(gen_status, step):
    """
    Regression GS-03: Generation status header icon renders with active (border-primary) state
    when on the generation status page.
    """
    with step("Verify header icon is visible and active"):
        header_icon = gen_status.page.locator(
            "a[href*='generation-status'].border-primary"
        )
        expect(header_icon).to_be_visible(timeout=5000)
