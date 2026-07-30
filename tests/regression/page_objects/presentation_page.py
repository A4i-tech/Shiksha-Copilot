from .base_page import BasePage
from playwright.sync_api import Page


class PresentationPage(BasePage):
    def __init__(self, page: Page):
        super().__init__(page)
        self.status_indicator = page.get_by_test_id("job-status-message")
        self.download_btn = page.get_by_test_id("download-presentation-btn")
        self.progress_bar = page.get_by_test_id("job-progress-bar")
        self.error_msg = page.get_by_test_id("job-error-message")

    def navigate(self, base_url: str, job_id: str):
        self.page.goto(f"{base_url}/#/content-generation/presentation/{job_id}")
        self.page.wait_for_load_state("networkidle")

    def is_complete(self) -> bool:
        return self.download_btn.is_visible()

    def get_status_text(self) -> str:
        if self.status_indicator.count() > 0:
            return self.status_indicator.first.inner_text().strip()
        return ""
