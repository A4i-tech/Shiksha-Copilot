const Joi = require("joi");
const PAPER_CONFIG = require("../config/question-bank-paper-config.json");
const validateRequest = require("./common.validation");

const VALID_QUESTION_TYPES = Object.keys(PAPER_CONFIG.questionTypes);
const questionBankTemplateItemSchema = {
    type: Joi.string().valid(...VALID_QUESTION_TYPES).required(),
    numberOfQuestions: Joi.number(),
    marksPerQuestion: Joi.number(),
    description: Joi.string().optional().allow(""),
    questionDistribution: Joi.array().items(Joi.object().unknown(true)).required(),
};

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
    isPreview: Joi.boolean(),
    surplus: Joi.boolean(),
    chapterIds: Joi.alternatives().try(
        Joi.array().items(Joi.string()),
        Joi.string()
    ).required(),
    isMultiChapter: Joi.boolean().required(),
    marksDistribution: Joi.array()
        .min(1)
        .items({
            unitName: Joi.string(),
            marks: Joi.number(),
            percentageDistribution: Joi.number(),
        })
        .required()
}

// 1. Template Schema (Step 1)
const questionBankTemplateSchemaCreate = Joi.object({
    ...questionBankCommonSchema
}).unknown(true); // Allow extra fields

// 2. Generate Schema
const questionBankSchemaCreate = Joi.object({
    ...questionBankCommonSchema,
    objectiveDistribution: Joi.array().min(1).items(Joi.object().unknown(true)).required(),

    questionBankTemplate: Joi.array()
        .items(questionBankTemplateItemSchema).optional(),

    template: Joi.array()
        .items(questionBankTemplateItemSchema)
        .required(),
}).unknown(true); //  Allows extra fields in the root payload

const questionBankBluePrintSchemaCreate = Joi.object({
    template: Joi.array().min(1).items({
        ...questionBankTemplateItemSchema,
        numberOfQuestions: Joi.number().integer().positive().required(),
        marksPerQuestion: Joi.number().positive().required(),
        questionDistribution: Joi.array().items({
            unitName: Joi.string().required(),
            objective: Joi.string().required(),
        }).required(),
    }).required(),
    marksDistribution: Joi.array().min(1).items({
        unitName: Joi.string().required(),
        marks: Joi.number().positive().required(),
        percentageDistribution: Joi.number().min(0).max(100),
    }).required(),
    objectiveDistribution: Joi.array().min(1).items({
        objective: Joi.string().required(),
        percentageDistribution: Joi.number().min(0).max(100).required(),
    }).required(),
}).unknown(true);

const questionBankFeedbackSchema = Joi.object({
    question: Joi.string().required(),
    feedback: Joi.string().required(),
    overallFeedback: Joi.string().allow("")
})

const getQuestionTypesQuerySchema = Joi.object({
    subject: Joi.string().required(),
}).unknown(true);

const getGrammarTopicsQuerySchema = Joi.object({
    grade: Joi.number().integer().min(1).max(12).required(),
}).unknown(true);

// Middleware functions
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

const validateQuestionBankBluePrintCreate = (req, res, next) => {
    const isValid = questionBankBluePrintSchemaCreate.validate(req.body, { abortEarly: false });
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

const validateQuestionBankFeedbackCreate = validateRequest(questionBankFeedbackSchema);

const validateGetQuestionTypes = (req, res, next) => {
    const isValid = getQuestionTypesQuerySchema.validate(req.query, { abortEarly: false });
    if (isValid.error) {
        return res.status(400).json({
            success: false,
            data: false,
            error: isValid.error.details.map((i) => i.message),
        });
    }
    req.query = isValid.value;
    next();
};

const validateGetGrammarTopics = (req, res, next) => {
    const isValid = getGrammarTopicsQuerySchema.validate(req.query, { abortEarly: false });
    if (isValid.error) {
        return res.status(400).json({
            success: false,
            data: false,
            error: isValid.error.details.map((i) => i.message),
        });
    }
    req.query = isValid.value;
    next();
};

module.exports = {
    validateQuestionBankCreate,
    validateQuestionBankBluePrintCreate,
    validateQuestionBankFeedbackCreate,
    validateGetQuestionTypes,
    validateGetGrammarTopics
};
