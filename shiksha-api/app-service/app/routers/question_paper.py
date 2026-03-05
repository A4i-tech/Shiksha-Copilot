from typing import List, Dict, Any
from fastapi import APIRouter, Body, HTTPException, status
from langdetect import LangDetectException, detect
from langdetect.detector import Detector

from app.models.question_paper import (
    QBQuestionDistributionGenerationRequest,
    QBTemplateGenerationRequest,
    QuestionBankPartsGenerationRequest,
    QuestionBankResponse,
    QuestionType,
    Template,
    get_question_types_for_subject,
)
from app.services.question_paper_service import QUESTION_PAPER_SERVICE_INSTANCE
from app.services.translation_service import TranslationService
import logging

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/question-paper", tags=["Question Paper Generation"])

# ISO 639-1 Language Code Mapping
LANGUAGE_MAP = {
    "english": "en",
    "kannada": "kn",
    "hindi": "hi",
    "telugu": "te",
    "tamil": "ta",
    "malayalam": "ml",
    "marathi": "mr",
    "bengali": "bn",
    "gujarati": "gu",
    "punjabi": "pa",
    "urdu": "ur"
}

def get_sample_text(data: Any) -> str:
    """Recursively finds the first substantial string to use for language detection."""
    if isinstance(data, dict):
        for key, value in data.items():
            # Prioritize fields likely to contain full sentences or specific language content
            if key in ['instructions', 'question_text', 'title', 'question', 'text', 'part_name']:
                if isinstance(value, str) and len(value.strip().split()) > 2:
                    return value
            res = get_sample_text(value)
            if res:
                return res
    elif isinstance(data, list):
        for item in data:
            res = get_sample_text(item)
            if res:
                return res
    elif isinstance(data, str) and len(data.strip().split()) > 2:
        return data
    return ""


@router.post("/translate-json", summary="Translate JSON Content (Auto-Detect Source)")
async def translate_json_content_to_kannada(
    target_language: str = Body(..., description="The target language to translate to.", examples=["Kannada", "Hindi"]),
    json_data: Dict[str, Any] = Body(..., description="The JSON object to be translated.")
) -> Dict[str, Any]:
    """
    Accepts a JSON object and a target language.

    1. Auto-detects the language of the input JSON content.
    2. Compares detected language with `target_language`.
    3. Translates only if they are different.
    """
    logger.info(f"Processing JSON translation request. Target: {target_language}")

    # Detect Source Language
    sample_text = get_sample_text(json_data)
    source_lang_code = Detector.UNKNOWN_LANG

    if sample_text:
        try:
            source_lang_code = detect(sample_text)
        except LangDetectException:
            source_lang_code = Detector.UNKNOWN_LANG

    if source_lang_code == Detector.UNKNOWN_LANG:
        logger.warning("Language detection failed on sample text: %s", sample_text)
        source_lang_code = "en"  # Default fallback

    # Normalize Target Language
    target_lang_input = target_language.lower().strip()
    target_iso = LANGUAGE_MAP.get(target_lang_input, target_lang_input)

    logger.info(f"Detected Source ISO: '{source_lang_code}', Target ISO: '{target_iso}'")

    # Compare and Decide
    if source_lang_code == target_iso:
        logger.info("Source and Target languages match. Skipping translation.")
        return json_data

    # Perform Translation
    logger.info("Using TranslationService to translate from %s to %s", source_lang_code, target_iso)

    try:
        translated_data = await TranslationService.translate_json_async(json_data, source_lang_code, target_iso)
    except ValueError as e:
        logger.warning("Translation request validation error: %s", e)
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e)) from e

    logger.info("Successfully processed translation request.")
    return translated_data


_DISPLAY_NAMES = {
    "MCQ": "Multiple Choice Questions",
    "FILL_BLANKS": "Fill in the blanks with suitable words",
    "ANSWER_WORD": "Answer in a word, phrase or sentence",
    "ANSWER_SHORT": "Answer in two or three sentences",
    "ANSWER_GENERAL": "Answer the following questions",
    "ANSWER_LONG": "Answer in four or five sentences",
    "MATCH_LIST": "Match the following",
    "GRAMMAR_MCQ": "Grammar: Multiple Choice Questions",
    "GRAMMAR_FILL_BLANKS": "Grammar: Fill in the blanks",
    "GRAMMAR_EDITING": "Grammar: Identify and correct the error",
}


def _get_display_name(qt: QuestionType) -> str:
    return _DISPLAY_NAMES.get(qt.name, qt.name)


@router.get(
    "/question-types",
    status_code=status.HTTP_200_OK,
    summary="Get available question types for a subject",
)
async def get_question_types(subject: str = ""):
    """Return question types available for the given subject."""
    types = get_question_types_for_subject(subject)
    return [
        {"key": qt.name, "value": qt.value, "name": _get_display_name(qt)}
        for qt in types
    ]


@router.post(
    "/by-parts",
    response_model=QuestionBankResponse,
    status_code=status.HTTP_200_OK,
    summary="Generate Complete Question Paper by Parts",
    description="""
    **Generate a comprehensive question paper with multiple question types and parts**
    
    This endpoint creates a structured question paper using AI generation based on:
    - Specified question templates and distributions
    - Chapter content and learning outcomes
    - Educational objectives and mark distributions
    - Different question types (MCQ, short answer, long answer, etc.)
    
    **Key Features:**
    - Multi-part question paper generation
    - Template-based question distribution
    - Learning outcome alignment
    - Various question types support (MCQ, Fill blanks, Short/Long answers, Matching)
    - Curriculum-specific content generation
    
    **Question Types Supported:**
    - Multiple Choice Questions (MCQ)
    - Fill in the blanks
    - Short answer questions
    - Long answer questions
    - Matching type questions
    """,
    responses={
        status.HTTP_200_OK: {
            "description": "Successfully generated question paper",
            "model": QuestionBankResponse,
            "content": {
                "application/json": {
                    "example": {
                        "metadata": {
                            "user_id": "teacher123",
                            "subject": "Science",
                            "grade": "10",
                            "unit_names": ["Light", "Electricity"],
                            "school_name": "ABC School",
                            "examination_name": "Mid-term Exam",
                        },
                        "questions": [
                            {
                                "type": "MCQ",
                                "number_of_questions": 5,
                                "marks_per_question": 1,
                                "questions": [
                                    {
                                        "question": "What is the speed of light in vacuum?",
                                        "options": [
                                            "3x10^8 m/s",
                                            "3x10^6 m/s",
                                            "3x10^10 m/s",
                                            "3x10^5 m/s",
                                        ],
                                        "answer": "3x10^8 m/s",
                                    }
                                ],
                            }
                        ],
                    }
                }
            },
        },
        status.HTTP_400_BAD_REQUEST: {
            "description": "Invalid template configuration or missing required fields"
        },
        status.HTTP_500_INTERNAL_SERVER_ERROR: {
            "description": "Question generation process failed"
        },
    },
)
async def generate_question_paper_by_parts(
    request: QuestionBankPartsGenerationRequest,
) -> QuestionBankResponse:
    """
    Creates a comprehensive question paper using AI generation with specified templates,
    learning outcomes, and question distributions across different sections.
    """
    try:
        logger.info(f"Processing question paper generation request for user: {request.user_id}")
        response = await QUESTION_PAPER_SERVICE_INSTANCE.generate_question_bank_by_parts(request)
        logger.info(f"Successfully generated question paper for user: {request.user_id}\nResponse: {response.model_dump_json(indent=2)}")
        return response
    except ValueError as e:
        logger.error(f"Configuration error in question paper generation: {e}")
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=f"Configuration error: {str(e)}") from e
    except Exception as e:
        logger.exception(e)
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Failed to generate question paper") from e


@router.post("/questiondistribution", summary="Generate Question Distribution Templates")
async def get_question_distribution(request: QBQuestionDistributionGenerationRequest) -> List[Template]:
    """
    Creates optimized question paper templates based on specified marks distribution,
    objective distribution, and educational parameters.
    """
    try:
        return await QUESTION_PAPER_SERVICE_INSTANCE.get_question_distribution(request)
    except Exception as e:
        logger.exception(e)
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="An unexpected error occurred.") from e


@router.post("/template", summary="Generate Question Paper Templates (Static)")
async def get_question_paper_template_v2(request: QBTemplateGenerationRequest) -> List[Template]:
    """
    Provides predefined question paper templates based on standard educational
    configurations and curriculum requirements.
    """
    try:
        return request.get_template()
    except ValueError as e:
        logger.exception(f"Configuration error in question paper template generation: {e}")
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=f"Configuration error: {str(e)}") from e
    except Exception as e:
        logger.exception(e)
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Failed to generate question paper template") from e
