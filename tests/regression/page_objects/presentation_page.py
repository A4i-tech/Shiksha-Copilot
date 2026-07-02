from .base_page import BasePage
from playwright.sync_api import Page


class PresentationPage(BasePage):
    def __init__(self, page: Page):
        super().__init__(page)
        self.status_indicator = page.locator(
            "[class*='status'], [class*='badge'], span"
        ).filter(has_text="")
        self.download_btn = page.locator("button", has_text="Download")
        self.progress_bar = page.locator("mat-progress-bar, [role='progressbar'], .progress-bar")
        self.error_msg = page.locator("[class*='error'], p", has_text="failed")

    def navigate(self, base_url: str, job_id: str):
        self.page.goto(f"{base_url}/#/user/content-generation/presentation/{job_id}")
        self.page.wait_for_load_state("networkidle")

    def is_complete(self) -> bool:
        return self.download_btn.is_visible()

    def get_status_text(self) -> str:
        if self.status_indicator.count() > 0:
            return self.status_indicator.first.inner_text().strip()
        return ""
