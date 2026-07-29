"""Unit tests for the doc-shaping and chapter-resolution logic in connectors.lba.ingest.

Covers the bugs fixed per PR review: matching-question pairs shape (left/right, not
value1/value2), answerType validation against the backend's real config, and the
cross-board chapter collision in _upsert_chapters.
"""
import re
from types import SimpleNamespace

import pytest

from connectors.lba.base_scraper import PDFEntry
from connectors.lba.ingest import _to_mongo_doc, _upsert_chapters


def _entry(**overrides) -> PDFEntry:
    defaults = dict(
        board="telangana",
        grade=6,
        subject="science",
        medium="english",
        source_url="",
        local_path="",
    )
    defaults.update(overrides)
    return PDFEntry(**defaults)


class FakeCollection:
    """Minimal in-memory Mongo collection covering the query shapes _upsert_chapters uses."""

    def __init__(self):
        self.docs: list[dict] = []
        self._next_id = 1

    async def find_one(self, filt, projection=None):
        for doc in self.docs:
            if self._matches(doc, filt):
                return doc
        return None

    async def update_one(self, filt, update, upsert=False):
        for doc in self.docs:
            if self._matches(doc, filt):
                self._apply(doc, update)
                return
        if upsert:
            doc = {k: v for k, v in filt.items() if not isinstance(v, dict)}
            doc["_id"] = f"id-{self._next_id}"
            self._next_id += 1
            self._apply(doc, update)
            self.docs.append(doc)

    async def insert_one(self, doc):
        doc = dict(doc)
        doc["_id"] = f"id-{self._next_id}"
        self._next_id += 1
        self.docs.append(doc)
        return SimpleNamespace(inserted_id=doc["_id"])

    @classmethod
    def _matches(cls, doc, filt) -> bool:
        for k, v in filt.items():
            if k == "$or":
                if not any(cls._matches(doc, sub) for sub in v):
                    return False
            elif isinstance(v, dict) and "$regex" in v:
                flags = re.IGNORECASE if v.get("$options") == "i" else 0
                if not re.match(v["$regex"], str(doc.get(k, "")), flags):
                    return False
            elif isinstance(v, dict) and "$ne" in v:
                if doc.get(k) == v["$ne"]:
                    return False
            else:
                existing = doc.get(k)
                if isinstance(existing, list):
                    if v not in existing:  # Mongo array-containment semantics
                        return False
                elif existing != v:
                    return False
        return True

    @staticmethod
    def _apply(doc, update):
        for k, v in update.get("$set", {}).items():
            doc[k] = v
        for k, v in update.get("$setOnInsert", {}).items():
            doc.setdefault(k, v)


class FakeDB:
    def __init__(self):
        self.collections: dict[str, FakeCollection] = {}

    def __getitem__(self, name):
        return self.collections.setdefault(name, FakeCollection())


def test_to_mongo_doc_matching_pairs_use_left_right():
    q = {"answerType": "matching", "question": "match these", "value1": "A", "value2": "B"}
    doc = _to_mongo_doc(q, _entry())
    assert doc is not None
    assert doc["pairs"] == [{"left": "A", "right": "B"}]
    assert "value1" not in doc["pairs"][0]


def test_to_mongo_doc_valid_answer_type_kept_with_real_config_label():
    doc = _to_mongo_doc({"answerType": "mcq", "question": "q"}, _entry())
    assert doc is not None
    assert doc["answerType"] == "mcq"
    assert doc["groupHeading"] == "Multiple Choice Questions"


def test_to_mongo_doc_unrecognized_answer_type_is_dropped():
    doc = _to_mongo_doc({"answerType": "true_or_false_junk", "question": "q"}, _entry())
    assert doc is None


@pytest.mark.asyncio
async def test_upsert_chapters_does_not_collide_across_boards():
    db = FakeDB()
    # A MasterSubject shared across boards (the real trigger: _resolve_or_create_master_subject
    # matches on `boards` containing the canonical board, regardless of what else is in the list).
    db["mastersubjects"].docs.append({
        "_id": "shared-subject-id",
        "name": "Science",
        "subjectName": "Science",
        "boards": ["KSEEB", "BSE-TG"],
        "isDeleted": False,
    })
    # A pre-existing KSEEB chapter with the same topics/standard/medium/subjectId.
    db["chapters"].docs.append({
        "_id": "kseeb-chapter-id",
        "topics": "Light",
        "standard": 6,
        "medium": "english",
        "subjectId": "shared-subject-id",
        "board": "KSEEB",
        "orderNumber": 5,
        "isDeleted": False,
    })

    entry = _entry(board="telangana", grade=6, subject="science", medium="english")
    chapter_map = await _upsert_chapters(db, [{"unitName": "Light"}], entry)

    kseeb_chapter = next(d for d in db["chapters"].docs if d["_id"] == "kseeb-chapter-id")
    assert kseeb_chapter["board"] == "KSEEB"
    assert kseeb_chapter["orderNumber"] == 5
    assert chapter_map["Light"] != "kseeb-chapter-id"

    new_chapter = next(d for d in db["chapters"].docs if d["_id"] == chapter_map["Light"])
    assert new_chapter["board"] == "BSE-TG"


@pytest.mark.asyncio
async def test_upsert_chapters_matches_existing_same_board_chapter():
    db = FakeDB()
    db["mastersubjects"].docs.append({
        "_id": "subject-id", "name": "Science", "subjectName": "Science",
        "boards": ["BSE-TG"], "isDeleted": False,
    })
    db["chapters"].docs.append({
        "_id": "existing-id", "topics": "Light", "standard": 6, "medium": "english",
        "subjectId": "subject-id", "board": "BSE-TG", "orderNumber": 3, "isDeleted": False,
    })

    entry = _entry(board="telangana", grade=6, subject="science", medium="english")
    chapter_map = await _upsert_chapters(db, [{"unitName": "Light"}], entry)

    assert chapter_map["Light"] == "existing-id"
    assert len(db["chapters"].docs) == 1  # no duplicate created
