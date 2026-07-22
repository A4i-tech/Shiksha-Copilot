import json
import os

import aiohttp
import pytest

from app.models.chat import (
    ChatRequest,
    ConversationMessage,
    LessonChatRequest,
    LessonChatResponse,
    MessageRole,
)


@pytest.mark.integration
@pytest.mark.requires_azure
async def test_general_chat():
    request = ChatRequest(
        user_id="integration-test",
        messages=[ConversationMessage(role=MessageRole.USER, message="What is 2 + 2? Reply with only the number.")],
    )
    async with aiohttp.ClientSession() as client:
        async with client.post(f'{os.environ["SHIKSHA_BASE_URL"].rstrip("/")}/chat/general', json=request.model_dump(mode="json")) as response:
            response.raise_for_status()
            events = [json.loads(line) async for line in response.content if line.strip()]
    assert events[0] == {"type": "status", "message": "Thinking..."}
    assert "".join(event["delta"] for event in events if event["type"] == "content").strip()
    assert events[-1]["type"] == "references"
    assert isinstance(events[-1]["data"], list)


@pytest.mark.integration
@pytest.mark.requires_azure
@pytest.mark.requires_qdrant
async def test_lesson_chat():
    request = LessonChatRequest(
        user_id="integration-test",
        chapter_id="Board=BSE-TG,Medium=english,Grade=9,Subject=math,Number=5,Title=Co-ordinate Geometry",
        index_path="qdrant/SCERT/chapter_id:Medium=english,Grade=9,Subject=math,Number=5",
        messages=[
            ConversationMessage(role=MessageRole.USER, message="I teach Class 9 co-ordinate geometry."),
            ConversationMessage(role=MessageRole.ASSISTANT, message="Acknowledged."),
            ConversationMessage(role=MessageRole.USER, message="What is the centroid formula?"),
        ],
    )
    async with aiohttp.ClientSession() as client:
        async with client.post(f'{os.environ["SHIKSHA_BASE_URL"].rstrip("/")}/chat/lesson', json=request.model_dump(mode="json")) as response:
            response.raise_for_status()
            result = LessonChatResponse.model_validate(await response.json())
    assert result.user_id == request.user_id
    assert result.response.strip()
    assert result.references
    assert all(reference.text for reference in result.references)
