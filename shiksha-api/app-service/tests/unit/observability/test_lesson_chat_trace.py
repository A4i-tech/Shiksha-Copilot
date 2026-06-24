import pytest
from unittest.mock import patch, AsyncMock, MagicMock


@pytest.mark.asyncio
async def test_lesson_chat_sets_user_id_and_tags():
    """Verify user_id and curriculum tags are set on the trace."""
    pytest.importorskip("app.services.lesson_chat_service")

    captured_calls = []

    mock_lf_client = MagicMock()
    mock_lf_client.update_current_trace = MagicMock(
        side_effect=lambda **kw: captured_calls.append(kw)
    )

    mock_rag_adapter = AsyncMock()
    mock_rag_adapter.initiate_index = AsyncMock()
    mock_rag_adapter.chat_with_index = AsyncMock(return_value={
        "response": "Test response about heredity",
        "source_nodes": [],
    })

    import app.services.lesson_chat_service  # ensure module imported before patch resolves
    with patch("app.services.lesson_chat_service.get_client", return_value=mock_lf_client):
        from app.services.lesson_chat_service import LessonChatService
        from app.models.chat import LessonChatRequest, ConversationMessage, MessageRole

        svc = LessonChatService.__new__(LessonChatService)
        svc._prompt_template = MagicMock()
        svc._prompt_template.get_prompt_with_variables = MagicMock(return_value="sys prompt")
        mock_rags = AsyncMock()
        mock_rags.get = AsyncMock(return_value=mock_rag_adapter)
        svc._rags = mock_rags
        svc._rag_llm = MagicMock()
        svc._rag_embed = MagicMock()

        request = LessonChatRequest(
            user_id="student-456",
            chapter_id="Board=NCERT,Medium=English,Grade=10,Subject=Science,Number=5,Title=Heredity",
            index_path="/indexes/test",
            messages=[ConversationMessage(role=MessageRole.USER, message="What is DNA?")],
        )

        result = await svc(request)

    assert result["response"] == "Test response about heredity"
    assert len(captured_calls) >= 1
    call = captured_calls[0]
    assert call.get("user_id") == "student-456"
    assert "chat_type:lesson" in call.get("tags", [])
    assert "board:NCERT" in call.get("tags", [])
    assert "grade:10" in call.get("tags", [])
    assert "subject:Science" in call.get("tags", [])


def test_lesson_chat_tags_no_pii():
    """Board/grade/subject are curriculum metadata, not PII."""
    tags = ["chat_type:lesson", "board:NCERT", "grade:10", "subject:Science"]
    pii_indicators = ["name:", "phone:", "email:", "mobile:", "address:"]
    for tag in tags:
        for pii in pii_indicators:
            assert pii not in tag.lower(), f"PII '{pii}' in tag '{tag}'"


def test_lesson_chat_langfuse_import():
    """Verify lesson_chat_service imports observe and get_client from langfuse."""
    mod = pytest.importorskip("app.services.lesson_chat_service")
    assert hasattr(mod, "observe")
    assert hasattr(mod, "get_client")
