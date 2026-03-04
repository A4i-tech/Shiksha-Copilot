from .base_page import BasePage
from playwright.sync_api import Page, expect


class ProfilePage(BasePage):
    def __init__(self, page: Page):
        super().__init__(page)

        # --- Page Heading ---
        self.heading = page.locator("h1", has_text="Setup Your Profile")

        # --- Profile Photo Section ---
        self.profile_image = page.locator("app-profile-image")
        self.choose_image_btn = page.locator("button", has_text="Choose Image")
        self.change_image_btn = page.locator("button", has_text="Change Image")
        self.remove_image_btn = page.locator("button", has_text="Remove")
        self.file_input = page.locator("#file_input")

        # --- Language ---
        self.language_label = page.locator("label", has_text="Language")
        self.language_switcher = page.locator("app-language-switcher")

        # --- Read-Only Info Fields ---
        self.name_input = page.locator("#first_name").first
        self.phone_input = page.locator("#last_name").first
        self.school_input = page.locator("#company").first
        # State, Zone, District, Taluk share generic IDs — locate by label context
        self.state_label = page.locator("label", has_text="State")
        self.zone_label = page.locator("label", has_text="Zone")
        self.district_label = page.locator("label", has_text="District")
        self.taluk_label = page.locator("label", has_text="Taluk")

        # --- Class Details Section ---
        self.class_details_heading = page.locator("h2", has_text="Class Details")
        self.class_table = page.locator("table[aria-label='school-profile-list']")
        self.class_table_rows = self.class_table.locator("tbody tr")
        self.add_class_btn = page.locator("button", has_text="Add").last
        self.delete_class_btn = page.locator(
            "button:has(img[src*='delete'])"
        )

        # --- Class Details Dropdowns (per row) ---
        # These are inside each table row as app-form-dropdown
        self.board_dropdowns = self.class_table.locator(
            "app-form-dropdown[ng-reflect-drop-down-control-name='board'],"
            + " app-form-dropdown"
        )

        # --- Resources Section ---
        self.resources_heading = page.locator("h2", has_text="Resources")
        self.resource_rows = page.locator(
            "ng-container[formArrayName='facilities'] > div"
        )
        self.add_resource_btn = page.locator(
            "button:has(img[src*='add']):has-text('Add')"
        ).last

        # --- Save Button ---
        self.save_btn = page.locator("button", has_text="Save profile")

        # --- Confirmation Modals ---
        self.delete_class_modal = page.locator(
            "app-delete-detail"
        ).filter(has_text="Delete Class Details")
        self.delete_resource_modal = page.locator(
            "app-delete-detail"
        ).filter(has_text="Delete Resource")
        self.delete_profile_image_modal = page.locator(
            "app-delete-detail"
        ).filter(has_text="Remove Profile Image")

    def navigate(self, base_url: str):
        """Navigate to the profile page."""
        self.page.goto(f"{base_url}/#/user/profile")
        self.heading.wait_for(state="visible", timeout=15000)

    def get_name_value(self) -> str:
        """Get the current value of the Name field."""
        return self.name_input.input_value()

    def get_phone_value(self) -> str:
        """Get the current value of the Phone field."""
        return self.phone_input.input_value()

    def get_school_value(self) -> str:
        """Get the current value of the School field."""
        return self.school_input.input_value()

    def get_class_row_count(self) -> int:
        """Get the number of class detail rows."""
        return self.class_table_rows.count()

    def click_save(self):
        """Click the Save profile button."""
        self.click_robust(self.save_btn)
