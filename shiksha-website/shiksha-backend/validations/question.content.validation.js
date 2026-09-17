const Joi = require("joi");
const { validateRequestForUpdates } = require("./common.validation");
const { CONTENT_STATUSES } = require("../constants/content-status");

const objectId = Joi.string().regex(/^[0-9a-fA-F]{24}$/);

// model normalizes options/pairs in its findOneAndUpdate hook, so accept both shorthand string and full object form
const optionItem = Joi.alternatives().try(
	Joi.string().allow(""),
	Joi.object({
		label: Joi.string().allow(""),
		key: Joi.string().allow(""),
		text: Joi.string().allow("").required(),
	})
);

const pairItem = Joi.object({
	value1: Joi.string().allow(""),
	value2: Joi.string().allow(""),
}).or("value1", "value2");

const questionContentUpdateSchema = Joi.object({
	subject: Joi.string(),
	medium: Joi.string(),
	class: Joi.string(),
	chapterId: objectId,
	chapter: Joi.object({
		chapterNumber: Joi.number(),
		title: Joi.string().allow(""),
	}),
	groupHeading: Joi.string().allow(""),
	answerType: Joi.string(),
	difficulty: Joi.string(),
	marksPerQuestion: Joi.number(),
	text: Joi.string().allow(""),
	keyAnswer: Joi.string().allow(""),
	options: Joi.array().items(optionItem),
	pairs: Joi.array().items(pairItem),
	status: Joi.string().valid(...CONTENT_STATUSES),
}).min(1);

const validateQuestionContentUpdate = validateRequestForUpdates(
	questionContentUpdateSchema
);

module.exports = {
	validateQuestionContentUpdate,
};
