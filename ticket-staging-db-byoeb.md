# Ticket: Shrink MongoDB Atlas staging data — byoeb

## Summary

Staging MongoDB Atlas cluster is shared across three codebases and is running low on free-tier storage. byoeb is one of three contributing repos (others: Shiksha-Copilot, SEEDS — tracked in separate tickets). byoeb is the likely single largest continuous contributor: CI runs against the *live deployed staging service* over HTTP and leaves orphaned documents on every run.

## Current behaviour (as implemented)

- No local seed/fixture scripts exist. Staging data instead accumulates from CI/integration tests that run against the *live deployed staging service* over HTTP: `.github/workflows/integration-tests.yml` runs integration tests (`tests/integration/test_onboarding.py`, `test_message_history.py`, `test_audio_message.py`, `test_early_return_already_onboarded.py`, `test_mcp.py`, `test_message_producer.py`) and `byoeb-v1/byoeb/byoeb/scripts/run_release_qa_benchmark.py` (driven by `release_qa_regression_set.json`) on every pipeline run, each persisting real user + message documents to staging Mongo.
- No TTL indexes exist on any collection (`message_collection`, `user_collection`, `dyk_storage_collection`, `dyk_queue_collection`, `auth_*` — confirmed via `repository_factory.py`; zero hits for `expireAfterSeconds`/`create_index` repo-wide).
- `byoeb-v1/byoeb/byoeb/services/databases/mongo_db/message_db.py` only ever inserts/updates message documents — no delete/expiry path.
- An admin `clear_history` endpoint exists (`byoeb-v1/byoeb/byoeb/apis/admin.py:78`) but is never called by tests, CI, or any scheduled job.
- Integration tests call `/delete_users` in teardown (`tests/integration/conftest.py`) but this does **not** delete the message documents those flows generated — every CI run leaves orphaned message documents in staging. Most likely single largest continuous contributor to storage growth, since it runs on every pipeline execution.
- Large binary files exist in the repo tree (`checkpoint.pkl` 53.8 MB, `asha.mp4` 14.9 MB, onboarding `.wav` files ~13 MB total) but no code path was found loading them into MongoDB — flagged as git-repo bloat, out of scope for this DB-specific ticket unless further evidence surfaces.
- Open item: `byoeb-v1/byoeb/byoeb/factory/mongo_db.py` supports an `azure_cosmos_mongo_db` provider type, and CI injects `MONGO_DB_CONNECTION_STRING` purely as an opaque GitHub secret — worth confirming this repo's "staging" actually targets the Atlas cluster in the screenshot rather than a separate Cosmos DB endpoint.

## Requested change

1. Wire message-document cleanup into CI teardown alongside the existing `/delete_users` call, either by invoking the existing (currently unused) `clear_history` admin endpoint (`admin.py:78`) or a new bulk-delete, so every integration-test/QA-benchmark run against staging leaves no residue.
2. Add `expireAfterSeconds` TTL indexes on `message_collection` and `dyk_queue_collection` as a structural backstop, independent of (1).
3. Once landed, verify a resulting drop in Atlas `Data Size` (currently 483.83 MB / 512 MB) over the following days via the Atlas monitoring tab.

## Open questions / dependencies

- Does `MONGO_DB_CONNECTION_STRING` in CI actually point at the Atlas cluster shown in the screenshot (`Shikshana-test`), or a separate Azure Cosmos DB Mongo-API endpoint? Needs confirming with whoever manages the Atlas/Azure secrets (reportedly Pun-it) before assuming this repo is a contributor to this specific cluster.
- Should CI run against a disposable/ephemeral staging environment instead of the shared persistent one, removing the need for manual cleanup entirely? Out of scope for a data-bareboning ticket but worth flagging as the more durable fix.

## Blast radius

Overall risk: **MEDIUM**
*Risk calculation: test gap (0.30, no test asserts TTL-index presence/behavior or teardown completeness) + schema/contract change (0.10, new TTL indexes) = 0.40 → MEDIUM.*

### Recommended actions
- [ ] Confirm this repo actually writes to the Atlas cluster in the screenshot before touching anything.
- [ ] Add the `clear_history` cleanup call to CI teardown first — highest-confidence, lowest-risk single fix (unused endpoint, no schema change).

### Direct Impact

| Directory | Reason | Risk |
|---|---|---|
| `byoeb-v1/byoeb/byoeb/apis/` | Wiring `clear_history` into CI teardown / new bulk-delete | LOW |

### Indirect Impact

| Directory | Reason | Risk |
|---|---|---|
| `byoeb-v1/byoeb/tests/integration/` | Teardown logic changes; must not break existing `/delete_users` flow | MEDIUM |
| `.github/workflows/integration-tests.yml` | CI teardown step gains a new call | LOW |

### Speculative Impact

| Directory | Reason | Risk |
|---|---|---|
| Support/debugging workflows relying on old chat/message history | TTL cleanup removes data investigators might expect to still be there | LOW |

### Test Coverage Gaps

- byoeb has no test verifying that CI teardown actually removes message documents (only `/delete_users` is asserted, per `conftest.py`).
- No existing test asserts TTL-index presence or behavior.
