======================================================================
3799156250 shiksha-website/shiksha-frontend/src/app/view/user/question-bank/question-bank-view/question-bank-view.component.ts line=106
DIFF:
@@ -101,7 +102,7 @@ export class QuestionBankViewComponent implements OnInit {
           this.questionBankDetails = val.data;
           this.questionBank = this.questionBankDetails.questionBank
           this.generatedTotalMarks = this.questionBank.questions.reduce((sum: number, section: any) => (
-            sum + Number(section.numberOfQuestions || 0) * Number(section.marksPerQuestion || 0)
+            sum + Number(section.answerCount) * Number(section.marksPerQuestion)
           ), 0);
BODY:
**NaN `generatedTotalMarks` for legacy papers after fallback removed**

The PR's final commit ("require answerCount end to end") removed the `|| section.numberOfQuestions` fallback that `ANSWER_COUNT_MARKS_LOGIC.md` section C in this same PR explicitly documented as required for pre-feature saved papers.

The server's `dbService.connect()` call is not awaited before `app.listen()`, so HTTP requests arrive before `backfillAnswerCount()` completes. Any `getQuestionBankDetails` call for a legacy paper during that window returns `section.answerCount = undefined`.

**Fix:**
```ts
this.generatedTotalMarks = this.questionBank.questions.reduce((sum: number, section: any) => (
  sum + Number(section.answerCount ?? section.numberOfQuestions ?? 0) * Number(section.marksPerQuestion || 0)
), 0);
```

Using `??` instead of `||` keeps the semantic correct: only fall back when `answerCount` is `null` or `undefined`, not when it's a valid `0` (though Joi requires min(1) so 0 is invalid anyway).
======================================================================
3799163259 shiksha-website/shiksha-frontend/src/app/shared/services/question-bank-download.service.ts line=236
DIFF:
@@ -202,7 +231,9 @@ export class QuestionBankDownloadService {
   private createDocument(data: QuestionBankData, children: (Paragraph | Table)[], subtitleSuffix: string): Document {
     let totalMarks = 0;
     for (const section of data.questionBank.questions as QuestionBankSection[]) {
-      totalMarks += Number(section.numberOfQuestions || 0) * Number(section.marksPerQuestion || 0);
+      // Only the questions a student must answer count toward the paper total, so a
+      // "answer any 5 of 7" section contributes 5 * marksPerQuestion, not 7.
+      totalMarks += Number(section.answerCount) * Number(section.marksPerQuestion);
BODY:
**NaN docx total marks for legacy papers**

The docx `createDocument` method computes `totalMarks` for the document subtitle without a fallback.

**Fix:**
```ts
totalMarks += Number(section.answerCount ?? section.numberOfQuestions ?? 0) * Number(section.marksPerQuestion || 0);
```

**Note:** The section header display in `question-bank-view.component.html` has the same exposure:
```html
<!-- line 116 — shows 'undefined × 5 = NaN' for legacy papers -->
{{ questionBankData.answerCount }} X {{ formatMarks(questionBankData.marksPerQuestion) }}
```
Fix: `{{ (questionBankData.answerCount ?? questionBankData.numberOfQuestions) }}`.
======================================================================
3799169780 shiksha-website/shiksha-frontend/src/app/view/user/question-bank/question-bank-generation/question-bank-generation.component.html line=215
DIFF:
@@ -194,7 +212,7 @@ <h2 data-testid="wizard-step-header" class="text-base md:text-xl font-bold text-
           <ng-container *ngFor="let block of questionBankBluePrintData; let i = index">
             <div class="flex justify-between mt-5 font-bold">
               <span>{{ i + 1 }}. {{ questionTypeLabel(block.type) | translate }}</span>
-              <span>{{ block.numberOfQuestions }} X {{ formatMarks(block.marksPerQuestion) }} = {{ formatMarks(block.numberOfQuestions * block.marksPerQuestion) }}</span>
+              <span>{{ block.numberOfQuestions }} X {{ formatMarks(block.marksPerQuestion) }} = {{ formatMarks(block.answerCount * block.marksPerQuestion) }}</span>
BODY:
**Blueprint preview marks formula is mathematically inconsistent**

The blueprint step shows `numberOfQuestions` (pool size) on the left of `×` but `answerCount * marksPerQuestion` on the right of `=`. When a choice row has `numberOfQuestions=10, answerCount=4, marksPerQuestion=1`, this renders:

> **10 × 1 = 4**

which is mathematically false (10×1 = 10). The final paper view correctly uses `answerCount` on both sides.

**Fix — use `answerCount` on the left (matches view component):**
```html
<span>
  {{ block.answerCount }} X {{ formatMarks(block.marksPerQuestion) }}
  = {{ formatMarks(block.answerCount * block.marksPerQuestion) }}
</span>
```

If showing the pool size alongside is desired (for context), render both explicitly:
```html
<span>
  {{ 'Answer any' | translate }} {{ block.answerCount }} {{ 'of' | translate }}
  {{ block.numberOfQuestions }}
  &nbsp;|&nbsp;
  {{ block.answerCount }} X {{ formatMarks(block.marksPerQuestion) }}
  = {{ formatMarks(block.answerCount * block.marksPerQuestion) }}
</span>
```

======================================================================
3799178866 shiksha-website/shiksha-frontend/src/app/view/user/question-bank/question-bank-generation/question-bank-generation.component.ts line=614
DIFF:
@@ -531,21 +597,32 @@ export class QuestionBankGenerationComponent implements OnInit, OnDestroy {
     });
   }
 
-  private pickToTotalMarks(pool: any[]): any[] {
+  private pickToTotalMarks(pool: PoolQuestion[]): PoolQuestion[] {
     const shuffled = this.utilityservice.shuffleOptions([...pool]);
     const used = new Set<string>();
-    const picked: any[] = [];
+    const picked: PoolQuestion[] = [];
+    let marks = 0;
     for (const row of this.templateData) {
-      let need = row.numberOfQuestions;
+      // Show the full pool (numberOfQuestions) so students can pick alternates,
+      // but only answerCount of them actually count toward the paper's marks.
+      let need = Number(row.numberOfQuestions);
       for (const q of shuffled) {
         if (!need || used.has(q._id)) continue;
         if (q.type === row.type && Number(q.marks) === Number(row.marksPerQuestion)) {
           picked.push(q); used.add(q._id); need--;
         }
       }
BODY:
**`pickToTotalMarks` overcounts marks when question pool is smaller than `numberOfQuestions`**

The function adds `answerCount × marksPerQuestion` to `marks` for each template row unconditionally, even when the pool has fewer questions than `numberOfQuestions`. The fallback-fill guard then sees `marks >= totalMarks` and stops filling, leaving the paper under-populated.

**Failure scenario:** Pool has 3 `ANSWER_LONG` questions, template requires `numberOfQuestions=5, answerCount=4, marksPerQuestion=10`. Found 3 questions (30 marks actually picked). `marks += 4×10 = 40`. If `totalMarks = 40`, fallback fill sees `marks == totalMarks` and exits. Paper delivered with 3 questions instead of the expected count.

**Fix — base `requiredForRow` on actually-found count:**
```ts
const actualFound = Number(row.numberOfQuestions) - need;  // need was decremented per find
const requiredForRow = Math.min(Number(row.answerCount), actualFound);
marks += requiredForRow * Number(row.marksPerQuestion);
```
======================================================================
3799182250 shiksha-website/shiksha-backend/managers/question.bank.manager.js line=582
DIFF:
@@ -568,7 +572,14 @@ class QuestionBankManager extends BaseManager {
       item.numberOfQuestions++;
       remaining -= item.marksPerQuestion;
     }
-    return result.filter(item => item.numberOfQuestions);
+    // numberOfQuestions was just re-derived from totalMarks, so the client's answerCount
+    // can no longer be trusted to fit it: a section that shrank below its choice count
+    // becomes answer-all, and answerCount <= numberOfQuestions holds again.
+    return result.filter(item => item.numberOfQuestions)
+      .map(item => ({
+        ...item,
+        answerCount: Math.min(Number(item.answerCount), item.numberOfQuestions),
+      }));
BODY:
**`Math.min(Number(item.answerCount), ...)` → NaN when `answerCount` is absent**

Joi requires `answerCount` on the HTTP blueprint endpoint, so the normal request path is safe. But `_applyQuestionCounts` is a public class method invocable by tests, scripts, or future code without Joi gating. A silent NaN stored in the blueprint would produce NaN marks downstream.

**Fix:**
```js
answerCount: item.answerCount != null
  ? Math.min(Number(item.answerCount), item.numberOfQuestions)
  : item.numberOfQuestions,  // no choice = answer all
```
