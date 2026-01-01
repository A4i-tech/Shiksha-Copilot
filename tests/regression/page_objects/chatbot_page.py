from .base_page import BasePage

class ChatbotPage(BasePage):
    def __init__(self, page: Page):
        super().__init__(page)
        
        
        self.header_title = page.locator("h1") 
        
        self.empty_state_msg = page.locator("text=Hello! I am here to assist you")
        self.empty_state_img = page.locator("img[src*='chat-bot-empty.svg']")

        self.chat_textarea = page.locator("textarea.chat-input")
        self.send_button = page.locator("button.btn-primary")
        self.daily_limit_text = page.locator("text=Daily chat limit")
        
        self.user_message_bubbles = page.locator(".user-chat")
        self.bot_message_bubbles = page.locator(".chatbot-chat")
        
        self.loading_indicator = page.locator(".loading-indicator")

    def load(self, base_url: str):
        """Navigates to the specific Chatbot route."""
        self.page.goto(f"{base_url}/#/user/chatbot")
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
            self.loading_indicator.wait_for(state="visible", timeout=1000)
        except:
            pass
        self.loading_indicator.wait_for(state="hidden", timeout=15000)

        last_msg = self.bot_message_bubbles.last
        last_msg.wait_for(state="visible")
        
        return last_msg.text_content().strip()