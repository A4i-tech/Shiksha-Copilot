# PR review comments (copy-paste ready)

PR: feat(schedule): make lesson-plan filters optional, pick from recent plans (+ question-paper TeX validation)
Branch: pun-it/511-schedule-ux → a4i/main

## Blockers (must fix before merge)

1. **Modal positions off-screen when opened via "Schedule this"** — `schedule-view.component.ts:126` passes `document.body.getBoundingClientRect()` (left=0, right=innerWidth). In `setElementCoordinates` this cascades through 3 fallbacks and lands off-screen either left or right. The teacher opens the modal and sees nothing. Fix: use `{ left: innerWidth/2, right: innerWidth/2, top: innerHeight/2, bottom: innerHeight/2 }` as a centered anchor.

2. **Unrelated local-dev change leaked into PR** — `environment.dev.ts:5` changes `apiUrl` from `'your_backend_url'` to `"http://localhost:8080/api"`. This is a developer-local override, not part of the schedule-UX feature. Revert this file (or move to `.gitignore`'d `environment.local.ts`).

3. **`populateDropdownsForPrefill` leaves chapter/sub-topic dropdowns empty** — populates medium/class/subject but not `chapterDropdownValue` or `subTopicDropDownValue`. When a teacher expands the "Narrow by…" filters on a pre-filled plan, Chapter and Sub-Topic dropdowns have no options. Fix: after populating subject, trigger the chapter cascade (`setChapterValues`) and then sub-topic cascade.

4. **Hardcoded `medium: "English"`** — `shiksha-backend/managers/question.bank.manager.js:747`. Payload builder destructures `medium` from `reqBody` but hardcodes `"English"`. Teachers selecting Kannada/Telugu get English-medium question papers. Silent data corruption. Fix: `medium: reqBody.medium`.

5. **TOCTOU race in login attempt counting** — `shiksha-backend/managers/auth.manager.js:85-115`. Two concurrent requests both read `attemptCount=4` (below MAX=6), both pass the guard, both reserve — now `loginAttempts` has 7 entries. Lock threshold bypassed under burst. Fix: make `reserveLoginAttempt` the sole atomic gate (existing `$exists: false` pattern), check `result === null` for "locked", remove the pre-check.

6. **Missing `isDeleted` filter (pre-existing)** — `shiksha-backend/managers/teacher.feedback.manager.js:22-26`. `getOne` query does not filter soft-deleted records, so a soft-deleted feedback with `isCompleted: true` blocks resubmission with "Feedback already submitted!". `LessonFeedbackDao` correctly filters; this DAO does not. Not introduced by this PR but flagged as a blocker by reviewer — fix: add `isDeleted: { $ne: true }` to the `getOne` query.

---

## shiksha-website/shiksha-frontend/src/app/view/user/schedule/schedule-view/schedule-view.component.ts

### Line 126 — Modal positioning anchor is wrong
`document.body.getBoundingClientRect()` has `left=0`, which breaks the modal positioning math in `setElementCoordinates`. Use a centered anchor or a known element rect.

### Line 121-129 — Prefill consumed only in snapshot check
If the user navigates to `/schedule?openAdd=1` then hits back, `pendingLessonPlan` is gone but the modal may not have opened. The state lingers. A proper stream (`activatedRoute.queryParams.pipe(filter(p => p.openAdd), take(1), switchMap(...))`) handles this cleanly.

### Line 489 — Defensive nulling masks missing lifecycle reset
`setScheduleData` nulls `prefillLessonPlan` on every create-click. The component is reused across modal opens without a proper reset. Reset all `@Input` state in `ngOnChanges` when `mode` changes, not ad-hoc nulling in event handlers.

---

## shiksha-website/shiksha-frontend/src/app/view/user/schedule/schedule.service.ts

### Line 18 — `pendingLessonPlan` is mutable singleton state
Root-provided service property used as a one-shot bus between two components. Race conditions (two tabs, page refresh, race with `openAdd` query param), memory leak (stale prefill on later navigation). Fix: remove entirely. Pass lesson plan via `NavigationExtras.state` or `queryParams` and resolve from API in the schedule component. Angular has purpose-built primitives for this — service properties are not a transport layer.

---

## shiksha-website/shiksha-frontend/src/app/view/user/schedule/add-edit-schedule/add-edit-schedule.component.ts

### Line 562-590 — `populateDropdownsForPrefill` incomplete
Populates medium/class/subject but not chapter/sub-topic dropdowns. Teachers expanding the filters see empty Chapter/Sub-Topic dropdowns. Fix: after populating subject, trigger `setChapterValues` then `setSubTopicValue`. Or pre-populate `chapterDropdownValue`/`subTopicDropDownValue` directly from lesson data if available.

### Line 534-554 — `!== undefined` passes `null` through
`patchValue` writes `null` into the form for any field that came back `null` from the API. Fix: use `!= null` (catches both `null` and `undefined`) or an explicit predicate.

### Line 534-554 — Two different item shapes enter `onLessonPlanSelected`
Recent-plan items carry board/medium/class/subject/topic/subTopic; filter-cascade items carry only name/lessonId. Six `!== undefined` guards paper over this. Fix: normalize the item shape at the source (`mapLessonListItem` already does this for recent plans; do the same for cascade items) so this method receives one consistent shape.

### Line 312-325 — Ordering fragility between auto-cascade and prefill
`setBoardDropdownValue` runs first; for single-board teachers it auto-selects and cascades, resetting `lessonPlan`. The comment says "prefill must win" but this is a race between two competing state mutations. Fix: skip the auto-cascade when `prefillLessonPlan` is present, or make the cascade not clobber an already-set `lessonPlan`.

### Line 338-354 — `loadRecentLessonPlans` ignores active filters
Calls `getRecentLessonPlans()` with no filters. If the teacher already selected a Board in the optional filters, the recent-plans list still returns plans from all boards. The auto-selected "most recent" may belong to a different board. Fix: pass current form board/medium/class/subject as filters.

### Line 344 — Redundant defensive check
`if (!this.scheduleForm.get('lessonPlan')?.value ...)` — this method is only called when `prefillLessonPlan` is falsy, so the guard is always true. Dead conditional masking that the control flow is hard to reason about. Fix the flow, remove the check.

### Line 338-369 — Auto-select scope creep
Auto-selecting the most-recent plan on every add flow is a behavioral assumption that may surprise teachers (they might want last week's, or a different subject). It also adds an API call on every "add schedule" open. The dropdown already exists for explicit selection. Consider removing auto-patch; keep `getRecentLessonPlans` as the dropdown's data source only.

### Line 49 — `any` on `prefillLessonPlan`
The shape is known from `mapLessonListItem`. Define an interface and use it.

---

## shiksha-website/shiksha-frontend/src/app/view/user/content-generation/lesson-plan-view-edit/lesson-plan-view-edit.component.ts

### Line 277-279 — Dead guard, button already disabled
`if (!this.subjectDetails?._id) { return; }` — the template already has `[disabled]="!subjectDetails?._id"`. This guard cannot fire from the UI. Either remove it or throw (if reachable from code, that's the real bug).

### Line 296 — `scheduleThis()` skips save only for `view` mode
When `mode === 'view'` (already-created plan), the modal should navigate directly to schedule without re-saving. Current code calls `save(true, goToSchedule)` for view mode, which triggers the backend feedback-duplicate error ("Feedback already submitted!"). Fix: `if (this.mode === 'view' || this.isSaved) { goToSchedule(); }`.

### Line 298-302 — `onAiAccepted()` called as side-effect for missing feedback
`onAiAccepted()` accepts AI edits — calling it because feedback is missing is a non-sequitur. Root cause: if feedback is required to schedule, disable the button and show why. Don't let the user click, then surprise them.

### Line 20 — Import placement wrong
`ScheduleService` import sits between `CCE_TYPE_MAPPER` and `buildDiffParts, toSplitDiff` — two utility imports. It's a feature/service import, belongs with the other app imports above (grouped with `ModalService` at line 19).

### Line 640, 700 — `onSaved` callback threaded through `save()`
A callback parameter added to `save()` and two conditional branches solely to hijack navigation. This exists to avoid a `router.navigate` that would run otherwise. If `pendingLessonPlan` is removed (see schedule.service.ts finding), this threading disappears — `scheduleThis()` can just save and navigate in the subscribe.

---

## shiksha-api/app-service/app/utils/utils.py

### Line 62-89 — `validate_tex` is best-effort, not a full TeX parser
Documented as such, which is fine. But the error messages truncate at 200 chars (`{text[:200]!r}`) — for long content spans this may hide the actual location of the problem. Consider including the span offset in the error.

---

## shiksha-website/shiksha-frontend/src/app/view/user/schedule/add-edit-schedule/add-edit-schedule.component.html

### Line 26-30 — Verbose filter toggle text
"Narrow by Board, Medium, Class, Subject, Chapter, Sub Topic (optional)" as the toggle label is wordy. Consider a shorter label like "Filters" with a filter icon (matching Teacher Management pattern).

---

## Open questions

- Should `loadRecentLessonPlans` auto-select the most recent plan, or just populate the list and let the teacher pick? Auto-selection is an untested behavioral assumption.
- Should the "Schedule this" button require feedback for `generate`-mode plans (not just `view`/`draft`)? Currently a teacher can generate a plan and immediately schedule it without feedback if `isSaved` gets set during the flow.
- Is the `pendingLessonPlan` service field the right transport, or should this use `NavigationExtras.state`? Multiple reviewers flagged the service-property pattern as fragile.
