# DB Changes Tracker

> All changes made locally on `prod_dump2`. Must be replicated to **staging** and **production** DBs after Shikshana approval.
> Collection: `masterresources` (unless noted)
> Branch: `nikunj/regional-translation`

---

## How to apply to staging/prod

1. Get Shikshana approval on translated content (share sample exports)
2. Run translation script against staging DB:
   ```bash
   MONGO_URI="<staging-uri>" MONGO_DB="<staging-db>" \
   TRANSLATOR_KEY="..." TRANSLATOR_REGION="swedencentral" \
   TRANSLATOR_ENDPOINT="https://scp-staging-translator.cognitiveservices.azure.com" \
   poetry run python scripts/translate_masterresources.py --board KSEEB --lang kn --is-all true
   ```
3. Verify in staging app UI
4. Repeat for prod DB

---

## Change Log

---

### [2026-05-12] Phase 0 — Fix wrong-medium docs

**Type:** Update (medium field correction)  
**Collection:** `masterresources`  
**DB:** local `prod_dump2`  

**What:** 13 docs had Kannada content in `subTopics` + `resources` but were tagged `medium: "english"`. Updated to `medium: "kannada"`.

**Query used:**
```javascript
db.masterresources.updateMany(
  {
    board: "KSEEB",
    medium: "english",
    subTopics: { $elemMatch: { $regex: /[ಀ-೿]/ } }
  },
  { $set: { medium: "kannada" } }
)
// matched: 13, modified: 13
```

**Affected lessonNames:**
- `social_science_2-KSEEB Class9 THE AHOM DYNASTY`
- `social_science_2-KSEEB Class8 The Guptas and Vardhanas`
- `social_science_2-KSEEB Class9 MONEY AND CREDIT`
- `social_science_2-KSEEB Class10 THE FIRST WAR OF INDIAN INDEPENDENCE (1857)`
- `social_science_2-KSEEB Class8 Mauryas and Kushans`
- `science_2-KSEEB Class6 AIR AROUND US`
- `social_science_2-KSEEB Class9 MINERAL RESOURCES OF KARNATAKA`
- `science_1-KSEEB Class6 Measurement of Length and Motion`
- `mathematics_1-KSEEB Class6 Data Handling and Presentation`
- `mathematics_1-KSEEB Class6 Patterns in Mathematics`
- `mathematics_1-KSEEB Class6 Prime Time`
- `mathematics_1-KSEEB Class6 Number Play`
- `mathematics_1-KSEEB Class6 Lines and Angles`

**Replicate to staging/prod:** Yes — same `updateMany` query above.

---

### [2026-05-12] Phase 0 — Remove duplicate Kannada docs

**Type:** Delete  
**Collection:** `masterresources`  
**DB:** local `prod_dump2`

**What:** The medium fix above created 14 duplicate Kannada docs (each wrong-medium doc already had a legitimate Kannada counterpart). Kept older `_id`, deleted newer one per pair.

**Deleted `_id`s:**
```
6926c842e72e269b5a89bc15   mathematics_1-KSEEB Class6 Number Play
6926c841e72e269b5a89bbce   mathematics_1-KSEEB Class6 Data Handling and Presentation
6926c841e72e269b5a89bbe9   mathematics_1-KSEEB Class6 Prime Time
675ff15ab903c6f1f6e90186   social_science_2-KSEEB Class9 THE AHOM DYNASTY
6926c843e72e269b5a89bc31   mathematics_1-KSEEB Class6 Lines and Angles
68b6bbea246a83abc0fcd2e0   science_1-KSEEB Class6 Measurement of Length and Motion
675ff15ab903c6f1f6e9018c   social_science_2-KSEEB Class8 Mauryas and Kushans
675ff15ab903c6f1f6e90192   science_2-KSEEB Class6 AIR AROUND US
675fe53fb903c6f1f6e8f9d5   social_science_2-KSEEB Class8 The Guptas and Vardhanas
675ff15ab903c6f1f6e9019e   social_science_2-KSEEB Class9 MONEY AND CREDIT
675ff15ab903c6f1f6e90198   social_science_2-KSEEB Class9 MINERAL RESOURCES OF KARNATAKA
6926c83fe72e269b5a89bb93   mathematics_1-KSEEB Class6 Patterns in Mathematics
6778eb4f8e5cf04f0738e94c   science_2-KSEEB Class6 LIGHT
675ff15ab903c6f1f6e901a4   social_science_2-KSEEB Class10 THE FIRST WAR OF INDIAN INDEPENDENCE (1857)
```

**Replicate to staging/prod:** Run same dedup logic — check for Kannada docs with duplicate `lessonName` per class/subject, delete newer `_id`.

```javascript
// Find dupes per lessonName
db.masterresources.aggregate([
  { $match: { board: "KSEEB", medium: "kannada", isAll: true } },
  { $group: { _id: "$lessonName", count: { $sum: 1 }, ids: { $push: "$_id" } } },
  { $match: { count: { $gt: 1 } } }
])
// For each group: sort ids, keep ids[0], delete ids[1..]
```

---

### [2026-05-12] Phase 1 — Translate 29 missing KSEEB Kannada isAll=true docs

**Type:** Insert  
**Collection:** `masterresources`  
**DB:** local `prod_dump2`

**What:** 29 new Kannada (`medium: "kannada"`, `isAll: true`) docs created by translating their English counterparts via Azure Translator API. All `_id`, `lessonId`, `chapterId` are new ObjectIds.

**Script:**
```bash
poetry run python scripts/translate_masterresources.py \
  --board KSEEB --lang kn --is-all true
```

**Docs translated (lessonName):**
- `science_1-KSEEB Class7 Acids` ← smoke test (translated separately)
- `evs_2-KSEEB Class5 Elements` ← smoke test (translated separately)
- `mathematics_2-KSEEB Class6 Fractions` (v2 — `693274ee53371e8aeb6ac1e2`) ← translated separately
- `science_1-KSEEB Class6 COMPONENTS OF FOOD`
- `mathematics_1-KSEEB Class6 Knowing our Numbers`
- `science_1-KSEEB Class6 SORTING MATERIALS INTO GROUPS`
- `science_1-KSEEB Class6 SEPARATION OF SUBSTANCES`
- `mathematics_1-KSEEB Class6 WHOLE NUMBERS`
- `science_1-KSEEB Class6 GETTING TO KNOW PLANTS`
- `mathematics_1-KSEEB Class6 BASIC GEOMETRICAL IDEAS`
- `science_1-KSEEB Class6 BODY MOVEMENT`
- `mathematics_1-KSEEB Class6 PLAYING WITH NUMBERS`
- `science_1-KSEEB Class10 Acids`
- `mathematics_1-KSEEB Class6 UNDERSTANDING ELEMENTARY SHAPES`
- `mathematics_1-KSEEB Class6 INTEGERS`
- `social_science_1-KSEEB Class10 THE ADVENT OF EUROPEANS TO INDIA`
- `social_science_1-KSEEB Class7 INTRODUCTION TO LEGISLATIVE`
- `mathematics_1-KSEEB Class10 TRIANGLES`
- `mathematics_1-KSEEB Class5 Length`
- `social_science_1-KSEEB Class10 INDIA - FOREST RESOURCES`
- `social_science_1-KSEEB Class10 INDIA - GEOGRAPHICAL POSITION AND PHYSICAL FEATURES`
- `social_science_1-KSEEB Class10 CHALLENGES OF INDIA AND THEIR REMEDIES`
- `social_science_2-KSEEB Class10 INDIA - TRANSPORT AND COMMUNICATION`
- `social_science_2-KSEEB Class10 CONSUMER EDUCATION AND PROTECTION`
- `mathematics_2-KSEEB Class5 WEIGHT AND VOLUME`
- `social_science_1-KSEEB Class6 The Culture of The Vedic Period`
- `social_science_1-KSEEB Class6 Types of Government`
- `social_science_2-KSEEB Class8 The Chalukyas of Badami and the Pallavas of Kanchi`
- `social_science_2-KSEEB Class8 Basic concepts of Economics`
- `social_science_2-KSEEB Class9 LABOUR AND EMPLOYMENT`
- `social_science_1-KSEEB Class6 India - Our Pride`
- `social_science_2-KSEEB Class9 THE AHOM DYNASTY, THE MOGHULS AND THE MARATHAS`

**Replicate to staging/prod:** Run the same script against staging/prod URI — script is idempotent (skips already-translated lessonNames).

---

### [2026-05-12] Phase 1 — Delete bad English duplicate + fix subTopics typo

**Type:** Delete + Update  
**Collection:** `masterresources`  
**DB:** local `prod_dump2`

**What:** Two English docs with same `lessonName: "science_1-KSEEB Class6 The Wonderful World of Science"` — identical content but one had `subTopics: ['']` (empty) and one had `subTopics: ['intruduction']` (typo).

- **Deleted** (empty subTopics): `_id = 693274ed53371e8aeb6abcaa`
- **Fixed typo** on keeper (`_id = 6880ad0d850ad5a1595003b1`): `subTopics: ['intruduction'] → ['Introduction']`

```javascript
db.masterresources.deleteOne({ _id: ObjectId("693274ed53371e8aeb6abcaa") })
db.masterresources.updateOne(
  { _id: ObjectId("6880ad0d850ad5a1595003b1") },
  { $set: { subTopics: ["Introduction"] } }
)
```

**Replicate to staging/prod:** Run same two operations above.

---

## Summary

| Change | Type | Count | Status |
|--------|------|-------|--------|
| Fix wrong-medium (english→kannada) | Update | 13 docs | ✅ Local done |
| Remove Kannada duplicates | Delete | 14 docs | ✅ Local done |
| Translate KSEEB Kannada isAll=true | Insert | 29 docs | ✅ Local done |
| Delete bad English duplicate | Delete | 1 doc | ✅ Local done |
| Fix subTopics typo on English doc | Update | 1 doc | ✅ Local done |
| KSEEB Kannada isAll=false (~1300 docs) | Insert | TBD | ⏳ Pending team confirmation |
| BSE-TG Telugu (~208 docs) | Insert | TBD | ⏳ Pending |
| Staging DB | All above | — | ⏳ Pending Shikshana approval |
| Production DB | All above | — | ⏳ Pending staging sign-off |
