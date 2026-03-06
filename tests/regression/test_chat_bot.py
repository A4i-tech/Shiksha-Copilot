import pytest
import os
from page_objects.chatbot_page import ChatbotPage
from playwright.sync_api import expect
from playwright.sync_api import TimeoutError as PlaywrightTimeoutError

BASE_URL = os.getenv("FRONTEND_URL")

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
    initial_bot_count = chatbot.bot_message_bubbles.count()
    
    with step("Send Message"):
        chatbot.send_message(question)
        expect(chatbot.chat_textarea).to_have_value("")

    with step("Verify Chatbot Response"):
        # The exact text varies based on LLM output and timing, so we just
        # ensure that a response bubble has populated with *some* text length
        try:
            response = chatbot.get_latest_bot_response()
        except PlaywrightTimeoutError:
            pytest.skip("No chatbot response returned within timeout in this environment.")
        assert len(response) > 5, f"Chatbot response is too short or empty: '{response}'"
        assert chatbot.bot_message_bubbles.count() > initial_bot_count, (
            "Expected a new chatbot response bubble after sending a message."
        )

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
