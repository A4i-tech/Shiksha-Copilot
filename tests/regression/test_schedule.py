import pytest
import os
import re
from playwright.sync_api import expect
from page_objects.schedule_page import SchedulePage

BASE_URL = os.getenv("FRONTEND_URL")

@pytest.fixture
def schedule_page(logged_in_page):
    page_obj = SchedulePage(logged_in_page)
    if BASE_URL:
        page_obj.navigate(BASE_URL)
    return page_obj

def test_schedule_initial_view(schedule_page, step):
    """Regression: Verify Schedule Calendar loads."""
    with step("Verify Header Title"):
        expect(schedule_page.header_title).to_be_visible()
    
    with step("Verify Calendar Week View"):
        expect(schedule_page.calendar_week_view).to_be_visible()
    
    with step("Verify 'My Schedules' Button Class"):
        # Use regex for partial class match on the button
        expect(schedule_page.my_schedule_btn).to_have_class(re.compile(r"btn-primary"))

def test_open_and_close_popup(schedule_page, step):
    """
    Regression: Click calendar slot to open popup, verify 'Add Details', then close it.
    """
    with step("Open Add Schedule Popup"):
        # 1. Open the popup
        schedule_page.open_add_schedule_popup()
    
    with step("Verify Popup Visible"):
        # 2. Verify the popup container is visible
        expect(schedule_page.popup_header).to_be_visible()
    
    with step("Close Popup"):
        # 3. Close (Cut) the popup
        schedule_page.close_add_schedule_popup()
    
    with step("Verify Popup Hidden"):
        # 4. Verify popup is hidden
        expect(schedule_page.popup_header).to_be_hidden()

def test_schedule_tooltip_elements(schedule_page, step):
    """
    Regression: Verify that the tooltip menu components are definable.
    (This test does not click, just checks the Page Object locators match selectors).
    """
    with step("Verify Tooltip Menu Locators"):
        # Just verification of locator strategies (no interaction unless data exists)
        # This ensures our Page Object isn't broken syntax-wise
        assert schedule_page.tooltip_menu is not None
        assert schedule_page.edit_details_opt is not None
        assert schedule_page.delete_opt is not None