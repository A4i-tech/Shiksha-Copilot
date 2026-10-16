import asyncio
import aiohttp
from unittest.mock import patch

from core.models.status_webhook import GenStatus, WebhookPoster


def test_failed_webhook_post_does_not_raise():
    poster = WebhookPoster()
    poster.webhook_url = "http://webhook.invalid/hook"
    status = GenStatus(instance_id="i-1", status="pending", timestamp="t", input={})

    with patch("aiohttp.ClientSession.post", side_effect=aiohttp.ClientConnectionError("down")):
        asyncio.run(poster.post_status(status))
