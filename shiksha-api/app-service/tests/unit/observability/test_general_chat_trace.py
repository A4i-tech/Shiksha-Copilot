import pytest
from unittest.mock import patch, AsyncMock, MagicMock


@pytest.mark.asyncio
async def test_general_chat_user_id_in_trace():
    """Verify user_id and tags are set on the Langfuse trace."""
    pytest.importorskip("app.services.general_chat_service")

    captured_calls = []

    mock_lf_client = MagicMock()
    mock_lf_client.update_current_trace = MagicMock(side_effect=lambda **kw: captured_calls.append(kw))

    async def empty_stream():
        return
        yield

    mock_openai_client = MagicMock()
    mock_openai_client.responses.create = AsyncMock(return_value=empty_stream())

    import app.services.general_chat_service  # ensure module imported before patch resolves
    with patch("app.services.general_chat_service.get_client", return_value=mock_lf_client):
        from app.services.general_chat_service import GeneralChatService

        svc = GeneralChatService.__new__(GeneralChatService)
        svc.client = mock_openai_client
        svc.prompt_template = MagicMock()
        svc.prompt_template.get_prompt = MagicMock(return_value="system prompt")

        chunks = []
        async for chunk in svc(messages=[], user_id="user-abc"):
            chunks.append(chunk)

    assert len(captured_calls) >= 1, "update_current_trace was never called"
    call = captured_calls[0]
    assert call.get("user_id") == "user-abc"
    assert "chat_type:general" in call.get("tags", [])
    assert "has_web_search:true" in call.get("tags", [])


def test_no_pii_in_general_chat_tags():
    """Tags must not contain name, phone, or other PII."""
    tags = ["chat_type:general", "has_web_search:true"]
    pii_indicators = ["name:", "phone:", "email:", "mobile:", "address:"]
    for tag in tags:
        for pii in pii_indicators:
            assert pii not in tag.lower(), f"PII indicator '{pii}' in tag '{tag}'"


def test_langfuse_openai_import():
    """Verify AsyncAzureOpenAI in general_chat_service comes from langfuse.openai."""
    mod = pytest.importorskip("app.services.general_chat_service")
    import langfuse.openai as langfuse_openai
    assert mod.AsyncAzureOpenAI is langfuse_openai.AsyncAzureOpenAI
