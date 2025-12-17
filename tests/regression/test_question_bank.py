import pytest
import os
from tests.regression.page_objects.question_bank_page import QuestionBankPage

BASE_URL = os.getenv("STAGING_URL")
QP_BOARD = os.getenv("TEST_QP_BOARD", "CBSE")      
QP_MEDIUM = os.getenv("TEST_QP_MEDIUM", "English")
QP_GRADE = os.getenv("TEST_QP_GRADE", "Class 10")
QP_SUBJECT = os.getenv("TEST_QP_SUBJECT", "Science")
QP_NAME = os.getenv("TEST_QP_EXAM_NAME", "Regression Test Exam")
QP_MARKS = os.getenv("TEST_QP_MARKS", "50")

def test_qb_generate_step1_fill(logged_in_page):
    """
    Regression: Fill Step 1 using data from .env file.
    """
    qb_page = QuestionBankPage(logged_in_page)
    qb_page.navigate_to_wizard(BASE_URL)
    
    qb_page.fill_configuration_from_env(
        exam_name=QP_NAME,
        marks=QP_MARKS,
        board=QP_BOARD,
        medium=QP_MEDIUM,
        grade=QP_GRADE,
        subject=QP_SUBJECT
    )
    
    # Click Next
    qb_page.next_btn.click()
    
    from playwright.sync_api import expect
    expect(logged_in_page.locator("text=Step 2")).to_be_visible()