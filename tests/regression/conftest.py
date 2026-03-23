import os
import pytest
from dotenv import load_dotenv
from playwright.sync_api import sync_playwright, expect

load_dotenv()

FRONTEND_URL = os.getenv("FRONTEND_URL")
USER_PHONE = os.getenv("TEST_USER_PHONE")
USER_OTP = os.getenv("TEST_USER_OTP")


@pytest.fixture(scope="session")
def browser_context():
    """
    Launches browser once per session.
    Performs login and yields an authenticated browser context.
    """
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context()
        page = context.new_page()

        page.goto(f"{FRONTEND_URL}/#/auth/signin")

        phone_input = page.locator("#mNumber")
        phone_input.wait_for(state="visible")
        phone_input.fill(USER_PHONE)

        page.get_by_role("button", name="Continue").click()

        otp_inputs = page.locator("input.otp-input")
        expect(otp_inputs).to_have_count(4)

        for i, digit in enumerate(USER_OTP):
            otp_inputs.nth(i).click()
            otp_inputs.nth(i).type(digit, delay=100)

        verify_button = page.get_by_role("button", name="Verify")
        verify_button.click()

        page.wait_for_url("**/dashboard")

        yield context

        browser.close()


@pytest.fixture(scope="function")
def logged_in_page(browser_context):
    """
    Provides a fresh page using the authenticated session.
    """
    page = browser_context.new_page()
    yield page
    page.close()

@pytest.fixture
def step():
    """
    Fixture to provide a context manager for logging test steps.
    Usage:
        with step("Logging in"):
            ...
    """
    class StepContext:
        def __call__(self, name):
            self.name = name
            return self
        def __enter__(self):
            print(f"\n[STEP START] {self.name}...")
        def __exit__(self, exc_type, exc_val, exc_tb):
            if exc_type:
                print(f"[STEP FAIL] {self.name} - Error: {exc_val}")
            else:
                print(f"[STEP PASS] {self.name}")

    return StepContext()
