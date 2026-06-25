# Models for question paper generation
# Extracted from the original standalone FastAPI application

from enum import Enum
from typing import Annotated, List, Literal, Optional, TypeAlias
from pydantic import AfterValidator, BaseModel, BeforeValidator, Field, WithJsonSchema


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

SerializableBytes = Annotated[
    bytes,
    BeforeValidator(lambda v: v if isinstance(v, bytes) else v.encode("utf-8")),
    WithJsonSchema({"type": "string"}),
]


class Content(BaseModel):
    content_type: Literal["text/plain", "image/png", "image/jpeg"] = Field(default="text/plain")
    content: SerializableBytes

    @staticmethod
    def text(content: str): return Content(content=content.encode(encoding="utf-8"))


class TextQuestion(BaseModel):
    question: list[Content] = Field(default_factory=list)
    answer: list[Content] = Field(default_factory=list)
    keyAnswer: list[Content] = Field(default_factory=list, description="\n".join([
        "Answer to be displayed right below the question.",
        "- For MCQs, this should be the label of the correct option (e.g. 'A').",
        "- For fill-in-the-blank questions, this should be the word or phrase that fills the blank.",
        "- For short and long answer questions, this should be a concise model answer."
    ]))
    difficulty: DifficultyType = "Average"


class McqOption(BaseModel):
    label: str
    text: list[Content]


class FourOptionsQuestion(BaseModel):
    question: list[Content] = Field(default_factory=list, examples=["What is the speed of light in vacuum?"])
    options: List[McqOption] = Field(default_factory=list, min_length=4, max_length=4, examples=[[
        McqOption(label="A", text=[Content.text("3x10^8 m/s")]),
        McqOption(label="B", text=[Content.text("3x10^6 m/s")]),
        McqOption(label="C", text=[Content.text("3x10^10 m/s")]),
        McqOption(label="D", text=[Content.text("3x10^5 m/s")])
    ]])
    answer: list[Content] = Field(default_factory=list, examples=["3x10^8 m/s"])
    keyAnswer: list[Content] = Field(default_factory=list, description="The correct answer choice. This is displayed right below the question.", examples=["A"])
    difficulty: DifficultyType = "Average"


class MatchingListQuestion(BaseModel):
    """
    Models a single entry in a match-the-following question. While a match-the-following type question
    often consists of multiple entries, this model represents just one complete entry.
    """

    value1: list[Content] = Field(default_factory=list, description="The phrase to display on the left-hand side.")
    value2: list[Content] = Field(default_factory=list, description="The phrase to display on the right-hand side.")
    difficulty: DifficultyType = "Average"


# ==============================
# QUESTION TYPE
# ==============================

QuestionModel: TypeAlias = MatchingListQuestion | FourOptionsQuestion | TextQuestion


class QuestionType(str, Enum):
    model: QuestionModel
    display_name: str
    description: str

    MCQ = "MCQ", FourOptionsQuestion, "Multiple Choice Questions", "These questions provide exactly four options, challenging students to select the correct answer from a set of alternatives."
    FILL_BLANKS = "FILL_BLANKS", TextQuestion, "Fill in the blanks", "This type of question requires students to complete sentences or phrases by inserting the appropriate missing word(s). Use underscores to denote missing word(s)."
    ANSWER_VERY_SHORT = "ANSWER_VERY_SHORT", TextQuestion, "Very Short Answer Questions", "These questions expect a very brief response: a single word, a short phrase, or a concise sentence."
    ANSWER_SHORT = "ANSWER_SHORT", TextQuestion, "Short Answer Questions", "Short answer questions require a concise yet complete response, typically in two or three sentences."
    ANSWER_MEDIUM = "ANSWER_MEDIUM", TextQuestion, "Answer the following questions", "These open-ended questions invite students to provide brief responses that are straightforward and to the point."
    ANSWER_LONG = "ANSWER_LONG", TextQuestion, "Long Answer Questions", "Long answer questions require a detailed, well-structured response that spans four to five sentences."
    MATCHING = "MATCHING", MatchingListQuestion, "Match the Following", "Match the following: generate a correctly matched item pair."
    GRAMMAR_MCQ = "GRAMMAR_MCQ", FourOptionsQuestion, "Grammar: Multiple Choice Questions", "Grammar MCQ: students select the grammatically correct alternative from four options."
    GRAMMAR_FILL_BLANKS = "GRAMMAR_FILL_BLANKS", TextQuestion, "Grammar: Fill in the blanks", "Grammar fill-in-the-blank: students complete sentences using correct grammatical forms."
    GRAMMAR_EDITING = "GRAMMAR_EDITING", TextQuestion, "Grammar: Identify and correct the error", "Grammar editing: students find and correct grammatical errors in given sentences."

    def __new__(cls, value, pydantic_model, display_name, description):
        obj = str.__new__(cls, value)
        obj._value_ = value
        obj.description = description
        obj.model = pydantic_model
        obj.display_name = display_name
        return obj


class QuestionTypeResponse(BaseModel):
    type: QuestionType
    number_of_questions: int
    marks_per_question: Marking
    questions: List[QuestionModel]


class QuestionBankResponse(BaseModel):
    metadata: QuestionBankMetadata
    questions: List[QuestionTypeResponse]


# Ordered list is the single source of truth; set is derived for O(1) lookup.
_GRAMMAR_QUESTION_TYPES_ORDERED: List[QuestionType] = [
    QuestionType.GRAMMAR_MCQ,
    QuestionType.GRAMMAR_FILL_BLANKS,
    QuestionType.GRAMMAR_EDITING,
]
GRAMMAR_QUESTION_TYPES = set(_GRAMMAR_QUESTION_TYPES_ORDERED)


def get_question_types_for_subject(subject: str) -> List[QuestionType]:
    """Return the list of question types available for the given subject.

    Grammar types are always appended to the response. The frontend filters them
    based on each chapter's ``isGrammar`` flag (DB-derived) before showing them
    to the user, so the previous English-only hardcoding is no longer needed.
    The ``subject`` parameter is retained for backwards compatibility and future
    per-subject filtering.
    """
    base_types = [qt for qt in QuestionType if qt not in GRAMMAR_QUESTION_TYPES]
    return base_types + _GRAMMAR_QUESTION_TYPES_ORDERED


# ============================
# REQUEST MODELS
# ============================


class _LearningRecord(BaseModel):
    title: str
    index_path: str
    learning_outcomes: List[str]
    grammar_source_chapters: Optional[List[str]] = None
    is_grammar: bool = False
    grammar_topics: Optional[List[str]] = None


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

    def grammar_chapters(self) -> List[Chapter]:
        """Return chapters flagged as grammar (DB ``isGrammar`` true).

        Encapsulates the filter so callers do not need to inspect
        ``grammar_source_chapters`` directly. Replaces the previous bespoke
        ``grammar_source_chapters`` plumbing flagged in PR #52 review.
        """
        return [c for c in self.chapters if c.is_grammar]


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
