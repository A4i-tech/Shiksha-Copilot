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
    

    # Subsequent steps removed [TO BE IMPLEMENTED]
    # with step(f"Select Board: {QP_BOARD}"):
    #     # Mandatory specific selection
    #     qb_page.select_dropdown_option("board", value_text=QP_BOARD)
    
    # with step("Select Medium (First Option)"):
    #     qb_page.select_dropdown_option("medium", index=0)
    # ... (rest removed)