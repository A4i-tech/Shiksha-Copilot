import pytest
import os
import re
from playwright.sync_api import expect
from page_objects.content_generation_page import ContentGenerationPage

BASE_URL = os.getenv("STAGING_URL")


@pytest.fixture
def content_gen(logged_in_page):
    """Local fixture to initialize the Content Generation Page Object."""
    page_obj = ContentGenerationPage(logged_in_page)
    page_obj.navigate_to_list(BASE_URL)
    return page_obj


def test_cg_navigation_lesson_plan(content_gen, logged_in_page, step):
    """
    Regression CG-01a: Verify 'Generate Lesson Plan' navigates to the correct route.
    HTML: routerLink="/user/content-generation/lesson-plan"
    """
    with step("Verify List Page Loaded"):
        # The heading or the generate buttons should be visible
        content_gen.page.wait_for_load_state("networkidle")

    with step("Click Generate Lesson Plan"):
        content_gen.click_generate_lesson_plan()

    with step("Verify URL contains lesson-plan route"):
        expect(logged_in_page).to_have_url(
            re.compile(r"content-generation/lesson-plan")
        )


def test_cg_navigation_lesson_resource(content_gen, logged_in_page, step):
    """
    Regression CG-01b: Verify 'Generate Lesson Resource' navigates to the correct route.
    HTML: routerLink="/user/content-generation/lesson-resources"
    """
    with step("Verify List Page Loaded"):
        content_gen.page.wait_for_load_state("networkidle")

    with step("Click Generate Lesson Resource"):
        content_gen.click_generate_lesson_resource()

    with step("Verify URL contains lesson-resources route"):
        expect(logged_in_page).to_have_url(
            re.compile(r"content-generation/lesson-resources")
        )


def test_cg_view_edit_page_elements(content_gen, logged_in_page, step):
    """
    Regression CG-02: Verify that clicking a content card opens the view/edit page
    with tabs and feedback section. If no cards exist, verify empty state.
    """
    with step("Check Card Count"):
        content_gen.page.wait_for_timeout(3000)  # Allow cards to render
        card_count = content_gen.get_card_count()

    if card_count == 0:
        with step("Verify Empty State"):
            expect(content_gen.no_items_msg).to_be_visible()
        return

    with step("Click First Content Card"):
        content_gen.click_first_card()
        logged_in_page.wait_for_load_state("networkidle")

    with step("Verify Tabs Present"):
        # The Documents tab should always be present
        expect(content_gen.documents_tab).to_be_visible()

    with step("Verify Feedback Section"):
        expect(content_gen.feedback_heading).to_be_visible()
        expect(content_gen.feedback_textarea).to_be_visible()


def test_cg_documents_tab(content_gen, logged_in_page, step):
    """
    Regression CG-03: Verify Documents tab renders download cards.
    If no cards exist on the list, skip gracefully.
    """
    with step("Check Card Count"):
        content_gen.page.wait_for_timeout(3000)
        card_count = content_gen.get_card_count()

    if card_count == 0:
        with step("Skip — No Content Cards Available"):
            pytest.skip("No content cards available for documents tab test")

    with step("Click First Content Card"):
        content_gen.click_first_card()
        logged_in_page.wait_for_load_state("networkidle")

    with step("Switch to Documents Tab"):
        content_gen.switch_to_documents_tab()

    with step("Verify Document Download Elements"):
        # In 'view' mode: download buttons visible
        # In 'draft' mode: warning message visible
        has_downloads = content_gen.download_buttons.count() > 0
        has_warning = content_gen.documents_warning.is_visible()
        assert has_downloads or has_warning, (
            "Documents tab should show either download buttons or a warning message"
        )
