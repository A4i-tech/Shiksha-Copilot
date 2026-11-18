from .base_page import BasePage
from playwright.sync_api import Page


class PresentationPage(BasePage):
    def __init__(self, page: Page):
        super().__init__(page)
        self.status_indicator = page.get_by_test_id("job-status-message")
        self.download_btn = page.get_by_test_id("download-presentation-btn")
        self.progress_bar = page.get_by_test_id("job-progress-bar")
        self.error_msg = page.get_by_test_id("job-error-message")
        self.file_input = page.locator("input[type='file']")
        self.generate_btn = page.get_by_role("button", name="Generate Presentation")
        self.terminate_btn = page.get_by_role("button", name="Terminate Job")

    def navigate(self, base_url: str, job_id: str):
        self.page.goto(f"{base_url}/#/content-generation/presentation/{job_id}")
        self.page.wait_for_load_state("networkidle")

    def open_new(self, base_url: str):
        self.page.goto(f"{base_url}/#/content-generation/presentation")
        self.page.wait_for_load_state("networkidle")

    def upload_document(self, name: str, mime_type: str, content: bytes):
        self.file_input.set_input_files({"name": name, "mimeType": mime_type, "buffer": content})

    def terminate_job(self):
        # the job must end so the test user's pending-job limit is freed
        if self.terminate_btn.count() == 0 or not self.terminate_btn.is_enabled():
            return
        self.page.once("dialog", lambda dialog: dialog.accept())
        self.terminate_btn.click()

    def is_complete(self) -> bool:
        return self.download_btn.is_visible()

    def get_status_text(self) -> str:
        if self.status_indicator.count() > 0:
            return self.status_indicator.first.inner_text().strip()
        return ""
