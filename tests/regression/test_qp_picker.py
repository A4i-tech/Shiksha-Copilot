import os
import re

import pytest
from playwright.sync_api import expect

from page_objects.qp_wizard_page import DEVICES, QPWizardPage, TOTAL_MARKS, install_generate_stub, new_context, paper_marks

BASE_URL = os.getenv("FRONTEND_URL")
SHORT_TYPE = "ANSWER_SHORT"
WARNING = re.compile(rf"select questions worth exactly {TOTAL_MARKS} marks", re.I)


@pytest.fixture(params=list(DEVICES))
def device(request):
    return request.param


@pytest.fixture
def wizard(browser_context, device):
    context = new_context(browser_context, **DEVICES[device])
    page = context.new_page()
    yield QPWizardPage(page, BASE_URL)
    context.close()


def _selected_card(wizard: QPWizardPage, text: str):
    return wizard.page.locator("app-question-bank-template div.relative.rounded.border", has_text=text).first


def _show(wizard: QPWizardPage, device: str, pane: str):
    if device != "desktop":
        (wizard.available_tab if pane == "pool" else wizard.selected_tab).click()


def test_partial_pool_blocks_generate_with_exact_marks_warning(wizard, device, step):
    stub = install_generate_stub(wizard.page, surplus=1, skip_types=(SHORT_TYPE,))
    wizard.open()
    wizard.to_step4()
    with step("Picker opens with a total below the target"):
        expect(wizard.toggle_btn).to_have_text(re.compile("Show Preview"))
        assert wizard.picker_total() < TOTAL_MARKS
    with step("Generate is blocked with the exact-marks warning"):
        wizard.generate_btn.click()
        expect(wizard.page.get_by_text(WARNING).first).to_be_visible()
        wizard.step_is(4)
        assert stub.final_payloads == []


def test_picker_remove_then_add_from_available_reaches_exact_total(wizard, device, step):
    stub = install_generate_stub(wizard.page, surplus=2)
    wizard.open()
    wizard.to_step4()
    wizard.open_picker()
    assert wizard.picker_total() == TOTAL_MARKS

    with step("Remove a 2-mark card from Selected"):
        _show(wizard, device, "selected")
        _selected_card(wizard, f"Stub {SHORT_TYPE}").get_by_role("button", name="×").click()
        assert wizard.picker_total() == TOTAL_MARKS - 2
    with step("Generate is blocked while the total is short"):
        wizard.generate_btn.click()
        expect(wizard.page.get_by_text(WARNING).first).to_be_visible()
        assert stub.final_payloads == []
    with step("Add a 2-mark card from Available"):
        _show(wizard, device, "pool")
        before = wizard.pool_cards.filter(has_text=f"Stub {SHORT_TYPE}").count()
        assert before > 0, "Available pane has no 2-mark card to add"
        wizard.pool_cards.filter(has_text=f"Stub {SHORT_TYPE}").first.click()
        expect(wizard.pool_cards.filter(has_text=f"Stub {SHORT_TYPE}")).to_have_count(before - 1)
        assert wizard.picker_total() == TOTAL_MARKS
    with step("Card now sits in Selected"):
        _show(wizard, device, "selected")
        expect(_selected_card(wizard, f"Stub {SHORT_TYPE}")).to_be_visible()
    with step("Generate now sends a paper worth the exact marks"):
        wizard.generate_btn.click()
        wizard.page.wait_for_url(re.compile(r"/question-papers/view/"))
        payload = stub.final_payloads[0]
        assert paper_marks(payload) == TOTAL_MARKS


def test_picker_never_exceeds_total_when_adding_everything(wizard, device, step):
    install_generate_stub(wizard.page, surplus=2)
    wizard.open()
    wizard.to_step4()
    wizard.open_picker()
    _show(wizard, device, "selected")
    _selected_card(wizard, f"Stub {SHORT_TYPE}").get_by_role("button", name="×").click()
    _show(wizard, device, "pool")
    for _ in range(wizard.pool_cards.count()):
        wizard.pool_cards.first.click()
        assert wizard.picker_total() <= TOTAL_MARKS
    assert wizard.picker_total() == TOTAL_MARKS
