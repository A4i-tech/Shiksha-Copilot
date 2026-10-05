from collections.abc import Callable
from functools import cache
import logging
from typing import TypeAlias

from app.config import settings
from app.services.translation.base import TranslatorBase
from app.services.translation.noop import NoOpTranslator
from app.services.translation.openai import OpenAITranslator

logger = logging.getLogger(__name__)

"""Factory to provide translators for specific target languages."""
TranslatorFactory: TypeAlias = Callable[[str], TranslatorBase]
TranslationParser: TypeAlias = Callable[[str], TranslatorBase | None]

def sequential(parsers: tuple[TranslationParser, ...]) -> TranslatorFactory:
    """Sequentially tries each parser in iteration order, returns first succeeding parser."""
    def _factory(target: str) -> TranslatorBase:
        for p in parsers:
            if t := p(target):
                return t
        raise ValueError(f"no translator matched target {target!r}")
    return _factory


def fallback_noop(target: str) -> NoOpTranslator:
    logger.warning("Translation disabled, returning %s for target_lang=%s.", NoOpTranslator.__qualname__, target)
    return NoOpTranslator()


def azure() -> TranslationParser:
    key = (settings.translator_key or "").strip()
    region = (settings.translator_region or "").strip()
    endpoint = (settings.translator_endpoint or "").strip()
    if not all((key, region, endpoint)):
        return lambda _: None
    from azure.ai.translation.text.aio import TextTranslationClient
    from azure.core.credentials import AzureKeyCredential
    from app.services.translation.azure import AzureTranslator

    translator = AzureTranslator(TextTranslationClient(
        endpoint=endpoint.rstrip("/"),
        credential=AzureKeyCredential(key),
        region=region,
        connection_timeout=10,
        read_timeout=60,
    ))
    return lambda _: translator


def openai() -> TranslationParser:
    translator = OpenAITranslator(
        model=(settings.translation_model or "").strip(),
        base_url=(settings.translation_base_url or settings.openai_base_url or "").strip() or None,
        api_key=(settings.translation_api_key or settings.openai_api_key).strip(),
    )
    return lambda _: translator


def simple(parsers: tuple[TranslationParser] | None = None) -> TranslatorFactory:
    """
    Implements the replication (prototype) and caching of instances.
    The setting translation_provider picks the translator. NoOpTranslator is the last resort.
    """
    provider = openai if settings.translation_provider == "openai" else azure
    return cache(sequential(parsers or (provider(), fallback_noop)))