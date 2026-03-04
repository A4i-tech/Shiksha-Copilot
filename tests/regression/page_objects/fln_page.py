from .base_page import BasePage
from playwright.sync_api import Page, expect


class FlnPage(BasePage):
    def __init__(self, page: Page):
        super().__init__(page)

        # --- Container (only shown when grades.length > 0) ---
        self.container = page.locator(".fln-lessons-container")

        # --- Header ---
        self.header = page.locator("h2", has_text="FLN Teacher Resources")

        # --- Controls ---
        self.grade_select = page.locator("select")
        self.prev_day_btn = page.locator("button", has_text="← Previous Day")
        self.next_day_btn = page.locator("button", has_text="Next Day →")
        self.day_input = page.locator("input[type='number']")
        self.jump_go_btn = page.locator("button", has_text="Go")
        self.download_excel_btn = page.locator("button", has_text="Download Excel")

        # --- Loading ---
        self.loading_indicator = page.locator(".fln-loading")

        # --- Lesson Details ---
        self.lesson_details = page.locator(".fln-lesson-details")
        self.lesson_day_heading = self.lesson_details.locator("h3")
        self.learning_outcome = self.lesson_details.locator(
            "p:has(strong:has-text('Learning Outcome'))"
        )
        self.concept = self.lesson_details.locator(
            "p:has(strong:has-text('Concept'))"
        )
        self.teaching_strategy = self.lesson_details.locator(
            "p:has(strong:has-text('Teaching Strategy'))"
        )
        self.activity = self.lesson_details.locator(
            "p:has(strong:has-text('Activity'))"
        )
        self.assessment_questions = self.lesson_details.locator(
            "ul"
        ).first
        self.teacher_notes = self.lesson_details.locator(
            "p:has(strong:has-text('Teacher Notes'))"
        )

    def navigate(self, base_url: str):
        """Navigate to the FLN page."""
        self.page.goto(f"{base_url}/#/user/fln")
        self.page.wait_for_load_state("networkidle")

    def select_grade(self, grade_value: str = None, index: int = 0):
        """Select a grade from the dropdown. If no value given, selects by index."""
        self.grade_select.wait_for(state="visible", timeout=10000)
        if grade_value:
            self.grade_select.select_option(value=grade_value)
        else:
            options = self.grade_select.locator("option")
            if options.count() > index:
                value = options.nth(index).get_attribute("value")
                self.grade_select.select_option(value=value)

    def click_next_day(self):
        """Click the Next Day button."""
        self.click_robust(self.next_day_btn)

    def click_prev_day(self):
        """Click the Previous Day button."""
        self.click_robust(self.prev_day_btn)

    def jump_to_day(self, day: int):
        """Enter a day number and click Go."""
        self.day_input.fill(str(day))
        self.click_robust(self.jump_go_btn)

    def wait_for_lesson_loaded(self, timeout=15000):
        """Wait for the lesson details to appear (loading finished)."""
        try:
            self.loading_indicator.wait_for(state="hidden", timeout=timeout)
        except Exception:
            pass  # Loading might not appear if data is fast
        self.lesson_details.wait_for(state="visible", timeout=timeout)

    def get_day_heading_text(self) -> str:
        """Return the text of the day heading (e.g., 'Day 1 - Grade 1')."""
        return self.lesson_day_heading.text_content()
