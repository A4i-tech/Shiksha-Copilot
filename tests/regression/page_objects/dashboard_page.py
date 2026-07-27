from .base_page import BasePage
from playwright.sync_api import Page, expect

class DashboardPage(BasePage):
    def __init__(self, page: Page):
        super().__init__(page)
        
        # Header and User Info
        self.welcome_header = page.get_by_test_id("welcome-header")
        self.teacher_toolkit_subtitle = page.get_by_test_id("teacher-toolkit-subtitle")

        # Landing Card (Lesson Plan Generation)
        self.landing_card_title = page.get_by_test_id("landing-card-title")
        self.generate_lesson_plan_btn = page.get_by_test_id("generate-lesson-plan-btn")

        # Recently Generated Section
        self.recent_plans_section = page.get_by_test_id("recent-plans-section-header")
        self.view_all_link = page.get_by_test_id("view-all-link")
        self.recent_plan_cards = page.get_by_test_id("recent-plan-card")
        self.no_plans_found_container = page.get_by_test_id("no-plans-found-container")
        self.empty_state_generate_btn = page.get_by_test_id("empty-state-generate-btn")

        # Analytics/Chart Section
        self.analytics_container = page.get_by_test_id("analytics-container")
        self.chart_canvas = page.get_by_test_id("chart-canvas")
        self.analytics_dropdown = page.get_by_test_id("analytics-dropdown")

        # Calendar Section
        self.calendar_header = page.get_by_test_id("calendar-header")
        self.current_month_display = page.get_by_test_id("current-month-display")
        self.prev_month_btn = page.get_by_test_id("prev-month-btn")
        self.next_month_btn = page.get_by_test_id("next-month-btn")
        self.calendar_month_view = page.get_by_test_id("calendar-month-view")
        self.my_schedule_btn = page.get_by_test_id("my-schedule-btn")
        self.calendar_day_view = page.get_by_test_id("calendar-day-view")

    def load(self, base_url: str):
        """Navigates to the user dashboard route."""
        self.page.goto(f"{base_url}/#/user/dashboard")
        self.welcome_header.wait_for()

    def click_generate_lesson_plan(self):
        """Clicks the generate button in the main landing card."""
        self.click_robust(self.generate_lesson_plan_btn)

    def get_recent_plan_count(self) -> int:
        """Returns the number of recently generated plan cards visible."""
        return self.recent_plan_cards.count()

    def click_view_all(self):
        """Clicks the View All link for recently generated plans."""
        self.click_robust(self.view_all_link)

    def navigate_next_month(self):
        """Clicks the next month arrow in the calendar."""
        self.click_robust(self.next_month_btn)

    def click_my_schedule(self):
        """Clicks the My Schedule button."""
        self.click_robust(self.my_schedule_btn)