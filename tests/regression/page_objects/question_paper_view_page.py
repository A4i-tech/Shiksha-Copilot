from .base_page import BasePage
from playwright.sync_api import Page


class QuestionPaperViewPage(BasePage):
    def __init__(self, page: Page):
        super().__init__(page)
        # h1 "Question Paper"
        self.paper_heading = page.get_by_test_id("question-paper-heading")
        # Question type sections: repeated via *ngFor over questionBank.questions
        self.sections = page.get_by_test_id("question-section")
        # Individual question items inside each section
        self.question_items = page.get_by_test_id("question-item")
        # Download button: repeated per doc type (PDF/DOCX), take the first
        self.download_btn = page.get_by_test_id("download-btn").first
        # Feedback sidebar container
        self.feedback_section = page.get_by_test_id("feedback-section")
        # Feedback is radio buttons, not stars
        self.feedback_radio_btns = page.get_by_test_id("feedback-radio")
        self.submit_feedback_btn = page.get_by_test_id("submit-feedback-btn")

    def navigate(self, base_url: str, paper_id: str):
        self.page.goto(f"{base_url}/#/user/question-paper/view/{paper_id}")
        self.page.wait_for_load_state("networkidle")

    def get_section_count(self) -> int:
        return self.sections.count()

    def get_question_count(self) -> int:
        return self.question_items.count()

    def click_feedback_option(self, index: int):
        """Click nth radio button in the feedback section."""
        self.feedback_radio_btns.nth(index).wait_for(state="attached", timeout=5000)
        self.feedback_radio_btns.nth(index).check()
