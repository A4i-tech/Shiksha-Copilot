import pytest

from app.models.question_paper import Content, TextQuestion
from app.services.translation.base import TranslatorBase
from app.services.translation.factory import fallback_noop, sequential, simple
from app.services.translation.language import detect_language, get_sample_text, language_code
from app.services.translation.noop import NoOpTranslator
from app.services.translation_service import TranslationService


class PrefixTranslator(TranslatorBase):
    def __init__(self, result=None):
        self.result = result
        self.calls = []

    async def translate_async(self, text, src_lang, tgt_lang):
        return f"translated:{text}"

    async def translate_batch_async(self, texts, src_lang, tgt_lang):
        self.calls.append((texts, src_lang, tgt_lang))
        return self.result if self.result is not None else [f"translated:{text}" for text in texts]


async def test_translates_question_content_and_preserves_semantic_values():
    data = TextQuestion(question=[Content.text("Hello"), Content(content_type="image/png", content=b"image")], difficulty="Easy").model_dump(mode="json")
    result = await TranslationService(lambda _: PrefixTranslator()).translate(data, "en", "te")
    assert result["question"][0]["content"] == "translated:Hello"
    assert result["question"][1]["content"] == "image"
    assert result["difficulty"] == "Easy"
    assert data["question"][0]["content"] == "Hello"


async def test_batches_without_changing_output_order():
    translator = PrefixTranslator()
    result = await TranslationService(lambda _: translator, batch_size=2).translate({"items": ["a", "b", "c"]}, "en", "te")
    assert result == {"items": ["translated:a", "translated:b", "translated:c"]}
    assert all(len(texts) <= 2 for texts, _, _ in translator.calls)
    assert all((src, dst) == ("en", "te") for _, src, dst in translator.calls)


async def test_skips_translation_for_same_language():
    data = {"question": "Hello"}
    assert await TranslationService(pytest.fail).translate(data, "en", "en") is data


async def test_rejects_invalid_translation_count():
    with pytest.raises(ValueError):
        await TranslationService(lambda _: PrefixTranslator([])).translate({"question": "Hello"}, "en", "te")


async def test_empty_skip_keys_translates_everything():
    result = await TranslationService(lambda _: PrefixTranslator(), skip_keys=frozenset()).translate({"difficulty": "Easy"}, "en", "te")
    assert result == {"difficulty": "translated:Easy"}


def test_detects_language_from_nested_question():
    data = TextQuestion(question=[Content.text("Explain how green plants convert sunlight into chemical energy.")]).model_dump(mode="json")
    assert detect_language(data) == "en"


def test_finds_sample_text_in_deep_structure():
    data = "enough words to detect"
    for _ in range(2000):
        data = [data]
    assert get_sample_text(data) == "enough words to detect"


@pytest.mark.parametrize("data", [{}, {"question": "1 2 3"}])
def test_defaults_to_english_when_language_cannot_be_detected(data):
    assert detect_language(data) == "en"


@pytest.mark.parametrize(("language", "code"), [(" Kannada ", "kn"), ("KN", "kn")])
def test_normalizes_language_code(language, code):
    assert language_code(language) == code


def test_factory_selects_first_available_translator():
    expected = PrefixTranslator()
    selected = sequential((lambda _: None, lambda _: expected, pytest.fail))("te")
    assert selected is expected


def test_factory_falls_back_to_noop():
    selected = sequential((lambda _: None, fallback_noop))("te")
    assert isinstance(selected, NoOpTranslator)


def test_simple_factory_caches_by_target():
    factory = simple((lambda _: PrefixTranslator(),))
    assert factory("xx") is factory("xx")
    assert factory("xx") is not factory("yy")
