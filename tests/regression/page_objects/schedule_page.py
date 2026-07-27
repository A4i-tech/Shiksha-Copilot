from .base_page import BasePage
from playwright.sync_api import Page, expect

class SchedulePage(BasePage):
    def __init__(self, page: Page):
        super().__init__(page)
        
        # --- Header & Navigation ---
        self.header_title = page.get_by_test_id("schedule-header-title")
        self.my_schedule_btn = page.get_by_test_id("my-schedules-tab-btn")

        # --- Calendar Grid ---
        self.calendar_week_view = page.get_by_test_id("calendar-week-view")
        # --- Calendar Grid ---
        # 'angular-calendar' (mwl-calendar-week-view) renders .cal-hour-segment internally;
        # it is library-owned DOM, not markup from our own templates, so it cannot be
        # attributed to a template element and is left as a CSS selector.
        self.empty_slots = page.locator(".cal-hour-segment")
        self.existing_events = page.get_by_test_id("schedule-event-card")

        # --- Popup / Modal ---
        # The popup is rendered via <app-add-edit-schedule>
        self.popup_container = page.get_by_test_id("add-edit-schedule-popup")
        self.popup_header = page.get_by_test_id("add-edit-schedule-title")

        # Close/Cancel buttons often inside the component
        self.close_popup_btn = page.get_by_test_id("add-edit-schedule-close-btn")
        self.save_btn = page.get_by_test_id("add-edit-schedule-save-btn")

        # --- Tooltip / Context Menu ---
        # Defined as <div id="dialogue"> in the HTML
        self.tooltip_menu = page.get_by_test_id("schedule-tooltip-menu")
        self.view_details_opt = page.get_by_test_id("tooltip-view-details-option")
        self.edit_details_opt = page.get_by_test_id("tooltip-edit-details-option")
        self.delete_opt = page.get_by_test_id("tooltip-delete-option")

        # --- Delete Confirmation Modal ---
        # Defined as <app-delete-detail> in the HTML
        self.delete_confirm_modal = page.get_by_test_id("delete-confirm-modal")
        self.confirm_delete_btn = page.get_by_test_id("delete-detail-primary-btn")

    def navigate(self, base_url: str):
        """Goes to the Schedule page."""
        self.page.goto(f"{base_url}/#/user/schedule")
        self.header_title.wait_for()

    def open_add_schedule_popup(self):
        """
        Clicks on a time slot (grid cell) in the calendar.
        """
        # 1. Wait for calendar segments to be visible
        self.empty_slots.first.wait_for(state="visible", timeout=20000)
        
        # 2. IMPORTANT: Wait a moment for Angular to attach click listeners (Hydration)
        self.page.wait_for_timeout(2000)
        
        # 3. Click a slot in the future (index 40 is roughly Thursday/Friday mid-day)
        self.click_robust(self.empty_slots.nth(40))

        # 4. Wait for the popup component to appear in the DOM
        # We wait for the header because the host <app-add-edit-schedule> might be 0x0 size
        self.popup_header.wait_for(state="visible", timeout=15000)

    def close_add_schedule_popup(self):
        """Clicks the 'X' button to close the popup."""
        # Ensure the close button is visible
        btn = self.close_popup_btn.first
        btn.wait_for(state="visible")
        self.click_robust(btn)
        
        # Wait for the popup to disappear
        self.popup_header.wait_for(state="hidden", timeout=5000)