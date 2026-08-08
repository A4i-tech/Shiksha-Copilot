from azure.ai.translation.text.aio import TextTranslationClient
from azure.core.credentials import AzureKeyCredential
from app.config import settings
from app.services.translation.base import TranslatorBase
import logging

logger = logging.getLogger(__name__)


class AzureTranslator(TranslatorBase):
    def __init__(self):
        key = settings.translator_key or ""
        region = settings.translator_region or ""
        endpoint = (settings.translator_endpoint or "").rstrip("/")

        if not key or not region or not endpoint:
            raise ValueError("Azure Translator is not fully configured.")

        self._client = TextTranslationClient(
            endpoint=endpoint,
            credential=AzureKeyCredential(key),
            region=region,
            connection_timeout=10,
            read_timeout=60,
        )

    async def translate_async(
        self, text: str, src_lang: str = "en", tgt_lang: str = "te"
    ) -> str:
        if not text or not text.strip():
            return text
        results = await self.translate_batch_async([text], src_lang=src_lang, tgt_lang=tgt_lang)
        return results[0]

    async def translate_batch_async(
        self, texts: list[str], src_lang: str = "en", tgt_lang: str = "te"
    ) -> list[str]:
        if not texts:
            return []

        response = await self._client.translate(
            body=[{"text": t} for t in texts],
            from_language=src_lang,
            to_language=[tgt_lang],
        )

        out = []
        for i, item in enumerate(response):
            text_val = (
                item.translations[0].text
                if item.translations and item.translations[0].text
                else None
            )
            if not text_val or not text_val.strip():
                logger.warning(
                    "Azure translation missing or empty for index %d; using original text",
                    i,
                )
                text_val = texts[i] if i < len(texts) else ""
            out.append(text_val)
        return out
