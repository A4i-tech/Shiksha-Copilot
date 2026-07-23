# Backend Test Suite Cleanup Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fix [github.com/A4i-tech/.github/issues/477](https://github.com/A4i-tech/.github/issues/477) — remove pointless tests and brittle mocks from `shiksha-website/shiksha-backend/__tests__/`, then add real integration coverage for the highest-risk flows.

**Architecture:** Four sequential phases, one commit (or small commit group) per phase, full `npm run test:unit` run after each phase to confirm the suite stays green. Phase 1 is pure deletion (no production code touched). Phase 2 removes global test doubles from `jest.setup.js` and pushes mocking to the individual test files that need it. Phase 3 rewrites the tests that broke because they were relying on the global mock (or deletes them if there's no real logic left to test). Phase 4 adds a new `__tests__/integration/` tree that exercises real Express routes against a real Mongo instance (`mongodb-memory-server`, already wired in `__tests__/setup/db.setup.js` but currently unused).

**Tech Stack:** Jest 29, Supertest (already a devDependency, unused so far), mongodb-memory-server, Express, Mongoose.

**Working directory for all commands below:** `shiksha-website/shiksha-backend`

---

## Pre-flight: config discrepancy to resolve during Phase 2

There are two Jest configs in this package:
- `jest.config.js` — has no `setupFilesAfterEnv`. This is the config Jest picks up by default (standard filename), and it's what `npm test` / `npm run test:unit` / CI (`.github/workflows/ci-backend.yaml`) actually run against.
- `jest.config.test.js` — defines `setupFilesAfterEnv: ['<rootDir>/__tests__/setup/jest.setup.js']`, coverage thresholds, `moduleNameMapper` aliases. Nothing in `package.json` or CI passes `--config jest.config.test.js`, so **this file is currently dead** — the 5 `jest.mock(...)` calls and the console mock in `__tests__/setup/jest.setup.js` are not being loaded by the test run at all today.

Task 5 (Phase 2) confirms this empirically and decides what to keep. Do not assume the write-up above is still true by the time you get there — re-verify.

---

## Phase 1: Delete pure noise

### Task 1: Delete the 9 aggregation tests

**Files to delete:**
- `__tests__/unit/aggregation/admin.dashboard.aggregation.test.js`
- `__tests__/unit/aggregation/chapter.aggregation.test.js`
- `__tests__/unit/aggregation/master.lesson.aggregation.test.js`
- `__tests__/unit/aggregation/master.resource.aggregation.test.js`
- `__tests__/unit/aggregation/regenerate.log.aggregation.test.js`
- `__tests__/unit/aggregation/schedule.aggregation.test.js`
- `__tests__/unit/aggregation/school.class.aggregation.test.js`
- `__tests__/unit/aggregation/teacher.lesson.plan.aggregation.test.js`
- `__tests__/unit/aggregation/user.aggregation.test.js`

- [ ] **Step 1:** Read each file first to confirm none contain a real assertion against transformed output (issue calls these out as noise; spot-check 2-3 before bulk-deleting since the folder wasn't fully audited during planning).
- [ ] **Step 2:** Delete the directory:

```bash
git rm -r __tests__/unit/aggregation
```

- [ ] **Step 3:** Run: `npm run test:unit`
Expected: PASS, test count drops by however many `it()` blocks those 9 files had, no new failures.

### Task 2: Delete `constants.test.js` and `loggers.test.js`

**Files to delete:**
- `__tests__/unit/config/constants.test.js` (asserts exact string literals and `typeof` on a static config object — no behavior under test)
- `__tests__/unit/config/loggers.test.js`

- [ ] **Step 1:** Read `__tests__/unit/config/loggers.test.js` to confirm it's the same shape (asserts logger config shape, not logging behavior). If it does something more substantive (e.g. verifies a real transport writes output), keep it and note why in the commit message instead of deleting.
- [ ] **Step 2:** Delete:

```bash
git rm __tests__/unit/config/constants.test.js
git rm __tests__/unit/config/loggers.test.js   # only if Step 1 confirms it's noise
```

- [ ] **Step 3:** Run: `npm run test:unit`
Expected: PASS.

### Task 3: Delete the 4 skeleton controller tests

**Files to delete** (each is `should be defined` + `should be an instance of X` only, confirmed identical pattern by reading all 4):
- `__tests__/unit/controllers/master.class.controller.test.js`
- `__tests__/unit/controllers/school.class.controller.test.js`
- `__tests__/unit/controllers/feedback.lesson.controller.test.js`
- `__tests__/unit/controllers/teacher.feedback.controller.test.js`

- [ ] **Step 1:** Check whether `master.class.controller.js`, `school.class.controller.js`, `feedback.lesson.controller.js`, `teacher.lesson.plan.controller.js` extend `base.controller.js` with no overrides — if so, `base.controller.test.js` (345 lines, real behavioral tests) already covers their logic and nothing is lost.

```bash
grep -n "class.*Controller extends" ../../shiksha-website/shiksha-backend/controllers/master.class.controller.js ../../shiksha-website/shiksha-backend/controllers/school.class.controller.js ../../shiksha-website/shiksha-backend/controllers/feedback.lesson.controller.js ../../shiksha-website/shiksha-backend/controllers/teacher.feedback.controller.js
```

- [ ] **Step 2:** Delete:

```bash
git rm __tests__/unit/controllers/master.class.controller.test.js
git rm __tests__/unit/controllers/school.class.controller.test.js
git rm __tests__/unit/controllers/feedback.lesson.controller.test.js
git rm __tests__/unit/controllers/teacher.feedback.controller.test.js
```

- [ ] **Step 3:** Run: `npm run test:unit`
Expected: PASS.

### Task 4: Commit Phase 1

- [ ] **Step 1:** Run full suite once more with coverage to capture the before/after delta for the PR description:

```bash
npm run test:unit:coverage
```

Note the `coverage-summary.json` statements/branches/functions/lines percentages before moving on — paste into the commit body or PR description, not into code.

- [ ] **Step 2:** Commit:

```bash
git commit -m "test: remove pointless aggregation, config, and skeleton controller tests

Deletes 9 unit/aggregation/*.test.js, constants.test.js, and 4 controller
tests that only asserted new+instanceof. None exercised real behavior;
base.controller.test.js already covers the shared logic these controllers
inherit. Part of #477."
```

---

## Phase 2: Drop global mocks — COMPLETE (commit `2c46fcb9`)

**What actually happened, for anyone re-running this plan:** `jest --showConfig` confirmed `jest.config.test.js` was dead (empty `setupFilesAfterEnv` in the live config), and its `moduleNameMapper` aliases had zero real usages — deleted outright. That left `__tests__/setup/jest.setup.js` referenced by nothing at all, so it was deleted whole rather than edited (its global mocks, console mock, and `global.expect*Response` helpers were all unreachable dead code — none had any usage outside the file itself). `npm run test:unit` before and after: 102 suites / 891 tests pass identically, confirming none of it was load-bearing.

**Correction to the original Phase 3 premise below:** reading the actual service test files (`chat.bot.service.test.js`, `copilot.bot.service.test.js`, `question.bank.bot.service.test.js`, `variform.service.test.js`, `azure.blob.service.test.js`) shows their `jest.resetModules()` + re-require pattern is NOT dodging the global mock — it's re-evaluating module-top-level `process.env.X` reads (e.g. `chat.bot.service.js:5` captures `LLM_API_BASE_URL` at require-time), so each test needs a fresh module instance after setting its own env var. They already mock `axios` locally. This is legitimate, not brittle. Tasks 7 and 8 below do not apply — skip them.

`routes.test.js` (Task 9) is still a real brittle-mock case and remains valid — see revised note there.

### Task 5: Resolve the dual jest-config situation

- [ ] **Step 1:** Confirm which config is live by running with verbose Jest config resolution:

```bash
npx jest --showConfig 2>&1 | grep -i "setupFilesAfterEnv\|configFile"
```

Expected: shows `jest.config.js` is picked up and `setupFilesAfterEnv` is empty — confirming `jest.config.test.js` is dead.

- [ ] **Step 2:** If confirmed dead, delete `jest.config.test.js` entirely — it is unused, and the `moduleNameMapper` aliases (`@controllers/*`, `@managers/*`, etc.) it defines aren't used anywhere in source (grep to confirm):

```bash
grep -rn "require(['\"]@\(controllers\|managers\|dao\|services\|helpers\|middlewares\|validations\)" --include="*.js" . | grep -v node_modules
```

If that grep is empty, the aliases are unused too.

```bash
git rm jest.config.test.js
```

- [ ] **Step 3:** Run: `npm run test:unit` — expected PASS, no change (config was already dead).

### Task 6: Strip the global mocks from `jest.setup.js`

**File to modify:** `__tests__/setup/jest.setup.js`

- [ ] **Step 1:** Remove these lines:

```js
// Mock external services
jest.mock('../../services/azure.blob.service');
jest.mock('../../services/chat.bot.service');
jest.mock('../../services/copilot.bot.service');
jest.mock('../../services/question.bank.bot.service');
jest.mock('../../services/variform.service');
```

- [ ] **Step 2:** Remove the console mock block:

```js
// Mock console methods to reduce noise in test output
global.console = {
  ...console,
  log: jest.fn(), // Mock console.log
  debug: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(), // Keep error for debugging
};
```

- [ ] **Step 3:** Since Task 5 established this file isn't currently wired into `jest.config.js`'s `setupFilesAfterEnv`, add it now so the remaining env-var setup (`JWT_SECRET`, `PIN_SECRET_KEY`, etc.) and the `expectSuccessResponse`/`expectErrorResponse`/etc. global helpers actually run — check first whether any test currently depends on those env vars being set some other way:

```bash
grep -rln "JWT_SECRET\|PIN_SECRET_KEY" __tests__/ ../../shiksha-website/shiksha-backend/config/ 2>/dev/null
```

If tests/config already set these per-file or via `.env.test`, do not add `setupFilesAfterEnv` — leave `jest.setup.js` wiring for whichever tests need it locally. If nothing sets them and tests currently pass anyway, the env vars aren't load-bearing — leave as-is and skip this step's config change.

- [ ] **Step 4:** Run: `npm run test:unit`
Expected: Some tests FAIL now — specifically any test that imported a controller/manager which transitively requires `azure.blob.service`, `chat.bot.service`, `copilot.bot.service`, `question.bank.bot.service`, or `variform.service` and relied on it being auto-mocked. Record the failing file list; this becomes Phase 3's task list.

```bash
npm run test:unit 2>&1 | grep -B2 "FAIL "
```

- [ ] **Step 5:** Do NOT commit yet — Phase 3 fixes the breakage in the same logical change. If you want a checkpoint commit here, use `git stash` instead of committing broken tests.

---

## Phase 3: Fix or replace brittle tests

The exact file list depends on Task 6 Step 4's output. Known candidates going in (confirm against actual failures):

### Task 7: Rewrite `chat.bot.service.test.js`

**File to modify:** `__tests__/unit/services/chat.bot.service.test.js`

Current pattern (brittle — depends on global mock being absent, uses `jest.resetModules()` + re-require to dodge it):

```js
jest.mock("axios", () => ({ post: jest.fn() }));
let axios;

describe("chat.bot.service", () => {
  beforeEach(() => {
    jest.resetModules();
    jest.clearAllMocks();
    axios = require("axios");
    process.env.LLM_API_BASE_URL = "http://llm";
  });
```

- [ ] **Step 1:** Read the full current file and the real `services/chat.bot.service.js` to see what behavior exists to test (retry logic, response parsing, error mapping, etc.).
- [ ] **Step 2:** Rewrite without `resetModules`/re-require — mock only `axios` at the top of the file (module-level `jest.mock`, standard pattern, no global-mock dodging needed since Phase 2 removed the global mock):

```js
jest.mock("axios");
const axios = require("axios");
const chatBotService = require("../../../services/chat.bot.service");

describe("chat.bot.service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env.LLM_API_BASE_URL = "http://llm";
  });

  // real behavioral assertions go here — replace with actual exported
  // functions from chat.bot.service.js once read in Step 1
});
```

- [ ] **Step 3:** Add real assertions against whatever `chat.bot.service.js` actually does (e.g. `axios.post` called with the right URL/payload, response `.data` returned, thrown error on non-2xx). Do not leave `it.todo` placeholders — if there's nothing worth asserting beyond "it calls axios," say so in the PR description and keep the test minimal but real.
- [ ] **Step 4:** Run: `npx jest __tests__/unit/services/chat.bot.service.test.js -v`
Expected: PASS.

### Task 8: Audit and fix the other 4 service tests touched by the mock removal

**Files (confirm against Task 6 Step 4's failure list):**
- `__tests__/unit/services/azure.blob.service.test.js`
- `__tests__/unit/services/copilot.bot.service.test.js`
- `__tests__/unit/services/question.bank.bot.service.test.js`
- `__tests__/unit/services/variform.service.test.js`

For each file:
- [ ] **Step 1:** Read the file. If it already does local `jest.mock` of its own external deps (e.g. `axios`, Azure SDK) and only broke because some *other* test file imported it transitively without local mocking, the fix belongs in the *importing* test, not here.
- [ ] **Step 2:** For any test file that imports one of these services as a collaborator (e.g. a manager test importing `chat.bot.service` indirectly), add a local `jest.mock('../../../services/<name>.service')` at the top of that test file instead of relying on global mocking.
- [ ] **Step 3:** Run: `npm run test:unit` after each fix.
Expected: PASS, converging to zero failures.

### Task 9: Replace the `routes.test.js` Router-mock factory

**File to modify:** `__tests__/unit/routes/routes.test.js`

- [ ] **Step 1:** Read current file — 20-line custom `express.Router` mock that only spies on `.get/.post/.put/.delete` being called, asserting nothing about actual request handling.
- [ ] **Step 2:** Decide: if `__tests__/unit/controllers/*.controller.test.js` already cover the handler logic per-route, this file adds no value beyond "route registered" — replace it with a real Supertest-driven smoke test instead of a mock factory:

```js
const request = require("supertest");
const express = require("express");
const router = require("../../../routes"); // adjust to actual entry point

describe("routes", () => {
  const app = express();
  app.use(express.json());
  app.use("/", router);

  it("responds on a known route without a route-not-found 404", async () => {
    const res = await request(app).get("/health"); // adjust to a real registered path
    expect(res.status).not.toBe(404);
  });
});
```

- [ ] **Step 3:** If the real router requires auth middleware that'll block an unauthenticated smoke test, either hit a route that's intentionally public or mock only the auth middleware (local mock, not global) to pass through.
- [ ] **Step 4:** Run: `npx jest __tests__/unit/routes/routes.test.js -v`
Expected: PASS.

### Task 10: Full suite check + commit Phase 2 & 3 together

- [ ] **Step 1:** Run: `npm run test:unit:coverage`
Expected: PASS, no `FAIL` lines.

- [ ] **Step 2:** Commit:

```bash
git add __tests__/setup/jest.setup.js jest.config.test.js __tests__/unit/services __tests__/unit/routes
git commit -m "test: remove global service mocks, fix tests that depended on them

Drops the 5 jest.mock(...) calls and console mock from jest.setup.js.
Global mocking hid real import-time failures and forced brittle
resetModules+re-require dances in service tests. Each affected test now
mocks its own direct dependencies locally. Deletes the dead
jest.config.test.js (never wired into any npm script or CI). Part of #477."
```

---

## Phase 4: Add real integration tests

### Task 11: Wire up the integration test scaffold

**Files:**
- Create: `__tests__/integration/setup.js`
- Reference: `__tests__/setup/db.setup.js` (already exists, exports `setupTestDB`, `clearTestDB`, `closeTestDB`, `seedTestDB`, `resetTestDB` — unused until now)

- [ ] **Step 1:** Confirm `mongodb-memory-server` is already a devDependency (it is, per `package.json`) and that CI's `test:integration:coverage` step (in `.github/workflows/ci-backend.yaml`) currently runs with `--passWithNoTests` as a fallback — meaning it silently no-ops today.
- [ ] **Step 2:** Create `__tests__/integration/setup.js`:

```js
const { setupTestDB, clearTestDB, closeTestDB } = require("../setup/db.setup");

beforeAll(async () => {
  await setupTestDB();
});

afterEach(async () => {
  await clearTestDB();
});

afterAll(async () => {
  await closeTestDB();
});

module.exports = {};
```

- [ ] **Step 3:** No test to run yet — this is scaffold only, verified by Task 12.

### Task 12: Auth OTP integration test

**Files:**
- Create: `__tests__/integration/auth.otp.integration.test.js`
- Read first: `controllers/auth.controller.js`, `managers/auth.manager.js`, `routes/` entry for auth, `models/user.model.js`, `validations/auth.validation.js`

- [ ] **Step 1:** Read the files above to get exact route paths, request/response shape, and which fields `OTP` request/verify expect. Do not guess field names — copy them from source.
- [ ] **Step 2:** Write the test using the real app entry point (check `app.js`/`server.js` for how the Express app is assembled outside of `.listen()`) mounted against Supertest, `require("../integration/setup")` for DB lifecycle, and a real `User` document seeded via `mongoose.model("User").create(...)`:

```js
require("./setup");
const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../../app"); // adjust to actual exported app
const User = require("../../models/user.model");

describe("Auth OTP flow (integration)", () => {
  it("issues an OTP for a known user and verifies it", async () => {
    const user = await User.create({
      /* exact required fields from user.model.js schema, e.g. phone, name */
    });

    const otpRes = await request(app)
      .post("/api/auth/otp/request") // adjust to real route from routes/
      .send({ phone: user.phone });

    expect(otpRes.status).toBe(200);

    // fetch the OTP the same way the manager stores it (DB field or mocked
    // SMS gateway capture — adjust based on how managers/auth.manager.js
    // actually issues/stores OTP) to drive the verify call for real
  });
});
```

- [ ] **Step 3:** Mock only true externals (SMS/email gateway) — nothing in the auth/user/DB path.
- [ ] **Step 4:** Run: `npx jest __tests__/integration/auth.otp.integration.test.js -v`
Expected: PASS. Iterate on Step 2's placeholders using real source until green — this step legitimately can't be fully scripted without reading the live auth manager code, which is why Step 1 is mandatory before writing assertions.

### Task 13: Lesson plan generation skeleton integration test

**Files:**
- Create: `__tests__/integration/lesson.plan.skeleton.integration.test.js`
- Read first: `controllers/teacher.lesson.plan.controller.js`, `managers/teacher.lesson.plan.manager.js`, `managers/master.lesson.manager.js`

- [ ] **Step 1:** Read source to find the skeleton-generation entry point and its real request contract.
- [ ] **Step 2:** Write request → manager → real DB → response test following the same shape as Task 12, mocking only the LLM call (`services/copilot.bot.service.js` or `services/chat.bot.service.js`, whichever the skeleton path uses) since that's a genuine external dependency, not the DB/manager layer.
- [ ] **Step 3:** Run and iterate to green, same as Task 12 Step 4.

### Task 14: Question bank integration test

**Files:**
- Create: `__tests__/integration/question.bank.integration.test.js`
- Read first: `controllers/question.bank.controller.js`, `managers/question.bank.manager.js`, `dao/question.bank.dao.js`, `dao/question.bank.cache.dao.js`

- [ ] **Step 1:** Read source for the real create/fetch contract.
- [ ] **Step 2:** Write request → manager → real DB → response test, mocking only `services/question.bank.bot.service.js` (LLM-backed generation) if the flow under test touches it.
- [ ] **Step 3:** Run and iterate to green.

### Task 15: Schedule integration test

**Files:**
- Create: `__tests__/integration/schedule.integration.test.js`
- Read first: `controllers/schedule.controller.js`, `managers/schedule.manager.js`, `models/schedule.model.js`, `validations/schedule.validation.js`

- [ ] **Step 1:** Read source for real create/list/update contract and required fields on `schedule.model.js`.
- [ ] **Step 2:** Write request → manager → real DB → response test — no LLM services in this path, so no mocking needed beyond auth middleware if it gates the route (reuse the local auth-bypass approach from Task 9 if needed).
- [ ] **Step 3:** Run and iterate to green.

### Task 16: Remove the CI fallback and commit Phase 4

**File to modify:** `.github/workflows/ci-backend.yaml`

- [ ] **Step 1:** Once Tasks 12-15 all pass locally, remove the now-unnecessary `--passWithNoTests` flag from the integration test step (line ~97) since real tests exist now:

```yaml
docker run --rm \
  -e NODE_ENV=development \
  -e CI=true \
  -v $PWD/shiksha-website/shiksha-backend/coverage-integration:/usr/src/app/coverage \
  --workdir /usr/src/app \
  --entrypoint sh "$IMAGE" -c "npm ci && npm run test:integration:coverage"
```

- [ ] **Step 2:** Run full local suite once more:

```bash
npm run test:unit:coverage
npm run test:integration:coverage
```

Expected: both PASS.

- [ ] **Step 3:** Commit:

```bash
git add __tests__/integration ../../.github/workflows/ci-backend.yaml
git commit -m "test: add integration tests for auth OTP, lesson plan skeleton, question bank, schedule

Real request -> manager -> mongodb-memory-server -> response coverage for
the four highest-risk flows, using the db.setup.js helper that already
existed but was unused. Mocks only true externals (LLM/SMS gateways).
Removes the --passWithNoTests fallback from CI now that this suite is
non-empty. Closes #477."
```

---

## Post-implementation check

- [ ] Run `npm run test:coverage` (combined unit+integration) once at the end and compare total statements/branches/functions/lines % against the Task 4 baseline — deleting noise will likely drop raw coverage % slightly even though test *quality* went up; call this out explicitly in the PR description so it doesn't read as a regression.
- [ ] Open a PR against `a4i/staging` (not `a4i/main`) per this repo's branching convention.
