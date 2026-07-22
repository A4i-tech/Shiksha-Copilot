from playwright.sync_api import Page, expect
import re

class QuestionBankPage:
    def __init__(self, page: Page):
        self.page = page
        
        # --- Wizard Headers & Nav ---
        self.create_btn_list = page.locator("button.btn-primary:has-text('Generate Question Paper')")
        # Matches "Step 1/3: Configuration", "Step 2/3...", etc.
        self.wizard_step_header = page.locator("h2", has_text=re.compile(r"Step \d")) 
        self.next_btn = page.locator("button.btn-primary:has-text('Next')")
        
        # --- Step 1 Inputs ---
        self.exam_name_input = page.locator("input[formControlName='examinationName']")
        self.total_marks_input = page.locator("input[formControlName='totalMarks']")

        # --- Step 2 Elements ---
        # Specific locator for the Template Table to avoid strict mode violations
        self.template_table = page.locator("table[aria-label='question-configuration-list']")
        self.template_warning_msg = page.locator(".text-warn", has_text="Total Template Marks")

        # --- Step 3->4 nav & Step 4 Preview Elements ---
        self.preview_questions_btn = page.locator("button.btn-primary:has-text('Preview Questions')")
        self.preview_sections = page.locator(".section-drag")

    def navigate_to_wizard(self, base_url: str):
        self.page.goto(f"{base_url}/#/question-paper/generate")
        self.wizard_step_header.wait_for()

    def navigate_to_list(self, base_url: str):
        self.page.goto(f"{base_url}/#/question-paper")
        self.page.locator("h1", has_text="Question Papers").wait_for()

    def click_create_new_qp(self):
        self.create_btn_list.click()
        self.wizard_step_header.wait_for()

    # --- Dropdown Helpers ---
    def _get_dropdown_locator(self, control_name: str):
        """
        Robustly finds a dropdown by its label or control name.
        """
        # Prefer direct control-name binding when available.
        dropdown = self.page.locator(
            f"app-form-dropdown[ng-reflect-drop-down-control-name='{control_name}']"
        ).first

        if dropdown.count() == 0:
            # Fallback to index-based if attribute match fails.
            control_map = {
                "board": 0, "sourceGeneration": 1, "grade": 2, "medium": 3,
                "subject": 4, "language": 5, "chapter": 6, "subTopic": 7
            }
            index = control_map.get(control_name, 0)
            dropdown = self.page.locator("app-form-dropdown").nth(index)

        dropdown.scroll_into_view_if_needed()
        dropdown.wait_for(state="visible", timeout=10000)
        return dropdown

    def select_subtopic_if_present(self, index: int = 0):
        """
        For 'singleChapter' scope, Sub-Topic becomes a required field once the
        selected chapter has subtopics (*ngIf="questionBankTypeValue === 'singleChapter'
        && hasSubtopics"). Selects the first one when the control is present;
        no-op otherwise (chapter has no subtopics).
        """
        subtopic_dd = self.page.locator("app-form-dropdown[ng-reflect-drop-down-control-name='subTopic']").first
        if subtopic_dd.count() == 0:
            return
        self.select_dropdown_option("subTopic", index=index)

    def wait_for_dropdown_enabled(self, control_name: str, timeout: int = 20000):
        """
        Waits for a cascaded dropdown (e.g. 'chapter' after selecting subject) to
        become enabled, i.e. its upstream async data (chapters/paper config) has
        loaded. More reliable than wait_for_load_state('networkidle'), which never
        resolves on deployments with persistent background requests.
        """
        dropdown = self._get_dropdown_locator(control_name)
        ng_select = dropdown.locator("ng-select")
        expect(ng_select).not_to_have_class(re.compile(r"ng-select-disabled"), timeout=timeout)

    def is_dropdown_disabled(self, control_name: str) -> bool:
        """
        True when the app has disabled this dropdown — it auto-selected a single
        resolved value (e.g. only one board on this account) or is a cascaded
        field still awaiting an upstream selection. A disabled ng-select never
        opens its panel on click.
        """
        dropdown = self._get_dropdown_locator(control_name)
        ng_select_class = dropdown.locator("ng-select").get_attribute("class") or ""
        return "ng-select-disabled" in ng_select_class

    def select_dropdown_option(self, control_name: str, value_text: str = None, index: int = 0, clear_first: bool = False):
        dropdown = self._get_dropdown_locator(control_name)
        dropdown.scroll_into_view_if_needed()

        # Nothing to pick if the dropdown is disabled with an auto-selected value.
        if self.is_dropdown_disabled(control_name) and not clear_first:
            return

        if clear_first:
            clear_btn = dropdown.locator(".ng-clear-wrapper")
            try:
                clear_btn.wait_for(state="visible", timeout=2000)
                clear_btn.click(force=True)
                self.page.wait_for_timeout(500)
            except:
                pass
        
        # Open dropdown
        dropdown.locator(".ng-select-container").click(force=True)
        
        panel = self.page.locator("ng-dropdown-panel")
        try:
            panel.wait_for(state="visible", timeout=5000)
        except:
            # Retry with arrow
            dropdown.locator(".ng-arrow-wrapper").click(force=True)
            panel.wait_for(state="visible", timeout=10000)
        
        options = panel.locator(".ng-option")
        options.first.wait_for(state="visible", timeout=5000)
        
        if value_text == "SELECT_ALL":
            # For multi-select with "Select All" header. The header markup is
            # ".ng-dropdown-header" on the current app version (".ng-header-tmp"
            # was a stale selector from an older build and never matched).
            select_all_checkbox = panel.locator(".ng-dropdown-header input[type='checkbox']")
            if select_all_checkbox.is_visible(timeout=2000):
                select_all_checkbox.click(force=True)
            else:
                # Fallback: click all options if select all header is missing
                for i in range(options.count()):
                    options.nth(i).click(force=True)
        elif value_text:
            panel.locator(".ng-option", has_text=value_text).first.click(force=True, timeout=60000)
        else:
            options.nth(index).click(force=True, timeout=60000)

    def select_radio_option(self, value_key: str):
        text_map = {"singleChapter": "Single Chapter", "multiChapter": "Multiple Chapters"}
        if value_key in text_map:
            self.page.get_by_text(text_map[value_key], exact=False).first.click()
        else:
            self.page.locator(f"input[type='radio'][value='{value_key}']").click(force=True)

    def select_from_common_dropdown(self, parent_locator, value_to_select: str = None, index: int = 0):
        """Handles 'app-common-dropdown' used in the Template table."""
        dropdown = parent_locator.locator("app-common-dropdown")
        dropdown.click()
        
        try:
            panel = self.page.locator("ng-dropdown-panel")
            if panel.is_visible(timeout=3000):
                if value_to_select:
                    panel.get_by_text(value_to_select, exact=False).first.click()
                else:
                    panel.locator(".ng-option").nth(index).click()
                return
        except:
            pass
        
        if value_to_select:
             self.page.get_by_text(value_to_select, exact=True).first.click()
        else:
             self.page.keyboard.press("ArrowDown")
             self.page.keyboard.press("Enter")

    def reset_template_to_single_row(self):
        """
        Deletes extra rows in the template table until only 1 remains.
        Scoped specifically to the template table.
        """
        # Wait for the specific template table to be visible
        self.template_table.wait_for(state="visible")
        
        # Find delete buttons ONLY inside this table
        delete_btn = self.template_table.locator("button.btn-danger")
        
        # Keep deleting while delete buttons exist (meaning > 1 row)
        while delete_btn.count() > 0:
            delete_btn.first.click()
            self.page.wait_for_timeout(500)

    def fill_template_row(self, row_index: int, q_type: str, count: str, marks: str):
        """
        Cleans up the table to 1 row, then fills it.
        """
        # 1. Clean up extra rows first
        self.reset_template_to_single_row()

        # 2. Get the specific row inside the template table
        row = self.template_table.locator("tbody tr").nth(row_index)
        
        # 3. Select Question Type
        cell_type = row.locator("td").nth(0)
        if q_type == "AUTO":
             self.select_from_common_dropdown(cell_type, index=0)
        else:
             self.select_from_common_dropdown(cell_type, value_to_select=q_type)
        
        # 4. Fill Number of Questions
        count_input = row.locator("td").nth(1).locator("input")
        count_input.clear()
        count_input.fill(count)
        count_input.press("Tab") 

        # 5. Fill Marks per Question
        marks_input = row.locator("td").nth(2).locator("input")
        marks_input.clear()
        marks_input.fill(marks)
        marks_input.press("Tab")
        
        # 6. Wait for warning to be hidden (Total Marks Matched)
        expect(self.template_warning_msg).to_be_hidden(timeout=5000)

    def verify_step_2_loaded(self):
        self.page.locator("h2", has_text="Question Paper Template").wait_for()

    def verify_step_3_loaded(self):
        self.page.locator("h2", has_text=re.compile(r"Blue Print", re.IGNORECASE)).wait_for(timeout=45000)

    def click_next(self):
        self.next_btn.click()

    def click_generate(self):
        self.page.locator("button.btn-primary", has_text="Generate Question Paper").click()

    def click_preview_questions(self):
        """Step 3 -> Step 4: generates the question pool and opens the final preview/blueprint."""
        self.preview_questions_btn.click()

    def ensure_preview_visible(self):
        """
        Step 4 opens in the question picker (not the blueprint preview) whenever
        the auto-picked questions don't sum to exactly totalMarks (pickerOpen).
        Toggles to the preview via the 'Show Preview' button if the picker is
        currently showing.
        """
        show_preview_btn = self.page.locator("button.btn-outline-primary:has-text('Show Preview')")
        if show_preview_btn.is_visible(timeout=3000):
            show_preview_btn.click()

    def get_preview_sections(self):
        """
        Returns (type, marksPerQuestion) for every section rendered in the Step 4
        blueprint preview (app-question-bank-blue-print), in display order.
        Two sections of the same type but different marks are valid (e.g. 1-mark
        MCQ and 2-mark MCQ); only an exact (type, marks) repeat is a regression
        of the duplicate-section merge bug (issue #421).

        Parses the visible "N. <Type>" heading and the "<count> Questions x
        <marks> Marks" badge (en.json translation) rather than relying on any
        new markup/attributes.
        """
        self.preview_sections.first.wait_for(state="visible", timeout=20000)
        count = self.preview_sections.count()
        sections = []
        for i in range(count):
            section = self.preview_sections.nth(i)
            heading_text = section.locator("h3").inner_text()
            question_type = re.sub(r"^\d+\.\s*", "", heading_text).strip()

            badge_text = section.locator("span.bg-primary-10").inner_text()
            marks_match = re.search(r"x\s*([\d½.]+)\s*Marks", badge_text)
            marks = marks_match.group(1) if marks_match else badge_text.strip()

            sections.append((question_type, marks))
        return sections
