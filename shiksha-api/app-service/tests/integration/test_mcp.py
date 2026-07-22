import os

import pytest
from fastmcp import Client


@pytest.fixture
async def client():
    url = f'{os.environ["SHIKSHA_BASE_URL"].rstrip("/")}/mcp?user_id=00000000-0000-0000-0000-000000000001'
    async with Client(url) as client:
        yield client


@pytest.mark.integration
@pytest.mark.requires_azure
async def test_general_chat_tool(client):
    result = await client.call_tool("chat_general", {"message": "What is 2 + 2? Reply with only the number."})
    assert result.data.strip()


@pytest.mark.integration
@pytest.mark.requires_azure
@pytest.mark.requires_qdrant
async def test_lesson_chat_tool(client):
    result = await client.call_tool("chat_lesson", {
        "chapter_id": "Board=BSE-TG,Medium=english,Grade=9,Subject=math,Number=5,Title=Co-ordinate Geometry",
        "chapter_index": "qdrant/SCERT/chapter_id:Medium=english,Grade=9,Subject=math,Number=5",
        "message": "What is the centroid formula?",
    })
    assert result.data.strip()
