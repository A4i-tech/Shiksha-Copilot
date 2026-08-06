from .base_page import BasePage
from playwright.sync_api import Page


class HelpPage(BasePage):
    def __init__(self, page: Page):
        super().__init__(page)
        # h1, text "Explore Our Video Guides"
        self.heading = page.get_by_test_id("help-heading")
        # Video items are rendered inline as iframes (no modal on click)
        self.video_iframes = page.get_by_test_id("help-video-iframe")
        # Each video is wrapped in an <article> card
        self.video_containers = page.get_by_test_id("help-video-card")

    def navigate(self, base_url: str):
        self.page.goto(f"{base_url}/#/help")
        self.page.wait_for_load_state("domcontentloaded")
        self.heading.wait_for(state="visible", timeout=15000)

    def get_video_count(self) -> int:
        return self.video_iframes.count()
