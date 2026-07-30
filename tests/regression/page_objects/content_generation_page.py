from .base_page import BasePage
from playwright.sync_api import Page, expect


class ContentGenerationPage(BasePage):
    def __init__(self, page: Page):
        super().__init__(page)

        # --- List Page (lesson-content-list) ---
        self.list_heading = page.get_by_test_id("lesson-content-heading")
        self.generate_resource_btn = page.get_by_test_id(
            "generate-lesson-resource-btn"
        )
        self.generate_plan_btn = page.get_by_test_id("generate-lesson-plan-btn")
        self.search_input = page.get_by_test_id("content-search-input")
        self.content_cards = page.get_by_test_id("content-card")
        self.no_items_msg = page.get_by_test_id("no-items-message")

        # Filter dropdowns (app-common-dropdown)
        self.status_dropdown = page.get_by_test_id("status-dropdown")
        self.type_dropdown = page.get_by_test_id("type-dropdown")
        self.board_dropdown = page.get_by_test_id("board-dropdown")

        # --- View/Edit Page (lesson-plan-view-edit) ---
        self.back_arrow = page.get_by_test_id("back-arrow-btn")

        # Tabs
        self.plan_tab = page.get_by_test_id("content-type-tab")
        self.videos_tab = page.get_by_test_id("videos-tab-btn")
        self.documents_tab = page.get_by_test_id("documents-tab-btn")

        # Section navigation sidebar
        self.section_nav = page.get_by_test_id("section-navigation")
        self.chapter_details_btn = page.get_by_test_id("chapter-details-toggle")

        # Feedback section
        self.feedback_heading = page.get_by_test_id("feedback-heading")
        self.feedback_textarea = page.get_by_test_id("feedback-textarea")
        # "Save Changes" (view mode) and "Save <type>" (edit mode) are mutually
        # exclusive on the page, mirroring the old `has_text="Save"`.first behavior.
        self.save_btn = page.get_by_test_id("save-changes-btn").or_(
            page.get_by_test_id("save-content-btn")
        )
        self.save_changes_btn = page.get_by_test_id("save-changes-btn")

        # Draft confirmation modal
        self.draft_modal = page.get_by_test_id("draft-confirmation-modal")
        self.save_draft_btn = self.draft_modal.get_by_test_id(
            "delete-detail-primary-btn"
        )

        # --- Documents Tab (lesson-plan-documents) ---
        self.document_cards = page.get_by_test_id("document-card")
        self.download_buttons = page.get_by_test_id("download-btn")
        self.pdf_icon = page.get_by_test_id("pdf-icon")
        self.docx_icon = page.get_by_test_id("docx-icon")
        self.documents_warning = page.get_by_test_id("documents-warning-message")

        # Card details
        self.card_subject_labels = page.get_by_test_id("card-subject-label")
        self.card_view_buttons = page.get_by_test_id("card-view-button")

    def navigate_to_list(self, base_url: str):
        """Navigate to the content generation list page."""
        self.page.goto(f"{base_url}/#/content-generation")
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
