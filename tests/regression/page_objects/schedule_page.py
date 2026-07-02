from .base_page import BasePage
from playwright.sync_api import Page, expect

class SchedulePage(BasePage):
    def __init__(self, page: Page):
        super().__init__(page)
        
        # --- Header & Navigation ---
        self.header_title = page.locator("h1", has_text="My Schedules")
        self.my_schedule_btn = page.locator("button", has_text="My Schedules").first
        
        # --- Calendar Grid ---
        # RESTORED: This was missing in the previous version
        self.calendar_week_view = page.locator("mwl-calendar-week-view")
        # --- Calendar Grid ---
        # The library 'angular-calendar' uses .cal-hour-segment for the clickable white boxes
        self.empty_slots = page.locator(".cal-hour-segment") 
        self.existing_events = page.locator(".schedule-view")

        # --- Popup / Modal ---
        # The popup is rendered via <app-add-edit-schedule>
        self.popup_container = page.locator("app-add-edit-schedule")
        self.popup_header = self.popup_container.locator("h1, .modal-title, .title", has_text="Add Details")
        
        # Close/Cancel buttons often inside the component
        self.close_popup_btn = self.popup_container.locator("img[src*='remove'], button.close, [aria-label='Close'], .close-icon, span.cursor-pointer")
        self.save_btn = self.popup_container.locator("button[type='submit']")

        # --- Tooltip / Context Menu ---
        # Defined as <div id="dialogue"> in the HTML
        self.tooltip_menu = page.locator("#dialogue")
        self.view_details_opt = self.tooltip_menu.locator("li", has_text="View Details")
        self.edit_details_opt = self.tooltip_menu.locator("li.edit")     # matches <li class="... edit">
        self.delete_opt = self.tooltip_menu.locator("li.delete")         # matches <li class="... delete">

        # --- Delete Confirmation Modal ---
        # Defined as <app-delete-detail> in the HTML
        self.delete_confirm_modal = page.locator("app-delete-detail")
        self.confirm_delete_btn = self.delete_confirm_modal.locator("button.btn-danger, button.delete")

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