import os

import aiohttp
import pytest
from langdetect import detect


@pytest.mark.integration
async def test_translation():
    question = "Explain how green plants convert sunlight into chemical energy for growth."
    payload = {"target_language": "Kannada", "json_data": {"question": [{"content_type": "text/plain", "content": question}], "difficulty": "Easy", "image": {"content_type": "image/png", "content": "image"}}}
    async with aiohttp.ClientSession() as client:
        async with client.post(f'{os.environ["SHIKSHA_BASE_URL"].rstrip("/")}/question-paper/translate-json', json=payload) as response:
            response.raise_for_status()
            translated = await response.json()
    assert detect(translated["question"][0]["content"]) == "kn"
    assert translated["difficulty"] == "Easy"
    assert translated["image"]["content"] == "image"
