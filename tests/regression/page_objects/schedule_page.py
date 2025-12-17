from playwright.sync_api import Page, expect

class SchedulePage:
    def __init__(self, page: Page):
        self.page = page
        
        self.header_title = page.locator("h1:has-text('My Schedules')")
        self.my_schedule_btn = page.locator("button:has-text('My Schedules')")
        self.others_schedule_btn = page.locator("button:has-text('Others')")
        
        self.prev_week_btn = page.locator("button[mwlCalendarPreviousView]")
        self.next_week_btn = page.locator("button[mwlCalendarNextView]")
        self.current_date_display = page.locator("h3.text-content-100")
        
        self.calendar_week_view = page.locator("mwl-calendar-week-view")
        self.empty_slots = page.locator(".cal-hour-segment") 
        self.existing_events = page.locator(".schedule-view") 

        self.tooltip_menu = page.locator("#dialogue")
        self.view_details_opt = self.tooltip_menu.locator("li:has-text('View Details')")
        self.edit_details_opt = self.tooltip_menu.locator("li:has-text('Edit Details')")
        self.delete_opt = self.tooltip_menu.locator("li:has-text('Delete')")
        
        self.popup_container = page.locator(".form-content")
        self.popup_header = self.popup_container.locator("h1")
        self.close_popup_btn = self.popup_container.locator("img[src*='E remove.svg']")
        
        self.date_input = self.popup_container.locator("input[formControlName='date']")
        self.start_time_input = self.popup_container.locator("input[formControlName='fromTime']")
        self.end_time_input = self.popup_container.locator("input[formControlName='toTime']")
        
        self.save_btn = self.popup_container.locator("button[type='submit']")
        self.cancel_btn = self.popup_container.locator("button:has-text('Cancel')")
        
        # Delete Confirmation
        self.confirm_delete_btn = page.locator("app-delete-detail button.btn-danger")

    def navigate(self, base_url: str):
        """Goes to the Schedule page."""
        self.page.goto(f"{base_url}/#/user/schedule")
        self.header_title.wait_for()

    def open_add_schedule_popup(self):
        """Clicks an empty slot in the calendar to open the Add Modal."""
        self.empty_slots.first.click(force=True)
        self.popup_container.wait_for()

    def select_dropdown(self, control_name: str, value_text: str):
        """
        Selects a value from the custom app-form-dropdown in the popup.
        control_name: 'board', 'medium', 'className', 'subject', 'chapter', 'subTopic', 'lessonPlan'
        """
        dropdown = self.popup_container.locator(f"app-form-dropdown[dropdowncontrolname='{control_name}']")
        dropdown.click()
        # Wait for options to appear and click
        self.page.get_by_text(value_text, exact=True).first.click()

    def fill_schedule_time(self, date: str, start: str, end: str):
        """Fills the date and time fields."""
        self.date_input.fill(date)
        self.start_time_input.fill(start)
        self.end_time_input.fill(end)

    def save_form(self):
        self.save_btn.click()
        self.popup_container.wait_for(state="hidden")

    def click_existing_event(self):
        """Clicks the first existing event to show tooltip."""
        self.existing_events.first.click()
        self.tooltip_menu.wait_for()

    def delete_event(self):
        """Deletes the currently selected event via tooltip."""
        self.delete_opt.click()
        self.confirm_delete_btn.click()