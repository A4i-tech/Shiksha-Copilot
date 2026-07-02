import pytest
from unittest.mock import patch, MagicMock


def test_question_bank_openai_import_is_langfuse():
    mod = pytest.importorskip("app.services.question_paper_service")
    import langfuse.openai as lf_openai
    assert mod.AsyncAzureOpenAI is lf_openai.AsyncAzureOpenAI


@pytest.mark.asyncio
async def test_question_bank_sets_user_id_and_tags():
    pytest.importorskip("app.services.question_paper_service")
    from app.models.question_paper import QuestionBankPartsGenerationRequest

    captured = []
    mock_lf = MagicMock()
    mock_lf.update_current_trace = MagicMock(side_effect=lambda **kw: captured.append(kw))

    req = QuestionBankPartsGenerationRequest(
        user_id="teacher-1",
        board="CBSE",
        medium="English",
        grade=9,
        subject="Maths",
        unit_level="CHAPTER",
        chapters=[],
        total_marks=80,
        template=[],
    )

    import app.services.question_paper_service  # ensure imported before patch resolves
    with patch("app.services.question_paper_service.get_client", return_value=mock_lf):
        from app.services.question_paper_service import QuestionPaperService
        svc = QuestionPaperService.__new__(QuestionPaperService)
        svc.client = MagicMock()
        svc._adapter_cache = {}

        try:
            await svc.generate_question_bank_by_parts(req)
        except Exception:
            pass  # we only care that trace was set up before any downstream error

    assert len(captured) >= 1, "update_current_trace never called"
    c = captured[0]
    assert c.get("user_id") == "teacher-1"
    assert any("board:" in t for t in c.get("tags", []))
