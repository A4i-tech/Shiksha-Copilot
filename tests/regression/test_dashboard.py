import pytest
import os
from page_objects.dashboard_page import DashboardPage

BASE_URL = os.getenv("FRONTEND_URL")

@pytest.fixture
def dashboard(logged_in_page):
    """Local fixture to initialize the Dashboard Page Object."""
    page_obj = DashboardPage(logged_in_page)
    page_obj.load(BASE_URL)
    return page_obj

def test_dashboard_initial_rendering(dashboard, step):
    """Regression: Verify critical dashboard components render correctly."""
    from playwright.sync_api import expect
    
    with step("Check Welcome Section"):
        expect(dashboard.welcome_header).to_contain_text("Hi")
        expect(dashboard.teacher_toolkit_subtitle).to_be_visible()
    
    with step("Check Main Landing Card"):
        expect(dashboard.landing_card_title).to_contain_text("Lesson Plan Generation")
        expect(dashboard.generate_lesson_plan_btn).to_be_visible()
    
    with step("Check Analytics and Calendar"):
        expect(dashboard.chart_canvas).to_be_visible()
        expect(dashboard.calendar_month_view).to_be_visible()



def test_navigation_to_content_generation(dashboard, logged_in_page, step):
    """Regression: Verify the Generate button redirects to the correct sub-route."""
    from playwright.sync_api import expect
    import re
    
    with step("Click Generate Lesson Plan"):
        dashboard.click_generate_lesson_plan()
    
    with step("Verify Redirection"):
        # Expect URL to contain "content-generation/lesson-plan"
        expect(logged_in_page).to_have_url(re.compile(r"content-generation/lesson-plan"))
    
    with step("Navigate Back to Dashboard"):
        dashboard.load(BASE_URL)



def test_calendar_month_navigation(dashboard, step):
    """Regression: Verify calendar month navigation updates the display month."""
    from playwright.sync_api import expect
    
    with step("Get Initial Month"):
        initial_month = dashboard.current_month_display.text_content()
    
    with step("Navigate to Next Month"):
        dashboard.navigate_next_month()
    
    with step("Verify Month Changed"):
        # Verify the text content has changed to a different month/year
        new_month = dashboard.current_month_display.text_content()
        assert initial_month != new_month

def test_schedule_navigation(dashboard, logged_in_page, step):
    """Regression: Verify the My Schedule button redirects correctly."""
    from playwright.sync_api import expect
    import re
    
    with step("Click My Schedule"):
        dashboard.click_my_schedule()
    
    with step("Verify Redirection to Schedule"):
        expect(logged_in_page).to_have_url(re.compile(r"user/schedule"))
    
    with step("Navigate Back to Dashboard"):
        dashboard.load(BASE_URL)

