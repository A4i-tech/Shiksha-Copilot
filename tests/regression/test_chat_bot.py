import pytest
import os
from page_objects.chatbot_page import ChatbotPage
from playwright.sync_api import expect

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

def test_chatbot_renders_stubbed_reply(chatbot, step):
    question = "What is the capital of France?"
    ndjson = (
        '{"type": "status", "message": "Thinking..."}\n'
        '{"type": "content", "delta": "The capital of France is Paris."}\n'
    )
    chatbot.page.route(
        "**/chat/message",
        lambda route: route.fulfill(
            status=200, content_type="application/x-ndjson", body=ndjson
        ),
    )
    initial_bot_count = chatbot.bot_message_bubbles.count()

    with step("Send Message"):
        chatbot.send_message(question)
        expect(chatbot.chat_textarea).to_have_value("")
        chatbot.user_message_bubbles.last.wait_for(state="visible", timeout=5000)

    with step("Verify Chatbot Response"):
        response = chatbot.get_latest_bot_response()
        assert "Paris" in response, f"Stubbed reply not rendered: '{response}'"
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
