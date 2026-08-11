const QuestionBank = require("../models/question.bank.model");
const QuestionBankConfiguration = require("../models/question.bank.config.model");

// Backfills `answerCount` on question-paper sections/template rows authored before
// the "answer any N of M" internal-choice feature existed.
//
// Those documents have no `answerCount` at all, which previously forced every read
// site to re-derive it as `answerCount || numberOfQuestions`. Setting it explicitly
// to `numberOfQuestions` ("answer all") preserves the exact current meaning of a
// legacy paper - marks arithmetic is unchanged, because the fallback the code used
// to apply produced the same number - while letting the field become required.
//
// Safe to re-run, and safe to interrupt:
//   - only touches array elements where `answerCount` is absent, never overwrites
//   - only touches elements that actually carry a numeric `numberOfQuestions`, so a
//     malformed legacy row is left alone rather than backfilled to null
//   - the `$exists: false` filter makes a completed migration a no-op
//   - a partially applied run is still correct on both shapes, and the next boot
//     finishes it
// Because nothing is destroyed or rewritten in place, this needs no backup
// collection or single-writer lease (contrast migrations/unify-users.js, which
// reshapes and drops collections).

/**
 * Selects only documents that actually have a row left to backfill.
 *
 * The `answerCount: { $exists: false }` half alone also matches documents whose
 * array is empty (the dotted path exists nowhere), and `$set` on those still
 * counts as a write - so on prod_dump3 a completed migration kept rewriting
 * ~10k configurations with an empty `questionBankTemplate` on every boot.
 * Requiring a numeric `numberOfQuestions` somewhere in the array excludes them
 * and makes a finished migration cost zero writes.
 * @param {string} field name of the array field on the document
 */
function pendingFilter(field) {
  return {
    [`${field}.answerCount`]: { $exists: false },
    [`${field}.numberOfQuestions`]: { $exists: true },
  };
}

/**
 * Rewrites one array field, adding `answerCount: numberOfQuestions` to elements missing it.
 * @param {string} field name of the array field on the document
 */
function backfillPipeline(field) {
  return [
    {
      $set: {
        [field]: {
          $map: {
            input: `$${field}`,
            as: "row",
            in: {
              $cond: [
                {
                  $and: [
                    { $eq: [{ $type: "$$row.answerCount" }, "missing"] },
                    { $isNumber: "$$row.numberOfQuestions" },
                  ],
                },
                { $mergeObjects: ["$$row", { answerCount: "$$row.numberOfQuestions" }] },
                "$$row",
              ],
            },
          },
        },
      },
    },
  ];
}

async function backfillAnswerCount() {
  const [questionBanks, questionBankTemplates, bluePrintTemplates] = await Promise.all([
    QuestionBank.updateMany(pendingFilter("questions"), backfillPipeline("questions")),
    QuestionBankConfiguration.updateMany(
      pendingFilter("questionBankTemplate"),
      backfillPipeline("questionBankTemplate")
    ),
    QuestionBankConfiguration.updateMany(
      pendingFilter("bluePrintTemplate"),
      backfillPipeline("bluePrintTemplate")
    ),
  ]);

  const modified =
    questionBanks.modifiedCount + questionBankTemplates.modifiedCount + bluePrintTemplates.modifiedCount;
  if (modified) {
    console.log(
      `answerCount backfill: updated ${questionBanks.modifiedCount} question bank(s), ` +
      `${questionBankTemplates.modifiedCount} question bank template(s), ` +
      `${bluePrintTemplates.modifiedCount} blueprint template(s).`
    );
  }
  return { questionBanks, questionBankTemplates, bluePrintTemplates };
}

module.exports = backfillAnswerCount;
module.exports.backfillPipeline = backfillPipeline;
module.exports.pendingFilter = pendingFilter;
