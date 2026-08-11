# Answer-Count Marks Calculation — Rationale Notes

Context: Issue #512 — teacher configures "Answer any N of M" per section (`answerCount` vs `numberOfQuestions`). This note explains *why* each marks-calculation snippet is written the way it is, so no one "simplifies" the fallback chains later and reintroduces the marks-multiplier bug that was fixed in this branch.

## Core rule
`answerCount` = how many questions in a section actually count toward marks (student must answer that many; rest are optional alternates shown so the student can pick).
`numberOfQuestions` = total questions shown in the section.

If `answerCount` is unset (`0`/`null`/`undefined`), the rule is **answer all** → falls back to `numberOfQuestions`.

## Snippets

### 1. `question-bank-generation.component.ts` — `pickToTotalMarks`
```ts
const requiredForRow = Number(row.answerCount) || Number(row.numberOfQuestions);
marks += requiredForRow * Number(row.marksPerQuestion || 0);
```
Picks the full pool (`numberOfQuestions`) into the paper so students have alternates to choose from, but only `answerCount` of them should count toward `totalMarks` while building the auto-picked set. The `||` here is not defensive boilerplate — it *is* the "unset = answer all" business rule.

### 2. `question-bank-generation.component.ts` — `recalculateTemplate` (totalTemplateMarks)
```ts
const numberOfQuestions = Number(row.numberOfQuestions) || 0;
const answerCount = Number(row.answerCount) || numberOfQuestions;
return total + Math.min(answerCount, numberOfQuestions) * Number(row.marksPerQuestion || 0);
```
Same fallback rule, plus an extra `Math.min(answerCount, numberOfQuestions)` clamp. This clamp *is* defensive: guards against a transient/bad state where `answerCount > numberOfQuestions` (e.g. mid-edit before `onNumberOfQuestionsChange` has re-synced it) so displayed total marks never over-counts.

### 3. `onNumberOfQuestionsChange`
```ts
const numberOfQuestions = Number(row.numberOfQuestions) || 0;
if (!Number(row.answerCount) || Number(row.answerCount) > numberOfQuestions) {
  row.answerCount = numberOfQuestions;
}
```
When the teacher edits `numberOfQuestions`, if `answerCount` is unset OR now exceeds the new `numberOfQuestions` (e.g. was 6, teacher drops total to 4), reset `answerCount = numberOfQuestions`. Prevents an invalid "answer 6 of 4" state from persisting in the template.

### 4. `matchingRow` / `marginalMarks` / `computeGroupAwareMarks` (question-bank-generation.component.ts, picker logic)
```ts
private matchingRow(q: any): any | undefined {
  return (this.templateData || []).find(
    r => r.type === q.type && Number(r.marksPerQuestion) === Number(q.marks)
  );
}

private marginalMarks(q: any): number {
  const row = this.matchingRow(q);
  if (!row) return Number(q.marks);
  const cap = Number(row.answerCount) || Number(row.numberOfQuestions) || Infinity;
  const countInGroup = this.selectedQuestions.filter(sq => this.matchingRow(sq) === row).length;
  return countInGroup < cap ? Number(q.marks) : 0;
}
```
`matchingRow`: maps a loose question object back to its template row by `(type, marksPerQuestion)` — there's no explicit foreign key linking a generated question to its template row, so this is a best-effort structural match. Extracted as a shared helper so `marginalMarks` and `computeGroupAwareMarks` don't duplicate the lookup.

`marginalMarks`: used while the teacher is manually picking/swapping questions in the picker UI. If a row has no match (`!row`), the question isn't governed by any template cap, so it always contributes its full marks. Otherwise, once a row's group already has `cap` (= `answerCount`, or `numberOfQuestions` if unset, or literally `Infinity` if both are somehow falsy/missing) questions selected, any *additional* question from that same group contributes **0 marginal marks** — picking a 9th alternate in a "choose 8 of 12" group shouldn't push totalMarks over the cap.

`Infinity` fallback specifically: if both `answerCount` and `numberOfQuestions` are missing/zero (corrupt/legacy row), don't cap at `0` and silently reject every question in that group — let all of them count rather than break selection entirely.

`computeGroupAwareMarks`: same cap logic, but computes the *total* marks across `this.selectedQuestions` in one pass (used for footer/summary display) rather than "would this next pick add marks" (which is what `marginalMarks` answers).

### 5. `question-bank-download.service.ts` — docx export section header
```ts
`\t${section.answerCount || section.numberOfQuestions} X ${formatMarks(section.marksPerQuestion)} = ${formatMarks((section.answerCount || section.numberOfQuestions) * section.marksPerQuestion)}`
```
Docx export mirrors the on-screen "N X marks = total" header line. Same answer-all fallback rule as everywhere else — must match what's shown on screen (task #8: mirror choice line + OR divider from on-screen view into the Word doc).

### 6. `question-bank-view.component.ts` — `generatedTotalMarks`
```ts
this.generatedTotalMarks = this.questionBank.questions.reduce((sum: number, section: any) => (
  sum + Number(section.answerCount || section.numberOfQuestions || 0) * Number(section.marksPerQuestion || 0)
), 0);
```
Same rule again, computing the header "Total Marks" shown on the generated-paper view page. The extra `|| 0` on the inner term and `|| 0` on `marksPerQuestion` are pure `NaN`/undefined guards (backend response shape isn't strictly typed here — see `any` note below) so a missing field can't turn the whole sum into `NaN`.

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
`templateData: any[]`, question objects (`q`), matched `row`, `section` — all typed `any` throughout this feature area. This is the **pre-existing convention** in `question-bank-generation.component.ts` / `question-bank-template.component.ts` / `question-bank-view.component.ts`; there's no shared TS interface for a template row or generated question object anywhere in this module. Not new debt introduced by task #9 — kept consistent with surrounding code rather than doing an unscoped typing refactor alongside the bug fix. Proper interfaces (e.g. `QuestionTemplateRow`, `GeneratedQuestion`) would be a separate follow-up task if wanted.

## Remaining `|| 0` occurrences — rebuttal reference

Full audit of every `|| 0` still present in the question-bank frontend after the answer-count fix. Each is deliberate, not a leftover bug. Grouped by why it's safe to leave.

### A. Counter/accumulator init (map `.get()` before first increment) — structurally required, not a data default

- `question-bank-generation.component.ts:616` — `const count = (countByRow.get(row) || 0) + 1;`
  Map returns `undefined` on first hit for a row; `|| 0` is the standard "first occurrence" seed for a running tally, not a masking of bad/missing data. Removing it makes the first increment `undefined + 1 = NaN`.
- `question-bank-template.component.ts:238` — same pattern, same map-counter idiom, same file family (`countByRow`).
- `question-bank-blue-print.component.ts:130` — `chartMapper[label] = (chartMapper[label] || 0) + 1;`
  Plain-object counter, identical idiom (object index instead of Map). Same rebuttal.

### B. Sum accumulator seed — `reduce(..., 0)` initial value, not a `|| 0` fallback

- `question-bank-view.component.ts:106` — the trailing `, 0)` is `reduce`'s initial accumulator, unrelated to the `|| 0` fallbacks inside the callback at line 105. Listed for completeness only.

### C. Legacy/back-compat field fallback — needed until old saved data is migrated

- `question-bank-view.component.ts:105` — `Number(section.answerCount || section.numberOfQuestions || 0) * Number(section.marksPerQuestion || 0)`
  Renders **previously saved** question banks fetched from `getQuestionBankDetails`. Banks created before this feature shipped have no `answerCount` field at all, so the chain falls through to `numberOfQuestions`, then to `0` only if the section is malformed/legacy-corrupt. Removing the outer `|| 0` turns a legacy bank with neither field into `NaN` total marks shown to the teacher — worse than `0`. `marksPerQuestion || 0` is the same defense for pre-feature sections that may have it unset.
  Not the same bug class as the marks-miscalculation issue fixed elsewhere in this task (that one silently substituted `numberOfQuestions` for `answerCount` in *live* calculation paths where `answerCount` is always populated by the current UI). This one guards against *data that predates the field's existence*.

### D. Composite dedup key, not a marks/count calculation

- `question-bank-template.component.ts:91` — `` `${q?.text || ''}__${q?.marks || 0}` ``
  Builds a dedup-map key when syncing pre-selected questions. `marks` is used as a string fragment for identity, never summed or displayed. Missing `marks` collapsing to `0` in the key is deterministic and harmless.

### E. Row-level defaults during in-progress template editing — teacher hasn't finished the row yet

- `question-bank-generation.component.ts:584` — `marks += requiredForRow * Number(row.marksPerQuestion || 0);`
- `question-bank-generation.component.ts:665,672,798` — `Number(row.numberOfQuestions) || 0`
  Run against `this.templateData`, the in-progress wizard template, where a row can legitimately have `marksPerQuestion`/`numberOfQuestions` unset for a moment (row just added, field not yet typed). Treating unset as `0` keeps the running total/preview stable (no `NaN` flash) mid-edit. A real `0` can never reach generation: `questionBankTemplateSchema` (Joi) requires `numberOfQuestions: min(1).required()` and `marksPerQuestion: min(1).required()` before the payload is accepted server-side.

### Bottom line
None of these correspond to the answer-count/marks bug class (treating `numberOfQuestions` as the graded count instead of `answerCount`). They're counter-seed idioms, back-compat guards for pre-feature saved data, non-numeric dedup keys, or live-edit defaults backstopped by required-field schema validation. Flag any *new* `answerCount`-adjacent `|| 0` for review — not these.
