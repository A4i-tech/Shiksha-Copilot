
import sys
import os
import json
from unittest.mock import MagicMock

# Add project root to sys.path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from app.models.question_paper import (
    TextQuestion,
    FourOptionsQuestion,
    QuestionType,
    QuestionTypeResponse,
    McqOption,
    QuestionBankResponse
)

def test_serialization():
    print("Testing Validation & Serialization...")
    
    # 1. Create a FourOptionsQuestion with difficulty
    q_mcq = FourOptionsQuestion(
        question="What is 5+5?",
        options=[McqOption(label="A", text="10"), McqOption(label="B", text="11"), McqOption(label="C", text="12"), McqOption(label="D", text="13")],
        answer="A",
        difficulty="Easy"
    )
    
    # 2. Check if dumping it includes difficulty
    dumped_mcq = q_mcq.model_dump()
    print("Dumped MCQ:", json.dumps(dumped_mcq, indent=2))
    assert "difficulty" in dumped_mcq, "difficulty field missing from FourOptionsQuestion dump"
    assert dumped_mcq["difficulty"] == "Easy", "difficulty value incorrect"

    # 3. Create a QuestionTypeResponse containing this question
    qt_resp = QuestionTypeResponse(
        type=QuestionType.MCQ,
        number_of_questions=1,
        marks_per_question=1,
        questions=[q_mcq]
    )
    
    # 4. Check serialization of the wrapper
    dumped_resp = qt_resp.model_dump()
    print("Dumped Response:", json.dumps(dumped_resp, indent=2))
    
    # Verify the question inside has difficulty
    q_inside = dumped_resp["questions"][0]
    assert "difficulty" in q_inside, "difficulty missing from question inside QuestionTypeResponse"
    assert q_inside["difficulty"] == "Easy"
    
    # 5. Check JSON serialization (FastAPI uses jsonable_encoder or similar, but model_dump_json is closest proxy)
    json_output = qt_resp.model_dump_json()
    print("JSON Output:", json_output)
    assert '"difficulty":"Easy"' in json_output or '"difficulty": "Easy"' in json_output, "difficulty missing from JSON string"

    print("\nSerialization tests passed!")

if __name__ == "__main__":
    test_serialization()
