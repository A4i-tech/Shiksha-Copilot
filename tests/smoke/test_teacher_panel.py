import pytest

TEACHER_ROUTES = [
    ("Home", "#/home"),
    ("Profile", "#/profile"),
    ("Content Generation", "#/content-generation"),
    ("Question Paper Generation", "#/question-papers"),
    ("Chatbot", "#/chat"),
    ("My Schedules", "#/schedule"),
    ("Help", "#/help"),
]


def test_teacher_panel_actionability(logged_in_page):
    failures = []
    for name, href in TEACHER_ROUTES:
        link = logged_in_page.locator(f'a.menu-item[href="{href}"]').first
        try:
            link.wait_for(state="visible", timeout=5000)
            if not link.is_enabled():
                failures.append(f"{name} link disabled")
            link.click(trial=True, timeout=2000)
        except Exception as e:
            failures.append(f"{name} ({href}) actionability failed: {e}")

    assert not failures, "Teacher Smoke Test Failures:\n" + "\n".join(failures)
