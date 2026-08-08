import logging

from app.config import settings
from app.services.translation.base import TranslatorBase
from app.services.translation.azure import AzureTranslator
from app.services.translation.fallback import FallbackTranslator
from app.services.translation.noop import NoOpTranslator

logger = logging.getLogger(__name__)


class TranslatorFactory:
    """
    Factory to provide translators for specific target languages.
    Implements the replication (prototype) and caching of instances.
    When Azure Translator is not configured, returns NoOpTranslator.
    """

    _instances: dict = {}

    @classmethod
    def _is_azure_configured(cls) -> bool:
        return bool(
            (settings.translator_key or "").strip()
            and (settings.translator_region or "").strip()
            and (settings.translator_endpoint or "").strip()
        )

    @classmethod
    def get_translator(cls, tgt_lang: str) -> TranslatorBase:
        tgt_lang = tgt_lang.lower().strip()

        if tgt_lang in cls._instances:
            return cls._instances[tgt_lang]

        if not cls._is_azure_configured():
            logger.warning(
                "Translation disabled: Azure Translator not configured "
                "(translator_key, translator_region, translator_endpoint). "
                "Returning no-op translator for target_lang=%s.",
                tgt_lang,
            )
            cls._instances[tgt_lang] = NoOpTranslator()
            return cls._instances[tgt_lang]

        translators: list[TranslatorBase] = [AzureTranslator()]
        if tgt_lang == "te":
            translators = [AzureTranslator()] + translators
        instance = FallbackTranslator(translators=translators)
        cls._instances[tgt_lang] = instance
        return instance
