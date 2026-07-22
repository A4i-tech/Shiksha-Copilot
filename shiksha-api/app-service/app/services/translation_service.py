from copy import deepcopy
from typing import Any, Iterable

from app.services.translation.factory import TranslatorFactory, simple
import logging

logger = logging.getLogger(__name__)


class TranslationService:
    """
    High-level translation service responsible for translating JSON content
    into the target language. Uses a collect-then-batch-translate-then-fill
    strategy to minimize API round-trips.
    """

    def __init__(self, factory: TranslatorFactory | None = None, batch_size: int | None = None, skip_keys: frozenset[str] | None = None):
        self.factory = factory or simple()
        self.batch_size = batch_size or 100

        # Keys whose values are semantic identifiers (enums, codes) used for logic/styling,
        # not human-readable content. Translating these would break downstream consumers.
        self.skip_keys = skip_keys if skip_keys is not None else frozenset({
            "type", "heading", "source", "difficulty", "objective", "unit_name", "answer_type", "_id",
            "correct_order_indices", "year", "correct_order_by_id", "exam_type", "chapter_number", "content_type",
            "marks_per_question", "title", "medium", "language", "chapter_id", "subject", "chapter", "class"
        })


    async def translate(self, data: dict[str, Any], src: str, dst: str) -> dict[str, Any]:
        """
        Recursively translates string values within a dict/list structure.
        """
        if src == dst:
            return data

        translator = self.factory(dst)
        flat = self.unzip(data)
        texts = [v for _, v in flat]
        translated = sum([
            await translator.translate_batch_async(texts[i:i+self.batch_size], src, dst)
            for i in range(0, len(texts), self.batch_size)
        ], [])
        if len(translated) != len(flat):
            raise RuntimeError("Invalid translation count")
        return self.zip(data, zip((p for p, _ in flat), translated, strict=True))


    def _skip(self, data: dict, key: str) -> bool:
        if key in self.skip_keys:
            return True
        if key == "content" and "content_type" in data and data["content_type"].startswith("image/"):
            return True
        return False


    def unzip(self, data: dict[str, Any]) -> list[tuple[tuple, str]]:
        out, stack = [], [((), data)]
        while stack:
            path, value = stack.pop()
            if isinstance(value, str):
                out.append((path, value))
            elif isinstance(value, list):
                stack += [(path + (i,), v) for i, v in enumerate(value)]
            elif isinstance(value, dict):
                stack += [(path + (k,), v) for k, v in value.items() if not self._skip(value, k)]
        return out


    def zip(self, data: dict[str, Any], values: Iterable[tuple[tuple, str]]):
        data = deepcopy(data)
        for path, value in values:
            node = data
            for key in path[:-1]:
                node = node[key]
            node[path[-1]] = value
        return data
