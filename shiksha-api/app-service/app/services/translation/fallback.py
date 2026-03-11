from typing import Annotated, List

import logging

from pydantic import Field, validate_call

from app.services.translation.base import TranslatorBase

logger = logging.getLogger(__name__)


class FallbackTranslator(TranslatorBase):
    """
    A translator that attempts each translator in sequence, falling back to
    the next if the current one fails. Requires at least one translator.
    """

    @validate_call(config={"arbitrary_types_allowed": True})
    def __init__(
        self, translators: Annotated[List[TranslatorBase], Field(min_length=1)]
    ):
        self.translators = translators

    async def translate_async(
        self, text: str, src_lang: str, tgt_lang: str
    ) -> str:
        for i, translator in enumerate(self.translators[:-1]):
            try:
                return await translator.translate_async(text, src_lang, tgt_lang)
            # Intentionally catch any translation failure (e.g. network/provider errors)
            # so we can fall back to the next translator.
            except Exception as e:
                logger.warning(
                    "Translator %d failed: %s. Trying next.", i, e
                )
        return await self.translators[-1].translate_async(text, src_lang, tgt_lang)

    async def translate_batch_async(
        self, texts: List[str], src_lang: str, tgt_lang: str
    ) -> List[str]:
        for i, translator in enumerate(self.translators[:-1]):
            try:
                return await translator.translate_batch_async(
                    texts, src_lang, tgt_lang
                )
            # Intentionally catch any translation failure (e.g. network/provider errors)
            # so we can fall back to the next translator.
            except Exception as e:
                logger.warning(
                    "Translator %d batch failed: %s. Trying next.", i, e
                )
        return await self.translators[-1].translate_batch_async(
            texts, src_lang, tgt_lang
        )
