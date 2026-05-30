from typing import Any, Iterator, List

from app.services.translation.factory import TranslatorFactory
import logging

logger = logging.getLogger(__name__)

MAX_RECURSION_DEPTH = 50
TRANSLATION_BATCH_SIZE = 100
# Keys whose values are semantic identifiers (enums, codes) used for logic/styling,
# not human-readable content. Translating these would break downstream consumers.
SKIP_KEYS: frozenset = frozenset({"type", "heading", "source", "difficulty", "objective", "unitName", "unit_name"})


class TranslationService:
    """
    High-level translation service responsible for translating JSON content
    into the target language. Uses a collect-then-batch-translate-then-fill
    strategy to minimize API round-trips.
    """

    @classmethod
    async def translate_json_async(
        cls, data: Any, src_lang: str, tgt_lang: str
    ) -> Any:
        """
        Recursively translates string values within a JSON-like dict/list structure.
        """
        if src_lang == tgt_lang:
            return data

        translator = TranslatorFactory.get_translator(tgt_lang)
        strings = cls._collect_strings(data, depth=0)
        if not strings:
            return data

        # Batch translate in chunks to respect API limits
        translated: List[str] = []
        for i in range(0, len(strings), TRANSLATION_BATCH_SIZE):
            chunk = strings[i : i + TRANSLATION_BATCH_SIZE]
            translated.extend(
                await translator.translate_batch_async(
                    chunk, src_lang, tgt_lang
                )
            )
        return cls._fill_strings(data, iter(translated), depth=0)

    @classmethod
    def _collect_strings(cls, data: Any, depth: int = 0) -> List[str]:
        """Collect all string values in DFS order. Raises ValueError if depth exceeded."""
        if depth >= MAX_RECURSION_DEPTH:
            raise ValueError(
                f"JSON structure exceeds maximum depth ({MAX_RECURSION_DEPTH})"
            )
        if isinstance(data, dict):
            out: List[str] = []
            for key, value in data.items():
                if key in SKIP_KEYS:
                    continue
                if isinstance(value, str):
                    out.append(value)
                else:
                    out.extend(cls._collect_strings(value, depth + 1))
            return out
        if isinstance(data, list):
            out = []
            for item in data:
                if isinstance(item, str):
                    out.append(item)
                else:
                    out.extend(cls._collect_strings(item, depth + 1))
            return out
        return []

    @classmethod
    def _next_translated(cls, translations: Iterator[str], original: str) -> str:
        """Return next translated string, falling back to original if iterator is exhausted."""
        try:
            return next(translations)
        except StopIteration:
            logger.warning(
                "Translation iterator exhausted before structure was fully filled; "
                "using original text as fallback."
            )
            return original

    @classmethod
    def _fill_strings(
        cls, data: Any, translations: Iterator[str], depth: int = 0
    ) -> Any:
        """Reconstruct structure with translated strings in same DFS order."""
        if depth >= MAX_RECURSION_DEPTH:
            raise ValueError(
                f"JSON structure exceeds maximum depth ({MAX_RECURSION_DEPTH})"
            )
        if isinstance(data, dict):
            return {
                key: value
                if key in SKIP_KEYS
                else cls._fill_strings(value, translations, depth + 1)
                if not isinstance(value, str)
                else cls._next_translated(translations, value)
                for key, value in data.items()
            }
        if isinstance(data, list):
            return [
                cls._fill_strings(item, translations, depth + 1)
                if not isinstance(item, str)
                else cls._next_translated(translations, item)
                for item in data
            ]
        return data
