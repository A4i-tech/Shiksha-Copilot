from .base_page import BasePage
from playwright.sync_api import Page, expect

class DashboardPage(BasePage):
    def __init__(self, page: Page):
        super().__init__(page)
        
        # Header and User Info
        self.welcome_header = page.locator("h1.text-content")
        self.teacher_toolkit_subtitle = page.locator("h6.text-content-60")
        
        # Landing Card (Lesson Plan Generation)
        self.landing_card_title = page.locator(".dashboard-landing-card h2")
        self.generate_lesson_plan_btn = page.locator(".dashboard-landing-card button")
        
        # Recently Generated Section
        self.recent_plans_section = page.locator("h3:has-text('Recently Generated/Modified Plans')")
        self.view_all_link = page.locator("p:has-text('View All')")
        self.recent_plan_cards = page.locator(".grid-cols-1.md\\:grid-cols-2 .bg-white.border")
        self.no_plans_found_container = page.locator("div:has-text('No plans found')")
        self.empty_state_generate_btn = self.no_plans_found_container.locator("button")

        # Analytics/Chart Section
        self.analytics_container = page.locator(".canvas-container")
        self.chart_canvas = page.locator("canvas")
        self.analytics_dropdown = page.locator("app-common-dropdown")
        
        # Calendar Section
        self.calendar_header = page.locator("h2:has-text('Calendar')")
        self.current_month_display = page.locator("h3.font-normal")
        self.prev_month_btn = page.locator("button[mwlCalendarPreviousView]")
        self.next_month_btn = page.locator("button[mwlCalendarNextView]")
        self.calendar_month_view = page.locator("mwl-calendar-month-view")
        self.my_schedule_btn = page.locator("button:has-text('My Schedule')")
        self.calendar_day_view = page.locator("mwl-calendar-day-view")

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