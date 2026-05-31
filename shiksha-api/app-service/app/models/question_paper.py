# Models for question paper generation
# Extracted from the original standalone FastAPI application

from enum import Enum
from typing import Annotated, List, Literal, TypeAlias
import re
from pydantic import AfterValidator, BaseModel, field_validator, Field, model_validator


# ==============================
# RESPONSE MODELS
# ==============================


class QuestionBankMetadata(BaseModel):
    user_id: str = Field(..., description="Unique identifier for the requesting user", examples=["teacher123"])
    subject: str = Field(..., description="Subject for question generation", examples=["Science"])
    grade: str = Field(..., description="Student grade/class level", examples=["10"])
    unit_names: List[str] = Field(..., examples=[["Light", "Electricity"]])
    school_name: str = Field(..., examples=["ABC School"])
    examination_name: str = Field(..., examples=["Mid-term Exam"])


DifficultyType: TypeAlias = Literal["Easy", "Average", "Difficult"]


def valid_marking(v: float | int) -> float:
    if v <= 0 or v % 0.5:
        raise ValueError("must be a positive multiple of 0.5")
    return v

_MARKING_DESC = "Must be a positive multiple of 0.5."
Marking = Annotated[
    float,
    Field(description=_MARKING_DESC, examples=[0.5, 1, 2, 3, 4, 5]),
    AfterValidator(valid_marking)
]


class TextQuestion(BaseModel):
    question: str = Field(default="")
    answer: str = Field(default="")
    keyAnswer: str = Field(default="", description="\n".join([
        "Answer to be displayed right below the question.",
        "- For MCQs, this should be the label of the correct option (e.g. 'A').",
        "- For fill-in-the-blank questions, this should be the word or phrase that fills the blank.",
        "- For short and long answer questions, this should be a concise model answer."
    ]))
    difficulty: DifficultyType = "Average"



class McqOption(BaseModel):
    label: str
    text: str



class FourOptionsQuestion(BaseModel):
    question: str = Field(default="", examples=["What is the speed of light in vacuum?"])
    options: List[McqOption] = Field(default_factory=list, min_length=4, max_length=4, examples=[[
        McqOption(label="A", text="3x10^8 m/s"),
        McqOption(label="B", text="3x10^6 m/s"),
        McqOption(label="C", text="3x10^10 m/s"),
        McqOption(label="D", text="3x10^5 m/s")
    ]])
    answer: str = Field(default="", examples=["3x10^8 m/s"])
    keyAnswer: str = Field(default="", description="The correct answer choice. This is displayed right below the question.", examples=["A"])
    difficulty: DifficultyType = "Average"

    @model_validator(mode="before")
    @classmethod
    def convert_legacy_mcq_shape(cls, values):
        if not isinstance(values, dict):
            return values

        values = dict(values)

        if "options" not in values:
            legacy_options = []
            for label in ["A", "B", "C", "D", "E", "F"]:
                option_key = f"option_{label.lower()}"
                option_text = values.get(option_key)
                if option_text:
                    legacy_options.append({"label": label, "text": option_text})

            if legacy_options:
                values["options"] = legacy_options

        if "keyAnswer" not in values and "correct_option" in values:
            correct_option = values.get("correct_option")
            if isinstance(correct_option, str):
                match = re.match(r"option_([A-Za-z])$", correct_option.strip())
                values["keyAnswer"] = (
                    match.group(1).upper() if match else correct_option.strip()
                )

        return values

    @field_validator("options", mode="before")
    def convert_strings_to_options(cls, v):
        # If it's a list of strings, convert to McqOption objects
        if v is None:
            return []
        if isinstance(v, list) and len(v) > 0 and isinstance(v[0], str):
            labels = ["A", "B", "C", "D", "E", "F"]
            cleaned_options = []
            for i, opt in enumerate(v):
                # Clean prefix like "A. ", "a) ", "1. " from the start of the string
                clean_text = re.sub(r'^[A-Za-z0-9]+[\.\)]\s*', '', opt)
                
                label = labels[i] if i < len(labels) else str(i+1)
                cleaned_options.append({"label": label, "text": clean_text})
                
            return cleaned_options
        return v


class MatchingListQuestion(BaseModel):
    """
    Models a single entry in a match-the-following question. While a match-the-following type question
    often consists of multiple entries, this model represents just one complete entry.
    """

    value1: str = Field(default="", description="The phrase to display on the left-hand side.")
    value2: str = Field(default="", description="The phrase to display on the right-hand side.")
    difficulty: DifficultyType = "Average"


# ==============================
# QUESTION TYPE
# ==============================

QuestionModel: TypeAlias = MatchingListQuestion | FourOptionsQuestion | TextQuestion


class QuestionType(str, Enum):
    model: QuestionModel
    description: str

    MCQ = "MCQ", FourOptionsQuestion, "These questions provide exactly four options, challenging students to select the correct answer from a set of alternatives"
    FILL_BLANKS = "FILL_BLANKS", TextQuestion, "This type of question requires students to complete sentences or phrases by inserting the appropriate missing word(s). Use many underscores to denote missing word(s)."
    ANSWER_VERY_SHORT = "ANSWER_VERY_SHORT", TextQuestion, "These questions expect a very brief response—a single word, a short phrase, or a concise sentence."
    ANSWER_SHORT = "ANSWER_SHORT", TextQuestion, "Short answer questions require a concise yet complete response, typically in two or three sentences."
    ANSWER_MEDIUM = "ANSWER_MEDIUM", TextQuestion, "These open-ended questions invite students to provide brief responses that are straightforward and to the point."
    ANSWER_LONG = "ANSWER_LONG", TextQuestion, "Long answer questions require a detailed, well-structured response that spans four to five sentences."
    MATCHING = "MATCHING", MatchingListQuestion, "Match the following - generate a CORRECTLY matched item-pair"

    def __new__(cls, value, pydantic_model, description):
        obj = str.__new__(cls, value)
        obj._value_ = value
        obj.description = description
        obj.model = pydantic_model
        return obj


class QuestionTypeResponse(BaseModel):
    type: QuestionType
    number_of_questions: int
    marks_per_question: Marking
    questions: List[QuestionModel]


class QuestionBankResponse(BaseModel):
    metadata: QuestionBankMetadata
    questions: List[QuestionTypeResponse]


# ============================
# REQUEST MODELS
# ============================


class _LearningRecord(BaseModel):
    title: str
    index_path: str
    learning_outcomes: List[str]


class ChapterSubtopic(_LearningRecord):
    ...


class Chapter(_LearningRecord):
    subtopics: List[ChapterSubtopic]


class MarksDistribution(BaseModel):
    unit_name: str
    percentage_distribution: int
    marks: Marking


class ObjectiveDistribution(BaseModel):
    objective: str
    percentage_distribution: int


class QuestionDistribution(BaseModel):
    unit_name: str
    objective: str


class _Template(BaseModel):
    type: QuestionType
    number_of_questions: int
    marks_per_question: Marking


class UngeneratedTemplate(_Template):
    ...


class GeneratedTemplate(_Template):
    question_distribution: List[QuestionDistribution] = Field(min_length=1)


class QuestionBankPartsGenerationRequest(BaseModel):
    user_id: str = Field(..., description="Unique identifier for the requesting user", examples=["teacher123"])
    board: str = Field(..., description="Educational board", examples=["NCERT", "CBSE", "State board"])
    medium: str = Field(..., description="Language medium", examples=["English", "Hindi"])
    grade: int = Field(..., description="Student grade/class level")
    subject: str = Field(..., description="Subject for question generation")
    unit_level: Literal["CHAPTER", "SUBTOPIC"]
    chapters: List[Chapter] = Field(..., description="List of chapters with learning outcomes and subtopics")
    total_marks: Marking = Field(..., description=f"Total marks for the question paper. {_MARKING_DESC}")
    template: List[GeneratedTemplate] = Field(..., description="Question distribution template specifying types and marks")
    existing_questions: List[QuestionTypeResponse] = Field(default_factory=list, description="List of pre-existing questions (to avoid duplication)")
    school_name: str = "Shiksha Partner School"
    examination_name: str = "Class Assessment"


class QBQuestionDistributionGenerationRequest(BaseModel):
    user_id: str = Field(..., description="Unique identifier for the requesting user", examples=["teacher123"])
    board: str = Field(..., description="Educational board", examples=["NCERT", "CBSE", "State board"])
    medium: str = Field(..., description="Language medium", examples=["English", "Hindi"])
    grade: int = Field(..., description="Student grade/class level")
    subject: str = Field(..., description="Subject for question generation")
    unit_level: Literal["CHAPTER", "SUBTOPIC"]
    chapters: List[Chapter] = Field(..., min_length=1, description="List of chapters with learning outcomes and subtopics")
    total_marks: Marking = Field(..., description=f"Total marks for the question paper. {_MARKING_DESC}")
    template: List[UngeneratedTemplate] = Field(..., description="Question distribution template specifying types and marks")
    marks_distribution: List[MarksDistribution] = Field(..., description="Unit-wise marks allocation with percentages")
    objective_distribution: List[ObjectiveDistribution] = Field(..., description="Learning objective distribution (Knowledge, Understanding, etc.)")


class GeneratedQuestionItem(BaseModel):
    unit_name: str
    type: QuestionType
    objective: str
    marks_per_question: Marking
    item: QuestionModel
