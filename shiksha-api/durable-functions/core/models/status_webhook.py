import datetime
import hashlib
import hmac
import json
import time
from enum import Enum
from typing import Optional, Union
import os
import aiohttp
from pydantic import BaseModel
from core.config import Config
from core.logger import LoggerFactory


class StatusEnum(Enum):
    PENDING = "PENDING"
    RUNNING = "RUNNING"
    FAILED = "FAILED"
    COMPLETED = "COMPLETED"


class GenStatus(BaseModel):
    instance_id: str
    status: str
    timestamp: str
    input: Optional[dict] = None
    output: Optional[Union[dict, str]] = None

    @staticmethod
    def from_status_and_output(
        instance_id, input, status: StatusEnum, output: dict | str = None
    ):
        return GenStatus(
            instance_id=instance_id,
            status=status.value,
            timestamp=datetime.datetime.now().isoformat(),
            input=input,
            output=output,
        )


class WebhookPoster:
    def __init__(self):
        self.webhook_url = Config.WEBHOOK_URL
        self.webhook_secret = Config.WEBHOOK_SECRET
        self.logger = LoggerFactory.get_logger("WebhookPoster")

    async def post_status(self, gen_status: GenStatus):
        if self.webhook_url:
            if not self.webhook_secret:
                self.logger.error(
                    "WEBHOOK_SECRET is not set. Skipping status webhook. "
                    "Set WEBHOOK_SECRET to the same value the backend uses to verify signatures."
                )
                return
            body = json.dumps(gen_status.dict()).encode()
            timestamp = str(int(time.time()))
            signature = hmac.new(
                self.webhook_secret.encode(),
                timestamp.encode() + b"." + body,
                hashlib.sha256,
            ).hexdigest()
            headers = {
                "Content-Type": "application/json",
                "X-Webhook-Timestamp": timestamp,
                "X-Webhook-Signature": signature,
            }
            async with aiohttp.ClientSession() as session:
                try:
                    async with session.post(
                        self.webhook_url, data=body, headers=headers
                    ) as response:
                        response.raise_for_status()  # Raise an error for bad status codes
                        self.logger.info(
                            f"Successfully posted GenStatus: {gen_status.instance_id}"
                        )
                except aiohttp.ClientError as e:
                    self.logger.error(
                        f"Failed to post GenStatus: {gen_status.instance_id}"
                    )
                    self.logger.error(f"Error: {e}")
                    self.log_gen_status(gen_status)

    def log_gen_status(self, gen_status: GenStatus):
        self.logger.info(f"GenStatus log: {gen_status.dict()}")
