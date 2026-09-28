from typing import Any

from langdetect import LangDetectException, detect


LANGUAGE_MAP = {
    "english": "en", "kannada": "kn", "hindi": "hi", "telugu": "te", "tg": "te",
    "tamil": "ta", "malayalam": "ml", "marathi": "mr", "bengali": "bn",
    "gujarati": "gu", "punjabi": "pa", "urdu": "ur",
}


def get_sample_text(data: Any) -> str:
    stack = [data]
    while stack:
        value = stack.pop()
        if isinstance(value, str) and len(value.split()) > 2:
            return value
        if isinstance(value, dict):
            stack.extend(reversed(value.values()))
        elif isinstance(value, list):
            stack.extend(reversed(value))
    return ""


def detect_language(data: Any) -> str:
    try:
        return detect(get_sample_text(data))
    except LangDetectException:
        return "en"


def language_code(language: str) -> str:
    language = language.lower().strip()
    return LANGUAGE_MAP.get(language, language)
