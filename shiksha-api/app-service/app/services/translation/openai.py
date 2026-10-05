import json
import logging
from typing import List

from openai import AsyncOpenAI

from app.services.translation.base import TranslationProviderError, TranslatorBase
from app.services.translation.language import LANGUAGE_MAP

logger = logging.getLogger(__name__)

_NAMES = {code: name.title() for name, code in LANGUAGE_MAP.items() if name != "tg"}


def _describe(code: str) -> str:
    return f"{_NAMES[code]} ({code})" if code in _NAMES else code


class OpenAITranslator(TranslatorBase):

    def __init__(self, model: str, base_url: str | None = None, api_key: str = "unused", client: AsyncOpenAI | None = None):
        self._model = model
        self._client = client or AsyncOpenAI(base_url=base_url, api_key=api_key, timeout=60)

    async def translate_async(
        self, text: str, src_lang: str = "en", tgt_lang: str = "te"
    ) -> str:
        if not text or not text.strip():
            return text
        results = await self.translate_batch_async([text], src_lang=src_lang, tgt_lang=tgt_lang)
        return results[0]

    async def translate_batch_async(
        self, texts: List[str], src_lang: str = "en", tgt_lang: str = "te"
    ) -> List[str]:
        pending = [i for i, t in enumerate(texts) if t and t.strip()]
        if not pending:
            return list(texts)

        source = "Detect the source language." if src_lang in (None, "auto") else f"The source language is {_describe(src_lang)}."
        system = (
            f"Translate every string in `texts` to {_describe(tgt_lang)}. {source} "
            "Keep the order and the count. Keep placeholders, markup and numbers unchanged. "
            'Return only JSON in the form {"translations": ["..."]}.'
        )
        response = await self._client.chat.completions.create(
            model=self._model,
            temperature=0,
            response_format={"type": "json_object"},
            messages=[
                {"role": "system", "content": system},
                {"role": "user", "content": json.dumps({"texts": [texts[i] for i in pending]}, ensure_ascii=False)},
            ],
        )
        try:
            translations = json.loads(response.choices[0].message.content)["translations"]
        except (TypeError, ValueError, KeyError, IndexError) as e:
            raise TranslationProviderError(f"Translation server sent a reply that is not the expected JSON ({e!r}). Check that TRANSLATION_MODEL supports JSON output.") from e
        if not isinstance(translations, list) or len(translations) != len(pending) or not all(isinstance(t, str) for t in translations):
            raise TranslationProviderError(f"Translation server returned a bad `translations` value for {len(pending)} texts. Check that TRANSLATION_MODEL follows the JSON format.")

        out = list(texts)
        for i, t in zip(pending, translations):
            out[i] = t
        return out
