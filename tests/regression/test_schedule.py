import pytest
import os
from datetime import datetime, timedelta
from tests.regression.page_objects.schedule_page import SchedulePage

BASE_URL = os.getenv("STAGING_URL")

TEST_BOARD = os.getenv("TEST_SCHED_BOARD", "CBSE")
TEST_MEDIUM = os.getenv("TEST_SCHED_MEDIUM", "English")
TEST_CLASS = os.getenv("TEST_SCHED_CLASS", "Class 10")
TEST_SUBJECT = os.getenv("TEST_SCHED_SUBJECT", "Science")

@pytest.fixture
def schedule_page(logged_in_page):
    page_obj = SchedulePage(logged_in_page)
    page_obj.navigate(BASE_URL)
    return page_obj

def test_schedule_initial_view(schedule_page):
    """Regression: Verify Schedule Calendar loads."""
    from playwright.sync_api import expect
    
    expect(schedule_page.header_title).to_be_visible()
    expect(schedule_page.calendar_week_view).to_be_visible()
    
    expect(schedule_page.my_schedule_btn).to_have_class(lambda c: "btn-primary" in c)

def test_add_schedule_flow(schedule_page):
    """
    Regression: Open popup, fill details, and save a new schedule.
    """
    from playwright.sync_api import expect
    

    schedule_page.open_add_schedule_popup()
    expect(schedule_page.popup_header).to_contain_text("Add Details")
    

    try:
        schedule_page.select_dropdown("board", TEST_BOARD)
        schedule_page.select_dropdown("medium", TEST_MEDIUM)
        schedule_page.select_dropdown("className", TEST_CLASS)
        schedule_page.select_dropdown("subject", TEST_SUBJECT)
        
        tomorrow = (datetime.now() + timedelta(days=1)).strftime("%Y-%m-%d")
        schedule_page.fill_schedule_time(tomorrow, "10:00", "11:00")
        
        schedule_page.save_form()
        
        expect(schedule_page.existing_events).to_have_count(lambda c: c > 0)
        
    except Exception as e:
        pytest.fail(f"Could not fill schedule form. Check DB data. Error: {e}")

def test_edit_delete_flow(schedule_page):
    """
    Regression: Click an event, verify tooltip options, and delete.
    Pre-requisite: An event must exist.
    """
    from playwright.sync_api import expect

    if schedule_page.existing_events.count() == 0:
        pytest.skip("No existing schedules to test Edit/Delete")

    schedule_page.click_existing_event()

    expect(schedule_page.view_details_opt).to_be_visible()
    expect(schedule_page.edit_details_opt).to_be_visible()
    expect(schedule_page.delete_opt).to_be_visible()
    