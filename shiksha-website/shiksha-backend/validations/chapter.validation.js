const Joi = require("joi");
const validateRequest = require("./common.validation");
const { validateRequestForUpdates } = require("./common.validation");

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
	// The content generation pipeline owns the outcomes per subtopic, so the
	// admin routes accept the field but never require it to match `subTopics`.
	topicsLearningOutcomes: Joi.any().strip(),
	indexPath: Joi.string().allow(""),
	isGrammar: Joi.boolean(),
	grammarTopics: Joi.array().items(Joi.string().allow("")),
	grammarSourceChapters: Joi.array().items(Joi.string().allow("")),
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

const validateChapterCreate = validateRequest(chapterCreateSchema);
const validateChapterUpdate = validateRequestForUpdates(chapterUpdateSchema);

module.exports = {
	validateChapterCreate,
	validateChapterUpdate,
};
