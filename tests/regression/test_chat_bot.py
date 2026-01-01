import pytest
import os
from page_objects.chatbot_page import ChatbotPage
from playwright.sync_api import expect

BASE_URL = os.getenv("STAGING_URL")

@pytest.fixture
def chatbot(logged_in_page):
    """
    Local fixture to initialize the Page Object for these tests.
    Uses the logged_in_page from your root conftest.
    """
    page_obj = ChatbotPage(logged_in_page)
    page_obj.load(BASE_URL)
    return page_obj

def test_chatbot_ui_elements_exist(chatbot, step):
    """
    Regression: Verify specific static elements defined in HTML are rendered.
    """
    with step("Verify Header"):
        expect(chatbot.header_title).to_be_visible()
    
    with step("Verify Empty State"):
        expect(chatbot.empty_state_msg).to_be_visible()
        expect(chatbot.empty_state_img).to_be_visible()
    
    with step("Verify Daily Limit"):
        expect(chatbot.daily_limit_text).to_be_visible()

def test_chatbot_send_receive_logic(chatbot, step):
    """
    Regression: The core 'Happy Path'. 
    User sends message -> Loading appears -> Bot responds.
    """
    question = "What is the capital of France?"
    
    with step("Send Message"):
        chatbot.send_message(question)
        expect(chatbot.user_message_bubbles.last).to_contain_text(question)
    
    with step("Wait for Bot Response"):
        answer = chatbot.get_latest_bot_response()
        
        # Logic Checks
        assert len(answer) > 0, "Bot response was empty"

def test_chatbot_input_validation(chatbot, step):
    """
    Regression: Verify [disabled] logic on the send button.
    HTML: [disabled]="isLoading || !chatValue"
    """
    with step("Verify Send Disabled for Empty Input"):
        chatbot.chat_textarea.fill("")
        expect(chatbot.send_button).to_be_disabled()
    
    with step("Verify Send Enabled for Valid Input"):
        chatbot.chat_textarea.fill("Hi")
        expect(chatbot.send_button).to_be_enabled()
    
    with step("Verify Send Disabled after Clearing"):
        chatbot.chat_textarea.fill("")
        expect(chatbot.send_button).to_be_disabled()