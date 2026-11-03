import json
import re
from dataclasses import dataclass, field

from playwright.sync_api import Page, Route, expect

WIZARD_PATH = "/#/question-papers/generate"
GENERATE_URL = "**/api/question-bank/generate"

DEVICES = {
    "desktop": dict(viewport={"width": 1440, "height": 900}),
    "iPhone 13": dict(
        viewport={"width": 390, "height": 664},
        user_agent=(
            "Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15 "
            "(KHTML, like Gecko) Version/15.0 Mobile/15E148 Safari/604.1"
        ),
        device_scale_factor=3,
        is_mobile=True,
        has_touch=True,
    ),
    "Pixel 7": dict(
        viewport={"width": 412, "height": 839},
        user_agent=(
            "Mozilla/5.0 (Linux; Android 14; Pixel 7) AppleWebKit/537.36 "
            "(KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36"
        ),
        device_scale_factor=2.625,
        is_mobile=True,
        has_touch=True,
    ),
}

TOTAL_MARKS = 5


def new_context(browser_context, **kwargs):
    return browser_context.browser.new_context(
        storage_state=browser_context.storage_state(), **kwargs
    )


def parse_marks(text: str) -> float:
    # The app renders half marks as "½".
    text = text.strip()
    half = 0.5 if "½" in text else 0
    digits = re.sub(r"[^0-9.]", "", text)
    return (float(digits) if digits else 0.0) + half


@dataclass
class GenerateStub:
    mode: str = "ok"
    delay_ms: int = 0
    surplus: int = 0
    skip_types: tuple = ()
    hold: bool = False
    paper_id: str = "000000000000000000000747"
    held: list = field(default_factory=list)
    preview_calls: list = field(default_factory=list)
    final_payloads: list = field(default_factory=list)

    def _question(self, qtype: str, marks, n: int) -> dict:
        q = {
            "question": [{"contentType": "text/plain", "content": f"Stub {qtype} {marks}m question {n}"}],
            "keyAnswer": [{"contentType": "text/plain", "content": "Stub answer"}],
            "objective": "Knowledge",
        }
        if qtype == "MCQ":
            q["options"] = [
                {"label": label, "text": [{"contentType": "text/plain", "content": f"Option {label}"}]}
                for label in "ABCD"
            ]
        return q

    def _blocks(self, template: list) -> list:
        counts: dict = {}
        for slot in template:
            key = (slot["type"], float(slot["marksPerQuestion"]))
            counts[key] = counts.get(key, 0) + 1
        blocks = []
        for (qtype, marks), count in counts.items():
            total = 0 if qtype in self.skip_types else count + self.surplus
            blocks.append(
                {
                    "type": qtype,
                    "numberOfQuestions": total,
                    "marksPerQuestion": marks,
                    "answerCount": total,
                    "questions": [self._question(qtype, marks, i + 1) for i in range(total)],
                }
            )
        return blocks

    def release(self):
        held, self.held = self.held, []
        for route in held:
            self.handle(route)

    def handle(self, route: Route):
        body = json.loads(route.request.post_data)
        if body.get("isPreview") is not True:
            self.final_payloads.append(body)
            return route.fulfill(
                status=200,
                content_type="application/json",
                body=json.dumps({"success": True, "data": {"_id": self.paper_id}}),
            )
        self.preview_calls.append(body)
        if self.mode == "abort":
            return route.abort("connectionreset")
        if self.mode == "http500":
            return route.fulfill(
                status=500,
                content_type="application/json",
                body=json.dumps({"success": False, "message": "Something went wrong with copilot! Please try later"}),
            )
        blocks = self._blocks(body["template"])
        if self.mode == "empty":
            for block in blocks:
                block["questions"] = []
                block["numberOfQuestions"] = 0
        return route.fulfill(
            status=200,
            content_type="application/json",
            body=json.dumps({"success": True, "data": {"questions": blocks}}),
        )


def install_generate_stub(page: Page, **kwargs) -> GenerateStub:
    stub = GenerateStub(**kwargs)

    def handler(route: Route):
        if route.request.method != "POST":
            return route.fallback()
        if stub.hold:
            stub.held.append(route)
            return
        if stub.delay_ms:
            # Delay in the browser clock so the page sees a slow server.
            page.evaluate("ms => new Promise(r => setTimeout(r, ms))", stub.delay_ms)
        stub.handle(route)

    page.route(GENERATE_URL, handler)
    return stub


class QPWizardPage:
    def __init__(self, page: Page, base_url: str):
        self.page = page
        self.base_url = base_url
        self.announcement = page.locator("#step-announcement")
        self.next_btn = page.get_by_test_id("wizard-next-btn")
        self.preview_btn = page.get_by_test_id("preview-questions")
        self.toggle_btn = page.get_by_test_id("toggle-picker-preview-btn")
        self.generate_btn = page.get_by_test_id("generate-final-question-paper-btn")
        self.toast = page.locator(".toast-message, .toast-container .toast")
        self.preview_sections = page.get_by_test_id("preview-section")
        self.pool_cards = page.locator("app-question-bank-template .pool-item")
        self.available_tab = page.locator("app-question-bank-template button", has_text=re.compile(r"^\s*Available"))
        self.selected_tab = page.locator("app-question-bank-template button", has_text=re.compile(r"^\s*Selected \("))

    def open(self):
        self.page.goto(f"{self.base_url}{WIZARD_PATH}")
        self.page.get_by_test_id("wizard-step-header").wait_for()

    def step_is(self, n: int):
        expect(self.announcement).to_contain_text(f"Step {n} of 4", timeout=20000)

    def _pick(self, test_id: str, text: str | None = None, index: int = 0):
        dropdown = self.page.get_by_test_id(test_id)
        enabled = dropdown.locator("ng-select:not(.ng-select-disabled)")
        auto_selected = dropdown.locator("ng-select.ng-select-disabled .ng-value")
        expect(enabled.or_(auto_selected).first).to_be_visible(timeout=20000)
        if auto_selected.count():
            return  # The app disables a dropdown that has a single option and selects it.
        panel = self.page.locator("ng-dropdown-panel")
        options = panel.locator(".ng-option")
        for _ in range(10):
            dropdown.locator(".ng-select-container").click()
            try:
                expect(options.first).to_be_visible(timeout=3000)
                break
            except AssertionError:
                self.page.keyboard.press("Escape")
        else:
            raise AssertionError(f"Dropdown {test_id} never showed options after 10 attempts")
        target = options.filter(has_text=text).first if text else options.nth(index)
        target.click(force=True)

    def fill_step1(self, total_marks: int = TOTAL_MARKS, exam: str = "QP regression 747"):
        self._pick("dropdown-grade", "10")
        self._pick("dropdown-subject", "Physical")
        self._pick("dropdown-chapter", index=0)
        subtopic = self.page.get_by_test_id("dropdown-sub-topic")
        if subtopic.count():
            self._pick("dropdown-sub-topic", index=0)
            self.page.keyboard.press("Escape")
        self.page.get_by_test_id("examination-name-input").fill(exam)
        self.page.get_by_test_id("total-marks-input").fill(str(total_marks))

    def to_step3(self, total_marks: int = TOTAL_MARKS):
        self.fill_step1(total_marks)
        self.next_btn.click()
        self.step_is(2)
        self.page.get_by_test_id("template-question-table").wait_for()
        self.next_btn.click()
        self.step_is(3)
        expect(self.preview_btn).to_be_enabled()

    def to_step4(self, total_marks: int = TOTAL_MARKS):
        self.to_step3(total_marks)
        self.preview_btn.click()
        self.step_is(4)

    def picker_total(self) -> float:
        counter = self.page.locator("app-question-bank-template").get_by_text(re.compile(r"/\s*[\d½.]+\s*Marks")).locator("visible=true").first
        expect(counter).to_be_visible()
        current = counter.locator("xpath=preceding-sibling::span[1]").inner_text()
        return parse_marks(current)

    def preview_marks_total(self) -> float:
        total = 0.0
        for i in range(self.preview_sections.count()):
            badge = self.preview_sections.nth(i).get_by_test_id("preview-section-marks-badge").inner_text()
            m = re.search(r"(\d+)\s*Questions?\s*x\s*([\d½.]+)", badge, re.I)
            assert m, f"cannot parse badge: {badge!r}"
            total += int(m.group(1)) * parse_marks(m.group(2))
        return total

    def open_picker(self):
        if self.toggle_btn.inner_text().strip() == "Change Questions":
            self.toggle_btn.click()
        expect(self.toggle_btn).to_have_text(re.compile("Show Preview"))


def paper_marks(payload: dict) -> float:
    return sum(float(s["answerCount"]) * float(s["marksPerQuestion"]) for s in payload["questions"])
