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
    # Dismiss any active toast notifications so they do not intercept clicks
    logged_in_admin_page.evaluate('() => document.querySelectorAll(".overlay-container, .ngx-toastr").forEach(el => el.remove())')

    hamburger = logged_in_admin_page.locator("button[aria-label='Open navigation menu']")
    is_mobile = hamburger.is_visible()

    for name, href in ADMIN_ROUTES:
        if is_mobile:
            sidebar = logged_in_admin_page.locator("nav.sidebar")
            if not sidebar.is_visible() or "hide" in (sidebar.get_attribute("class") or ""):
                hamburger.click()
                logged_in_admin_page.wait_for_timeout(300)

        link = logged_in_admin_page.locator(f'a.menu-item[href="{href}"]').first
        try:
            link.wait_for(state="visible", timeout=5000)
            if not link.is_enabled():
                failures.append(f"{name} link disabled")
            link.click(trial=True, timeout=2000)
        except Exception as e:
            failures.append(f"{name} ({href}) actionability failed: {e}")

    assert not failures, "Admin Smoke Test Failures:\n" + "\n".join(failures)
