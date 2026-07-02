from .base_page import BasePage
from playwright.sync_api import Page


class LessonPlanDetailPage(BasePage):
    def __init__(self, page: Page):
        super().__init__(page)
        self.back_arrow = page.locator("img[src*='back-arrow']")
        self.content_heading = page.locator("h1, h2").first
        self.chat_sidebar_toggle = page.locator(
            "button[aria-label*='chat'], button[class*='chat'], app-chat-toggle button"
        ).first
        self.chat_sidebar = page.locator("app-chat-sidebar, .chat-sidebar, [class*='chat-panel']")
        self.chat_input = self.chat_sidebar.locator("textarea, input[type='text']").first
        self.chat_send_btn = self.chat_sidebar.locator("button[type='submit'], button").last
        self.edit_btn = page.locator("button[aria-label*='edit'], button:has(img[src*='edit'])")
        self.save_changes_btn = page.locator("button", has_text="Save Changes")
        self.download_btn = page.locator("button", has_text="Download")
        self.share_btn = page.locator("button", has_text="Share")
        self.draft_label = page.locator("[class*='draft'], span", has_text="Draft")

    def navigate(self, base_url: str, plan_id: str):
        self.page.goto(f"{base_url}/#/user/content-generation/lesson-plan/{plan_id}")
        self.page.wait_for_load_state("networkidle")

    def open_chat_sidebar(self):
        self.click_robust(self.chat_sidebar_toggle)
        self.chat_sidebar.wait_for(state="visible", timeout=10000)

    def send_chat_message(self, text: str):
        self.chat_input.fill(text)
        self.click_robust(self.chat_send_btn)
