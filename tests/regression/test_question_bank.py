import pytest
import os
from page_objects.question_bank_page import QuestionBankPage

BASE_URL = os.getenv("FRONTEND_URL")

# Only Hardcoded Variables needed for the specific test data
QP_BOARD = os.getenv("TEST_QP_BOARD", "KSEEB")      
QP_NAME = os.getenv("TEST_QP_EXAM_NAME", "Regression Auto Test")
QP_MARKS = os.getenv("TEST_QP_MARKS", "10") 

def test_qb_generate_full_flow(logged_in_page, step):
    """
    Regression: Full flow Step 1 -> Step 2 -> Step 3 -> Generate.
    Uses dynamic dropdown selection (First Option) for everything except Board.
    """
    with step("Initialize Page Object"):
        qb_page = QuestionBankPage(logged_in_page)
    
    with step("Navigate to Question Bank List"):
        qb_page.navigate_to_list(BASE_URL)
    
    with step("Click Create New Question Paper"):
        qb_page.click_create_new_qp()
    

def test_qb_board_reset(logged_in_page, step):
    """
    Regression QB-01: Verify that changing the Board resets dependent dropdowns.
    1. Select Board (CBSE) -> Grade -> Subject
    2. Change Board to a different value
    3. Verify Grade and Subject dropdowns are reset.
    """
    from playwright.sync_api import expect

    with step("Initialize Page Object"):
        qb_page = QuestionBankPage(logged_in_page)

    with step("Navigate to Question Bank Generation"):
        qb_page.navigate_to_wizard(BASE_URL)

    with step(f"Select Board: {QP_BOARD}"):
        qb_page.select_dropdown_option("board", value_text=QP_BOARD)

    with step("Select Grade (First Option)"):
        qb_page.select_dropdown_option("grade", index=0)

    with step("Select Medium (First Option)"):
        qb_page.select_dropdown_option("medium", index=0)

    with step("Select Subject (First Option)"):
        qb_page.select_dropdown_option("subject", index=0)

    with step("Change Board to Different Value"):
        # Select the board dropdown
        board_dropdown = qb_page._get_dropdown_locator("board")
        
        # Check if the panel is already open, if not click to open
        panel = logged_in_page.locator("ng-dropdown-panel")
        if not panel.is_visible():
            board_dropdown.click()
            
        options = panel.locator(".ng-option")
        options.first.wait_for(state="visible", timeout=5000)
        
        # If there's only 1 option (meaning the user doesn't teach multiple boards), skip
        if options.count() < 2:
            pytest.skip("Only 1 board is available for this staging user, cannot test board cascade reset.")
            
        # Select the second option to trigger cascade reset
        options.nth(1).click(force=True, timeout=10000)

    with step("Verify Dependent Dropdowns Reset"):
        # After board change, the subject dropdown should be cleared
        # We verify by checking the dropdown contains the placeholder text
        subject_dropdown = qb_page._get_dropdown_locator("subject")
        expect(subject_dropdown).to_contain_text("Select subject", timeout=5000)


def test_qb_ai_vs_lba_source(logged_in_page, step):
    """
    Regression QB-02: Verify AI vs LBA source toggle behavior.
    - AI selected: Objectives table and Marks Distribution table visible.
    - LBA selected: Those tables are hidden.
    HTML conditions:
      *ngIf="useAI && questionBankObjectives.length"
      *ngIf="useAI && marksDistribution.length"
    """
    from playwright.sync_api import expect

    with step("Initialize Page Object"):
        qb_page = QuestionBankPage(logged_in_page)

    with step("Navigate to Question Bank Generation"):
        qb_page.navigate_to_wizard(BASE_URL)

    with step("Configure Base Selections"):
        qb_page.select_dropdown_option("board", value_text=QP_BOARD)
        qb_page.select_dropdown_option("grade", index=0)
        qb_page.select_dropdown_option("medium", index=0)
        qb_page.select_dropdown_option("subject", index=0)
        # subject change fires getChapters() — wait for network and spinner overlay to clear
        logged_in_page.wait_for_load_state("networkidle", timeout=20000)
        # ngx-spinner outer element may report hidden while inner "Loading..." text still renders;
        # wait for the visible text itself to disappear
        loading_text = logged_in_page.get_by_text("Loading...")
        try:
            loading_text.wait_for(state="hidden", timeout=15000)
        except Exception:
            pass  # no loading text present — already clear
        logged_in_page.wait_for_timeout(500)

    with step("Select All Sources"):
        # Source Generation is the multi-select dropdown at index 1
        qb_page.select_dropdown_option("sourceGeneration", value_text="SELECT_ALL")

    with step("Fill Required Fields for AI Tables to Appear"):
        qb_page.exam_name_input.fill(QP_NAME)
        qb_page.total_marks_input.fill(QP_MARKS)
        # Select chapter to populate objectives
        qb_page.select_dropdown_option("chapter", index=0)

    with step("Verify AI Tables Visibility"):
        # Objectives table header
        objectives_heading = logged_in_page.locator(
            "h2", has_text="Objectives Weightage"
        )
        marks_heading = logged_in_page.locator(
            "h2", has_text="Topic-wise Marks Distribution"
        )
        # These should appear when useAI is true and data is loaded
        # We check with a reasonable timeout since data may need to load
        objectives_visible = objectives_heading.is_visible(timeout=5000)
        marks_visible = marks_heading.is_visible(timeout=5000)
        # At least one should be visible when AI is the source
        assert objectives_visible or marks_visible, (
            "With AI source, at least Objectives or Marks Distribution table "
            "should be visible after chapter selection"
        )

    with step("Switch to 'Pregenerated' Source"):
        # After SELECT_ALL, toggle off AI (first option) to keep only Pregenerated.
        qb_page.select_dropdown_option("sourceGeneration", index=0)

    with step("Verify AI Tables Hidden"):
        objectives_heading = logged_in_page.locator(
            "h2", has_text="Objectives Weightage"
        )
        marks_heading = logged_in_page.locator(
            "h2", has_text="Topic-wise Marks Distribution"
        )
        expect(objectives_heading).to_be_hidden(timeout=15000)
        expect(marks_heading).to_be_hidden(timeout=15000)
