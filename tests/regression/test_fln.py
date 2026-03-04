import pytest
import os
from playwright.sync_api import expect
from page_objects.fln_page import FlnPage

BASE_URL = os.getenv("STAGING_URL")


@pytest.fixture
def fln(logged_in_page):
    """Local fixture to initialize the FLN Page Object."""
    page_obj = FlnPage(logged_in_page)
    page_obj.navigate(BASE_URL)
    return page_obj


def test_fln_page_rendering(fln, step):
    """
    Regression FLN-01a: Verify the FLN page renders with header and grade controls.
    HTML: .fln-lessons-container only renders when grades.length > 0.
    """
    with step("Wait for Page Load"):
        fln.page.wait_for_timeout(3000)  # Allow API data to load

    with step("Check if FLN Data Available"):
        has_container = fln.container.is_visible()

    if not has_container:
        with step("Skip — No FLN Grade Data Available"):
            pytest.skip("No FLN grade data available in the system")

    with step("Verify Header"):
        expect(fln.header).to_be_visible()
        expect(fln.header).to_contain_text("FLN Teacher Resources")

    with step("Verify Grade Select"):
        expect(fln.grade_select).to_be_visible()

    with step("Verify Day Navigation Buttons"):
        expect(fln.next_day_btn).to_be_visible()
        expect(fln.prev_day_btn).to_be_visible()


def test_fln_grade_selection_and_navigation(fln, step):
    """
    Regression FLN-01b: Select a grade, verify lesson details load,
    then navigate to the next day and verify the heading updates.
    """
    with step("Wait for Page Load"):
        fln.page.wait_for_timeout(3000)

    with step("Check if FLN Data Available"):
        if not fln.container.is_visible():
            pytest.skip("No FLN grade data available in the system")

    with step("Select First Grade"):
        fln.select_grade(index=0)

    with step("Wait for Lesson to Load"):
        fln.wait_for_lesson_loaded()

    with step("Verify Lesson Details Rendered"):
        expect(fln.lesson_details).to_be_visible()
        day_text = fln.get_day_heading_text()
        assert "Day" in day_text, f"Expected 'Day' in heading, got: {day_text}"

    with step("Record Current Day"):
        initial_heading = fln.get_day_heading_text()

    with step("Click Next Day"):
        if fln.next_day_btn.is_enabled():
            fln.click_next_day()
            fln.wait_for_lesson_loaded()

            with step("Verify Day Changed"):
                new_heading = fln.get_day_heading_text()
                assert initial_heading != new_heading, (
                    f"Day heading did not change: '{initial_heading}'"
                )
        else:
            # Only one day available, skip navigation check
            pass
