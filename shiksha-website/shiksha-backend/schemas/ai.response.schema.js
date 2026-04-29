/**
 * Normalizes the Python question paper response into the flat shape expected by
 * the Node merge/cache flow.
 *
 * @param {unknown} data - Raw Python question-paper response
 * @returns {Array<object>} - Flat array of questions
 * @throws {Error} - If the response is not structurally usable
 */
function normalizePartsResponse(data) {
  if (!data || typeof data !== "object" || Array.isArray(data)) {
    throw new Error(`Invalid Parts Response. Expected response object, got: ${typeof data}`);
  }

  if (!Array.isArray(data.questions)) {
    throw new Error(`Invalid Parts Response. Expected questions array, got: ${typeof data.questions}`);
  }

  const flattenedQuestions = [];

  data.questions.forEach((questionBlock, blockIndex) => {
    const blockQuestions = Array.isArray(questionBlock?.questions) ? questionBlock.questions : [];
    const marksPerQuestion = questionBlock?.marks_per_question || 1;

    blockQuestions.forEach((q, qIndex) => {
      if (q.question) {
        let safeKeyAnswer = "";
        if (typeof q.keyAnswer === "string") {
          safeKeyAnswer = q.keyAnswer;
        } else if (q.keyAnswer !== undefined && q.keyAnswer !== null) {
          console.error(
            `[ai.response.schema.normalizePartsResponse] Block ${blockIndex}, Question ${qIndex}: ` +
              `keyAnswer is not a string (got ${typeof q.keyAnswer}). ` +
              `Rejecting malformed value to prevent downstream failures.`,
            { question: q.question }
          );
        }

        flattenedQuestions.push({
          question: q.question,
          options: Array.isArray(q.options) ? q.options : [],
          keyAnswer: safeKeyAnswer,
          difficulty: q.difficulty || "Average",
          marks: marksPerQuestion,
        });
      } else if (q.value1 && q.value2) {
        flattenedQuestions.push({
          value1: q.value1,
          value2: q.value2,
          difficulty: q.difficulty || "Average",
          marks: marksPerQuestion,
        });
      }
    });
  });

  return flattenedQuestions;
}

module.exports = {
  normalizePartsResponse,
};
