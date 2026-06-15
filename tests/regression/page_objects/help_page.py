from .base_page import BasePage
from playwright.sync_api import Page


class HelpPage(BasePage):
    def __init__(self, page: Page):
        super().__init__(page)
        # h1 with class main-heading, text "Explore Our Video Guides"
        self.heading = page.locator("h1.main-heading")
        # Video items are rendered inline as iframes (no modal on click)
        self.video_iframes = page.locator("iframe")
        # Each video is wrapped in div.bg-white.border.rounded
        self.video_containers = page.locator("div.bg-white.border.rounded")

    def navigate(self, base_url: str):
        self.page.goto(f"{base_url}/#/user/help")
        self.page.wait_for_load_state("domcontentloaded")
        self.heading.wait_for(state="visible", timeout=15000)

    def get_video_count(self) -> int:
        return self.video_iframes.count()
