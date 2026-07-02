from .base_page import BasePage
from playwright.sync_api import Page


class GenerationStatusPage(BasePage):
    def __init__(self, page: Page):
        super().__init__(page)
        # h1 only renders when type === 'status' (route /user/generation-status)
        self.heading = page.locator("h1.main-heading")
        # Cards: div.card per item in the grid
        self.status_cards = page.locator("div.card")
        # Status badge spans: text-xs text-white inside colored badge divs
        # Status values in template: 'running', 'completed', 'failed'
        self.status_badge_spans = page.locator("div.rounded-2xl span.text-xs.text-white")
        # Empty state: h4 "No items found"
        self.empty_msg = page.locator("h4", has_text="No items found")

    def navigate(self, base_url: str):
        self.page.goto(f"{base_url}/#/user/generation-status")
        self.page.wait_for_load_state("networkidle")

    def get_card_count(self) -> int:
        return self.status_cards.count()

    def get_badge_texts(self) -> list:
        count = self.status_badge_spans.count()
        return [self.status_badge_spans.nth(i).inner_text().strip() for i in range(count)]
