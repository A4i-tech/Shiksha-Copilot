const Joi = require("joi");
const PAPER_CONFIG = require("../config/question-bank-paper-config.json");
const validateRequest = require("./common.validation");

const VALID_QUESTION_TYPES = Object.keys(PAPER_CONFIG.questionTypes);

// Maps every objective name found under PAPER_CONFIG.objectives to its paired
// shortName. Built at module load time so a future config edit changes the
// validator with no code change.
const OBJECTIVE_SHORT_NAMES = Object.values(PAPER_CONFIG.objectives).reduce(
    (labels, objectiveSet) => {
        objectiveSet.forEach((entry) => {
            labels[entry.objective] = entry.shortName;
        });
        return labels;
    },
    {}
);
const VALID_OBJECTIVES = Object.keys(OBJECTIVE_SHORT_NAMES);
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
            objective: Joi.string().valid(...VALID_OBJECTIVES).required(),
        }).required(),
    }).required(),
    marksDistribution: Joi.array().min(1).items({
        unitName: Joi.string().required(),
        marks: Joi.number().positive().required(),
        percentageDistribution: Joi.number().min(0).max(100),
    }).required(),
    objectiveDistribution: Joi.array().min(1).items({
        objective: Joi.string().valid(...VALID_OBJECTIVES).required(),
        shortName: Joi.string().optional().valid(
            Joi.ref("objective", { adjust: (objective) => OBJECTIVE_SHORT_NAMES[objective] })
        ),
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

const questionBankListQuerySchema = Joi.object({
    page: Joi.number().integer().min(1),
    limit: Joi.number().integer().min(1).max(999),
    filter: Joi.object({
        _id: Joi.string().hex().length(24),
        board: Joi.string(),
        medium: Joi.string(),
        grade: Joi.number().integer(),
        subject: Joi.string(),
        examinationName: Joi.string(),
    }).unknown(false),
    sortBy: Joi.string().valid("createdAt", "updatedAt", "board", "medium", "grade", "subject", "examinationName"),
    sortOrder: Joi.string().valid("asc", "desc"),
    search: Joi.string(),
    fields: Joi.array().items(Joi.string().valid(
        "_id", "createdAt", "updatedAt", "board", "medium", "grade", "subject",
        "examinationName", "chapterIds", "topics", "isMultiChapter", "totalMarks",
        "marksDistribution", "objectiveDistribution", "questionBankTemplate", "bluePrintTemplate", "questionBank"
    )),
}).unknown(false);

// Maps each questionBankBluePrintSchemaCreate field path (array index stripped) to the
// label the user reads on the blueprint table screen.
const BLUEPRINT_FIELD_LABELS = {
    template: "the template list",
    "template.type": "a question type in the template",
    "template.numberOfQuestions": "the number of questions in a template row",
    "template.marksPerQuestion": "the marks per question in a template row",
    "template.description": "the description in a template row",
    "template.questionDistribution": "the question distribution in a template row",
    "template.questionDistribution.unitName": "a unit name in the question distribution",
    "template.questionDistribution.objective": "an objective in the question distribution",
    marksDistribution: "the marks distribution table",
    "marksDistribution.unitName": "a unit name in the marks distribution table",
    "marksDistribution.marks": "the marks value in the marks distribution table",
    "marksDistribution.percentageDistribution": "a percentage in the marks distribution table",
    objectiveDistribution: "the objective distribution table",
    "objectiveDistribution.objective": "an objective in the objective distribution table",
    "objectiveDistribution.shortName": "a short name in the objective distribution table",
    "objectiveDistribution.percentageDistribution": "a percentage in the objective distribution table",
};

// Builds the BLUEPRINT_FIELD_LABELS lookup key from a Joi error detail path.
// Joi array indexes are numbers in detail.path; drop them so every row of a
// repeating table shares one label.
const blueprintFieldKey = (detail) =>
    detail.path.filter((segment) => typeof segment !== "number").join(".");

const capitalize = (text) => text.charAt(0).toUpperCase() + text.slice(1);

// Converts one Joi error detail from questionBankBluePrintSchemaCreate into one
// plain-language message. Follows Nielsen heuristic 9: state the exact fault,
// then state the next action. https://www.nngroup.com/articles/ten-usability-heuristics/
const formatBlueprintValidationMessage = (detail) => {
    const fieldKey = blueprintFieldKey(detail);
    const label = BLUEPRINT_FIELD_LABELS[fieldKey];
    if (!label) {
        throw new Error(
            `No plain-language label mapped for blueprint field "${fieldKey}" in BLUEPRINT_FIELD_LABELS.`
        );
    }
    switch (detail.type) {
        case "any.required":
            return `The blueprint table is missing ${label}. Add ${label} and submit the blueprint again.`;
        case "array.min":
            return `The blueprint table needs at least one row for ${label}. Add a row and submit the blueprint again.`;
        case "array.base":
            return `${capitalize(label)} is not a list of rows. Fix the rows and submit the blueprint again.`;
        case "string.base":
        case "string.empty":
            return `${capitalize(label)} must be text. Enter a value and submit the blueprint again.`;
        case "number.base":
            return `${capitalize(label)} must be a number. Enter a number and submit the blueprint again.`;
        case "number.integer":
            return `${capitalize(label)} must be a whole number. Remove the decimal and submit the blueprint again.`;
        case "number.positive":
            return `${capitalize(label)} must be greater than zero. Enter a positive number and submit the blueprint again.`;
        case "number.min":
        case "number.max":
            return `${capitalize(label)} is outside the allowed range. Enter a value in the allowed range and submit the blueprint again.`;
        case "any.only":
            if (fieldKey === "objectiveDistribution.shortName") {
                return `The short name in this row does not match the objective it belongs to. Reload the page to load the current labels, then submit the blueprint again.`;
            }
            if (fieldKey === "objectiveDistribution.objective" || fieldKey === "template.questionDistribution.objective") {
                return `${capitalize(label)} does not match a listed objective. Pick an objective from the list and submit the blueprint again.`;
            }
            return `${capitalize(label)} is not one of the allowed choices. Pick a listed choice and submit the blueprint again.`;
        default:
            return `${capitalize(label)} is not valid. Correct the value and submit the blueprint again.`;
    }
};

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
            error: [...new Set(isValid.error.details.map(formatBlueprintValidationMessage))],
        });
    }
    req.body = isValid.value;
    next();
};

const validateQuestionBankFeedbackCreate = validateRequest(questionBankFeedbackSchema);

const validateQuestionBankList = validateRequest(questionBankListQuerySchema, "query");

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
    validateQuestionBankList,
    validateGetQuestionTypes,
    validateGetGrammarTopics,
    BLUEPRINT_FIELD_LABELS,
    questionBankBluePrintSchemaCreate,
    OBJECTIVE_SHORT_NAMES,
    VALID_OBJECTIVES,
};
