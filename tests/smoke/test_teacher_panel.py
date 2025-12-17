import pytest
import os
from dotenv import load_dotenv

load_dotenv()

BASE_URL = os.getenv("STAGING_URL")
TEACHER_PANEL_ITEMS = [
    "Dashboard", "Content Generation", "Generation Status",
    "Chatbot", "Question Paper Generation", "My Schedules",
    "Help", "FAQ"
]

TIMEOUT1 = 5000
TIMEOUT2 = 2000

def test_teacher_panel_actionability(logged_in_page):
    
    logged_in_page.goto(f"{BASE_URL}/#/user/dashboard")

    failures = []

    for item in TEACHER_PANEL_ITEMS:
        locator = logged_in_page.locator(f"text={item}")

        try:
            locator.wait_for(state="visible", timeout=TIMEOUT1)

            if not locator.is_enabled():
                failures.append(f"[Enabled Fail] {item}")
                continue

            locator.click(trial=True, timeout=TIMEOUT2)

        except Exception as e:
            failures.append(f"[Actionable Fail] {item}: {e}")

    assert not failures, "Smoke Test Failures:\n" + "\n".join(failures)
