from playwright.sync_api import Page, expect

class ProfilePage:
    def __init__(self, page: Page):
        self.page = page
        
        self.header_title = page.locator("h1:has-text('Setup Your Profile')")
        self.upload_photo_btn = page.locator("button:has-text('Choose Image')").or_(page.locator("button:has-text('Change Image')"))
        self.remove_photo_btn = page.locator("button:has-text('Remove')")
        
        self.name_input = page.locator("input[placeholder='Enter your name']")
        self.phone_input = page.locator("input[placeholder='Enter your phone number']")
        self.school_input = page.locator("input#company").first 
        
        self.add_class_btn = page.locator("button img[alt='plus']").first
        
        self.add_resource_btn = page.locator("button:has-text('Add')").last
        self.save_profile_btn = page.locator("button:has-text('Save profile')")
        
        self.delete_modal_heading = page.locator("app-delete-detail h1") 
        self.delete_confirm_btn = page.locator("app-delete-detail button.btn-danger") 

    def navigate(self, base_url: str):
        """Goes to the Profile page."""
        self.page.goto(f"{base_url}/#/user/profile")
        self.header_title.wait_for()

    def get_read_only_value(self, field_name: str) -> str:
        """Helper to get value from locked inputs."""
        if field_name == "name":
            return self.name_input.input_value()
        elif field_name == "phone":
            return self.phone_input.input_value()
        return ""

    def add_new_class_row(self):
        """Clicks the + button to add a class row."""
        self.page.locator("table tbody tr button img[alt='plus']").last.click()

    def delete_class_row(self, index=0):
        """Clicks the delete button for a specific row index (if > 0)."""
        row = self.page.locator("table tbody tr").nth(index)
        row.locator("img[alt='trash']").click()

    def select_class_dropdown(self, row_index: int, control_name: str, value: str):
        """
        Selects a value in the class table dropdowns.
        control_name: 'board', 'medium', 'class', 'subject'
        """
        # 1. Scope to the specific row
        row = self.page.locator("table tbody tr").nth(row_index)
        
        dropdown = row.locator(f"app-form-dropdown[dropdowncontrolname='{control_name}']")
        dropdown.click()
        
        self.page.get_by_text(value, exact=True).first.click()

    def save_changes(self):
        self.save_profile_btn.click()

    def confirm_delete_modal(self):
        """Clicks 'Delete' or 'Remove' on the confirmation popup."""
        self.page.locator("app-delete-detail button").last.click()