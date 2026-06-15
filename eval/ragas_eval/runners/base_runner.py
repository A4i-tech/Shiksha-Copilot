import asyncio
import random
from typing import List
from openai import AsyncAzureOpenAI, RateLimitError, APITimeoutError
from tqdm.asyncio import tqdm as tqdm_async
import config

CALL_TIMEOUT = 90.0        # seconds per API call
MAX_RETRIES = 6            # max 429 retries
BASE_BACKOFF = 2.0         # seconds, doubles each retry
INTER_REQUEST_DELAY = 0.3  # seconds between released semaphore slots


class BaseRunner:
    MAX_CONCURRENT = config.MAX_CONCURRENT_CALLS

    def __init__(self, model_name: str):
        self.model_cfg = config.MODELS[model_name]
        self.model_name = model_name
        self.client = AsyncAzureOpenAI(
            api_key=self.model_cfg["api_key"],
            api_version=self.model_cfg["api_version"],
            azure_endpoint=self.model_cfg["endpoint"],
            timeout=CALL_TIMEOUT,
        )
        self.deployment = self.model_cfg["deployment_name"]
        self._sem = asyncio.Semaphore(self.MAX_CONCURRENT)

    async def call_model(self, system_prompt: str, user_prompt: str, **kwargs) -> str:
        for attempt in range(MAX_RETRIES):
            try:
                async with self._sem:
                    await asyncio.sleep(INTER_REQUEST_DELAY)
                    resp = await asyncio.wait_for(
                        self.client.chat.completions.create(
                            model=self.deployment,
                            messages=[
                                {"role": "system", "content": system_prompt},
                                {"role": "user", "content": user_prompt},
                            ],
                            temperature=0,
                            **kwargs,
                        ),
                        timeout=CALL_TIMEOUT,
                    )
                    content = resp.choices[0].message.content.strip()
                    return content

            except RateLimitError:
                wait = BASE_BACKOFF ** attempt + random.uniform(0, 1)
                print(f"\n  [429] {self.model_name} rate limited — retry {attempt + 1}/{MAX_RETRIES} in {wait:.1f}s", flush=True)
                await asyncio.sleep(wait)

            except (APITimeoutError, asyncio.TimeoutError):
                wait = BASE_BACKOFF ** attempt
                print(f"\n  [TIMEOUT] {self.model_name} — retry {attempt + 1}/{MAX_RETRIES} in {wait:.1f}s", flush=True)
                await asyncio.sleep(wait)

            except Exception as e:
                print(f"\n  [ERROR] {self.model_name}: {type(e).__name__}: {e}", flush=True)
                raise

        raise RuntimeError(f"Exhausted {MAX_RETRIES} retries for {self.model_name}")

    async def run_batch(self, samples: List[dict], desc: str = "") -> List[dict]:
        bar_desc = f"  {desc or self.model_name}"
        tasks = [self.run_single(s) for s in samples]
        return await tqdm_async.gather(
            *tasks,
            desc=bar_desc,
            total=len(tasks),
            unit="sample",
            bar_format="{l_bar}{bar}| {n_fmt}/{total_fmt} [{elapsed}<{remaining}, {rate_fmt}]",
        )

    async def run_single(self, sample: dict) -> dict:
        raise NotImplementedError

    def to_ragas_samples(self, outputs: List[dict]):
        raise NotImplementedError
