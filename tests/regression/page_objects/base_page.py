from playwright.sync_api import Page, expect

class BasePage:
    def __init__(self, page: Page):
        self.page = page
        self.spinner = page.get_by_test_id("loading-spinner")
        self.backdrop = page.locator(".cdk-overlay-backdrop")

    def wait_for_overlays(self, timeout=10000):
        """
        Waits for common UI overlays like spinners and backdrops to be hidden.
        """
        try:
            # Wait for spinner to be hidden if it exists
            if self.spinner.count() > 0:
                self.spinner.wait_for(state="hidden", timeout=timeout)
            
            # Wait for backdrops to be hidden if they exist
            if self.backdrop.count() > 0:
                self.backdrop.wait_for(state="hidden", timeout=timeout)
        except Exception as e:
            print(f"Warning: Timeout waiting for overlays to clear: {e}")

    def click_robust(self, selector_or_locator, timeout=10000):
        """
        Waits for overlays to clear before clicking.
        """
        self.wait_for_overlays(timeout=timeout)
        if isinstance(selector_or_locator, str):
            locator = self.page.locator(selector_or_locator)
        else:
            locator = selector_or_locator
        
        locator.wait_for(state="visible", timeout=timeout)
        locator.click(timeout=timeout)
