import pytest
import os
from tests.regression.page_objects.dashboard_page import DashboardPage

BASE_URL = os.getenv("STAGING_URL")

@pytest.fixture
def dashboard(logged_in_page):
    """Local fixture to initialize the Dashboard Page Object."""
    page_obj = DashboardPage(logged_in_page)
    page_obj.load(BASE_URL)
    return page_obj

def test_dashboard_initial_rendering(dashboard):
    """Regression: Verify critical dashboard components render correctly."""
    from playwright.sync_api import expect
    
    # Check Welcome Section
    expect(dashboard.welcome_header).to_contain_text("Hi")
    expect(dashboard.teacher_toolkit_subtitle).to_be_visible()
    
    # Check Main Landing Card
    expect(dashboard.landing_card_title).to_contain_text("Lesson Plan Generation")
    expect(dashboard.generate_lesson_plan_btn).to_be_visible()
    
    # Check Analytics and Calendar visibility
    expect(dashboard.chart_canvas).to_be_visible()
    expect(dashboard.calendar_month_view).to_be_visible()

def test_navigation_to_content_generation(dashboard, logged_in_page):
    """Regression: Verify the Generate button redirects to the correct sub-route."""
    from playwright.sync_api import expect
    
    dashboard.click_generate_lesson_plan()
    expect(logged_in_page).to_have_url(lambda url: "content-generation/lesson-plan" in url)

def test_recent_plans_logic(dashboard, logged_in_page):
    """Regression: Verify the empty state or 'View All' logic for recent plans."""
    from playwright.sync_api import expect
    
    count = dashboard.get_recent_plan_count()
    
    if count == 0:
        # If no plans, verify empty state UI
        expect(dashboard.no_plans_found_container).to_be_visible()
        dashboard.empty_state_generate_btn.click()
        expect(logged_in_page).to_have_url(lambda url: "content-generation" in url)
    else:
        # If plans exist, verify 'View All' link functionality
        expect(dashboard.view_all_link).to_be_visible()
        dashboard.click_view_all()
        expect(logged_in_page).to_have_url(lambda url: "content-generation" in url)

def test_calendar_month_navigation(dashboard):
    """Regression: Verify calendar month navigation updates the display month."""
    from playwright.sync_api import expect
    
    initial_month = dashboard.current_month_display.text_content()
    dashboard.navigate_next_month()
    
    # Verify the text content has changed to a different month/year
    new_month = dashboard.current_month_display.text_content()
    assert initial_month != new_month

def test_schedule_navigation(dashboard, logged_in_page):
    """Regression: Verify the My Schedule button redirects correctly."""
    from playwright.sync_api import expect
    
    dashboard.my_schedule_btn.click()
    expect(logged_in_page).to_have_url(lambda url: "user/schedule" in url)