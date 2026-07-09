# Ticket: Shrink MongoDB Atlas staging data — SEEDS

## Summary

Staging MongoDB Atlas cluster is shared across three codebases and is running low on free-tier storage. SEEDS is one of three contributing repos (others: byoeb, Shiksha-Copilot — tracked in separate tickets). SEEDS has no seed data to trim; the only lever is bounding operational-collection growth via TTL.

## Current behaviour (as implemented)

- No seed/fixture/populate scripts exist anywhere in the repo (confirmed via `git ls-files` + grep). All DB-touching tests use `mongomock-motor` (in-memory mock, `platform/tests/conftest.py:14` sets `MONGO_DB_CONNECTION_STRING=""`) — tests do not write to any real/staging Mongo instance.
- No TTL indexes exist on any collection. `platform/migrations/002_tenant_scoped_indexes.py:17-34` only adds query-performance indexes, never `expireAfterSeconds`, on collections that otherwise accumulate unbounded: `logs`/`logentries`/`ivrv2logs` (`platform/app/models/audit_log.py:16,42,90`), `audit_logs`, `calls`, `conference_states` (`002_tenant_scoped_indexes.py:28-33`).
- Migrations are manual, developer-run scripts — not wired into any CI/CD step (`.github/workflows/*.yml` has zero references to "migrat*").
- No large embedded blobs/base64 checked into the repo or loaded into Mongo at seed time; the only sizeable tracked files are unrelated `package-lock.json`s.
- Open item: this repo's CI/CD does not visibly wire a Mongo/Atlas secret into any deploy step — the staging connection string is presumably set directly as an Azure App Service config value outside the repo. `platform/env.example:10-17` shows the platform can run against either genuine MongoDB (`STORAGE_BACKEND=mongodb`) or Azure Cosmos DB's Mongo-compatible API (`COSMOS_ENDPOINT`/`COSMOS_KEY`) — needs confirming which one staging actually uses before assuming this repo writes to the cluster in the screenshot at all.

## Requested change

1. Add TTL indexes on `logs`/`logentries`/`ivrv2logs`, `audit_logs`, and `calls` in a new migration alongside `002_tenant_scoped_indexes.py`, since this repo has no seed data to trim and the only lever available is bounding operational-collection growth.
2. Once landed, verify a resulting drop in Atlas `Data Size` (currently 483.83 MB / 512 MB) over the following days via the Atlas monitoring tab.

## Open questions / dependencies

- Does SEEDS staging actually point at the Atlas cluster shown in the screenshot (`Shikshana-test`), or a separate Azure Cosmos DB Mongo-API endpoint (`platform/env.example:10-17`)? Needs confirming with whoever manages the Atlas/Azure secrets (reportedly Pun-it) before assuming this repo is even a contributor.
- What TTL durations are acceptable per collection (audit logs, call logs, IVR logs, conference states) — product/compliance decision (audit logs may need longer retention), not something to default silently.
- Confirm the ask for this repo is specifically about operational-collection TTLs, not something the exploration missed, since SEEDS has no seed data at all to make "bare-bones."

## Blast radius

Overall risk: **MEDIUM**
*Risk calculation: test gap (0.30, no test asserts TTL-index presence/behavior) + schema/contract change (0.10, new migration adding TTL indexes) = 0.40 → MEDIUM.*

### Recommended actions
- [ ] Confirm which cluster this repo's staging actually points at before touching anything.
- [ ] Get TTL durations signed off per collection type (audit/call/log) before adding indexes — a wrong TTL silently deletes data users expect to persist.

### Direct Impact

| Directory | Reason | Risk |
|---|---|---|
| `SEEDS/platform/migrations/` | New migration adding TTL indexes | MEDIUM |

### Indirect Impact

| Directory | Reason | Risk |
|---|---|---|
| — | Migrations are manual/dev-run, not wired into CI — no automated pipeline step affected | LOW |

### Speculative Impact

| Directory | Reason | Risk |
|---|---|---|
| Any dashboard/reporting feature reading `audit_logs` | TTL-deleted logs disappear from historical reports | MEDIUM |

### Test Coverage Gaps

- No existing test asserts TTL-index presence or behavior — new indexes ship with zero regression coverage unless tests are added.
