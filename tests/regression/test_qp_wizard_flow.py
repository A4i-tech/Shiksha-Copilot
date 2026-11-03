import os
import re

import pytest
from playwright.sync_api import expect

from page_objects.qp_wizard_page import QPWizardPage, TOTAL_MARKS, install_generate_stub, paper_marks

BASE_URL = os.getenv("FRONTEND_URL")


@pytest.fixture
def wizard(logged_in_page):
    return QPWizardPage(logged_in_page, BASE_URL)


def test_happy_path_step4_marks_match_config(wizard, step):
    stub = install_generate_stub(wizard.page)
    with step("Walk Step 1 to Step 4"):
        wizard.open()
        wizard.to_step4()
    with step("Step 4 shows the preview with the configured marks"):
        expect(wizard.announcement).to_contain_text("Step 4 of 4")
        expect(wizard.toggle_btn).to_have_text(re.compile("Change Questions"))
        assert wizard.preview_sections.count() > 0
        assert wizard.preview_marks_total() == TOTAL_MARKS
    with step("Generate sends a paper worth the configured marks"):
        wizard.generate_btn.click()
        wizard.page.wait_for_url(re.compile(r"/question-papers/view/"))
        assert len(stub.final_payloads) == 1
        assert paper_marks(stub.final_payloads[0]) == TOTAL_MARKS


@pytest.fixture
def wizard_after_empty_generate(wizard):
    install_generate_stub(wizard.page, mode="empty")
    wizard.open()
    wizard.to_step3()
    wizard.preview_btn.click()
    return wizard


@pytest.mark.xfail(
    strict=True,
    raises=AssertionError,
    reason="BUG-127 cause 1: empty result shows blank Step 4, A4i-tech/.github#747",
)
def test_all_batches_fail_shows_error_not_blank_step4(wizard_after_empty_generate, step):
    wizard = wizard_after_empty_generate
    with step("Teacher sees an explicit failure message"):
        expect(wizard.toast.first).to_be_visible(timeout=10000)


def test_slow_generate_shows_spinner_then_step4(wizard, step):
    install_generate_stub(wizard.page, delay_ms=3000)
    wizard.open()
    wizard.to_step3()
    wizard.preview_btn.click()
    with step("Spinner shows while the call is pending"):
        expect(wizard.preview_btn).to_have_text(re.compile("Generating questions"))
        expect(wizard.preview_btn).to_be_disabled()
        expect(wizard.announcement).to_contain_text("Step 3 of 4")
    with step("Step 4 opens after the response"):
        wizard.step_is(4)
        assert wizard.preview_marks_total() == TOTAL_MARKS


@pytest.mark.parametrize("failure", ["http500", "abort"])
def test_generate_failure_shows_error_and_allows_retry(wizard, step, failure):
    stub = install_generate_stub(wizard.page, mode=failure)
    wizard.open()
    wizard.to_step3()
    wizard.preview_btn.click()
    with step("Error is shown and the spinner stops"):
        expect(wizard.toast.first).to_be_visible(timeout=15000)
        expect(wizard.preview_btn).to_have_text(re.compile("Preview Questions"), timeout=15000)
        expect(wizard.preview_btn).to_be_enabled()
        expect(wizard.announcement).to_contain_text("Step 3 of 4")
    with step("Retry succeeds once the service recovers"):
        stub.mode = "ok"
        wizard.page.locator(".toast-error").first.click()
        expect(wizard.page.locator(".toast-error")).to_have_count(0)
        wizard.preview_btn.click()
        wizard.step_is(4)
        assert wizard.preview_marks_total() == TOTAL_MARKS
    assert len(stub.preview_calls) == 2


def test_visibility_change_during_pending_generate_still_completes(wizard, step):
    stub = install_generate_stub(wizard.page, hold=True)
    wizard.open()
    wizard.to_step3()
    wizard.preview_btn.click()
    expect(wizard.preview_btn).to_have_text(re.compile("Generating questions"))
    with step("Tab goes hidden then visible while the call is pending"):
        for state in ("hidden", "visible"):
            wizard.page.evaluate(
                """state => {
                    Object.defineProperty(document, 'visibilityState', { get: () => state, configurable: true });
                    Object.defineProperty(document, 'hidden', { get: () => state === 'hidden', configurable: true });
                    document.dispatchEvent(new Event('visibilitychange'));
                }""",
                state,
            )
        expect(wizard.preview_btn).to_have_text(re.compile("Generating questions"))
        expect(wizard.announcement).to_contain_text("Step 3 of 4")
    with step("Response arrives and Step 4 opens"):
        assert len(stub.held) == 1
        stub.release()
        wizard.step_is(4)
        assert wizard.preview_marks_total() == TOTAL_MARKS
