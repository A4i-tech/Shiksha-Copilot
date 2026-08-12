from contextlib import asynccontextmanager
from app.utils.utils import detect_lang
from fastapi import APIRouter, Body, Depends, FastAPI, HTTPException, Request, status
from langdetect.detector import Detector
from pydantic import BaseModel, JsonValue

from app.models.question_paper import (
    QuestionBankPartsGenerationRequest,
    QuestionBankResponse,
    get_question_types_for_subject,
)
from app.services.question_paper_service import QuestionPaperService
from app.services.translation_service import TranslationService
import logging


@asynccontextmanager
async def lifespan(app: FastAPI):
    async with QuestionPaperService() as app.state.qp_svc:
        yield


def svc(request: Request) -> QuestionPaperService:
    return request.app.state.qp_svc


logger = logging.getLogger(__name__)

router = APIRouter(prefix="/question-paper", tags=["Question Paper Generation"], lifespan=lifespan)

# ISO 639-1 Language Code Mapping
LANGUAGE_MAP = {
    "english": "en",
    "kannada": "kn",
    "hindi": "hi",
    "telugu": "te",
    "tg": "te",
    "tamil": "ta",
    "malayalam": "ml",
    "marathi": "mr",
    "bengali": "bn",
    "gujarati": "gu",
    "punjabi": "pa",
    "urdu": "ur"
}


@router.post("/translate-json", summary="Translate JSON Content (Auto-Detect Source)")
async def translate_json(
    target_language: str = Body(..., description="The target language to translate to.", examples=["Kannada", "Hindi"]),
    json_data: dict[str, JsonValue] = Body(..., description="The JSON object to be translated."),
    json_data_allowed_keys: set[str] | None = Body(default=None, description="If set, only sample strings under these keys when auto-detecting language.")
) -> dict[str, JsonValue]:
    """
    Accepts a JSON object and a target language.

    1. Auto-detects the language of the input JSON content.
    2. Compares detected language with `target_language`.
    3. Translates only if they are different.
    """
    source_lang, source_lang_sample = detect_lang(json_data, json_data_allowed_keys)
    if source_lang == Detector.UNKNOWN_LANG:
        logger.warning("Language detection failed on sample text: %s", source_lang_sample)
        source_lang = "en"

    # Normalize Target Language
    target_lang_input = target_language.lower().strip()
    target_lang = LANGUAGE_MAP.get(target_lang_input, target_lang_input)

    logger.info(f"Detected source language: {source_lang}, target language: {target_lang}")
    if source_lang == target_lang:
        return json_data

    try:
        return await TranslationService.translate_json_async(json_data, source_lang, target_lang)
    except ValueError as e:
        logger.warning("Translation request validation error: %s", e)
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e)) from e


class QuestionTypeItem(BaseModel):
    key: str
    value: str
    name: str


@router.get("/question-types")
async def get_question_types(subject: str) -> list[QuestionTypeItem]:
    """Return question types available for the given subject."""
    types = get_question_types_for_subject(subject)
    return [
        QuestionTypeItem(key=qt.name, value=qt.value, name=qt.display_name)
        for qt in types
    ]


@router.post("/by-parts", summary="Generate Complete Question Paper by Parts")
async def generate_question_paper_by_parts(request: QuestionBankPartsGenerationRequest, service: QuestionPaperService = Depends(svc)) -> QuestionBankResponse:
    """
    Creates a comprehensive question paper using AI generation with specified templates,
    learning outcomes, and question distributions across different sections.
    """
    try:
        logger.info(f"Processing question paper generation request for user: {request.user_id}")
        response = await service.generate_question_bank_by_parts(request)
        logger.info(f"Successfully generated question paper for user: {request.user_id}\nResponse: {response.model_dump_json(indent=2)}")
        return response
    except ValueError as e:
        logger.error(f"Configuration error in question paper generation: {e}")
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=f"Configuration error: {str(e)}") from e
    except Exception as e:
        logger.exception(e)
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Failed to generate question paper") from e
