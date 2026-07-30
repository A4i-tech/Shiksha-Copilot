from .base_page import BasePage
from playwright.sync_api import Page


class LessonPlanDetailPage(BasePage):
    def __init__(self, page: Page):
        super().__init__(page)
        self.back_arrow = page.get_by_test_id("back-arrow-btn")
        self.content_heading = page.get_by_test_id("lesson-plan-page-heading")
        self.save_changes_btn = page.get_by_test_id("save-changes-btn")
        self.download_btn = page.get_by_test_id("download-btn")
        # NOTE: chat sidebar toggle/panel, edit button, share button, and a
        # standalone "Draft" label were dropped as locators. There is no chat
        # sidebar, edit button, share button, or draft badge in the current
        # lesson-plan-view-edit template (lesson-plan-view-edit.component.html)
        # or lesson-plan-documents template - chat opens as a separate routed
        # page (app-chatbot), not an in-page sidebar, and no edit/share/draft
        # elements exist to attribute a test-id to. Skipped rather than
        # invented.

    def navigate(self, base_url: str, plan_id: str):
        self.page.goto(f"{base_url}/#/content-generation/lesson-plan/{plan_id}")
        self.page.wait_for_load_state("networkidle")

    # NOTE: open_chat_sidebar/send_chat_message removed - chat is a separate
    # routed page (app-chatbot), not an in-page sidebar on this page object.
