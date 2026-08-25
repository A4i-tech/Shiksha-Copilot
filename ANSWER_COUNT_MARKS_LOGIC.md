# Answer-Count Marks Calculation — Rationale Notes

Context: Issue #512 — teacher configures "Answer any N of M" per section (`answerCount` vs `numberOfQuestions`). This note explains *why* each marks-calculation snippet is written the way it is, so no one "simplifies" the fallback chains later and reintroduces the marks-multiplier bug that was fixed in this branch.

## Core rule
`answerCount` = how many questions in a section actually count toward marks (student must answer that many; rest are optional alternates shown so the student can pick).
`numberOfQuestions` = total questions shown in the section.

If `answerCount` is unset (`0`/`null`/`undefined`), the rule is **answer all** → falls back to `numberOfQuestions`.

The "Answer any N of M" phrasing is only rendered when `answerCount < numberOfQuestions` (on-screen in `question-bank-generation.component.html`/`question-bank-view.component.html`, and in the docx export) — when they're equal ("answer all"), the line is hidden entirely instead of showing the redundant "answer all 6 of 6".

`answerCount <= numberOfQuestions` is enforced once, at write time, in `questionBankBluePrintSchemaCreate` (Joi, `shiksha-backend/validations/question.bank.validation.js`) — every blueprint/template write goes through this check, so read sites for *current* data never need to reconcile a mismatch between the two fields. The `?? numberOfQuestions` / `|| numberOfQuestions` fallbacks documented below exist only for **data saved before this validation existed**, not as a substitute for it.

## Snippets

### 1. `question-bank-generation.component.ts` — `pickToTotalMarks`
```ts
let need = this.rowQty(row);
// ...fill `need` slots from the pool by (type, marks)...
const actualFound = this.rowQty(row) - need;
const requiredForRow = Math.min(this.rowAns(row), actualFound);
marks += requiredForRow * this.rowMarks(row);
```
Picks the full pool (`numberOfQuestions`, via `rowQty`) into the paper so students have alternates to choose from, but only `answerCount` (via `rowAns`) of them should count toward `totalMarks` while building the auto-picked set. `Math.min(rowAns, actualFound)` additionally guards a short pool: if a row's pool has fewer matching questions than its `numberOfQuestions`, `answerCount` must not be claimed past what was actually found, or the fallback-fill step below stops early and the paper is delivered under-populated.

`rowQty`/`rowMarks`/`rowAns` (defined once, near `recalculateTemplate`) are the single named coercion point for `Number(row.numberOfQuestions) || 0`, `Number(row.marksPerQuestion) || 0`, `Number(row.answerCount) || 0` — template rows keep these fields nullable so a freshly added row renders as an empty input, not `"0"`.

### 2. `question-bank-generation.component.ts` — `recalculateTemplate` (totalTemplateMarks)
```ts
rowAns(row) * rowMarks(row)
```
No `Math.min` clamp here (unlike earlier drafts of this file) because `answerCount > numberOfQuestions` is no longer a reachable state by the time this runs: `onNumberOfQuestionsBlur` resyncs it in the UI (next snippet), and `answerCount <= numberOfQuestions` is now also enforced server-side at write time (Joi `.max(Joi.ref('numberOfQuestions'))` in `questionBankBluePrintSchemaCreate`, `shiksha-backend/validations/question.bank.validation.js`) — so the invariant holds by construction instead of being re-clamped on every read.

### 3. `onNumberOfQuestionsBlur`
```ts
const numberOfQuestions = this.rowQty(row);
if (!this.rowAns(row) || this.rowAns(row) > numberOfQuestions) {
  row.answerCount = numberOfQuestions;
}
```
When the teacher finishes editing `numberOfQuestions`, if `answerCount` is unset OR now exceeds the new `numberOfQuestions` (e.g. was 6, teacher drops total to 4), reset `answerCount = numberOfQuestions`. Prevents an invalid "answer 6 of 4" state from persisting in the template.

### 4. `computeGroupAwareMarks` (question-bank-generation.component.ts, picker logic)
```ts
private computeGroupAwareMarks(questions: PoolQuestion[]): number {
  const countByRow = new Map<TemplateRow, number>();
  let total = 0;
  for (const q of questions) {
    const row = (this.templateData || []).find(
      r => r.type === q.type && Number(r.marksPerQuestion) === Number(q.marks)
    );
    if (!row) { total += Number(q.marks); continue; }
    const count = (countByRow.get(row) || 0) + 1;
    countByRow.set(row, count);
    const cap = this.rowAns(row);
    if (count <= cap) total += Number(q.marks);
  }
  return total;
}
```
Maps each generated question back to its template row by `(type, marksPerQuestion)` — there's no explicit foreign key linking a generated question to its template row, so this is a best-effort structural match. Counts occurrences per row with `countByRow`; once a row's group already has `cap` (= `answerCount`, via `rowAns`) questions counted, any *additional* question from that same group contributes 0 marginal marks — picking a 9th alternate in a "choose 8 of 12" group shouldn't push totalMarks over the cap. A question with no matching row isn't governed by any template cap, so it always contributes its full marks. Used for both "would this next pick add marks" (`onPickerSelectionChange`/`onPreviewReorder`) and the footer/summary total (`updatePreview`) — same function, called from both places.

### 5. `question-bank-download.service.ts` — docx export
Two distinct code paths, don't conflate them:
- **Freshly generated paper** (`DownloadQuestionBankPayload`, `answerCount: number` is a required field on the DTO — every section is guaranteed to have it by the time this runs):
  ```ts
  `\t${section.answerCount} X ${formatMarks(section.marksPerQuestion)} = ${formatMarks(section.answerCount * section.marksPerQuestion)}`
  ...
  if (section.answerCount < section.numberOfQuestions) { /* render "Answer any N of M" + OR dividers */ }
  ```
  No fallback needed here — reads `answerCount` directly. Hides the "Answer any N of M" line entirely when `answerCount === numberOfQuestions` (redundant to tell a student to "answer all 6 of 6").
- **Legacy saved paper re-export path** (older code, different function):
  ```ts
  // Legacy papers saved before answerCount became required have no value on the
  // section, so fall back to numberOfQuestions (answer-all) instead of NaN.
  totalMarks += Number(section.answerCount ?? section.numberOfQuestions ?? 0) * Number(section.marksPerQuestion || 0);
  ```
  Kept intentionally — see "Legacy/back-compat field fallback" below.

### 6. `question-bank-view.component.ts` — `getQuestionBankDetails`
```ts
// Legacy blueprints saved before answerCount became required have no value on the
// section. Normalise once here so marks, template bindings and the download service
// all read a number instead of NaN.
this.questionBank.questions?.forEach((section: any) => {
  if (section.answerCount === undefined || section.answerCount === null) {
    section.answerCount = section.numberOfQuestions;
  }
});
this.generatedTotalMarks = this.questionBank.questions.reduce((sum: number, section: any) => (
  sum + Number(section.answerCount) * Number(section.marksPerQuestion)
), 0);
```
Normalises the legacy fallback **once**, right after the API response loads, instead of repeating `answerCount || numberOfQuestions` at every read site downstream (the template bindings, `generatedTotalMarks`, and the "Answer any N of M" line all just read `section.answerCount` afterward). Same "answer-all for pre-feature data" rule as everywhere else, applied at a single point of entry.

### 7. `isOrDividerAfter` (`question-bank-display.util.ts`)
```ts
export function isOrDividerAfter(questions: any[] | null | undefined, index: number): boolean {
  const current = questions?.[index];
  const next = questions?.[index + 1];
  return !!current?.choiceGroupId && current.choiceGroupId === next?.choiceGroupId;
}
```
Extracted as a standalone exported pure function (not a private component method) so:
- it's unit-testable in isolation without instantiating a component/service, and
- it's reused identically by both the on-screen question-bank view and the docx export service — single source of truth for "insert an OR divider between two questions in the same choice group" instead of duplicating the logic in two files.

## `any` typing note
`question-bank-generation.component.ts` now declares local `TemplateRow` and `PoolQuestion` interfaces and types `templateData`/pool/selection arrays against them — this is no longer bare `any` for the new answer-count logic. `question-bank-view.component.ts` and `question-bank-template.component.ts` still use `any` for the section/row objects they read from the untyped API response; that remains the pre-existing convention elsewhere in this module and wasn't part of this scope to change.

## Remaining `|| 0` occurrences — rebuttal reference

Full audit of every `|| 0` still present in the question-bank frontend after the answer-count fix. Each is deliberate, not a leftover bug. Grouped by why it's safe to leave.

### A. Counter/accumulator init (map `.get()` before first increment) — structurally required, not a data default

- `question-bank-generation.component.ts` `computeGroupAwareMarks` — `const count = (countByRow.get(row) || 0) + 1;`
  Map returns `undefined` on first hit for a row; `|| 0` is the standard "first occurrence" seed for a running tally, not a masking of bad/missing data. Removing it makes the first increment `undefined + 1 = NaN`.
- `question-bank-template.component.ts:238` — same pattern, same map-counter idiom, same file family (`countByRow`).
- `question-bank-blue-print.component.ts:130` — `chartMapper[label] = (chartMapper[label] || 0) + 1;`
  Plain-object counter, identical idiom (object index instead of Map). Same rebuttal.

### B. Sum accumulator seed — `reduce(..., 0)` initial value, not a `|| 0` fallback

- `question-bank-view.component.ts` `getQuestionBankDetails` — the trailing `, 0)` on the `generatedTotalMarks` reduce is `reduce`'s initial accumulator, not a fallback. Listed for completeness only.

### C. Legacy/back-compat field fallback — needed until old saved data is migrated

- `question-bank-view.component.ts` `getQuestionBankDetails` — the legacy fallback is now applied **once**, up front, instead of inline at every read (see snippet 6 above): `if (section.answerCount == null) section.answerCount = section.numberOfQuestions;`, then every downstream read (`generatedTotalMarks`, the template bindings, the "Answer any N of M" line) reads plain `section.answerCount`.
  Renders **previously saved** question banks fetched from `getQuestionBankDetails`. Banks created before this feature shipped have no `answerCount` field at all, so it falls back to `numberOfQuestions` once at load time.
  Not the same bug class as the marks-miscalculation issue fixed elsewhere in this task (that one silently substituted `numberOfQuestions` for `answerCount` in *live* calculation paths where `answerCount` is always populated by the current UI). This one guards against *data that predates the field's existence*.
- `question-bank-download.service.ts`'s legacy re-export path still uses the older inline form, `Number(section.answerCount ?? section.numberOfQuestions ?? 0) * Number(section.marksPerQuestion || 0)` — same rationale, different call site, not yet consolidated to the normalize-once pattern.

### D. Composite dedup key, not a marks/count calculation

- `question-bank-template.component.ts:91` — `` `${q?.text || ''}__${q?.marks || 0}` ``
  Builds a dedup-map key when syncing pre-selected questions. `marks` is used as a string fragment for identity, never summed or displayed. Missing `marks` collapsing to `0` in the key is deterministic and harmless.

### E. Row-level nullable-field coercion during in-progress template editing — teacher hasn't finished the row yet

- `question-bank-generation.component.ts` `rowQty`/`rowMarks`/`rowAns` helpers — `Number(row.numberOfQuestions) || 0`, `Number(row.marksPerQuestion) || 0`, `Number(row.answerCount) || 0`.
  Run against `this.templateData`, the in-progress wizard template, where a row can legitimately have any of these fields unset for a moment (row just added, field not yet typed). Treating unset as `0` keeps the running total/preview stable (no `NaN` flash) mid-edit. A real `0` can never reach a saved blueprint: `questionBankBluePrintSchemaCreate` (Joi, `shiksha-backend/validations/question.bank.validation.js`) requires `numberOfQuestions`/`marksPerQuestion`/`answerCount` all positive/`min(1)`, and `answerCount <= numberOfQuestions`, before the payload is accepted server-side.

### Bottom line
None of these correspond to the answer-count/marks bug class (treating `numberOfQuestions` as the graded count instead of `answerCount`). They're counter-seed idioms, back-compat guards for pre-feature saved data, non-numeric dedup keys, or live-edit defaults backstopped by required-field schema validation. Flag any *new* `answerCount`-adjacent `|| 0` for review — not these.
