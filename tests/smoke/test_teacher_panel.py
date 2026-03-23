import pytest
import os
from dotenv import load_dotenv

load_dotenv()

BASE_URL = os.getenv("FRONTEND_URL")
TEACHER_PANEL_ITEMS = [
    "Dashboard", "Content Generation", "Generation Status",
    "Chatbot", "Question Paper Generation", "My Schedules",
    "Help", "FAQ"
]

TIMEOUT1 = 5000
TIMEOUT2 = 2000

def test_teacher_panel_actionability(logged_in_page):
    
    logged_in_page.goto(f"{BASE_URL}/#/user/dashboard")

    # Shared overlay locators for smoke test
    spinner = logged_in_page.locator("ngx-spinner")
    backdrop = logged_in_page.locator(".cdk-overlay-backdrop")

    def wait_for_ui():
        try:
            if spinner.count() > 0:
                spinner.wait_for(state="hidden", timeout=10000)
            if backdrop.count() > 0:
                backdrop.wait_for(state="hidden", timeout=10000)
        except:
            pass

    failures = []

    for item in TEACHER_PANEL_ITEMS:
        # Use a more specific selector to avoid ambiguity with "Help"
        # and ensure we match text inside the sidebar/menu area if possible.
        # .first() handles cases where the same text appears elsewhere.
        locator = logged_in_page.locator(f"text='{item}'").first

        try:
            wait_for_ui()
            locator.wait_for(state="visible", timeout=TIMEOUT1)

            if not locator.is_enabled():
                failures.append(f"[Enabled Fail] {item}")
                continue

            # Trial click ensures it's actionable without actually navigating/submitting
            locator.click(trial=True, timeout=TIMEOUT2)

        except Exception as e:
            failures.append(f"[Actionable Fail] {item}: {e}")

    assert not failures, "Smoke Test Failures:\n" + "\n".join(failures)
