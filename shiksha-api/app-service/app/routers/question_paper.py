from typing import List, Dict, Any
from fastapi import APIRouter, Body, HTTPException, status
from langdetect import LangDetectException, detect
from langdetect.detector import Detector

from app.models.question_paper import (
    GeneratedTemplate,
    QBQuestionDistributionGenerationRequest,
    QuestionBankPartsGenerationRequest,
    QuestionBankResponse,
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


@router.post("/by-parts", summary="Generate Complete Question Paper by Parts")
async def generate_question_paper_by_parts(request: QuestionBankPartsGenerationRequest) -> QuestionBankResponse:
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
async def get_question_distribution(request: QBQuestionDistributionGenerationRequest) -> List[GeneratedTemplate]:
    """
    Creates optimized question paper templates based on specified marks distribution,
    objective distribution, and educational parameters.
    """
    try:
        return await QUESTION_PAPER_SERVICE_INSTANCE.get_question_distribution(request)
    except Exception as e:
        logger.exception(e)
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="An unexpected error occurred.") from e
