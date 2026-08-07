from .base_page import BasePage
from playwright.sync_api import Page, expect


class FlnPage(BasePage):
    def __init__(self, page: Page):
        super().__init__(page)

        # --- Container (only shown when grades.length > 0) ---
        self.container = page.get_by_test_id("fln-lessons-container")

        # --- Header ---
        self.header = page.get_by_test_id("fln-header-title")

        # --- Controls ---
        self.grade_select = page.get_by_test_id("fln-grade-select")
        self.prev_day_btn = page.get_by_test_id("fln-prev-day-btn")
        self.next_day_btn = page.get_by_test_id("fln-next-day-btn")
        self.day_input = page.get_by_test_id("fln-day-input")
        self.jump_go_btn = page.get_by_test_id("fln-jump-go-btn")
        self.download_excel_btn = page.get_by_test_id("fln-download-excel-btn")

        # --- Loading ---
        self.loading_indicator = page.get_by_test_id("fln-loading")

        # --- Lesson Details ---
        self.lesson_details = page.get_by_test_id("fln-lesson-details")
        self.lesson_day_heading = page.get_by_test_id("fln-lesson-day-heading")
        self.learning_outcome = page.get_by_test_id("fln-learning-outcome")
        self.concept = page.get_by_test_id("fln-concept")
        self.teaching_strategy = page.get_by_test_id("fln-teaching-strategy")
        self.activity = page.get_by_test_id("fln-activity")
        self.assessment_questions = page.get_by_test_id("fln-assessment-questions")
        self.teacher_notes = page.get_by_test_id("fln-teacher-notes")

    def navigate(self, base_url: str):
        """Navigate to the FLN page."""
        # NOTE: no /fln route exists in the app yet — this page object targets a route that doesn't exist; leave as-is pending route addition or removal, see PR #144 review comment.
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
