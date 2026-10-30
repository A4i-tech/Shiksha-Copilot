import asyncio
import hashlib
import hmac
import os
import sys

sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))

from core.models import status_webhook
from core.models.status_webhook import GenStatus, StatusEnum, WebhookPoster


class FakeResponse:
    def raise_for_status(self):
        pass

    async def __aenter__(self):
        return self

    async def __aexit__(self, *args):
        pass


class FakeSession:
    calls = []

    async def __aenter__(self):
        return self

    async def __aexit__(self, *args):
        pass

    def post(self, url, data=None, headers=None):
        FakeSession.calls.append((url, data, headers))
        return FakeResponse()


def _poster(monkeypatch, secret):
    FakeSession.calls = []
    monkeypatch.setattr(status_webhook.aiohttp, "ClientSession", FakeSession)
    monkeypatch.setattr(status_webhook.Config, "WEBHOOK_URL", "http://hook")
    monkeypatch.setattr(status_webhook.Config, "WEBHOOK_SECRET", secret)
    return WebhookPoster()


def _status():
    return GenStatus.from_status_and_output("id-1", {"a": 1}, StatusEnum.RUNNING)


def test_signature_matches_sent_bytes(monkeypatch):
    poster = _poster(monkeypatch, "s3cret")
    asyncio.run(poster.post_status(_status()))

    _, body, headers = FakeSession.calls[0]
    assert isinstance(body, bytes)
    assert headers["Content-Type"] == "application/json"
    expected = hmac.new(
        b"s3cret",
        headers["X-Webhook-Timestamp"].encode() + b"." + body,
        hashlib.sha256,
    ).hexdigest()
    assert headers["X-Webhook-Signature"] == expected


def test_skips_send_without_secret(monkeypatch):
    poster = _poster(monkeypatch, None)
    asyncio.run(poster.post_status(_status()))
    assert FakeSession.calls == []


def test_signature_matches_fixed_vector(monkeypatch):
    poster = _poster(monkeypatch, "test-secret")
    monkeypatch.setattr(status_webhook.time, "time", lambda: 1700000000)
    monkeypatch.setattr(
        status_webhook.json,
        "dumps",
        lambda _: '{"instance_id":"abc","status":"completed"}',
    )
    asyncio.run(poster.post_status(_status()))

    _, _, headers = FakeSession.calls[0]
    assert headers["X-Webhook-Timestamp"] == "1700000000"
    assert (
        headers["X-Webhook-Signature"]
        == "8f7eb16bff536d5c813ae1371c028b205e8612fdfe6bb57e28dacf4a8f61e4fa"
    )
