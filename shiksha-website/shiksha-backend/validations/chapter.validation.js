const Joi = require("joi");
const validateRequest = require("./common.validation");
const { validateRequestForUpdates } = require("./common.validation");
const { CONTENT_STATUSES } = require("../constants/content-status");

const objectId = Joi.string().regex(/^[0-9a-fA-F]{24}$/);

const chapterFields = {
	subjectId: objectId,
	topics: Joi.string(),
	subTopics: Joi.array().items(Joi.string().allow("")),
	medium: Joi.string(),
	standard: Joi.number(),
	board: Joi.string(),
	orderNumber: Joi.number(),
	learningOutcomes: Joi.array().items(Joi.string().allow("")),
	// content pipeline owns per-subtopic outcomes, so admin routes accept but never require this
	topicsLearningOutcomes: Joi.any().strip(),
	indexPath: Joi.string().allow(""),
	isGrammar: Joi.boolean(),
	grammarTopics: Joi.array().items(Joi.string().allow("")),
	grammarSourceChapters: Joi.array().items(Joi.string().allow("")),
	status: Joi.string().valid(...CONTENT_STATUSES),
};

const chapterCreateSchema = Joi.object({
	...chapterFields,
	subjectId: objectId.required(),
	topics: Joi.string().required(),
	medium: Joi.string().required(),
	standard: Joi.number().required(),
	board: Joi.string().required(),
});

const chapterUpdateSchema = Joi.object(chapterFields).min(1);

const assignSchema = Joi.object({ curatorId: objectId.required() });

const COMMENT_REQUIRED = "Write a comment that tells the curator what to change, then send the chapter back.";

const requestChangesSchema = Joi.object({
	comment: Joi.string().trim().max(2000).required().messages({
		"any.required": COMMENT_REQUIRED,
		"string.base": COMMENT_REQUIRED,
		"string.empty": COMMENT_REQUIRED,
		"string.max": "Shorten the comment to 2000 characters or fewer, then send the chapter back.",
	}),
});

const validateChapterCreate = validateRequest(chapterCreateSchema);
const validateChapterUpdate = validateRequestForUpdates(chapterUpdateSchema);
const validateAssign = validateRequest(assignSchema);
const validateRequestChanges = validateRequest(requestChangesSchema);

module.exports = {
	validateChapterCreate,
	validateChapterUpdate,
	validateAssign,
	validateRequestChanges,
};
