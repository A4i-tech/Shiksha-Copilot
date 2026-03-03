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
          question: z.string().min(1, "Question text cannot be empty").optional(),
          answer: z.string().default(""),
          difficulty: z.string().default("Average"),
          options: z.array(z.string()).default([]),
          text: z.string().min(1, "Question text cannot be empty").optional(),
          pairs: z.array(z.object({ left: z.string().min(1, "Left pair cannot be empty"), right: z.string().min(1, "Right pair cannot be empty") })).optional()
        }).passthrough()
      ).default([]),
    }).passthrough()
  ),
});

// For question-paper/by-parts API (Python service) response
// Returns: { items: [{ unit_name, type, objective, marks_per_question, difficulty, item: {...} }, ...] }
const QuestionBankPartsItemsResponseSchema = z.object({
  items: z.array(
    z.object({
      unit_name: z.string().optional(),
      type: z.string().optional(),
      objective: z.string().optional(),
      marks_per_question: z.number().optional(),
      difficulty: z.string().optional(),
      item: z.object({
        question: z.string().min(1, "Question text cannot be empty").optional(),
        answer: z.string().default(""),
        difficulty: z.string().default("Average"),
        options: z.array(z.string()).default([]),
        text: z.string().min(1, "Question text cannot be empty").optional(),
        pairs: z.array(z.object({ left: z.string().min(1, "Left pair cannot be empty"), right: z.string().min(1, "Right pair cannot be empty") })).optional()
      }).passthrough().optional(),
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
    if (data && typeof data === "object" && Array.isArray(data.items)) {
      const validatedItems = QuestionBankPartsItemsResponseSchema.parse(data);
      return validatedItems.items.reduce((acc, row) => {
        const payload = (row.item && typeof row.item === "object") ? { ...row.item } : {};
        const questionText = payload.question || payload.text || "";
        if (questionText || payload.pairs) {
          acc.push({
            ...payload,
            question: questionText,
            options: Array.isArray(payload.options) ? payload.options : [],
            answer: payload.answer || "",
            difficulty: row.difficulty || payload.difficulty || "Average",
            marks: row.marks_per_question || payload.marks || 1,
          });
        }
        return acc;
      }, []);
    }

    const validated = QuestionBankPartsResponseSchema.parse(data);

    if (!validated.questions || !Array.isArray(validated.questions)) {
      throw new Error(`Expected questions array, got: ${typeof validated.questions}`);
    }

    // Flatten nested questions structure
    const flattenedQuestions = [];

    validated.questions.forEach((questionBlock) => {
      const blockQuestions = questionBlock.questions;
      const marksPerQuestion = questionBlock.marks_per_question ?? 1;

      blockQuestions.forEach((q) => {
        const questionText = q.question || q.text || "";
        if (questionText || q.pairs) {
          flattenedQuestions.push({
            ...q,
            question: questionText,
            options: q.options,
            answer: q.answer,
            difficulty: q.difficulty,
            marks: marksPerQuestion,
          });
        }
      });
    });

    return flattenedQuestions;
  } catch (error) {
    if (error instanceof z.ZodError) {
      const issues = Array.isArray(error.issues) ? error.issues : (Array.isArray(error.errors) ? error.errors : []);
      const details = issues
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
