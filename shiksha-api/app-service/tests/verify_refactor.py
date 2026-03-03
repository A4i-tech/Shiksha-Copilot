
from app.models.question_paper import TextQuestion, FourOptionsQuestion, MatchPair, MatchingGroupQuestion, QuestionType
import json

def test_difficulty_refactoring():
    print("Verifying Difficulty Label Refactoring...")
    
    # 1. Verify Defaults
    tq = TextQuestion()
    if tq.difficulty != "Average":
        print(f"FAILED: TextQuestion default is '{tq.difficulty}', expected 'Average'")
        exit(1)
        
    foq = FourOptionsQuestion()
    if foq.difficulty != "Average":
        print(f"FAILED: FourOptionsQuestion default is '{foq.difficulty}', expected 'Average'")
        exit(1)
        
    mlq = MatchingGroupQuestion(pairs=[MatchPair(left="A", right="B")])
    if mlq.difficulty != "Average":
        print(f"FAILED: MatchingGroupQuestion default is '{mlq.difficulty}', expected 'Average'")
        exit(1)
        
    print("SUCCESS: Model defaults are correct.")
    
    # 2. Verify Schema Dict
    mcq_schema = QuestionType.MCQ.schema_dict()
    if '"difficulty": "Average"' not in mcq_schema:
         print(f"FAILED: MCQ schema does not contain 'Average'. Schema: {mcq_schema}")
         exit(1)
         
    print("SUCCESS: MCQ Schema dict is correct.")
    
if __name__ == "__main__":
    test_difficulty_refactoring()
