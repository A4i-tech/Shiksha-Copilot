from collections.abc import Callable
from functools import cache
import logging
from typing import TypeAlias

from app.config import settings
from app.services.translation.base import TranslatorBase
from app.services.translation.azure import AzureTranslator
from app.services.translation.noop import NoOpTranslator
from azure.ai.translation.text.aio import TextTranslationClient
from azure.core.credentials import AzureKeyCredential

logger = logging.getLogger(__name__)

"""Factory to provide translators for specific target languages."""
TranslatorFactory: TypeAlias = Callable[[str], TranslatorBase]
TranslationParser: TypeAlias = Callable[[str], TranslatorBase | None]

def sequential(parsers: tuple[TranslationParser, ...]) -> TranslatorFactory:
    """Sequentially tries each parser in iteration order, returns first succeeding parser."""
    return lambda target: next(t for p in parsers if (t := p(target)))


def fallback_noop(target: str) -> NoOpTranslator:
    logger.warning("Translation disabled, returning %s for target_lang=%s.", NoOpTranslator.__qualname__, target)
    return NoOpTranslator()


def azure() -> Callable[[str], AzureTranslator | None]:
    if not all((settings.translator_key, settings.translator_region, settings.translator_endpoint)):
        return lambda _: None
    translator = AzureTranslator(TextTranslationClient(
        endpoint=settings.translator_endpoint,
        credential=AzureKeyCredential(settings.translator_key),
        region=settings.translator_region
    ))
    return lambda _: translator


def simple(parsers: tuple[TranslationParser] | None = None) -> TranslatorFactory:
    """
    Implements the replication (prototype) and caching of instances.
    When Azure Translator is not configured, returns NoOpTranslator.
    """
    return cache(sequential(parsers or (azure(), fallback_noop)))