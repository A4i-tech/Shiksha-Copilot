import pytest
import os
from tests.regression.page_objects.profile_page import ProfilePage

BASE_URL = os.getenv("STAGING_URL")

@pytest.fixture
def profile_page(logged_in_page):
    """Fixture for Profile Page Object."""
    page_obj = ProfilePage(logged_in_page)
    page_obj.navigate(BASE_URL)
    return page_obj

def test_profile_initial_load(profile_page):
    """Regression: Verify Profile Page loads with User Data."""
    from playwright.sync_api import expect
    
    # 1. Header
    expect(profile_page.header_title).to_be_visible()
    
    name = profile_page.get_read_only_value("name")
    phone = profile_page.get_read_only_value("phone")
    
    assert len(name) > 0, "Name field should be pre-filled"
    assert len(phone) > 0, "Phone field should be pre-filled"

def test_profile_add_delete_class(profile_page):
    """Regression: Verify adding and deleting a class row."""
    from playwright.sync_api import expect
    
    initial_rows = profile_page.page.locator("table tbody tr").count()

    profile_page.add_new_class_row()
    
    expect(profile_page.page.locator("table tbody tr")).to_have_count(initial_rows + 1)
    
    profile_page.delete_class_row(initial_rows)
    
    expect(profile_page.page.locator("app-delete-detail")).to_be_visible()
    profile_page.confirm_delete_modal()
    
    expect(profile_page.page.locator("table tbody tr")).to_have_count(initial_rows)

def test_profile_save_flow(profile_page):
    """Regression: Verify Save button logic."""
    from playwright.sync_api import expect
    
    profile_page.save_changes()
    