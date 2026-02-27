import pytest
from unittest.mock import AsyncMock, MagicMock, patch

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
    mock_response = MagicMock()
    mock_response.status_code = 200
    # One item per batch request (each string may be one chunk)
    mock_response.json.return_value = [{"translations": [{"text": "నమస్కారం"}]}]
    mock_response.raise_for_status = MagicMock()

    with patch(
        "app.services.translation.azure.httpx.AsyncClient"
    ) as mock_client_cls:
        mock_client = MagicMock()
        # Return one translation per batch so response length matches request
        def post_return(*args, **kwargs):
            body = kwargs.get("json", [])
            n = len(body) if isinstance(body, list) else 1
            r = MagicMock()
            r.status_code = 200
            r.raise_for_status = MagicMock()
            r.json.return_value = [
                {"translations": [{"text": "నమస్కారం"}]} for _ in range(n)
            ]
            return r
        mock_client.post = AsyncMock(side_effect=post_return)
        mock_client_cls.return_value.__aenter__ = AsyncMock(
            return_value=mock_client
        )
        mock_client_cls.return_value.__aexit__ = AsyncMock(return_value=None)

        with patch("app.services.translation.factory.settings") as mock_factory_settings:
            with patch("app.services.translation.azure.settings") as mock_azure_settings:
                mock_factory_settings.translator_key = "key"
                mock_factory_settings.translator_region = "region"
                mock_factory_settings.translator_endpoint = "https://api.cognitive.microsoft.com"
                mock_azure_settings.translator_key = "key"
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
            mock_factory_settings.translator_key = "key"
            mock_factory_settings.translator_region = "region"
            mock_factory_settings.translator_endpoint = "https://api.cognitive.microsoft.com"
            mock_azure_settings.translator_key = "key"
            mock_azure_settings.translator_region = "region"
            mock_azure_settings.translator_endpoint = "https://api.cognitive.microsoft.com"
            translator = TranslatorFactory.get_translator("te")
    assert translator.__class__.__name__ == "FallbackTranslator"
    _clear_factory_cache()


@pytest.mark.asyncio
async def test_azure_malformed_response_fallback_to_original():
    """When Azure returns empty or missing translations, use original text."""
    _clear_factory_cache()
    mock_response = MagicMock()
    mock_response.status_code = 200
    mock_response.json.return_value = [
        {"translations": []},
        {"translations": [{"text": "translated"}]},
    ]
    mock_response.raise_for_status = MagicMock()

    with patch(
        "app.services.translation.azure.httpx.AsyncClient"
    ) as mock_client_cls:
        mock_client = MagicMock()
        mock_client.post = AsyncMock(return_value=mock_response)
        mock_client_cls.return_value.__aenter__ = AsyncMock(
            return_value=mock_client
        )
        mock_client_cls.return_value.__aexit__ = AsyncMock(return_value=None)

        with patch("app.services.translation.azure.settings") as mock_settings:
            mock_settings.translator_key = "key"
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
        primary=FailingTranslator(), secondary=NoOpTranslator()
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
