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

    def navigate_to_wizard(self, base_url: str):
        self.page.goto(f"{base_url}/#/user/question-paper/generate")
        self.wizard_step_header.wait_for()

    def navigate_to_list(self, base_url: str):
        self.page.goto(f"{base_url}/#/user/question-paper")
        self.page.locator("h1", has_text="Question Papers").wait_for()

    def click_create_new_qp(self):
        self.create_btn_list.click()
        self.wizard_step_header.wait_for()

    # --- Dropdown Helpers ---
    def _get_dropdown_locator(self, control_name: str):
        control_map = {
            "board": 0, "sourceGeneration": 1, "grade": 2, "medium": 3,
            "subject": 4, "language": 5, "chapter": 6, "subTopic": 7
        }
        self.page.locator("app-form-dropdown").first.wait_for(state="visible")
        
        if control_name in control_map:
            index = control_map[control_name]
            dropdowns = self.page.locator("app-form-dropdown")
            if dropdowns.count() <= index:
                 dropdowns.nth(index).wait_for()
            return dropdowns.nth(index)
        else:
            return self.page.locator(f"app-form-dropdown[dropdowncontrolname='{control_name}']")

    def select_dropdown_option(self, control_name: str, value_text: str = None, index: int = 0, clear_first: bool = False):
        dropdown = self._get_dropdown_locator(control_name)
        dropdown.scroll_into_view_if_needed()
        if clear_first:
            clear_btn = dropdown.locator(".ng-clear-wrapper")
            try:
                clear_btn.wait_for(state="visible", timeout=2000)
                clear_btn.click()
                self.page.wait_for_timeout(500)
            except:
                pass
        dropdown.click()
        
        panel = self.page.locator("ng-dropdown-panel")
        panel.wait_for(state="visible")
        
        options = panel.locator(".ng-option")
        options.first.wait_for(state="visible", timeout=10000)
        
        if value_text:
            panel.get_by_text(value_text, exact=False).first.click(timeout=60000)
        else:
            options.nth(index).click(timeout=60000)

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