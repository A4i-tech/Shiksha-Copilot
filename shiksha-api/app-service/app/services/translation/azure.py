import asyncio
import textwrap
from typing import List

import httpx
from app.config import settings
from app.services.translation.base import TranslatorBase
import logging

logger = logging.getLogger(__name__)


class AzureTranslator(TranslatorBase):
    def __init__(self):
        self.key = settings.translator_key or ""
        self.region = settings.translator_region or ""
        self.endpoint = (settings.translator_endpoint or "").rstrip("/")

        if not self.key or not self.region or not self.endpoint:
            raise ValueError(
                "Azure Translator is not configured: set translator_key, "
                "translator_region, and translator_endpoint"
            )

    def _split_text(self, text: str, max_len: int = 1000) -> List[str]:
        if not text:
            return []
        return textwrap.wrap(
            str(text), width=max_len, break_long_words=False, replace_whitespace=False
        )

    async def translate_async(
        self, text: str, src_lang: str = "en", tgt_lang: str = "te"
    ) -> str:
        if not text or not text.strip():
            return text

        chunks = self._split_text(text, max_len=1000)
        translated_chunks = await self.translate_batch_async(
            chunks, src_lang=src_lang, tgt_lang=tgt_lang
        )
        return " ".join(translated_chunks) if translated_chunks else text

    def _parse_batch_result(self, result: object, texts: List[str]) -> List[str]:
        if not isinstance(result, list):
            logger.error(
                "Azure Translator returned non-list result: %s", type(result)
            )
            raise ValueError("Azure Translator returned invalid response shape")
        out = []
        for i, item in enumerate(result):
            trans = item.get("translations") if isinstance(item, dict) else None
            trans = trans if isinstance(trans, list) else []
            text_val = (
                trans[0].get("text") if trans and isinstance(trans[0], dict) else None
            )
            if text_val is None or (
                isinstance(text_val, str) and not text_val.strip()
            ):
                original = texts[i] if i < len(texts) else ""
                logger.warning(
                    "Azure translation missing or empty for index %d; using original text",
                    i,
                )
                text_val = original
            out.append(text_val if isinstance(text_val, str) else str(text_val))
        # Ensure output length matches input; API may return fewer items
        while len(out) < len(texts):
            idx = len(out)
            out.append(texts[idx])
            logger.warning(
                "Azure returned fewer items than requested; using original for index %d",
                idx,
            )
        return out

    async def translate_batch_async(
        self, texts: List[str], src_lang: str = "en", tgt_lang: str = "te"
    ) -> List[str]:
        if not texts:
            return []

        url = f"{self.endpoint}/translator/text/v3.0/translate"
        params = {
            "api-version": "3.0",
            "from": src_lang,
            "to": tgt_lang,
        }
        headers = {
            "Ocp-Apim-Subscription-Key": self.key,
            "Ocp-Apim-Subscription-Region": self.region,
            "Content-Type": "application/json",
        }
        body = [{"text": str(t)} for t in texts]

        async with httpx.AsyncClient() as client:
            for attempt in range(5):
                try:
                    response = await client.post(
                        url, params=params, headers=headers, json=body
                    )

                    if response.status_code == 429:
                        logger.warning(
                            "Rate limit hit (429) interacting with Azure Translator. "
                            "Waiting 30 seconds..."
                        )
                        await asyncio.sleep(30)
                        continue

                    response.raise_for_status()
                    result = response.json()
                    return self._parse_batch_result(result, texts)

                except (httpx.HTTPStatusError, httpx.RequestError) as e:
                    logger.error(
                        "Attempt %d failed for Azure Translation batch: %s",
                        attempt + 1,
                        e,
                    )
                    if attempt == 4:
                        raise Exception(
                            f"Azure Translation failed after max retries: {e}"
                        ) from e
                    await asyncio.sleep(2)

        logger.error(
            "Failed to translate after 5 attempts due to rate limiting."
        )
        raise Exception("Rate limit exceeded after max retries")
