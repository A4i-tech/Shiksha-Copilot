from .base_page import BasePage
from playwright.sync_api import Page, expect


class ContentGenerationPage(BasePage):
    def __init__(self, page: Page):
        super().__init__(page)

        # --- List Page (lesson-content-list) ---
        self.list_heading = page.locator("h1", has_text="Lesson Content")
        self.generate_resource_btn = page.locator(
            "button", has_text="Generate Lesson Resource"
        )
        self.generate_plan_btn = page.locator(
            "button", has_text="Generate Lesson Plan"
        )
        self.search_input = page.locator("input[type='text']").filter(
            has_text=""
        )  # Search box
        self.content_cards = page.locator(".card")
        self.no_items_msg = page.locator("h4", has_text="No items found")

        # Filter dropdowns (app-common-dropdown)
        self.status_dropdown = page.locator("app-common-dropdown").nth(0)
        self.type_dropdown = page.locator("app-common-dropdown").nth(1)
        self.board_dropdown = page.locator("app-common-dropdown").nth(2)

        # --- View/Edit Page (lesson-plan-view-edit) ---
        self.back_arrow = page.locator("img[src*='back-arrow']")

        # Tabs
        self.plan_tab = page.locator("button.px-4.py-2.-mb-px").first
        self.videos_tab = page.locator("button", has_text="Videos")
        self.documents_tab = page.locator("button", has_text="Documents")

        # Section navigation sidebar
        self.section_nav = page.locator(".section-navigation").first
        self.chapter_details_btn = page.locator("p", has_text="Chapter Details")

        # Feedback section
        self.feedback_heading = page.locator("h2", has_text="Feedback")
        self.feedback_textarea = page.locator(
            "textarea[placeholder*='Leave your comments']"
        )
        self.save_btn = page.locator("button", has_text="Save").first
        self.save_changes_btn = page.locator("button", has_text="Save Changes")

        # Draft confirmation modal
        self.draft_modal = page.locator("app-delete-detail")
        self.save_draft_btn = self.draft_modal.locator(
            "button", has_text="Save as Draft"
        )

        # --- Documents Tab (lesson-plan-documents) ---
        self.document_cards = page.locator(
            ".bg-white.shadow.rounded-lg"
        )
        self.download_buttons = page.locator("button", has_text="Download")
        self.pdf_icon = page.locator("img[src*='pdf']")
        self.docx_icon = page.locator("img[src*='docx']")
        self.documents_warning = page.locator(
            "small",
            has_text="Documents will be available for download",
        )

        # Card details
        self.card_subject_labels = page.locator("h4", has_text="Subject")
        self.card_view_buttons = page.locator(
            "button:has-text('View Lesson'), button:has-text('Continue Editing')"
        )

    def navigate_to_list(self, base_url: str):
        """Navigate to the content generation list page."""
        self.page.goto(f"{base_url}/#/user/content-generation")
        self.page.wait_for_load_state("networkidle")

    def click_generate_lesson_plan(self):
        """Click the 'Generate Lesson Plan' button."""
        self.click_robust(self.generate_plan_btn)

    def click_generate_lesson_resource(self):
        """Click the 'Generate Lesson Resource' button."""
        self.click_robust(self.generate_resource_btn)

    def click_first_card(self):
        """Click first content card in the list."""
        self.content_cards.first.wait_for(state="visible", timeout=10000)
        card_btn = self.content_cards.first.locator("button").first
        self.click_robust(card_btn)

    def switch_to_documents_tab(self):
        """Switch to the Documents tab on the view/edit page."""
        self.click_robust(self.documents_tab)

    def switch_to_videos_tab(self):
        """Switch to the Videos tab on the view/edit page."""
        self.click_robust(self.videos_tab)

    def get_card_count(self) -> int:
        """Return count of content cards on the list page."""
        return self.content_cards.count()
