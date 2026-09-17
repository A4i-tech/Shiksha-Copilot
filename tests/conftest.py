import os
import pytest
from dotenv import load_dotenv
from playwright.sync_api import sync_playwright

load_dotenv()

FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:4200")
USER_PHONE = os.getenv("TEST_USER_PHONE")
USER_OTP = os.getenv("TEST_USER_OTP")
ADMIN_PHONE = os.getenv("TEST_ADMIN_PHONE") or USER_PHONE
ADMIN_OTP = os.getenv("TEST_ADMIN_OTP") or USER_OTP


def pytest_addoption(parser):
    parser.addoption("--browser-type", action="store", default="chromium", help="chromium, firefox, webkit")
    parser.addoption("--channel", action="store", default=None, help="chrome, msedge, chrome-beta")
    parser.addoption("--browser-path", action="store", default=None, help="Path to custom browser binary")


def _login_page(playwright, request, phone, otp):
    if not phone or not otp:
        pytest.skip("Credentials not set in environment (TEST_USER_PHONE / TEST_USER_OTP)")

    browser_type_name = request.config.getoption("--browser-type")
    channel = request.config.getoption("--channel")
    executable_path = request.config.getoption("--browser-path")

    browser_type = getattr(playwright, browser_type_name)
    launch_kwargs = {"headless": True}
    if channel:
        launch_kwargs["channel"] = channel
    if executable_path:
        launch_kwargs["executable_path"] = executable_path

    browser = browser_type.launch(**launch_kwargs)
    context = browser.new_context()

    # Intercept baseline survey guard to prevent popup interception during smoke tests
    context.route(
        "**/baseline-surveys/**",
        lambda route: route.fulfill(status=200, json={"success": True, "data": {"completed": True}})
    )

    page = context.new_page()
    page.goto(f"{FRONTEND_URL}/#/auth/signin")

    phone_input = page.locator("#mNumber")
    phone_input.wait_for(state="visible", timeout=15000)
    phone_input.fill(phone)

    page.get_by_role("button", name="Continue").click()

    otp_inputs = page.locator("input.otp-input")
    otp_inputs.first.wait_for(state="attached", timeout=15000)

    for i, digit in enumerate(otp):
        cell = otp_inputs.nth(i)
        cell.focus()
        cell.fill(digit)
        cell.dispatch_event("input")

    verify_button = page.get_by_role("button", name="Verify")
    verify_button.wait_for(state="visible", timeout=15000)
    verify_button.dispatch_event("click")

    page.locator("a.menu-item").first.wait_for(state="visible", timeout=20000)

    return browser, context, page


@pytest.fixture(scope="function")
def logged_in_page(request):
    with sync_playwright() as p:
        browser, context, page = _login_page(p, request, USER_PHONE, USER_OTP)
        yield page
        browser.close()


@pytest.fixture(scope="function")
def logged_in_admin_page(request):
    with sync_playwright() as p:
        browser, context, page = _login_page(p, request, ADMIN_PHONE, ADMIN_OTP)
        yield page
        browser.close()
