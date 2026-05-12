"""
Translate missing KSEEB/BSE-TG masterresources docs to regional language.

Uses Azure Translator API (same credentials as app-service).
Implements collect-batch-fill strategy to minimise API round-trips.

Usage:
    # Dry run — shows what would be translated, nothing written
    poetry run python scripts/translate_masterresources.py --dry-run

    # One subject/class first (smoke test)
    poetry run python scripts/translate_masterresources.py --board KSEEB --lang kn --class 6 --subject science_1

    # All missing KSEEB → Kannada isAll=true docs
    poetry run python scripts/translate_masterresources.py --board KSEEB --lang kn --is-all true

    # All missing BSE-TG → Telugu isAll=true docs
    poetry run python scripts/translate_masterresources.py --board BSE-TG --lang te --is-all true

Environment variables (required):
    TRANSLATOR_KEY      Azure Cognitive Services key
    TRANSLATOR_REGION   e.g. swedencentral
    TRANSLATOR_ENDPOINT e.g. https://api.cognitive.microsofttranslator.com

    MONGO_URI           default: mongodb://localhost:27017
    MONGO_DB            default: prod_dump2
"""

import argparse
import asyncio
import copy
import logging
import os
import sys
import time
from typing import Any, Iterator, List, Optional

from bson import ObjectId
from pymongo import MongoClient

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s %(levelname)s %(message)s",
    datefmt="%H:%M:%S",
)
logger = logging.getLogger(__name__)

# ---------------------------------------------------------------------------
# Config
# ---------------------------------------------------------------------------

MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017")
MONGO_DB = os.getenv("MONGO_DB", "prod_dump2")
COLLECTION = "masterresources"

BATCH_SIZE = 50          # strings per Azure API call
MAX_DEPTH = 50
BATCH_DELAY_S = 0.5      # seconds between batch calls (rate limit guard)
MAX_RETRIES = 5          # retry attempts on 429
RETRY_BASE_S = 5.0       # base backoff seconds (doubles each retry)

# Keys to skip during recursive translation (structural/enum identifiers)
SKIP_KEYS = frozenset({
    "difficulty",       # beginner / intermediate / advanced
    "type",             # MCQs / assessment
    "id",               # activity_1, question_bank, etc.
    "outputFormat",     # json_1 / json_2 / json_3
})

# Top-level document fields to translate
TRANSLATE_FIELDS = ["subTopics", "learningOutcomes", "resources", "additionalResources"]

# Board → medium mapping
BOARD_LANG_TO_MEDIUM = {
    "KSEEB": {"kn": "kannada"},
    "BSE-TG": {"te": "telugu"},
}

# Subjects to exclude (English-language textbooks — translation meaningless)
EXCLUDE_SUBJECTS = frozenset({"english 2_1", "english 2_2", "english"})


# ---------------------------------------------------------------------------
# Collect / fill helpers (mirrors TranslationService logic)
# ---------------------------------------------------------------------------

def _collect_strings(data: Any, depth: int = 0, parent_key: Optional[str] = None) -> List[str]:
    if depth >= MAX_DEPTH:
        raise ValueError(f"JSON depth exceeds {MAX_DEPTH}")
    if isinstance(data, dict):
        out: List[str] = []
        for k, v in data.items():
            if k in SKIP_KEYS:
                continue
            if isinstance(v, str):
                out.append(v)
            else:
                out.extend(_collect_strings(v, depth + 1, k))
        return out
    if isinstance(data, list):
        out = []
        for item in data:
            if isinstance(item, str):
                out.append(item)
            else:
                out.extend(_collect_strings(item, depth + 1, parent_key))
        return out
    return []


def _fill_strings(data: Any, it: Iterator[str], depth: int = 0) -> Any:
    if depth >= MAX_DEPTH:
        raise ValueError(f"JSON depth exceeds {MAX_DEPTH}")
    if isinstance(data, dict):
        result = {}
        for k, v in data.items():
            if k in SKIP_KEYS:
                result[k] = v
            elif isinstance(v, str):
                result[k] = next(it, v)
            else:
                result[k] = _fill_strings(v, it, depth + 1)
        return result
    if isinstance(data, list):
        result = []
        for item in data:
            if isinstance(item, str):
                result.append(next(it, item))
            else:
                result.append(_fill_strings(item, it, depth + 1))
        return result
    return data


# ---------------------------------------------------------------------------
# Azure Translator
# ---------------------------------------------------------------------------

async def translate_batch(texts: List[str], src: str, tgt: str, client) -> List[str]:
    """Translate a batch of strings via Azure Translator with retry on 429."""
    if not texts:
        return []

    from azure.core.exceptions import HttpResponseError

    delay = RETRY_BASE_S
    for attempt in range(1, MAX_RETRIES + 1):
        try:
            response = await client.translate(
                body=[{"text": t} for t in texts],
                from_language=src,
                to_language=[tgt],
            )
            out = []
            for i, item in enumerate(response):
                val = (
                    item.translations[0].text
                    if item.translations and item.translations[0].text
                    else None
                )
                if not val or not val.strip():
                    logger.warning("Empty translation at index %d; keeping original", i)
                    val = texts[i]
                out.append(val)
            return out
        except HttpResponseError as e:
            if e.status_code == 429 and attempt < MAX_RETRIES:
                logger.warning("Rate limited (429). Attempt %d/%d. Waiting %.1fs…",
                               attempt, MAX_RETRIES, delay)
                await asyncio.sleep(delay)
                delay *= 2
            else:
                raise

    raise RuntimeError("Max retries exceeded")


async def translate_json(data: Any, src: str, tgt: str, client) -> Any:
    """Collect all strings, batch-translate, fill back."""
    strings = _collect_strings(data)
    if not strings:
        return data

    translated: List[str] = []
    for i in range(0, len(strings), BATCH_SIZE):
        chunk = strings[i: i + BATCH_SIZE]
        translated.extend(await translate_batch(chunk, src, tgt, client))
        if i + BATCH_SIZE < len(strings):
            await asyncio.sleep(BATCH_DELAY_S)

    return _fill_strings(data, iter(translated))


# ---------------------------------------------------------------------------
# Document helpers
# ---------------------------------------------------------------------------

def make_target_doc(source_doc: dict, tgt_medium: str) -> dict:
    """Deep-copy source doc with new ObjectIds and target medium."""
    doc = copy.deepcopy(source_doc)
    doc["_id"] = ObjectId()
    doc["lessonId"] = ObjectId()
    doc["chapterId"] = ObjectId()
    doc["medium"] = tgt_medium
    return doc


async def translate_doc(doc: dict, src_lang: str, tgt_lang: str, az_client) -> dict:
    """Translate all translatable fields in a masterresources document."""
    for field in TRANSLATE_FIELDS:
        val = doc.get(field)
        if val is None:
            continue
        doc[field] = await translate_json(val, src_lang, tgt_lang, az_client)
    return doc


# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------

async def _run(args, az_client, col):
    """Core translation logic — separated so run() can wrap with try/finally."""
    board = args.board
    tgt_lang = args.lang
    src_lang = "en"
    is_all: Optional[bool] = args.is_all

    tgt_medium = BOARD_LANG_TO_MEDIUM.get(board, {}).get(tgt_lang)
    if not tgt_medium:
        logger.error("Unknown board/lang combination: %s / %s", board, tgt_lang)
        sys.exit(1)

    src_medium = "english"

    base_filter = {"board": board, "subject": {"$nin": list(EXCLUDE_SUBJECTS)}}
    if is_all is not None:
        base_filter["isAll"] = is_all
    if args.cls:
        base_filter["class"] = args.cls
    if args.subject:
        base_filter["subject"] = args.subject

    eng_docs = list(col.find({**base_filter, "medium": src_medium}))
    logger.info("English docs in scope: %d", len(eng_docs))

    existing_names = set(
        d["lessonName"] for d in col.find(
            {**base_filter, "medium": tgt_medium},
            {"lessonName": 1}
        )
    )
    logger.info("Already translated: %d", len(existing_names))

    missing = [d for d in eng_docs if d["lessonName"] not in existing_names]
    logger.info("Need to translate: %d", len(missing))

    if not missing:
        logger.info("Nothing to do.")
        return

    inserted = 0
    for i, eng_doc in enumerate(missing, 1):
        lesson = eng_doc["lessonName"]
        logger.info("[%d/%d] %s", i, len(missing), lesson)

        if args.dry_run:
            logger.info("  DRY RUN — skip")
            continue

        tgt_doc = make_target_doc(eng_doc, tgt_medium)
        tgt_doc = await translate_doc(tgt_doc, src_lang, tgt_lang, az_client)
        col.insert_one(tgt_doc)
        inserted += 1
        logger.info("  ✓ inserted _id=%s", tgt_doc["_id"])

    logger.info("Done. Inserted: %d | Dry-run skipped: %d",
                inserted, len(missing) if args.dry_run else 0)


async def run(args):
    from azure.ai.translation.text.aio import TextTranslationClient
    from azure.core.credentials import AzureKeyCredential

    key = os.getenv("TRANSLATOR_KEY", "")
    region = os.getenv("TRANSLATOR_REGION", "")
    endpoint = os.getenv("TRANSLATOR_ENDPOINT", "https://api.cognitive.microsofttranslator.com").rstrip("/")

    if not key or not region:
        logger.error("TRANSLATOR_KEY and TRANSLATOR_REGION env vars required")
        sys.exit(1)

    az_client = TextTranslationClient(
        endpoint=endpoint,
        credential=AzureKeyCredential(key),
        region=region,
        connection_timeout=10,
        read_timeout=60,
    )
    mongo = MongoClient(MONGO_URI)
    col = mongo[MONGO_DB][COLLECTION]

    try:
        await _run(args, az_client, col)
    finally:
        await az_client.close()
        mongo.close()


def parse_is_all(val: str) -> Optional[bool]:
    if val is None:
        return None
    return val.lower() == "true"


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Translate masterresources to regional language")
    parser.add_argument("--board", default="KSEEB", choices=["KSEEB", "BSE-TG"],
                        help="Board to translate (default: KSEEB)")
    parser.add_argument("--lang", default="kn", choices=["kn", "te"],
                        help="Target language ISO code: kn=Kannada, te=Telugu (default: kn)")
    parser.add_argument("--class", dest="cls", type=int, default=None,
                        help="Limit to specific class number")
    parser.add_argument("--subject", default=None,
                        help="Limit to specific subject (e.g. science_1)")
    parser.add_argument("--is-all", dest="is_all", default=None,
                        type=parse_is_all,
                        help="Filter by isAll: true or false (default: both)")
    parser.add_argument("--dry-run", action="store_true",
                        help="Print what would be translated without writing to DB")
    args = parser.parse_args()

    asyncio.run(run(args))
