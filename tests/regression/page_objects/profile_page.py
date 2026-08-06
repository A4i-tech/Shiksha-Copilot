from .base_page import BasePage
from playwright.sync_api import Page, expect


class ProfilePage(BasePage):
    def __init__(self, page: Page):
        super().__init__(page)

        # --- Page Heading ---
        self.heading = page.get_by_test_id("profile-heading")

        # --- Profile Photo Section ---
        self.profile_image = page.get_by_test_id("profile-image")
        # Choose/Change Image is a single button whose label toggles based on
        # whether a profile image is already set.
        self.choose_image_btn = page.get_by_test_id("upload-image-btn")
        self.change_image_btn = page.get_by_test_id("upload-image-btn")
        self.remove_image_btn = page.get_by_test_id("remove-image-btn")
        self.file_input = page.get_by_test_id("profile-image-file-input")

        # --- Language ---
        self.language_label = page.get_by_test_id("language-label")
        self.language_switcher = page.get_by_test_id("language-switcher")

        # --- Read-Only Info Fields ---
        self.name_input = page.get_by_test_id("profile-name-input")
        self.phone_input = page.get_by_test_id("profile-phone-input")
        self.school_input = page.get_by_test_id("profile-school-input")
        self.state_label = page.get_by_test_id("state-label")
        self.zone_label = page.get_by_test_id("zone-label")
        self.district_label = page.get_by_test_id("district-label")
        self.taluk_label = page.get_by_test_id("taluk-label")

        # --- Class Details Section ---
        self.class_details_heading = page.get_by_test_id("class-details-heading")
        self.class_table = page.get_by_test_id("class-table")
        self.class_table_rows = page.get_by_test_id("class-row")
        self.add_class_btn = page.get_by_test_id("add-class-btn")
        self.delete_class_btn = page.get_by_test_id("delete-class-btn")

        # --- Class Details Dropdowns (per row) ---
        self.board_dropdowns = page.get_by_test_id("board-dropdown")

        # --- Resources Section ---
        self.resources_heading = page.get_by_test_id("resources-heading")
        self.resource_rows = page.get_by_test_id("resource-row")
        self.add_resource_btn = page.get_by_test_id("add-resource-btn")

        # --- Save Button ---
        self.save_btn = page.get_by_test_id("save-profile-btn")

        # --- Confirmation Modals ---
        self.delete_class_modal = page.get_by_test_id("delete-class-modal")
        self.delete_resource_modal = page.get_by_test_id("delete-resource-modal")
        self.delete_profile_image_modal = page.get_by_test_id(
            "delete-profile-image-modal"
        )

    def navigate(self, base_url: str):
        """Navigate to the profile page."""
        self.page.goto(f"{base_url}/#/profile")
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
