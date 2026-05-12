# Regional Language Translation — Completion Plan

> DB: `prod_dump2` · Collection: `masterresources`
> Goal: Complete Kannada (KSEEB) and Telugu (BSE-TG) translations
> Issues: #134 (parent), #93 (Telugu eval), #222 (vendor integration)
> ⚠️ All work on local prod backup (`prod_dump2`). Shikshana approval required before staging/prod DB changes.

> **⚠️ Format distinction:** Previous offline work (zip files in issue #134) targeted **curationDB lesson plan** format (`instruction_set.engage/explore/explain/elaborate/evaluate` + full lesson plan text). This plan targets **`masterresources`** — the app's runtime collection storing extracted resources only (question banks, activities, real-world scenarios). These are two distinct parts of the system. The `masterresources.resources[]` content (question_bank, activities, real_world_scenarios) is what teachers see in the Shiksha Copilot app. See §11.1 for details.

---

## 1. Current State (from DB audit)

### 1.1 All boards/mediums in DB

| Board | Medium | Total docs | Notes |
|-------|--------|-----------|-------|
| KSEEB | english | 1652 | Karnataka — source |
| KSEEB | kannada | 307 | Karnataka — partially done |
| BSE-TG | english | 223 | Telangana — source |
| BSE-TG | telugu | 0 | Telangana — **not started** |
| CBSE | english | 5 | Negligible, ignore |

### 1.2 KSEEB Kannada totals

| Medium | Total docs | isAll=true | isAll=false |
|--------|-----------|------------|-------------|
| english | 1652 | 350 | 1302 |
| kannada | 307 | 305 | 2 |

### 1.2 Subjects scoped for translation

**Include:** `evs_1`, `evs_2`, `mathematics_1`, `mathematics_2`, `science_1`, `science_2`, `social_science_1`, `social_science_2`

**Exclude:** `english 2_1`, `english 2_2` — these are English-language subject textbooks; translating to Kannada medium has no meaning (221 English docs, 0 Kannada — intentional).

### 1.3 Gap by class/subject (`isAll=true` — priority)

| Class | Subject | English | Kannada | Gap |
|-------|---------|---------|---------|-----|
| 5 | evs_1 | 8 | 8 | **0** ✅ |
| 5 | evs_2 | 9 | 8 | 1 |
| 5 | mathematics_1 | 10 | 9 | 1 |
| 5 | mathematics_2 | 10 | 9 | 1 |
| 6 | mathematics_1 | 16 | 5 | 11* |
| 6 | mathematics_2 | 11 | 10 | 1 |
| 6 | science_1 | 13 | 6 | 7 |
| 6 | science_2 | 13 | 13 | **0** ✅ |
| 6 | social_science_1 | 11 | 8 | 3 |
| 6 | social_science_2 | 13 | 13 | **0** ✅ |
| 7 | mathematics_1 | 6 | 6 | **0** ✅ |
| 7 | mathematics_2 | 7 | 7 | **0** ✅ |
| 7 | science_1 | 7 | 6 | 1 |
| 7 | science_2 | 7 | 7 | **0** ✅ |
| 7 | social_science_1 | 15 | 14 | 1 |
| 7 | social_science_2 | 13 | 13 | **0** ✅ |
| 8 | mathematics_1 | 6 | 6 | **0** ✅ |
| 8 | mathematics_2 | 7 | 7 | **0** ✅ |
| 8 | science_1 | 6 | 6 | **0** ✅ |
| 8 | science_2 | 7 | 7 | **0** ✅ |
| 8 | social_science_1 | 15 | 15 | **0** ✅ |
| 8 | social_science_2 | 17 | 13 | 4 |
| 9 | mathematics_1 | 6 | 6 | **0** ✅ |
| 9 | mathematics_2 | 6 | 6 | **0** ✅ |
| 9 | science_1 | 6 | 6 | **0** ✅ |
| 9 | science_2 | 6 | 6 | **0** ✅ |
| 9 | social_science_1 | 16 | 16 | **0** ✅ |
| 9 | social_science_2 | 21 | 16 | 5 |
| 10 | mathematics_1 | 7 | 6 | 1 |
| 10 | mathematics_2 | 7 | 7 | **0** ✅ |
| 10 | science_1 | 7 | 6 | 1 |
| 10 | science_2 | 7 | 7 | **0** ✅ |
| 10 | social_science_1 | 16 | 12 | 4 |
| 10 | social_science_2 | 18 | 15 | 3 |

**Total `isAll=true` gap: ~45 docs**

> *Class 6 math_1: 16 English includes 5 docs that have Kannada content but are tagged `medium: "english"` (wrong medium). Actual untranslated = ~6 old chapters. See §2 below.

### 1.4 `isAll=false` gap

~1300 subtopic-level docs have no Kannada counterpart. Previous work only translated `isAll=true` (whole-chapter) docs. **Confirm with team whether `isAll=false` docs are needed before starting Phase 2.**

---

## 2. ⚠️ Data Anomaly — Wrong-Medium Docs

Some English docs in the collection already have Kannada content in `subTopics` and `resources` but are incorrectly tagged `medium: "english"`. Example found in class 6 `mathematics_1`:

```
lessonName: "mathematics_1-KSEEB Class6 Lines and Angles"
medium: "english"   ← WRONG
subTopics: ["2.1ಬಿಂದು", "2.2 ರೇಖಾ ಖಂಡ", ...]  ← Kannada content
```

These are likely translation drafts that were inserted without updating `medium`.

**Action needed before running the translation script:**
1. Query all English docs where `subTopics` array contains Kannada script (Unicode range `ಀ-೿`)
2. Verify their `resources` content is also Kannada
3. Either:
   - **Option A (preferred):** Update `medium` field to `"kannada"` for these docs
   - **Option B:** Delete and re-insert with correct medium

```javascript
// Query to find wrong-medium docs
db.masterresources.find({
  board: "KSEEB",
  medium: "english",
  "subTopics": { $elemMatch: { $regex: /[ಀ-೿]/ } }
})
```

---

## 3. Translation Architecture

### 3.1 Existing infrastructure (already in codebase)

| Component | File | What it does |
|-----------|------|-------------|
| `TranslationService` | `app-service/app/services/translation_service.py` | Recursively traverses JSON, collects strings, batch-translates, fills back |
| `AzureTranslator` | `app-service/app/services/translation/azure.py` | Azure Cognitive Services translator — chunking, rate limiting, error handling |
| `TranslatorFactory` | `app-service/app/services/translation/factory.py` | Returns correct translator by language code |
| Azure Translator resource | `scp-staging-translator` (swedencentral) | Already provisioned — use staging credentials |

### 3.2 Fields to translate

**Translate these fields:**
- `subTopics[]` — array of strings
- `learningOutcomes[]` — array of strings
- `resources[].content[].content[].questions[].question`
- `resources[].content[].content[].questions[].options[]`
- `resources[].content[].content[].title` (real world scenarios)
- `resources[].content[].content[].question` (real world scenarios)
- `resources[].content[].content[].description` (real world scenarios)
- `resources[].content[].content[].preparation` (activities)
- `resources[].content[].content[].required_materials` (activities)
- `resources[].content[].content[].obtaining_materials` (activities)
- `resources[].content[].content[].recap` (activities)
- `additionalResources` — same structure as `resources`

**Do NOT translate (keep as-is):**
- `_id`, `lessonId`, `chapterId` → generate fresh ObjectIds for Kannada doc
- `lessonName` → keep English identifier
- `board`, `class`, `semester`, `subject`, `templateId`, `isAll`
- `medium` → set to `"kannada"`
- `resources[].id`, `resources[].title`, `resources[].outputFormat` → structural identifiers
- `resources[].content[].difficulty` → enum (`beginner`/`intermediate`/`advanced`)
- `resources[].content[].content[].type` → enum (`MCQs`/`assessment`)
- Activity `id` fields

### 3.3 Two-step pipeline (from issue #134 decision)

```
Step 1: Azure Translator API  → raw Kannada translation
Step 2: GPT-4.1 with Kannada vocabulary glossary → verify + improve quality
```

> Step 2 is optional for the initial batch. Can do Step 1 first, send samples to Shikshana for approval, then add Step 2 if quality insufficient.

---

## 4. New Document Structure

Each translated doc needs NEW MongoDB ObjectIds. Do **not** reuse English `_id`, `lessonId`, or `chapterId`.

```python
from bson import ObjectId
import copy

def make_kannada_doc(english_doc):
    kan_doc = copy.deepcopy(english_doc)
    kan_doc["_id"] = ObjectId()
    kan_doc["lessonId"] = str(ObjectId())
    kan_doc["chapterId"] = str(ObjectId())
    kan_doc["medium"] = "kannada"
    # translate fields (see §3.2)
    return kan_doc
```

---

## 5. Implementation Plan

### Phase 0 — Fix wrong-medium docs (1–2 hours)

- [ ] Run query from §2 against `prod_dump2.masterresources`
- [ ] Review results — confirm content is fully Kannada (not partial)
- [ ] If fully Kannada: `db.masterresources.updateMany({...}, {$set: {medium: "kannada"}})`
- [ ] Re-run gap audit from §1.3 — gap count will shrink
- [ ] Document final gap count before proceeding

### Phase 1 — Translate `isAll=true` missing docs (~45 docs, ~2–4 hours)

- [ ] **Step 1.1:** Write script `scripts/translate_kseeb_kannada.py`
  - Connect to MongoDB (`prod_dump2`)
  - For each subject/class combo with gap > 0:
    - Query English `isAll=true` docs for that combo
    - Query Kannada `isAll=true` `lessonName` set for same combo
    - Find English docs whose `lessonName` is NOT in Kannada set
    - Translate and insert

- [ ] **Step 1.2:** Run in dry-run mode (print what would be inserted, don't write)
  ```bash
  python scripts/translate_kseeb_kannada.py --dry-run
  ```

- [ ] **Step 1.3:** Run for one subject/class first (e.g., class 6 `science_1`, gap=7)
  ```bash
  python scripts/translate_kseeb_kannada.py --class 6 --subject science_1
  ```

- [ ] **Step 1.4:** Verify inserted docs in MongoDB — check Kannada script present in `subTopics`, `resources`

- [ ] **Step 1.5:** Send sample to Shikshana team for quality review

- [ ] **Step 1.6:** If quality OK → run full batch for all remaining gaps
  ```bash
  python scripts/translate_kseeb_kannada.py --all
  ```

- [ ] **Step 1.7:** Re-run gap audit — all `isAll=true` gaps should be 0

### Phase 2 — Translate `isAll=false` docs (~1300 docs, ~1–2 days) [PENDING CONFIRMATION]

> **Confirm with team first:** Are subtopic-level (`isAll=false`) Kannada docs needed? Check if the app uses them or only `isAll=true`.

- [ ] Confirm requirement
- [ ] Same script, add `--is-all false` flag
- [ ] Run for one subject first as sample
- [ ] Quality review → full batch

---

## 6. Script Skeleton

```python
# scripts/translate_kseeb_kannada.py
"""
Translates missing KSEEB English masterresources docs to Kannada.
Uses existing AzureTranslator from app-service.

Usage:
    python translate_kseeb_kannada.py --dry-run
    python translate_kseeb_kannada.py --class 6 --subject science_1
    python translate_kseeb_kannada.py --all
"""

import asyncio
import copy
import argparse
from bson import ObjectId
from pymongo import MongoClient
import sys, os

sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', 'shiksha-api', 'app-service'))
from app.services.translation.azure import AzureTranslator

MONGO_URI = "mongodb://localhost:27017"
DB_NAME = "prod_dump2"
COLLECTION = "masterresources"

# Fields to translate — TranslationService handles recursion,
# but we translate specific top-level fields only to avoid
# translating structural/enum keys
TRANSLATE_FIELDS = ["subTopics", "learningOutcomes", "resources", "additionalResources"]

# Fields inside resources/activities to SKIP (passed to TranslationService SKIP_KEYS)
# Already handled by TranslationService: {"difficulty"}
# Add more here if needed

SUBJECTS_TO_TRANSLATE = [
    "evs_1", "evs_2",
    "mathematics_1", "mathematics_2",
    "science_1", "science_2",
    "social_science_1", "social_science_2",
]

async def translate_doc(english_doc: dict, translator: AzureTranslator) -> dict:
    """Create translated Kannada doc from English doc."""
    from app.services.translation_service import TranslationService

    kan_doc = copy.deepcopy(english_doc)
    kan_doc["_id"] = ObjectId()
    kan_doc["lessonId"] = str(ObjectId())
    kan_doc["chapterId"] = str(ObjectId())
    kan_doc["medium"] = "kannada"

    for field in TRANSLATE_FIELDS:
        if field in kan_doc and kan_doc[field]:
            kan_doc[field] = await TranslationService.translate_json_async(
                kan_doc[field],
                src_lang="en",
                tgt_lang="kn"  # Kannada ISO code
            )
    return kan_doc


async def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--dry-run", action="store_true")
    parser.add_argument("--class", dest="cls", type=int, default=None)
    parser.add_argument("--subject", default=None)
    parser.add_argument("--all", dest="all_subjects", action="store_true")
    parser.add_argument("--is-all", dest="is_all", type=lambda x: x.lower() == "true", default=True)
    args = parser.parse_args()

    client = MongoClient(MONGO_URI)
    col = client[DB_NAME][COLLECTION]

    # Build query scope
    classes = range(5, 11)
    subjects = SUBJECTS_TO_TRANSLATE

    if args.cls:
        classes = [args.cls]
    if args.subject:
        subjects = [args.subject]

    inserted = 0
    skipped = 0

    for cls in classes:
        for subject in subjects:
            # Get existing Kannada lesson names for this combo
            existing_kannada = set(
                d["lessonName"] for d in col.find(
                    {"board": "KSEEB", "medium": "kannada",
                     "class": cls, "subject": subject, "isAll": args.is_all},
                    {"lessonName": 1}
                )
            )

            # Get English docs for this combo
            eng_docs = list(col.find({
                "board": "KSEEB", "medium": "english",
                "class": cls, "subject": subject, "isAll": args.is_all
            }))

            # Filter to untranslated
            missing = [d for d in eng_docs if d["lessonName"] not in existing_kannada]

            if not missing:
                continue

            print(f"Class {cls} {subject}: {len(missing)} missing")

            for doc in missing:
                print(f"  Translating: {doc['lessonName']}")
                if args.dry_run:
                    skipped += 1
                    continue

                kan_doc = await translate_doc(doc, None)
                col.insert_one(kan_doc)
                inserted += 1
                print(f"  ✓ Inserted: {kan_doc['_id']}")

    print(f"\nDone. Inserted: {inserted}, Dry-run skipped: {skipped}")
    client.close()


if __name__ == "__main__":
    asyncio.run(main())
```

---

## 7. Verification Queries

After each batch, run these to verify:

```javascript
// Count gap per subject-class for isAll=true
db.masterresources.aggregate([
  { $match: { board: "KSEEB", isAll: true } },
  { $group: { _id: { class: "$class", subject: "$subject", medium: "$medium" }, count: { $sum: 1 } } },
  { $sort: { "_id.class": 1, "_id.subject": 1, "_id.medium": 1 } }
])

// Spot-check: verify a new Kannada doc has Kannada script in subTopics
db.masterresources.findOne({
  board: "KSEEB",
  medium: "kannada",
  isAll: true,
  class: 6,
  subject: "science_1"
}, { subTopics: 1, learningOutcomes: 1 })

// Check for wrong-medium docs (Kannada content but medium: english)
db.masterresources.find({
  board: "KSEEB",
  medium: "english",
  "subTopics": { $elemMatch: { $regex: /[ಀ-೿]/ } }
}, { lessonName: 1, class: 1, subject: 1, subTopics: 1 })
```

---

## 8. Environment Setup

Needed to run the script:

```bash
# Install dependencies (from app-service)
cd shiksha-api/app-service
poetry install

# Set Azure Translator creds (from staging resource scp-staging-translator)
export AZURE_TRANSLATION_KEY="<key-from-azure-portal>"
export AZURE_TRANSLATION_ENDPOINT="https://api.cognitive.microsofttranslator.com"
export AZURE_TRANSLATION_REGION="swedencentral"

# Run
poetry run python ../../scripts/translate_kseeb_kannada.py --dry-run
```

Azure resource: `scp-staging-translator` in `swedencentral` — keys at:
`portal.azure.com > subscriptions/3d015b01-... > shiksha-stage > scp-staging-translator > Keys and Endpoint`

---

## 9. Telugu (BSE-TG) — Separate Language Track

### 9.1 State

**0 Telugu docs in DB.** BSE-TG has 223 English docs across classes 6-10. All are `isAll=true` except class 10 biology (8 `isAll=false` docs).

| Class | Subjects | English docs |
|-------|----------|-------------|
| 6 | english(3), math(9), science(10), social(14) | 36 |
| 7 | english(3), math(11), science(12), social(14) | 40 |
| 8 | biology(9), english(3), math(9), physics(12), social(18) | 51 |
| 9 | biology(4), english(3), math(9), physics(12), social(15) | 43 |
| 10 | biology(15), english(3), math(7), physics(13), social(15) | 53 |
| **Total** | | **223** |

Skip `english` subject (language subject) → 15 docs excluded → **~208 Telugu docs to create**

### 9.2 Previous offline work (issues #93/#134)

Telugu translations done as JSON/zip batches, shared with Shikshana in 3 batches. **Never inserted into DB.** Feedback pending. Starting fresh in DB — previous batches can serve as quality reference.

### 9.3 Telugu pipeline

Same 2-step pipeline. Use `tgt_lang="te"`, `--board BSE-TG` in script.

---

## 10. Step 2 Pipeline — GPT-4.1 + Vocabulary

Issue #134 final decided approach:
> Azure Translate (raw) → GPT-4.1 with vocabulary context → final output

### 10.1 Vocabulary files

Shikshana provided glossary files attached in issue #134 comments:
- `batch2.zip` — Kannada vocabulary
- `Sikshana_IV_translated.zip` — Telugu samples

Download from issue attachments → store in `scripts/vocab/kannada/` and `scripts/vocab/telugu/`.

### 10.2 Step 2 implementation sketch

```python
async def refine_with_gpt(translated_text: str, vocab_context: str, language: str) -> str:
    prompt = f"""You are a {language} language expert for educational content.
The following text was machine-translated from English to {language}.
Using the vocabulary reference below, verify and improve the translation.
Keep educational terms accurate. Do not transliterate — translate fully.

Vocabulary reference:
{vocab_context}

Translated text to refine:
{translated_text}

Return only the refined {language} text, no explanation."""

    response = await openai_client.chat.completions.create(
        model="gpt-4.1",
        messages=[{"role": "user", "content": prompt}]
    )
    return response.choices[0].message.content
```

---

## 11. Approval & DB Update Workflow

⚠️ **All current work is on local prod backup (`prod_dump2`). Cannot write to staging or prod without Shikshana sign-off.**

```
Local prod_dump2
      │
      ▼
Translate batch (local script)
      │
      ▼
Export samples as JSON/zip (see §11.1 for format)
      │
      ▼
Share with Shikshana Foundation for quality review
      │
      ▼
Iterate on feedback → re-run Step 2 with corrections
      │
      ▼
Shikshana approves
      │
      ▼
Insert to staging DB → verify in app UI
      │
      ▼
Staging sign-off → insert to prod DB
```

Start with small batches (1 subject × 1 class) to get fast feedback loops before bulk run.

### 11.1 Export Format (how to share with Shikshana)

**Context from previous work (zip files):**
Previous worker shared translations in two formats:
- `Translations.zip` — curationDB *lesson plan* JSONs (`instruction_set.engage/explore/explain/elaborate/evaluate`), organized as `{Language}/{model}/{grade}.json`
- `Telugu-sarvam.zip` — per-subtopic curationDB JSONs organized as `{class}/{subject}/{chapter-name}/filename.json`

These are **curationDB lesson plan format** (different from `masterresources`). The full lesson plan content (instructional phases) lives in curationDB. What lives in `masterresources` is the **extracted resources** (question banks, activities, real-world scenarios) — the content teachers access in the app.

**For masterresources sharing, use this structure:**

```
TranslationReview_{date}/
├── KSEEB_Kannada/
│   ├── Class6/
│   │   ├── science_1/
│   │   │   ├── english_{lessonName}.json   ← original doc
│   │   │   └── kannada_{lessonName}.json   ← translated doc
│   │   └── social_science_1/
│   │       └── ...
│   └── Class7/
│       └── ...
└── BSE-TG_Telugu/
    └── Class6/
        └── math/
            ├── english_{lessonName}.json
            └── telugu_{lessonName}.json
```

Each `{lang}_{lessonName}.json` contains only the translatable fields for easy review:
```json
{
  "lessonName": "...",
  "medium": "kannada",
  "subTopics": ["ಉಪವಿಷಯ 1", ...],
  "learningOutcomes": ["ಕಲಿಕೆ ಗುರಿ 1", ...],
  "resources": [
    {
      "id": "question_bank",
      "content": [{ "difficulty": "beginner", "content": [...] }]
    },
    ...
  ]
}
```

**Export script snippet:**
```python
import json, os
from pathlib import Path

def export_for_review(col, board, src_medium, tgt_medium, out_dir):
    """Export side-by-side English + translated docs as JSON files."""
    tgt_docs = col.find({'board': board, 'medium': tgt_medium})
    for tdoc in tgt_docs:
        eng_doc = col.find_one({'board': board, 'medium': src_medium, 'lessonName': tdoc['lessonName']})
        if not eng_doc:
            continue
        folder = Path(out_dir) / f"Class{tdoc['class']}" / tdoc['subject']
        folder.mkdir(parents=True, exist_ok=True)
        lesson = tdoc['lessonName'].replace('/', '_').replace(' ', '_')
        for prefix, doc in [(src_medium, eng_doc), (tgt_medium, tdoc)]:
            doc['_id'] = str(doc['_id'])
            with open(folder / f"{prefix}_{lesson}.json", 'w', encoding='utf-8') as f:
                json.dump(doc, f, ensure_ascii=False, indent=2)
```

---

## 12. curationDB — Separate Translation Scope

**DB:** `shiksha_prod_curationDB_restored1`

curationDB and masterresources are **independent systems** — not synced. Translating one does NOT update the other. Confirmed: same chapter has different subtopics in curationDB vs masterresources (content diverged over time).

### 12.1 curationDB Kannada state

| Grade | Subject | English CHAPTER | Kn(total) | Kn(edited) | Gap |
|-------|---------|----------------|-----------|------------|-----|
| 5 | evs_1 | 8 | 0 | 0 | **8** |
| 5 | evs_2 | 8 | 8 | 0 | 0 ✅ |
| 5 | mathematics_1 | 10 | 0 | 0 | **10** |
| 5 | mathematics_2 | 10 | 8 | 8 | 2 |
| 6 | mathematics_1 | 5 | 0 | 0 | **5** |
| 6 | mathematics_2 | 5 | 4 | 3 | 1 |
| 6 | science_1 | 6 | 0 | 0 | **6** |
| 6 | science_2 | 6 | 5 | 5 | 1 |
| 6 | social_science_1 | 10 | 0 | 0 | **10** |
| 6 | social_science_2 | 13 | 6 | 6 | 7 |
| 7 | mathematics_1 | 6 | 0 | 0 | **6** |
| 7 | mathematics_2 | 7 | 7 | 4 | 0 ✅ |
| 7 | science_1 | 6 | 0 | 0 | **6** |
| 7 | science_2 | 7 | 7 | 1 | 0 ✅ |
| 7 | social_science_1 | 14 | 0 | 0 | **14** |
| 7 | social_science_2 | 13 | 4 | 0 | 9 |
| 8 | mathematics_1 | 6 | 0 | 0 | **6** |
| 8 | mathematics_2 | 7 | 6 | 3 | 1 |
| 8 | science_1 | 6 | 0 | 0 | **6** |
| 8 | science_2 | 7 | 7 | 3 | 0 ✅ |
| 8 | social_science_1 | 15 | 0 | 0 | **15** |
| 8 | social_science_2 | 15 | 5 | 5 | 10 |
| 9 | mathematics_1 | 6 | 0 | 0 | **6** |
| 9 | mathematics_2 | 6 | 6 | 0 | 0 ✅ |
| 9 | science_1 | 6 | 0 | 0 | **6** |
| 9 | science_2 | 6 | 6 | 0 | 0 ✅ |
| 9 | social_science_1 | 16 | 0 | 0 | **16** |
| 9 | social_science_2 | 17 | 5 | 5 | 12 |
| 10 | mathematics_1 | 7 | 0 | 0 | **7** |
| 10 | mathematics_2 | 7 | 7 | 0 | 0 ✅ |
| 10 | science_1 | 6 | 0 | 0 | **6** |
| 10 | science_2 | 7 | 7 | 0 | 0 ✅ |
| 10 | social_science_1 | 16 | 0 | 0 | **16** |
| 10 | social_science_2 | 17 | 2 | 2 | 15 |
| **TOTAL** | | **307** | **100** | **45** | **207** |

> `Kn(total)` = edited + not-edited. `Kn(edited)` = `editedLpsKn` (human-reviewed). 100 − 45 = 55 raw-translated but not reviewed.

### 12.2 curationDB fields to translate

Per doc in `editedLpsWithExRes` → create Kannada doc in `notEditedKnLps`:

| Field path | Notes |
|-----------|-------|
| `subtopics[]` | array of strings |
| `learning_outcomes[]` | array of strings |
| `instruction_set.engage.content` | long prose — lesson intro |
| `instruction_set.explore.content` | long prose |
| `instruction_set.explain.content` | long prose |
| `instruction_set.elaborate.content` | long prose |
| `instruction_set.evaluate.content` | long prose |
| `extracted_resources.activities.activity_N.title` | |
| `extracted_resources.activities.activity_N.preparation` | |
| `extracted_resources.activities.activity_N.required_materials` | |
| `extracted_resources.activities.activity_N.obtaining_materials` | |
| `extracted_resources.activities.activity_N.recap` | |
| `extracted_resources.questionbank.{beginner/intermediate/advanced}.MCQs.content[].question` | |
| `extracted_resources.questionbank.{beginner/intermediate/advanced}.MCQs.content[].options[]` | |
| `extracted_resources.questionbank.{beginner/intermediate/advanced}.assessmentQuestions.content[]` | |
| `extracted_resources.realworldscenarios.{level}.content[].{title,question,answer}` | |

**Do NOT translate:** `_id`, `chapter_id`, `userId`, `lp_level`, `lp_type_english`, `preferred_mot`, `interact_output`, `teacher_location`, structural IDs, difficulty enums

> Medium in `_id` and `chapter_id` stays `english` (it refers to school medium of instruction, not content language) — confirmed by looking at existing `editedLpsKn` docs where `chapter_id` still says `Medium=english`.

### 12.3 curationDB insert target

Translated Kannada docs go into `notEditedKnLps` (raw, unedited). Shikshana curators review and move to `editedLpsKn`. New doc `_id`: replace `Medium=english` → `Medium=kannada` in source `_id`.

### 12.4 No BSE-TG in curationDB

Zero BSE-TG docs in curationDB. Telugu translation scope = masterresources only.

---

## 13. Summary of All Work

| Track | DB | Scope | Docs | Status |
|-------|-----|-------|------|--------|
| KSEEB Kannada — Phase 0 | masterresources | Fix wrong-medium docs | TBD (run query) | Do first |
| KSEEB Kannada — Phase 1 | masterresources | `isAll=true` gap | ~45 | High priority |
| KSEEB Kannada — Phase 2 | masterresources | `isAll=false` gap | ~1300 | Confirm with team |
| BSE-TG Telugu | masterresources | All docs | ~208 | Not started |
| KSEEB Kannada LP | curationDB | CHAPTER-level LPs | 207 missing | Separate track |
| Step 2 GPT pipeline | both | Both languages | All batches | Must implement |
| Shikshana approval loop | both | Both languages | Per batch | Required before DB write |
