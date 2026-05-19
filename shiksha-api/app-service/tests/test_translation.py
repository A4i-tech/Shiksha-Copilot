import pytest
from unittest.mock import AsyncMock, MagicMock, patch
from pydantic import SecretStr

from app.services.translation.factory import TranslatorFactory
from app.services.translation_service import (
    MAX_RECURSION_DEPTH,
    TranslationService,
)


def _clear_factory_cache():
    TranslatorFactory._instances.clear()


@pytest.mark.asyncio
async def test_translation_service_bypasses_same_lang():
    data = {"hello": "world"}
    result = await TranslationService.translate_json_async(data, "en", "en")
    assert result == data


@pytest.mark.asyncio
async def test_translation_service_azure_mock():
    _clear_factory_cache()

    def _make_translate_result(n):
        items = []
        for _ in range(n):
            item = MagicMock()
            item.translations = [MagicMock(text="నమస్కారం")]
            items.append(item)
        return items

    with patch(
        "app.services.translation.azure.TextTranslationClient"
    ) as mock_client_cls:
        mock_client = MagicMock()
        mock_client.translate = AsyncMock(
            side_effect=lambda body, **kwargs: _make_translate_result(len(body))
        )
        mock_client_cls.return_value = mock_client

        with patch("app.services.translation.factory.settings") as mock_factory_settings:
            with patch("app.services.translation.azure.settings") as mock_azure_settings:
                mock_factory_settings.translator_key = SecretStr("key")
                mock_factory_settings.translator_region = "region"
                mock_factory_settings.translator_endpoint = "https://api.cognitive.microsoft.com"
                mock_azure_settings.translator_key = SecretStr("key")
                mock_azure_settings.translator_region = "region"
                mock_azure_settings.translator_endpoint = "https://api.cognitive.microsoft.com"
                _clear_factory_cache()

                data = {
                    "title": "Hello",
                    "nested": {"greeting": "Hello"},
                    "items": ["Hello", 123],
                }

                result = await TranslationService.translate_json_async(
                    data, "en", "te"
                )

    assert result["title"] == "నమస్కారం"
    assert result["nested"]["greeting"] == "నమస్కారం"
    assert result["items"][0] == "నమస్కారం"
    assert result["items"][1] == 123

    _clear_factory_cache()
    with patch("app.services.translation.factory.settings") as mock_factory_settings:
        with patch("app.services.translation.azure.settings") as mock_azure_settings:
            mock_factory_settings.translator_key = SecretStr("key")
            mock_factory_settings.translator_region = "region"
            mock_factory_settings.translator_endpoint = "https://api.cognitive.microsoft.com"
            mock_azure_settings.translator_key = SecretStr("key")
            mock_azure_settings.translator_region = "region"
            mock_azure_settings.translator_endpoint = "https://api.cognitive.microsoft.com"
            translator = TranslatorFactory.get_translator("te")
    assert translator.__class__.__name__ == "FallbackTranslator"
    _clear_factory_cache()


@pytest.mark.asyncio
async def test_azure_malformed_response_fallback_to_original():
    """When Azure returns empty or missing translations, use original text."""
    _clear_factory_cache()

    item1 = MagicMock()
    item1.translations = []
    item2 = MagicMock()
    item2.translations = [MagicMock(text="translated")]

    with patch(
        "app.services.translation.azure.TextTranslationClient"
    ) as mock_client_cls:
        mock_client = MagicMock()
        mock_client.translate = AsyncMock(return_value=[item1, item2])
        mock_client_cls.return_value = mock_client

        with patch("app.services.translation.azure.settings") as mock_settings:
            mock_settings.translator_key = SecretStr("key")
            mock_settings.translator_region = "region"
            mock_settings.translator_endpoint = "https://api.cognitive.microsoft.com"

            from app.services.translation.azure import AzureTranslator

            translator = AzureTranslator()
            result = await translator.translate_batch_async(
                ["first", "second"], src_lang="en", tgt_lang="te"
            )

    assert result[0] == "first"
    assert result[1] == "translated"
    _clear_factory_cache()


@pytest.mark.asyncio
async def test_recursion_depth_raises():
    """Deeply nested JSON beyond MAX_RECURSION_DEPTH raises ValueError."""
    _clear_factory_cache()
    with patch("app.services.translation.factory.settings") as mock_settings:
        mock_settings.translator_key = ""
        mock_settings.translator_region = ""
        mock_settings.translator_endpoint = ""
        _clear_factory_cache()

        def deep(n):
            return {"x": deep(n - 1)} if n > 0 else "leaf"

        data = deep(MAX_RECURSION_DEPTH + 5)

        with pytest.raises(ValueError) as exc_info:
            await TranslationService.translate_json_async(data, "en", "te")

        assert "maximum depth" in str(exc_info.value).lower()
    _clear_factory_cache()


@pytest.mark.asyncio
async def test_skip_keys_not_translated():
    """Fields in SKIP_KEYS (e.g. difficulty) must not be translated."""
    data = {"question": "What is gravity?", "difficulty": "Easy"}
    result = await TranslationService.translate_json_async(data, "en", "te")
    assert result["difficulty"] == "Easy"


@pytest.mark.asyncio
async def test_fallback_translator_uses_secondary_when_primary_fails():
    """When primary raises, FallbackTranslator uses secondary."""
    from app.services.translation.fallback import FallbackTranslator
    from app.services.translation.noop import NoOpTranslator

    class FailingTranslator(NoOpTranslator):
        async def translate_async(self, text, src_lang="en", tgt_lang="te"):
            raise RuntimeError("primary failed")

        async def translate_batch_async(self, texts, src_lang="en", tgt_lang="te"):
            raise RuntimeError("primary batch failed")

    fallback = FallbackTranslator(
        translators=[FailingTranslator(), NoOpTranslator()]
    )
    result = await fallback.translate_async("hello", "en", "te")
    assert result == "hello"

    batch_result = await fallback.translate_batch_async(
        ["a", "b"], "en", "te"
    )
    assert batch_result == ["a", "b"]


@pytest.mark.asyncio
async def test_noop_when_config_missing():
    """When translator config is missing, factory returns NoOpTranslator and data is unchanged."""
    _clear_factory_cache()
    with patch("app.services.translation.factory.settings") as mock_settings:
        mock_settings.translator_key = ""
        mock_settings.translator_region = ""
        mock_settings.translator_endpoint = ""

        translator = TranslatorFactory.get_translator("te")
        assert translator.__class__.__name__ == "NoOpTranslator"

        data = {"title": "Hello", "nested": {"key": "value"}}
        result = await TranslationService.translate_json_async(
            data, "en", "te"
        )
        assert result == data
    _clear_factory_cache()
