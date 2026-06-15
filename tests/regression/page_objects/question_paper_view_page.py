from .base_page import BasePage
from playwright.sync_api import Page


class QuestionPaperViewPage(BasePage):
    def __init__(self, page: Page):
        super().__init__(page)
        # h1 "Question Paper"
        self.paper_heading = page.locator("h1", has_text="Question Paper")
        # Question type sections: div.mt-5 repeated via *ngFor over questionBank.questions
        self.sections = page.locator("div.mt-5")
        # Individual question items inside each section
        self.question_items = page.locator("div.flex.justify-between.items-start.mt-2.gap-2")
        # Download button: btn-outline-primary with text "Download ..."
        self.download_btn = page.locator("button.btn-outline-primary").first
        # Feedback sidebar container
        self.feedback_section = page.locator("div.p-4.bg-white.border.rounded-lg")
        # Feedback is radio buttons, not stars
        self.feedback_radio_btns = page.locator("input[type='radio']")
        self.submit_feedback_btn = page.locator("button.btn-primary", has_text="Submit Feedback")

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
