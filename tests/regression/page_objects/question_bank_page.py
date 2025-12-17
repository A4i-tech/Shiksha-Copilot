from playwright.sync_api import Page, expect

class QuestionBankPage:
    def __init__(self, page: Page):
        self.page = page
        
        self.create_btn_list = page.locator("button.btn-primary:has-text('Generate Question Paper')")
        self.wizard_step_header = page.locator("h2") 
        
        self.exam_name_input = page.locator("input[formControlName='examinationName']")
        self.total_marks_input = page.locator("input[formControlName='totalMarks']")
        self.next_btn = page.locator("button.btn-primary:has-text('Next')")

    def navigate_to_wizard(self, base_url: str):
        self.page.goto(f"{base_url}/#/user/question-paper/generate")
        self.wizard_step_header.wait_for()

    def select_from_dropdown(self, control_name: str, value_to_select: str):
        """
        Handles the custom Angular dropdown.
        Args:
            control_name: The 'dropdownControlName' attribute in your HTML (e.g., 'board', 'medium')
            value_to_select: The text text to click (e.g., 'CBSE', 'Class 10')
        """

        dropdown = self.page.locator(f"app-form-dropdown[dropdowncontrolname='{control_name}']")
        
        dropdown.click()
        
        option = self.page.get_by_text(value_to_select, exact=True)
        option.click()

    def fill_configuration_from_env(self, exam_name, marks, board, medium, grade, subject):
        """
        Orchestrates filling the whole form using variables.
        """
        # fill dropdowns
        self.select_from_dropdown("board", board)
        self.select_from_dropdown("medium", medium)
        self.select_from_dropdown("grade", grade)
        self.select_from_dropdown("subject", subject)
        
        # fill inputs
        self.exam_name_input.fill(exam_name)
        self.total_marks_input.fill(marks)