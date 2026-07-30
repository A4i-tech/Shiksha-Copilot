from .base_page import BasePage
from playwright.sync_api import Page


class GenerationStatusPage(BasePage):
    def __init__(self, page: Page):
        super().__init__(page)
        # h1 only renders when type === 'status' (route /user/generation-status)
        self.heading = page.get_by_test_id("generation-status-heading")
        # Cards: one per item in the grid
        self.status_cards = page.get_by_test_id("generation-status-card")
        # Status badge spans: 'running', 'completed', 'failed', or 'Regenerated'
        self.status_badge_spans = page.get_by_test_id("generation-status-badge")
        # Empty state: "No items found"
        self.empty_msg = page.get_by_test_id("generation-status-empty")

    def navigate(self, base_url: str):
        self.page.goto(f"{base_url}/#/generation-status")
        self.page.wait_for_load_state("networkidle")

    def get_card_count(self) -> int:
        return self.status_cards.count()

    def get_badge_texts(self) -> list:
        count = self.status_badge_spans.count()
        return [self.status_badge_spans.nth(i).inner_text().strip() for i in range(count)]
