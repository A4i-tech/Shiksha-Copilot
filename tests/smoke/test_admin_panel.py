import pytest

ADMIN_ROUTES = [
    ("Dashboard", "#/dashboard"),
    ("School Management", "#/schools"),
    ("Teacher Management", "#/teachers"),
    ("Staff Management", "#/staff"),
    ("Role Management", "#/roles"),
    ("Content Activity", "#/content-activity"),
    ("Teacher Training", "#/training"),
    ("Audit Log", "#/audit-log"),
]


def test_admin_panel_actionability(logged_in_admin_page):
    failures = []
    for name, href in ADMIN_ROUTES:
        link = logged_in_admin_page.locator(f'a.menu-item[href="{href}"]').first
        try:
            link.wait_for(state="visible", timeout=5000)
            if not link.is_enabled():
                failures.append(f"{name} link disabled")
            link.click(trial=True, timeout=2000)
        except Exception as e:
            failures.append(f"{name} ({href}) actionability failed: {e}")

    assert not failures, "Admin Smoke Test Failures:\n" + "\n".join(failures)
