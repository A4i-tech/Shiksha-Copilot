from typing import List, Optional

import logging

from app.services.translation.base import TranslatorBase

logger = logging.getLogger(__name__)


class FallbackTranslator(TranslatorBase):
    """
    A translator that attempts to use a primary translator, and falls back to a
    secondary translator if the primary fails.
    """

    def __init__(self, primary: Optional[TranslatorBase], secondary: TranslatorBase):
        self.primary = primary
        self.secondary = secondary

    async def translate_async(
        self, text: str, src_lang: str, tgt_lang: str
    ) -> str:
        if self.primary:
            try:
                return await self.primary.translate_async(
                    text, src_lang, tgt_lang
                )
            # Intentionally catch any translation failure (e.g. network/provider errors)
            # so we can fall back to the secondary translator.
            except Exception as e:
                logger.warning(
                    "Primary translator failed: %s. Falling back to secondary.", e
                )
        return await self.secondary.translate_async(text, src_lang, tgt_lang)

    async def translate_batch_async(
        self, texts: List[str], src_lang: str, tgt_lang: str
    ) -> List[str]:
        if self.primary:
            try:
                return await self.primary.translate_batch_async(
                    texts, src_lang, tgt_lang
                )
            # Intentionally catch any translation failure (e.g. network/provider errors)
            # so we can fall back to the secondary translator.
            except Exception as e:
                logger.warning(
                    "Primary batch translation failed: %s. Falling back to secondary.",
                    e,
                )
        return await self.secondary.translate_batch_async(
            texts, src_lang, tgt_lang
        )
