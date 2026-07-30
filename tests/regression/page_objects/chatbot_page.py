from .base_page import BasePage
from playwright.sync_api import Page, expect

class ChatbotPage(BasePage):
    def __init__(self, page: Page):
        super().__init__(page)
        
        
        self.header_title = page.get_by_test_id("chatbot-header-title")

        self.empty_state_msg = page.get_by_test_id("chatbot-empty-state-msg")
        self.empty_state_img = page.get_by_test_id("chatbot-empty-state-img")

        self.chat_textarea = page.get_by_test_id("chat-input")
        self.send_button = page.get_by_test_id("chat-send-button")
        self.daily_limit_text = page.get_by_test_id("chat-daily-limit")

        self.user_message_bubbles = page.get_by_test_id("chat-user-bubble")
        self.bot_message_bubbles = page.get_by_test_id("chat-bot-bubble")

        self.loading_indicator = page.get_by_test_id("chat-loading-indicator")

    def load(self, base_url: str):
        """Navigates to the specific Chatbot route."""
        self.page.goto(f"{base_url}/#/chatbot")
        self.header_title.wait_for()

    def send_message(self, text: str):
        """Types text and clicks send."""
        self.chat_textarea.fill(text)
        
        expect(self.send_button).to_be_enabled()
        self.click_robust(self.send_button)

    def get_latest_bot_response(self) -> str:
        """
        Waits for loading to finish and returns the last text response.
        """
        try:
            self.loading_indicator.wait_for(state="visible", timeout=10000)
        except:
            pass
        self.loading_indicator.wait_for(state="hidden", timeout=240000)

        last_msg = self.bot_message_bubbles.last
        last_msg.wait_for(state="visible", timeout=60000)
        
        return last_msg.text_content().strip()
