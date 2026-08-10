const Joi = require("joi");
const { validateRequestForUpdates } = require("./common.validation");

const objectId = Joi.string().regex(/^[0-9a-fA-F]{24}$/);

// The model normalizes options, pairs and items in its `findOneAndUpdate` hook,
// so accept both the shorthand (a plain string) and the full object form here.
const optionItem = Joi.alternatives().try(
	Joi.string().allow(""),
	Joi.object({
		label: Joi.string().allow(""),
		key: Joi.string().allow(""),
		text: Joi.string().allow("").required(),
	})
);

const pairItem = Joi.object({
	left: Joi.string().allow(""),
	right: Joi.string().allow(""),
	keyAnswer: Joi.string().allow(""),
}).or("left", "right");

const item = Joi.alternatives().try(
	Joi.string().allow(""),
	Joi.object({
		question: Joi.string().allow(""),
		text: Joi.string().allow(""),
	}).or("question", "text")
);

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
	items: Joi.array().items(item),
	correctOrderById: Joi.array().items(Joi.number()),
	correctOrderIndices: Joi.array().items(Joi.number()),
}).min(1);

const validateQuestionContentUpdate = validateRequestForUpdates(
	questionContentUpdateSchema
);

module.exports = {
	validateQuestionContentUpdate,
};
