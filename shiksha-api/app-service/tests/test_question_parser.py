from app.models.question_paper import FourOptionsQuestion, GeneratedQuestionItem


def test_mcq():
    q = GeneratedQuestionItem.model_validate({
        "type": "MCQ",
        "unit_name": "Unit 1",
        "objective": "Remember",
        "marks_per_question": 1,
        "item": {
            "question": "What is 2+2?",
            "difficulty": "Difficult",
            "options": [
                {"label": "A", "text": "1"},
                {"label": "B", "text": "2"},
                {"label": "C", "text": "3"},
                {"label": "D", "text": "4"}
            ],
            "answer": "B"
        }
    })

    assert isinstance(q.item, FourOptionsQuestion)
    assert q.item.difficulty == "Difficult"
    assert q.item.answer == "B"
    assert len(q.item.options) == 4
    assert q.item.options[0].label == "A"
    assert q.item.options[0].text == "1"
