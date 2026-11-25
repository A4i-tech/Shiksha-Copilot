import pytest
import os
from page_objects.dashboard_page import DashboardPage

BASE_URL = os.getenv("FRONTEND_URL")

GENERATION_TILES_LABELS = [
    ("generate-period-plan-tile", "Generate New Period Plan"),
    ("generate-question-paper-tile", "Generate New Question Paper"),
    ("generate-lesson-resource-tile", "Generate New Lesson Resource"),
    ("generate-presentation-tile", "Generate New Presentation"),
]

@pytest.fixture
def dashboard(logged_in_page):
    """Local fixture to initialize the Dashboard Page Object."""
    page_obj = DashboardPage(logged_in_page)
    page_obj.load(BASE_URL)
    return page_obj

def test_dashboard_initial_rendering(dashboard, step):
    """Regression: Verify critical dashboard components render correctly."""
    from playwright.sync_api import expect
    
    with step("Check Welcome Section"):
        expect(dashboard.welcome_header).to_contain_text("Hi")
        expect(dashboard.teacher_toolkit_subtitle).to_be_visible()
    
    with step("Check Generation Options Grid"):
        expect(dashboard.generation_options_grid).to_be_visible()
        for tile_id, label in GENERATION_TILES_LABELS:
            expect(dashboard.generation_tile(tile_id)).to_be_visible()
            expect(dashboard.generation_tile(tile_id)).to_contain_text(label)

    with step("Check Old Landing Card Is Removed"):
        expect(dashboard.landing_card_title).to_have_count(0)

    with step("Check Analytics and Calendar"):
        expect(dashboard.chart_canvas).to_be_visible()
        expect(dashboard.calendar_month_view).to_be_visible()


@pytest.mark.parametrize(
    "tile_id, url_pattern",
    [
        ("generate-period-plan-tile", r"#/content-generation/lesson-plan(?:[?]|$)"),
        ("generate-question-paper-tile", r"#/question-papers/generate(?:[?]|$)"),
        ("generate-lesson-resource-tile", r"#/content-generation/lesson-resources(?:[?]|$)"),
        ("generate-presentation-tile", r"#/content-generation/presentation(?:[?]|$)"),
    ],
)
def test_navigation_from_generation_tile(dashboard, logged_in_page, step, tile_id, url_pattern):
    """Regression: Each Home generation tile opens its feature in one tap (issue #677)."""
    from playwright.sync_api import expect
    import re

    with step(f"Click {tile_id}"):
        dashboard.click_generation_tile(tile_id)

    with step("Verify Redirection"):
        expect(logged_in_page).to_have_url(re.compile(url_pattern))

    with step("Navigate Back to Dashboard"):
        dashboard.load(BASE_URL)


def test_generation_tiles_mobile_layout(dashboard, logged_in_page, step):
    """Regression: At 360px tiles fit without horizontal scroll and meet 44x44 touch targets."""
    with step("Resize to 360px"):
        logged_in_page.set_viewport_size({"width": 360, "height": 780})
        dashboard.load(BASE_URL)

    with step("No Horizontal Overflow"):
        overflow = logged_in_page.evaluate(
            "() => document.documentElement.scrollWidth - document.documentElement.clientWidth"
        )
        assert overflow <= 0, f"page overflows horizontally by {overflow}px"

    with step("Touch Targets And Row Layout"):
        boxes = {tile_id: dashboard.generation_tile(tile_id).bounding_box() for tile_id, _ in GENERATION_TILES_LABELS}
        for tile_id, box in boxes.items():
            assert box is not None, f"{tile_id} not rendered"
            assert box["width"] >= 44 and box["height"] >= 44, f"{tile_id} smaller than 44x44: {box}"
        period, paper = boxes["generate-period-plan-tile"], boxes["generate-question-paper-tile"]
        resource, presentation = boxes["generate-lesson-resource-tile"], boxes["generate-presentation-tile"]
        # Row 1: side by side
        assert abs(period["y"] - paper["y"]) < 1 and paper["x"] > period["x"]
        # Row 2+: full width, stacked below row 1
        assert resource["y"] > period["y"] and presentation["y"] > resource["y"]
        assert resource["width"] > period["width"] and abs(resource["width"] - presentation["width"]) < 1



def test_calendar_month_navigation(dashboard, step):
    """Regression: Verify calendar month navigation updates the display month."""
    from playwright.sync_api import expect
    
    with step("Get Initial Month"):
        initial_month = dashboard.current_month_display.text_content()
    
    with step("Navigate to Next Month"):
        dashboard.navigate_next_month()
    
    with step("Verify Month Changed"):
        # Verify the text content has changed to a different month/year
        new_month = dashboard.current_month_display.text_content()
        assert initial_month != new_month

def test_schedule_navigation(dashboard, logged_in_page, step):
    """Regression: Verify the My Schedule button redirects correctly."""
    from playwright.sync_api import expect
    import re
    
    with step("Click My Schedule"):
        dashboard.click_my_schedule()
    
    with step("Verify Redirection to Schedule"):
        expect(logged_in_page).to_have_url(re.compile(r"user/schedule"))
    
    with step("Navigate Back to Dashboard"):
        dashboard.load(BASE_URL)


def test_hamburger_menu_still_works_on_mobile(dashboard, logged_in_page, step):
    """Regression (issue #677): Home redesign must not break the hamburger menu."""
    from playwright.sync_api import expect
    import re

    with step("Resize to 360px"):
        logged_in_page.set_viewport_size({"width": 360, "height": 780})
        dashboard.load(BASE_URL)

    hamburger = logged_in_page.get_by_role("button", name="Open navigation menu")

    with step("Open Hamburger"):
        expect(hamburger).to_have_attribute("aria-expanded", "false")
        hamburger.click()
        expect(hamburger).to_have_attribute("aria-expanded", "true")

    with step("Close Hamburger Without Navigating"):
        # Clicking the backdrop (outside the 270px sidebar) closes the menu.
        logged_in_page.mouse.click(340, 400)
        expect(hamburger).to_have_attribute("aria-expanded", "false")
        expect(logged_in_page).to_have_url(re.compile(r"#/home"))

    with step("Reopen Hamburger"):
        hamburger.click()
        expect(hamburger).to_have_attribute("aria-expanded", "true")

    with step("Navigate via Menu Item"):
        nav = logged_in_page.get_by_role("navigation", name="Main navigation")
        nav.locator("a[href$='/schedule']").first.click()
        expect(logged_in_page).to_have_url(re.compile(r"#/schedule(?:[/?]|$)"))
        expect(hamburger).to_have_attribute("aria-expanded", "false")
