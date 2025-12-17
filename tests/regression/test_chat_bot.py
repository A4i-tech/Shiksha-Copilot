import pytest
import os
from tests.regression.page_objects.chatbot_page import ChatbotPage

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

def test_chatbot_ui_elements_exist(chatbot):
    """
    Regression: Verify specific static elements defined in HTML are rendered.
    """
    expect(chatbot.header_title).to_be_visible()
    
    expect(chatbot.empty_state_msg).to_be_visible()
    expect(chatbot.empty_state_img).to_be_visible()
    
    expect(chatbot.daily_limit_text).to_be_visible()

def test_chatbot_send_receive_logic(chatbot):
    """
    Regression: The core 'Happy Path'. 
    User sends message -> Loading appears -> Bot responds.
    """
    question = "What is the capital of France?"
    
    chatbot.send_message(question)
    
    expect(chatbot.user_message_bubbles.last).to_contain_text(question)
    
    answer = chatbot.get_latest_bot_response()
    
    # Logic Checks
    assert len(answer) > 0, "Bot response was empty"
    assert "Paris" in answer or "capital" in answer, f"Unexpected response: {answer}"

def test_chatbot_input_validation(chatbot):
    """
    Regression: Verify [disabled] logic on the send button.
    HTML: [disabled]="isLoading || !chatValue"
    """
    chatbot.chat_textarea.fill("")
    expect(chatbot.send_button).to_be_disabled()
    
    chatbot.chat_textarea.fill("Hi")
    expect(chatbot.send_button).to_be_enabled()
    
    chatbot.chat_textarea.fill("")
    expect(chatbot.send_button).to_be_disabled()