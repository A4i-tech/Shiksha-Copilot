import pytest
import os
from page_objects.question_bank_page import QuestionBankPage

BASE_URL = os.getenv("STAGING_URL")

# Only Hardcoded Variables needed for the specific test data
QP_BOARD = os.getenv("TEST_QP_BOARD", "CBSE")      
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
    
    # --- Step 1: Configuration ---
    
    with step(f"Select Board: {QP_BOARD}"):
        # Mandatory specific selection
        qb_page.select_dropdown_option("board", value_text=QP_BOARD)
        
    with step("Select Medium (First Option)"):
        qb_page.select_dropdown_option("medium", index=0)

    with step("Select Language (First Option)"):
        qb_page.select_dropdown_option("language", index=0)

    with step("Select Grade (First Option)"):
        qb_page.select_dropdown_option("grade", index=0)

    with step("Select Subject (First Option)"):
        qb_page.select_dropdown_option("subject", index=0)

    with step("Fill Exam Details"):
        qb_page.exam_name_input.fill(QP_NAME)
        qb_page.total_marks_input.fill(QP_MARKS)
    
    with step("Select Scope: Single Chapter"):
        qb_page.select_radio_option("singleChapter")

    with step("Select Chapter (First Option)"):
        qb_page.select_dropdown_option("chapter", index=0)

    with step("Select SubTopic (First Option)"):
        # Subtopic often appears only after chapter is selected
        qb_page.select_dropdown_option("subTopic", index=0)

    with step("Proceed to Step 2"):
        qb_page.click_next()
    
    # --- Step 2: Template ---
    
    with step("Step 2: Verify Template Loaded"):
        qb_page.verify_step_2_loaded()
    
    with step("Step 2: Fill Template Row"):
        # We use "AUTO" to let the page object pick the first available question type
        # We set 1 Question for 10 Marks to match the Total Marks (10)
        qb_page.fill_template_row(0, "AUTO", "1", "10")
    
    with step("Proceed to Step 3"):
        qb_page.click_next()
    
    # --- Step 3: Blueprint ---

    with step("Step 3: Verify Blueprint Loaded"):
        qb_page.verify_step_3_loaded()
    
    with step("Generate Question Paper"):
        qb_page.click_generate()