# Models for question paper generation
# Extracted from the original standalone FastAPI application

from enum import Enum
from typing import Annotated, List, Optional, Union, Tuple, Literal, TypeAlias
import re
from pydantic import AfterValidator, BaseModel, computed_field, field_validator, Field, model_validator


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
# SELF-DESCRIBING QUESTION TYPE
# ==============================


class QuestionType(str, Enum):
    # value, description, pydantic_model
    MCQ = (
        "Four alternatives are given for each of the following questions, choose the correct alternative",
        "These questions provide exactly four options, challenging students to select the correct answer from a set of alternatives.",
        FourOptionsQuestion,
    )
    FILL_BLANKS = (
        "Fill in the blanks with suitable words",
        "This type of question requires students to complete sentences or phrases by inserting the appropriate missing word(s).",
        TextQuestion,
    )
    ANSWER_WORD = (
        "Answer the following in a word, phrase or sentence",
        "These questions expect a very brief response—a single word, a short phrase, or a concise sentence.",
        TextQuestion,
    )
    ANSWER_SHORT = (
        "Answer the following in two or three sentences each",
        "Short answer questions require a concise yet complete response, typically in two or three sentences.",
        TextQuestion,
    )
    ANSWER_GENERAL = (
        "Answer the following questions",
        "These open-ended questions invite students to provide brief responses that are straightforward and to the point.",
        TextQuestion,
    )
    ANSWER_LONG = (
        "Answer the following question in four or five sentences",
        "Long answer questions require a detailed, well-structured response that spans four to five sentences.",
        TextQuestion,
    )
    MATCH_LIST = (
        "Match the following",
        "Generate a CORRECTLY matched item-pair",
        MatchingListQuestion,
    )

    def __new__(cls, value, description, pydantic_model):
        obj = str.__new__(cls, value)
        obj._value_ = value
        obj.description = description
        obj._model = pydantic_model
        return obj

    # Prompt/schema hint for LLM
    def model_name(self) -> str:
        return self._model.__name__

    # Cast generated dict to the right Pydantic model
    def cast(self, obj: dict):
        return self._model.model_validate(obj)


class QuestionTypeResponse(BaseModel):
    type: QuestionType
    number_of_questions: int
    marks_per_question: Marking
    questions: List[Union[MatchingListQuestion, FourOptionsQuestion, TextQuestion]] = []


class QuestionBankResponse(BaseModel):
    metadata: Optional[QuestionBankMetadata] = None
    questions: List[QuestionTypeResponse] = []


# ============================
# REQUEST MODELS
# ============================


class ChapterSubtopic(BaseModel):
    title: str
    learning_outcomes: List[str]


class Chapter(BaseModel):
    title: str
    index_path: str
    learning_outcomes: List[str]
    subtopics: Optional[List[ChapterSubtopic]] = None


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


class Template(BaseModel):
    type: QuestionType
    number_of_questions: int
    marks_per_question: Marking
    question_distribution: Optional[List[QuestionDistribution]] = None

    @computed_field
    @property
    def description(self) -> str:
        return self.type.description


class QuestionBankPartsGenerationRequest(BaseModel):
    user_id: str = Field(..., description="Unique identifier for the requesting user", examples=["teacher123"])
    board: str = Field(..., description="Educational board", examples=["NCERT", "CBSE", "State board"])
    medium: str = Field(..., description="Language medium", examples=["English", "Hindi"])
    grade: int = Field(..., description="Student grade/class level")
    subject: str = Field(..., description="Subject for question generation")
    chapters: List[Chapter] = Field(..., description="List of chapters with learning outcomes and subtopics")
    total_marks: Marking = Field(..., description=f"Total marks for the question paper. {_MARKING_DESC}")
    template: List[Template] = Field(..., description="Question distribution template specifying types and marks")
    existing_questions: List[QuestionTypeResponse] = Field(default_factory=list, description="List of pre-existing questions (to avoid duplication)")
    school_name: str = "Shiksha Partner School"
    examination_name: str = "Class Assessment"


class QBQuestionDistributionGenerationRequest(BaseModel):
    user_id: str = Field(..., description="Unique identifier for the requesting user", examples=["teacher123"])
    board: str = Field(..., description="Educational board", examples=["NCERT", "CBSE", "State board"])
    medium: str = Field(..., description="Language medium", examples=["English", "Hindi"])
    grade: int = Field(..., description="Student grade/class level")
    subject: str = Field(..., description="Subject for question generation")
    chapters: List[Chapter] = Field(..., min_length=1, description="List of chapters with learning outcomes and subtopics")
    total_marks: Marking = Field(..., description=f"Total marks for the question paper. {_MARKING_DESC}")
    marks_distribution: List[MarksDistribution] = Field(..., description="Unit-wise marks allocation with percentages")
    objective_distribution: List[ObjectiveDistribution] = Field(..., description="Learning objective distribution (Knowledge, Understanding, etc.)")
    template: List[Template] = Field(..., description="Base template for question types and structure")

    def verify_template_for_marks_and_objective_distribution(
        self, new_template: List[Template]
    ) -> Tuple[bool, Optional[str]]:
        """
        Verifies if the given `new_template` follows:
        1. The total marks match `self.total_marks`.
        2. The marks distribution per unit (chapter) aligns with `self.marks_distribution`.
        3. The objective-based percentage distribution aligns with `self.objective_distribution`.

        Returns:
            Tuple[bool, Optional[str]]: (True, None) if the new template is valid, (False, "Reason for failure") otherwise.
        """

        # **Step 1: Verify Total Marks**
        new_template_total_marks = sum(
            q_type.marks_per_question * q_type.number_of_questions
            for q_type in new_template
        )
        if new_template_total_marks != self.total_marks:
            return (
                False,
                f"Total marks mismatch: expected {self.total_marks}, got {new_template_total_marks}",
            )

        # **Step 2: Verify Unit (Chapter) Marks Distribution**
        new_unit_marks_distribution = {}

        for q_type in new_template:
            if q_type.question_distribution:
                for q_dist in q_type.question_distribution:
                    unit_name = q_dist.unit_name
                    new_unit_marks_distribution[unit_name] = (
                        new_unit_marks_distribution.get(unit_name, 0)
                        + q_type.marks_per_question
                    )

        # Convert `self.marks_distribution` to a dictionary for faster lookup
        expected_unit_marks = {md.unit_name: md.marks for md in self.marks_distribution}

        # Ensure the unit names match
        if set(new_unit_marks_distribution.keys()) != set(expected_unit_marks.keys()):
            return (
                False,
                "Mismatch in unit names between template and expected distribution",
            )

        # Ensure marks are correctly distributed
        for unit_name, marks in new_unit_marks_distribution.items():
            if marks != expected_unit_marks[unit_name]:
                return (
                    False,
                    f"Marks distribution mismatch for unit '{unit_name}': expected {expected_unit_marks[unit_name]}, got {marks}",
                )

        # **Step 3: Verify Objective-Based Percentage Distribution**
        new_objective_marks_distribution = {}

        for q_type in new_template:
            if q_type.question_distribution:
                for q_dist in q_type.question_distribution:
                    objective = q_dist.objective
                    new_objective_marks_distribution[objective] = (
                        new_objective_marks_distribution.get(objective, 0)
                        + q_type.marks_per_question
                    )

        # Convert `self.objective_distribution` to a dictionary for faster lookup
        expected_objective_distribution = {
            obj_dist.objective: obj_dist.percentage_distribution
            for obj_dist in self.objective_distribution
        }

        # Convert new marks distribution to percentage
        new_objective_percentage_distribution = {
            obj: (marks / self.total_marks) * 100
            for obj, marks in new_objective_marks_distribution.items()
        }

        # Ensure the objectives match
        if set(new_objective_percentage_distribution.keys()) != set(
            expected_objective_distribution.keys()
        ):
            return False, "Mismatch in objective distribution keys"

        # Ensure percentage distributions are within ±1% tolerance
        for objective, percentage in new_objective_percentage_distribution.items():
            if abs(percentage - expected_objective_distribution[objective]) > 1:
                return (
                    False,
                    f"Objective '{objective}' percentage mismatch: expected {expected_objective_distribution[objective]}%, got {percentage:.2f}%",
                )

        return True, None  # If all checks pass


class QBTemplateGenerationRequest(BaseModel):
    user_id: str = Field(..., description="Unique identifier for the requesting user", examples=["teacher123"])
    board: str = Field(..., description="Educational board", examples=["NCERT", "CBSE", "State board"])
    medium: str = Field(..., description="Language medium", examples=["English", "Hindi"])
    grade: int = Field(..., description="Student grade/class level")
    subject: str = Field(..., description="Subject for question generation")
    chapters: List[Chapter] = Field(..., description="List of chapters with learning outcomes and subtopics")
    total_marks: Marking
    marks_distribution: List[MarksDistribution]


class GeneratedQuestionItem(BaseModel):
    unit_name: str
    type: QuestionType
    objective: Optional[str] = None
    marks_per_question: Marking
    difficulty: DifficultyType
    item: Union[MatchingListQuestion, FourOptionsQuestion, TextQuestion]
