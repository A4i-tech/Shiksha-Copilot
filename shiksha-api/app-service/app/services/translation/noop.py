from app.services.translation.base import TranslatorBase


class NoOpTranslator(TranslatorBase):
    """
    Translator that returns input unchanged. Used when Azure Translator
    is not configured (e.g. local/dev) so the app can run without credentials.
    """

    async def translate_async(
        self, text: str, src_lang: str = "en", tgt_lang: str = "te"
    ) -> str:
        return text

    async def translate_batch_async(
        self, texts: list[str], src_lang: str = "en", tgt_lang: str = "te"
    ) -> list[str]:
        return list(texts) if texts else []
