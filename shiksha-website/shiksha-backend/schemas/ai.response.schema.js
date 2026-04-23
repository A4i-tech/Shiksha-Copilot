const { z } = require("zod");

// ============ STRICT RESPONSE SCHEMAS - One per use case ============

// For generating question bank parts (missing questions)
// AI returns: { metadata: {...}, questions: [{ type, number_of_questions, marks_per_question, questions: [{question, ...}, ...] }, ...] }
const QuestionBankPartsResponseSchema = z.object({
  metadata: z.object({
    user_id: z.string().optional(),
    subject: z.string().optional(),
    grade: z.string().optional(),
    unit_names: z.array(z.string()).optional(),
    school_name: z.string().optional(),
    examination_name: z.string().optional(),
  }).optional(),
  questions: z.array(
    z.object({
      type: z.string().optional(),
      number_of_questions: z.number().optional(),
      marks_per_question: z.number().optional(),
      questions: z.array(
        z.object({
          question: z.string().min(1, "Question text required"),
          answer: z.string().optional(),
          difficulty: z.string().optional(),
        }).passthrough() // Allow additional fields
      ).optional(),
    }).passthrough()
  ),
});

// For generating question bank templates
const QuestionBankTemplateResponseSchema = z.object({
  template: z.array(
    z.object({
      type: z.string(),
      description: z.string().optional(),
      number_of_questions: z.number().positive().optional(),
      marks_per_question: z.number().positive().optional(),
    })
  ),
});

// For blueprint generation
const QuestionBankBlueprintResponseSchema = z.object({
  blueprint: z.array(
    z.object({
      unit_name: z.string(),
      objective: z.string().optional(),
      question_count: z.number().optional(),
      marks_allocated: z.number().optional(),
    })
  ),
});

// ============ STRICT VALIDATORS WITH EXTRACTION ============

/**
 * Validates AI response for question bank parts generation.
 * Handles nested structure: { metadata: {...}, questions: [{ questions: [{question}, ...], ... }, ...] }
 * Returns flat array: [{ question, answer, difficulty, marks }, ...]
 * 
 * @param {unknown} data - Raw AI response
 * @returns {Array<object>} - Flat array of questions
 * @throws {Error} - If validation fails
 */
function validatePartsResponse(data) {
  try {
    const validated = QuestionBankPartsResponseSchema.parse(data);

    if (!validated.questions || !Array.isArray(validated.questions)) {
      throw new Error(`Expected questions array, got: ${typeof validated.questions}`);
    }

    // Flatten nested questions structure
    const flattenedQuestions = [];

    validated.questions.forEach((questionBlock, blockIndex) => {
      const blockQuestions = questionBlock.questions || [];
      const marksPerQuestion = questionBlock.marks_per_question || 1;

      blockQuestions.forEach((q, qIndex) => {
        if (q.question) {
          let safeKeyAnswer = "";
          if (typeof q.keyAnswer === "string") {
            safeKeyAnswer = q.keyAnswer;
          } else if (q.keyAnswer !== undefined && q.keyAnswer !== null) {
            console.error(
              `[ai.response.schema.validatePartsResponse] Block ${blockIndex}, Question ${qIndex}: ` +
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
        }
      });
    });

    return flattenedQuestions;
  } catch (error) {
    if (error instanceof z.ZodError) {
      const details = error.errors
        .map(e => `${e.path.join('.')}: ${e.message}`)
        .join('; ');
      throw new Error(
        `Invalid Parts Response. Expected { metadata, questions: [{ questions: [{question}, ...], ... }] }. Details: ${details}`
      );
    }
    throw error;
  }
}

/**
 * Validates AI response for question bank template generation.
 * Expects: { template: [...] }
 * 
 * @param {unknown} data - Raw AI response
 * @returns {object} - Validated template response
 * @throws {Error} - If validation fails
 */
function validateTemplateResponse(data) {
  try {
    return QuestionBankTemplateResponseSchema.parse(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const details = error.errors
        .map(e => `${e.path.join('.')}: ${e.message}`)
        .join('; ');
      throw new Error(`Invalid Template Response. Details: ${details}`);
    }
    throw error;
  }
}

/**
 * Validates AI response for blueprint generation.
 * Expects: { blueprint: [...] }
 * 
 * @param {unknown} data - Raw AI response
 * @returns {object} - Validated blueprint response
 * @throws {Error} - If validation fails
 */
function validateBlueprintResponse(data) {
  try {
    return QuestionBankBlueprintResponseSchema.parse(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const details = error.errors
        .map(e => `${e.path.join('.')}: ${e.message}`)
        .join('; ');
      throw new Error(`Invalid Blueprint Response. Details: ${details}`);
    }
    throw error;
  }
}

module.exports = {
  QuestionBankPartsResponseSchema,
  QuestionBankTemplateResponseSchema,
  QuestionBankBlueprintResponseSchema,
  validatePartsResponse,
  validateTemplateResponse,
  validateBlueprintResponse,
};
