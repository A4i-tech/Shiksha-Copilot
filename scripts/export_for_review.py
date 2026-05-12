"""
Export translated masterresources docs for Shikshana review.

Generates side-by-side English + Kannada/Telugu JSON files, organized by
Class/subject. Reviewer can compare original vs translated content field-by-field.

Usage:
    # Export KSEEB isAll=true Kannada docs (Phase 1 review)
    poetry run python scripts/export_for_review.py --board KSEEB --lang kn --is-all true

    # Export all KSEEB Kannada docs
    poetry run python scripts/export_for_review.py --board KSEEB --lang kn

    # Custom output dir
    poetry run python scripts/export_for_review.py --board KSEEB --lang kn --out exports/review-2026-05-12

Environment variables:
    MONGO_URI   default: mongodb://localhost:27017
    MONGO_DB    default: prod_dump2
"""

import argparse
import json
import os
import sys
from pathlib import Path
from typing import Optional

from bson import ObjectId
from pymongo import MongoClient

MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017")
MONGO_DB = os.getenv("MONGO_DB", "prod_dump2")
COLLECTION = "masterresources"

BOARD_LANG_TO_MEDIUM = {
    "KSEEB": {"kn": "kannada"},
    "BSE-TG": {"te": "telugu"},
}

# Only export these fields — keeps files readable for reviewer
REVIEW_FIELDS = ["lessonName", "class", "subject", "medium", "isAll",
                 "subTopics", "learningOutcomes", "resources", "additionalResources"]


def clean_doc(doc: dict) -> dict:
    """Return only review-relevant fields, with _id as string."""
    out = {"_id": str(doc["_id"])}
    for field in REVIEW_FIELDS:
        if field in doc:
            out[field] = doc[field]
    return out


def bson_default(obj):
    """JSON serialiser for ObjectId and other BSON types."""
    if isinstance(obj, ObjectId):
        return str(obj)
    raise TypeError(f"Object of type {type(obj)} is not JSON serialisable")


def export(board: str, tgt_lang: str, is_all: Optional[bool], out_root: Path, col):
    tgt_medium = BOARD_LANG_TO_MEDIUM.get(board, {}).get(tgt_lang)
    if not tgt_medium:
        print(f"ERROR: Unknown board/lang: {board}/{tgt_lang}", file=sys.stderr)
        sys.exit(1)

    src_medium = "english"

    filt = {"board": board, "medium": tgt_medium}
    if is_all is not None:
        filt["isAll"] = is_all

    tgt_docs = list(col.find(filt))
    print(f"Found {len(tgt_docs)} {tgt_medium} docs to export")

    exported = 0
    skipped = 0
    for tdoc in tgt_docs:
        eng_doc = col.find_one({
            "board": board,
            "medium": src_medium,
            "lessonName": tdoc["lessonName"],
        })
        if not eng_doc:
            print(f"  WARN: No English counterpart for '{tdoc['lessonName']}' — skipping")
            skipped += 1
            continue

        cls = tdoc.get("class", "unknown")
        subject = tdoc.get("subject", "unknown").replace(" ", "_")
        lesson_safe = (
            tdoc["lessonName"]
            .replace("/", "_").replace(" ", "_")
            .replace("?", "").replace(":", "-").replace("*", "")
            .replace('"', "").replace("<", "").replace(">", "")
            .replace("|", "-").replace("\\", "_")
        )

        folder = out_root / f"Class{cls}" / subject
        folder.mkdir(parents=True, exist_ok=True)

        for prefix, doc in [(src_medium, eng_doc), (tgt_medium, tdoc)]:
            out_path = folder / f"{prefix}_{lesson_safe}.json"
            with open(out_path, "w", encoding="utf-8") as f:
                json.dump(clean_doc(doc), f, ensure_ascii=False, indent=2,
                          default=bson_default)

        exported += 1

    print(f"Exported: {exported} pairs -> {out_root}")
    if skipped:
        print(f"Skipped (no English counterpart): {skipped}")
    return exported


def parse_is_all(val: str) -> Optional[bool]:
    if val is None:
        return None
    return val.lower() == "true"


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Export translated docs for review")
    parser.add_argument("--board", default="KSEEB", choices=["KSEEB", "BSE-TG"])
    parser.add_argument("--lang", default="kn", choices=["kn", "te"])
    parser.add_argument("--is-all", dest="is_all", default=None, type=parse_is_all,
                        help="true/false — omit to export all")
    parser.add_argument("--out", default=None,
                        help="Output directory (default: exports/shikshana-review/<board>-<medium>)")
    args = parser.parse_args()

    medium = BOARD_LANG_TO_MEDIUM.get(args.board, {}).get(args.lang, args.lang)
    is_all_suffix = "" if args.is_all is None else ("-isAll" if args.is_all else "-isSubtopic")
    default_out = Path("exports") / "shikshana-review" / f"{args.board}-{medium}{is_all_suffix}"
    out_root = Path(args.out) if args.out else default_out

    mongo = MongoClient(MONGO_URI)
    col = mongo[MONGO_DB][COLLECTION]
    try:
        export(args.board, args.lang, args.is_all, out_root, col)
    finally:
        mongo.close()
