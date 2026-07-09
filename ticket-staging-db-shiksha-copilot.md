# Ticket: Shrink MongoDB Atlas staging data — Shiksha-Copilot

## Summary

Staging MongoDB Atlas cluster is shared across three codebases and is running low on free-tier storage. Shiksha-Copilot is one of three contributing repos (others: byoeb, SEEDS — tracked in separate tickets). This ticket covers Shiksha-Copilot's contribution: no seed-data minimization, no retention/TTL policy on most collections.

## Current behaviour (as implemented)

- `shiksha-website/shiksha-backend/scripts/seed-grammar-chapters.js:1-205` seeds the full grammar syllabus (all grades 5-10, all topics, lines 30-95) into whichever DB `MONGO_URL` points to — no minimal/sample-size mode, not scoped to a "test-only" flag (`seed-grammar-chapters.js:21-25`).
- Only one collection has a TTL index: `models/question.bank.cache.model.js:37-40` (`expireAfterSeconds`, 6h).
- No TTL/expiry exists on `models/chat.model.js:4,21`, `models/lesson.chats.model.js:6,44`, `models/teacher.lesson.plan.model.js:20-86` (generated lesson plans with embedded `sections`/`media` sub-docs), `models/user.action.logs.model.js:4,29`, `models/user.activity.logs.model.js:4,32`, or `models/audit.log.model.js:5,31` — these accumulate unbounded per user action.
- No large embedded blobs/base64 in Mongo documents; media is stored as URLs to Azure Blob Storage (`services/azure.blob.service.js`), not inline.
- No cleanup cron, scheduled job, or documented retention policy anywhere in the repo.

## Requested change

1. Add TTL indexes to `chat.model.js`, `lesson.chats.model.js`, `user.action.logs.model.js`, `user.activity.logs.model.js`, and `audit.log.model.js`, mirroring the existing pattern in `question.bank.cache.model.js:37-40`.
2. Parameterize `seed-grammar-chapters.js` with a minimal/sample-size mode (e.g. one grade, one topic) for staging use, instead of always inserting the full syllabus.
3. Once landed, verify a resulting drop in Atlas `Data Size` (currently 483.83 MB / 512 MB) over the following days via the Atlas monitoring tab.

## Open questions / dependencies

- What TTL durations are acceptable per collection (chat history, lesson plans, audit logs, activity logs) — product/compliance decision (audit logs may need longer retention than chat history), not something to default silently.
- Confirm this repo's `MONGO_URL` in CI/staging actually targets the Atlas cluster shown in the screenshot before assuming it's a contributor.

## Blast radius

Overall risk: **MEDIUM**
*Risk calculation: test gap (0.30, no test asserts TTL-index presence/behavior) + schema/contract change (0.10, new TTL indexes) = 0.40 → MEDIUM.*

### Recommended actions
- [ ] Get TTL durations signed off per collection type (chat/lesson/log/audit) before adding indexes — a wrong TTL silently deletes data users expect to persist.
- [ ] Confirm `MONGO_URL` staging target before assuming this repo writes to the cluster in the screenshot.

### Direct Impact

| Directory | Reason | Risk |
|---|---|---|
| `shiksha-website/shiksha-backend/models/` | New TTL indexes on 5 collections | MEDIUM |
| `shiksha-website/shiksha-backend/scripts/` | `seed-grammar-chapters.js` gains a minimal-mode flag | LOW |

### Indirect Impact

| Directory | Reason | Risk |
|---|---|---|
| `shiksha-website/shiksha-backend/__tests__/` | In-memory test fixtures unaffected, but any test asserting on log/chat retention needs review | LOW |

### Speculative Impact

| Directory | Reason | Risk |
|---|---|---|
| Any dashboard/reporting feature reading `audit_logs`/`user.activity.logs` | TTL-deleted logs disappear from historical reports | MEDIUM |
| Support/debugging workflows relying on old chat/message history | TTL cleanup removes data investigators might expect to still be there | LOW |

### Test Coverage Gaps

- No existing test asserts TTL-index presence or behavior — new indexes ship with zero regression coverage unless tests are added.
