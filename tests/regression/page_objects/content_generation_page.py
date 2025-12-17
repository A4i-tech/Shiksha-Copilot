from playwright.sync_api import Page, expect

class ContentGenerationPage:
    def __init__(self, page: Page):
        self.page = page
        
        # --- List View Elements (/content-generation) ---
        self.list_header = page.locator("h1.main-heading")
        self.generate_resource_btn = page.locator("button:has-text('Generate Lesson Resource')").first
        self.generate_plan_btn = page.locator("button:has-text('Generate Lesson Plan')").first
        self.search_input = page.locator("input[placeholder*='Search']")
        self.content_cards = page.locator(".card")
        self.no_items_found = page.locator("h4:has-text('No items found')")
        
        # Filters (using your app-common-dropdown)
        # We will use the helper method for these

        # --- View/Edit Page Elements (/lesson-plan/:id) ---
        self.plan_header = page.locator("h1.font-bold.text-content")
        self.tabs_container = page.locator(".flex.border-b.border-gray-200")
        self.documents_tab = page.locator("button:has-text('Documents')")
        self.videos_tab = page.locator("button:has-text('Videos')")
        self.plan_tab = page.locator("button:has-text('Lesson Plan')").or_(page.locator("button:has-text('Lesson Resource')"))
        
        # Sections Navigation (Left Sidebar)
        self.section_nav_items = page.locator(".section-navigation div.cursor-pointer")
        
        # Edit Mode Elements
        self.edit_pen_icons = page.locator("img[src*='edit-pen.svg']")
        self.save_section_btns = page.locator("button:has-text('Save')")
        
        # Feedback & Final Save
        self.feedback_radio_group = page.locator("input[type='radio']")
        self.feedback_textarea = page.locator("textarea[placeholder*='Leave your comments']")
        self.save_final_btn = page.locator("button.btn-primary:has-text('Save')")
        self.save_changes_btn = page.locator("button:has-text('Save Changes')")

    def navigate_to_list(self, base_url: str):
        """Goes to the Content Generation List page."""
        self.page.goto(f"{base_url}/#/user/content-generation")
        self.list_header.wait_for()

    def start_generate_plan(self):
        """Clicks the Generate Lesson Plan button."""
        self.generate_plan_btn.click()
        self.page.wait_for_url("**/lesson-plan")

    def search_content(self, query: str):
        """Types into the search bar."""
        self.search_input.fill(query)
        self.page.wait_for_timeout(500) # Wait for debounce

    def open_first_content(self):
        """Opens the first available content card."""
        # Click either 'Continue Editing' or 'View Lesson Plan'
        btn = self.content_cards.first.locator("button")
        btn.click()
        self.page.wait_for_url("**/view/*", timeout=10000)

    def switch_tab(self, tab_name: str):
        """Switches tabs in the view page (Documents, Videos, Plan)."""
        if tab_name == "Documents":
            self.documents_tab.click()
        elif tab_name == "Videos":
            self.videos_tab.click()
        else:
            self.plan_tab.click()

    def select_feedback(self, value_idx=0):
        """Selects the Nth feedback radio button."""
        self.feedback_radio_group.nth(value_idx).click()
        
    def fill_feedback_comment(self, comment: str):
        self.feedback_textarea.fill(comment)

    def save_final_plan(self):
        """Clicks the bottom save button."""
        self.save_final_btn.click()