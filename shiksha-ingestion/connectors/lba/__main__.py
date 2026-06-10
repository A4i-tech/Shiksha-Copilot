"""
LBA connector CLI.

Usage:
    python -m connectors.lba scrape --board karnataka|telangana|all
    python -m connectors.lba ingest  --board karnataka|telangana|all
    python -m connectors.lba status

Environment variables for ingest:
    OPENAI_API_KEY   Required for question extraction
    MONGODB_URI      MongoDB connection string (default: mongodb://localhost:27017)
    MONGODB_DB       Database name (default: shiksha)
"""
from __future__ import annotations

import argparse
import asyncio
import logging
from pathlib import Path

logging.basicConfig(level=logging.INFO, format="%(asctime)s %(levelname)s %(message)s")

DATA_DIR = Path(__file__).parent  # local_path in entries already starts with "data/"
MANIFEST_PATH = Path(__file__).parent / "manifest.json"


def _get_scrapers(board: str):
    from .boards.karnataka import KarnatakaScraper
    from .boards.telangana import TelanganaScraperLive
    if board == "karnataka":
        return [KarnatakaScraper()]
    if board == "telangana":
        return [TelanganaScraperLive()]
    return [KarnatakaScraper(), TelanganaScraperLive()]


async def _scrape(board: str) -> None:
    from .manifest import Manifest

    manifest = Manifest(MANIFEST_PATH)
    manifest.load()

    for scraper in _get_scrapers(board):
        entries = await scraper.download_all(DATA_DIR)
        for entry in entries:
            manifest.add(entry)
        manifest.save()
        done = sum(1 for e in entries if e.status == "downloaded")
        failed = sum(1 for e in entries if e.status == "failed")
        logging.getLogger(__name__).info(
            "board=%s scraped: %d downloaded, %d failed", board, done, failed
        )


async def _ingest(board: str) -> None:
    from .manifest import Manifest
    from .ingest import run_ingestion
    import os
    from motor.motor_asyncio import AsyncIOMotorClient

    from pymongo.uri_parser import parse_uri
    mongo_uri = os.environ.get("MONGODB_URI", "mongodb://localhost:27017")
    parsed = parse_uri(mongo_uri)
    db_name = parsed.get("database") or os.environ.get("MONGODB_DB")
    if not db_name:
        raise ValueError(
            "No database name found. Include it in MONGODB_URI "
            "(e.g. mongodb://localhost:27017/shiksha-backend) "
            "or set MONGODB_DB env var."
        )
    client = AsyncIOMotorClient(mongo_uri)
    collection = client[db_name]["lba_questions"]

    manifest = Manifest(MANIFEST_PATH)
    manifest.load()

    if board != "all":
        manifest.entries = [e for e in manifest.entries if e.board == board]

    try:
        await run_ingestion(manifest, collection)
    finally:
        client.close()


def _status() -> None:
    from .manifest import Manifest

    manifest = Manifest(MANIFEST_PATH)
    manifest.load()

    if not manifest.entries:
        print("No entries in manifest.")
        return

    counts: dict[str, dict[str, int]] = {}
    for e in manifest.entries:
        board_counts = counts.setdefault(e.board, {"pending": 0, "downloaded": 0, "ingested": 0, "failed": 0})
        board_counts[e.status] = board_counts.get(e.status, 0) + 1

    for board, c in counts.items():
        print(
            f"{board}: pending={c['pending']} downloaded={c['downloaded']} "
            f"ingested={c['ingested']} failed={c['failed']}"
        )


def main() -> None:
    parser = argparse.ArgumentParser(prog="python -m connectors.lba")
    sub = parser.add_subparsers(dest="command", required=True)

    p_scrape = sub.add_parser("scrape", help="Discover and download PDFs")
    p_scrape.add_argument("--board", choices=["karnataka", "telangana", "all"], default="all")

    p_ingest = sub.add_parser("ingest", help="Extract questions and insert into MongoDB")
    p_ingest.add_argument("--board", choices=["karnataka", "telangana", "all"], default="all")

    sub.add_parser("status", help="Show manifest status summary")

    args = parser.parse_args()

    if args.command == "scrape":
        asyncio.run(_scrape(args.board))
    elif args.command == "ingest":
        asyncio.run(_ingest(args.board))
    elif args.command == "status":
        _status()


if __name__ == "__main__":
    main()
