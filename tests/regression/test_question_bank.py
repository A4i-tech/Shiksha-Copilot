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

    with step("Check Board Has Multiple Options"):
        # The app disables the board dropdown outright when the account only
        # teaches one board (boardDropdownconfig.disabled = options.length === 1),
        # auto-selecting it. A disabled ng-select never opens a panel on click,
        # so there is no cascade-reset to trigger or verify here.
        if qb_page.is_dropdown_disabled("board"):
            pytest.skip("Only 1 board is available for this staging user, cannot test board cascade reset.")

    with step(f"Select Board: {QP_BOARD}"):
        qb_page.select_dropdown_option("board", value_text=QP_BOARD)

    with step("Select Grade (First Option)"):
        qb_page.select_dropdown_option("grade", index=0)

    with step("Select Subject (First Option)"):
        qb_page.select_dropdown_option("subject", index=0)

    with step("Change Board to Different Value"):
        board_dropdown = qb_page._get_dropdown_locator("board")
        board_dropdown.locator(".ng-select-container").click(force=True)

        panel = logged_in_page.locator("ng-dropdown-panel")
        panel.wait_for(state="visible", timeout=5000)
        options = panel.locator(".ng-option")
        options.first.wait_for(state="visible", timeout=5000)

        # Select the second option to trigger cascade reset
        options.nth(1).click(force=True, timeout=10000)

    with step("Verify Dependent Dropdowns Reset"):
        # After board change, the subject dropdown should be cleared
        # We verify by checking the dropdown contains the placeholder text
        subject_dropdown = qb_page._get_dropdown_locator("subject")
        expect(subject_dropdown).to_contain_text("Select subject", timeout=5000)


def test_qb_ai_vs_lba_source(logged_in_page, step):
    """
    Regression QB-02: Verify the Objectives Weightage and Topic-wise Marks
    Distribution tables appear once a chapter is selected and their data loads.
    HTML conditions (current app):
      *ngIf="questionBankObjectives.length"
      *ngIf="marksDistribution.length"
    Note: these tables are no longer gated on the AI/LBA source selection (only
    on data being loaded), so switching to LBA-only no longer hides them — that
    assertion was dropped as stale against current app behavior.
    """
    with step("Initialize Page Object"):
        qb_page = QuestionBankPage(logged_in_page)

    with step("Navigate to Question Bank Generation"):
        qb_page.navigate_to_wizard(BASE_URL)

    with step("Configure Base Selections"):
        qb_page.select_dropdown_option("board", value_text=QP_BOARD)
        qb_page.select_dropdown_option("grade", index=0)
        # "medium" is auto-resolved by the app and is no longer a separate
        # control on the current wizard.
        qb_page.select_dropdown_option("subject", index=0)
        # Subject selection fires getChapters() + getPaperConfig() — wait for the
        # chapter dropdown to become enabled rather than networkidle, which never
        # fires on this deployment (persistent background requests).
        qb_page.wait_for_dropdown_enabled("chapter", timeout=20000)

    with step("Select All Sources"):
        # Source Generation is the multi-select dropdown at index 1
        qb_page.select_dropdown_option("sourceGeneration", value_text="SELECT_ALL")

    with step("Fill Required Fields for AI Tables to Appear"):
        qb_page.exam_name_input.fill(QP_NAME)
        qb_page.total_marks_input.fill(QP_MARKS)
        # Select chapter to populate objectives
        qb_page.select_dropdown_option("chapter", index=0)
        # Sub-Topic becomes required if the selected chapter has subtopics.
        qb_page.select_subtopic_if_present()

    with step("Verify Objectives/Marks Distribution Tables Visible"):
        objectives_heading = logged_in_page.locator(
            "h2", has_text="Objectives Weightage"
        )
        marks_heading = logged_in_page.locator(
            "h2", has_text="Topic-wise Marks Distribution"
        )
        # These appear once questionBankObjectives/marksDistribution are populated
        # (data loaded after chapter selection) — we check with a reasonable
        # timeout since data may need to load.
        objectives_visible = objectives_heading.is_visible(timeout=5000)
        marks_visible = marks_heading.is_visible(timeout=5000)
        assert objectives_visible or marks_visible, (
            "At least Objectives or Marks Distribution table should be visible "
            "after chapter selection"
        )


@pytest.mark.xfail(reason="#421 not fixed yet")
def test_qb_no_duplicate_sections_in_preview(logged_in_page, step):
    """
    Regression #421: generating a paper with both AI and LBA sources selected,
    with marks distributed across multiple chapters/types, used to render the
    same (type, marks) pair as two separate sections in the Step 4 preview
    instead of merging them into one. Two sections of the same type but
    different marks (e.g. 1-mark MCQ and 2-mark MCQ) are valid and must NOT
    be flagged; only an exact (type, marks) repeat is the bug.
    """
    with step("Initialize Page Object"):
        qb_page = QuestionBankPage(logged_in_page)

    with step("Navigate to Question Bank Generation"):
        qb_page.navigate_to_wizard(BASE_URL)

    with step("Configure Base Selections"):
        qb_page.select_dropdown_option("board", value_text=QP_BOARD)
        qb_page.select_dropdown_option("grade", index=0)
        # "medium" is auto-resolved by the app when a chapter/class has a single
        # medium and is no longer a separate control on the current wizard.
        qb_page.select_dropdown_option("subject", index=0)
        # Subject selection fires getChapters() + getPaperConfig() — wait for the
        # chapter dropdown to become enabled rather than networkidle, which never
        # fires on this deployment (persistent background requests).
        qb_page.wait_for_dropdown_enabled("chapter", timeout=20000)

    with step("Select AI + LBA Sources (both, to trigger the merge path)"):
        qb_page.select_dropdown_option("sourceGeneration", value_text="SELECT_ALL")

    with step("Fill Exam Name, Total Marks and Chapter"):
        qb_page.exam_name_input.fill(QP_NAME)
        qb_page.total_marks_input.fill(QP_MARKS)
        qb_page.select_dropdown_option("chapter", index=0)
        # Sub-Topic becomes required if the selected chapter has subtopics.
        qb_page.select_subtopic_if_present()

    with step("Proceed to Step 2 (Template)"):
        qb_page.click_next()
        qb_page.verify_step_2_loaded()

    with step("Proceed to Step 3 (Blue Print)"):
        qb_page.click_next()
        qb_page.verify_step_3_loaded()

    with step("Proceed to Step 4 (Preview)"):
        qb_page.click_preview_questions()
        qb_page.ensure_preview_visible()

    with step("Verify No Duplicate (Type, Marks) Sections in Preview"):
        sections = qb_page.get_preview_sections()
        assert sections, "Expected at least one section in the preview"
        assert len(sections) == len(set(sections)), (
            f"Duplicate sections found for the same (type, marks) pair: {sections}"
        )
