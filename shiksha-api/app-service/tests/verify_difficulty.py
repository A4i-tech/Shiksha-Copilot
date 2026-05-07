
import sys
import os
import json
from unittest.mock import MagicMock

# Add project root to sys.path to allow imports
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from app.models.question_paper import (
    TextQuestion,
    FourOptionsQuestion,
    MatchingListQuestion,
    QuestionType,
    McqOption
)
from app.services.question_paper_service import QuestionPaperService

def test_models():
    print("Testing Models...")
    
    # Test TextQuestion
    q1 = TextQuestion(question="What is verification?")
    assert q1.difficulty == "Medium", f"TextQuestion default difficulty should be Medium, got {q1.difficulty}"
    
    q2 = TextQuestion(question="Hard question?", difficulty="Hard")
    assert q2.difficulty == "Hard", f"TextQuestion difficulty should be Hard, got {q2.difficulty}"

    # Test FourOptionsQuestion
    opts = [{"label": "A", "text": "Opt A"}, {"label": "B", "text": "Opt B"}]
    q3 = FourOptionsQuestion(question="Select one", options=opts, answer="A")
    assert q3.difficulty == "Medium", f"FourOptionsQuestion default difficulty should be Medium, got {q3.difficulty}"

    q4 = FourOptionsQuestion(question="Select one", options=opts, answer="A", difficulty="Easy")
    assert q4.difficulty == "Easy", f"FourOptionsQuestion difficulty should be Easy, got {q4.difficulty}"
    
    # Test MatchingListQuestion
    q5 = MatchingListQuestion(value1="A", value2="B")
    assert q5.difficulty == "Medium", f"MatchingListQuestion default difficulty should be Medium, got {q5.difficulty}"

    print("Model tests passed!")


def test_organize_logic():
    print("\nTesting _organize_questions_into_response Logic Snippet...")
    
    # Mock data resembling what comes from LLM (using the value string as type)
    generated_item = {
        "type": "Four alternatives are given for each of the following questions, choose the correct alternative",
        "unit_name": "Unit 1",
        "objective": "Remember",
        "marks_per_question": 1,
        "difficulty": "Hard",
        "item": {
            "question": "What is 2+2?",
            "options": [
                {"label": "A", "text": "3"},
                {"label": "B", "text": "4"}
            ],
            "answer": "B"
        }
    }
    
    # Simulate logic in _organize_questions_into_response
    qtype = QuestionType(generated_item.get("type"))
    difficulty = generated_item.get("difficulty", "Medium")
    item = generated_item.get("item")
    
    # Logic to test
    if isinstance(item, dict):
        item["difficulty"] = difficulty
    
    # Verify injection
    assert item["difficulty"] == "Hard", "Difficulty should be injected into item dictionary"
    
    # Verify casting
    obj = qtype.cast(item)
    assert isinstance(obj, FourOptionsQuestion), "Object should be cast to FourOptionsQuestion"
    assert obj.difficulty == "Hard", "Casted object should have the correct difficulty"
    
    print("Organization logic tests passed!")

if __name__ == "__main__":
    test_models()
    test_organize_logic()
    print("\nAll verification tests passed successfully!")
