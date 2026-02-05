const Joi = require("joi");

// 1. Define the allowed types strictly
const VALID_QUESTION_TYPES = [
    'Four alternatives are given for each of the following questions, choose the correct alternative',
    'Fill in the blanks with suitable words',
    'Answer the following in a word, phrase or sentence',
    'Answer the following in two or three sentences each',
    'Answer the following questions',
    'Answer the following question in four or five sentences',
    'Match the following'
];

const questionBankCommonSchema = {
    medium: Joi.string().required(),
    board: Joi.string().required(),
    grade: Joi.number().required(),
    subject: Joi.string().required(),
    chapter: Joi.alternatives().try(
        Joi.array().items(Joi.string()),
        Joi.string()
    ),
    subTopic: Joi.alternatives().try(
        Joi.array()
            .items(Joi.string())
            .allow(null)
            .empty(null)
            .default([]),
    ),
    totalMarks: Joi.number().required(),
    examinationName: Joi.string().required(),
    chapterIds: Joi.alternatives().try(
        Joi.array().items(Joi.string()),
        Joi.string()
    ).required(),
    isMultiChapter: Joi.boolean().required(),
    marksDistribution: Joi.array()
        .items({
            unit_name: Joi.string(),
            marks: Joi.number(),
            percentage_distribution: Joi.number(),
        })
        .required()
}

// 1. Template Schema (Step 1)
const questionBankTemplateSchemaCreate = Joi.object({
    ...questionBankCommonSchema
}).unknown(true); // Allow extra fields

// 2. Blueprint Schema (Step 2)
const questionBankBluePrintSchemaCreate = Joi.object({
    ...questionBankCommonSchema,
    objective_distribution: Joi.array()
        .items(Joi.object().unknown(true)) // Relaxed to allow snake/camel case items
        .required(),
    template: Joi.array()
        .items({
            type: Joi.string().valid(...VALID_QUESTION_TYPES).required(),
            number_of_questions: Joi.number(),
            marks_per_question: Joi.number(),
            description: Joi.string().optional().allow(""),
            question_distribution: Joi.alternatives().try(
                Joi.array(),
                Joi.valid(null)
            ).optional(),
        })
        .required(),
}).unknown(true); // Allow extra fields

// 3. Generate Schema (Step 3 - The one failing)
const questionBankSchemaCreate = Joi.object({
    ...questionBankCommonSchema,
    
    // Allow both camelCase and snake_case versions
    objectiveDistribution: Joi.array().items(Joi.object().unknown(true)).optional(),
    objective_distribution: Joi.array().items(Joi.object().unknown(true)).optional(),

    questionBankTemplate: Joi.array()
        .items({
            type: Joi.string().valid(...VALID_QUESTION_TYPES).required(),
            number_of_questions: Joi.number(),
            marks_per_question: Joi.number(),
            description: Joi.string().optional().allow(""),
            question_distribution: Joi.alternatives().try(
                Joi.array(),
                Joi.valid(null)
            ).optional(),
        }).optional(),

    template: Joi.array()
        .items({
            type: Joi.string().valid(...VALID_QUESTION_TYPES).required(),
            number_of_questions: Joi.number(),
            marks_per_question: Joi.number(),
            description: Joi.string().optional().allow(""),
            question_distribution: Joi.alternatives().try(
                Joi.array().items(
                    Joi.object().unknown(true) 
                ),
                Joi.valid(null)
            ).optional()
        })
        .required(),
}).unknown(true); //  Allows extra fields in the root payload

const questionBankFeedbackSchema = Joi.object({
    question: Joi.string().required(),
    feedback: Joi.string().required(),
    overallFeedback: Joi.string().allow("")
})

// Middleware functions
const validateQuestionBankTemplateCreate = (req, res, next) => {
    const data = req.body;
    let isValid = questionBankTemplateSchemaCreate.validate(data, { abortEarly: false });
    if (isValid.error) {
        return res.status(400).json({
            success: false,
            data: false,
            error: isValid.error.details.map((i) => i.message),
        });
    }
    req.body = isValid.value;
    next();
};

const validateQuestionBankBluePrintCreate = (req, res, next) => {
    const data = req.body;
    let isValid = questionBankBluePrintSchemaCreate.validate(data, { abortEarly: false });
    if (isValid.error) {
        return res.status(400).json({
            success: false,
            data: false,
            error: isValid.error.details.map((i) => i.message),
        });
    }
    req.body = isValid.value;
    next();
};

const validateQuestionBankCreate = (req, res, next) => {
    const data = req.body;
    let isValid = questionBankSchemaCreate.validate(data, { abortEarly: false });
    if (isValid.error) {
        // Log the actual error to the console for debugging
        console.log("Validation Error Details:", isValid.error.details.map((i) => i.message));
        
        return res.status(400).json({
            success: false,
            data: false,
            error: isValid.error.details.map((i) => i.message),
        });
    }
    req.body = isValid.value;
    next();
};

const validateQuestionBankFeedbackCreate = (req, res, next) => {
    const data = req.body;
    let isValid = questionBankFeedbackSchema.validate(data, { abortEarly: false });
    if (isValid.error) {
        return res.status(400).json({
            success: false,
            data: false,
            error: isValid.error.details.map((i) => i.message),
        });
    }
    next();
};

module.exports = {
    validateQuestionBankCreate,
    validateQuestionBankTemplateCreate,
    validateQuestionBankBluePrintCreate,
    validateQuestionBankFeedbackCreate
};