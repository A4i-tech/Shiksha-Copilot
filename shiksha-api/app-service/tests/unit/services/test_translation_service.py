import pytest

from app.services.translation_service import TranslationProviderError, TranslationService


class Short:
    async def translate_batch_async(self, texts, src, dst):
        return texts[:-1]


class Upper:
    async def translate_batch_async(self, texts, src, dst):
        return [t.upper() for t in texts]


async def test_count_mismatch_raises():
    service = TranslationService(factory=lambda dst: Short())
    with pytest.raises(TranslationProviderError, match="1 results for 2 inputs"):
        await service.translate({"a": "x", "b": "y"}, "en", "hi")


async def test_translates_and_skips_same_language():
    calls = []

    def factory(dst):
        calls.append(dst)
        return Upper()

    service = TranslationService(factory=factory)
    assert await service.translate({"a": "x"}, "en", "hi") == {"a": "X"}
    assert await service.translate({"a": "x"}, "en", "en") == {"a": "x"}
    assert calls == ["hi"]
