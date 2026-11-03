import os

import pytest
from playwright.sync_api import expect

from page_objects.qp_wizard_page import QPWizardPage, new_context

BASE_URL = os.getenv("FRONTEND_URL")


@pytest.fixture
def no_structured_clone_page(browser_context):
    context = new_context(browser_context)
    context.add_init_script("delete window.structuredClone")
    page = context.new_page()
    wizard = QPWizardPage(page, BASE_URL)
    wizard.open()
    assert page.evaluate("typeof structuredClone") == "undefined"
    wizard._pick("dropdown-grade", "10")
    wizard._pick("dropdown-subject", "Physical")
    yield page
    context.close()


@pytest.mark.xfail(
    strict=True,
    raises=AssertionError,
    reason="structuredClone missing, question-bank-generation.component.ts:429-430,1037, A4i-tech/.github#747",
)
def test_step1_loads_chapters_without_structured_clone(no_structured_clone_page, step):
    page = no_structured_clone_page
    with step("Chapter dropdown lists chapters"):
        page.get_by_test_id("dropdown-chapter").locator(".ng-select-container").click(force=True)
        expect(page.locator("ng-dropdown-panel .ng-option").first).to_be_visible(timeout=10000)
