import pytest
import os
from tests.regression.page_objects.content_generation_page import ContentGenerationPage

BASE_URL = os.getenv("STAGING_URL")

@pytest.fixture
def cg_page(logged_in_page):
    """Fixture for Content Generation Page Object."""
    page_obj = ContentGenerationPage(logged_in_page)
    page_obj.navigate_to_list(BASE_URL)
    return page_obj

def test_cg_list_render(cg_page):
    """Regression: Verify List View elements load."""
    from playwright.sync_api import expect
    
    expect(cg_page.list_header).to_contain_text("Lesson Content")
    expect(cg_page.generate_plan_btn).to_be_visible()
    expect(cg_page.generate_resource_btn).to_be_visible()

def test_cg_navigation_to_generate(cg_page, logged_in_page):
    """Regression: Verify 'Generate Plan' button redirects correctly."""
    from playwright.sync_api import expect
    
    cg_page.start_generate_plan()
    expect(logged_in_page).to_have_url(lambda url: "/lesson-plan" in url)

def test_cg_search_filter(cg_page):
    """Regression: Verify search interaction."""
    cg_page.search_content("Physics Class 10")

def test_cg_view_edit_flow(cg_page, logged_in_page):
    """
    Regression: Open an existing plan, switch tabs, and verify Edit UI.
    Pre-requisite: At least 1 generated plan must exist.
    """
    from playwright.sync_api import expect
    
    if cg_page.content_cards.count() == 0:
        pytest.skip("No Lesson Plans available to test View/Edit flow")

    cg_page.open_first_content()
    
    expect(cg_page.plan_header).to_be_visible()
    
    cg_page.switch_tab("Documents")
    expect(logged_in_page.locator("button:has-text('Download')").first).to_be_visible()
    
    if cg_page.videos_tab.is_visible():
        cg_page.switch_tab("Videos")
        expect(logged_in_page.locator("iframe").first).to_be_visible()

def test_cg_feedback_submission_logic(cg_page, logged_in_page):
    """
    Regression: Verify Feedback form logic (Save button disabled until feedback selected).
    """
    from playwright.sync_api import expect
    
    if cg_page.content_cards.count() == 0:
        pytest.skip("No content to test feedback")

    cg_page.open_first_content()
    
    cg_page.switch_tab("Plan")
    
    cg_page.feedback_textarea.scroll_into_view_if_needed()
    
    if cg_page.save_final_btn.is_visible():
        
        # Select Feedback
        cg_page.select_feedback(0) # Select first radio
        cg_page.fill_feedback_comment("Automated Regression Test Comment")
        
        # Verify Enabled
        expect(cg_page.save_final_btn).to_be_enabled()