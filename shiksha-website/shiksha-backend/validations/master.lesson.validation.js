const Joi = require("joi");
const validateRequest = require("./common.validation");
const { validateRequestForUpdates } = require("./common.validation");

const schema = Joi.object({
	name: Joi.string().min(3).required(),
	class: Joi.number().required(),
	board: Joi.string().required(),
	medium: Joi.string().required(),
	semester: Joi.number().optional(),
	subject: Joi.string().required(),
	chapterId: Joi.string().required(),
	teachingModel: Joi.string().optional(),
	subTopics: Joi.array().items(Joi.string()),
	level: Joi.array().items(Joi.string()).required(),
	instructionSet: Joi.array().items(Joi.object()).required(),
	learningOutcomes: Joi.array(),
	videos: Joi.array(),
	documents: Joi.array(),
	interactOutput: Joi.array(),
	extractedResources: Joi.array().required(),
	isAll: Joi.boolean().required(),
});

const validateMasterLessonCreate = validateRequest(schema);

// Admin edit of an ingested lesson plan. Every field is optional, but the body
// must carry at least one. `chapterId` stays out: a lesson plan cannot move to
// a different chapter through this route.
const updateSchema = Joi.object({
	name: Joi.string().min(3),
	class: Joi.number(),
	board: Joi.string(),
	medium: Joi.string(),
	semester: Joi.alternatives().try(Joi.string(), Joi.number()),
	subject: Joi.string(),
	teachingModel: Joi.array().items(Joi.string()),
	subTopics: Joi.array().items(Joi.string()),
	instructionSet: Joi.alternatives().try(
		Joi.object(),
		Joi.array().items(Joi.object())
	),
	learningOutcomes: Joi.array(),
	videos: Joi.array(),
	documents: Joi.array(),
	interactOutput: Joi.array(),
	extractedResources: Joi.array(),
	checkList: Joi.array(),
	sections: Joi.array().items(Joi.object()),
	isAll: Joi.boolean(),
}).min(1);

const validateMasterLessonUpdate = validateRequestForUpdates(updateSchema);

module.exports = {
	validateMasterLessonCreate,
	validateMasterLessonUpdate,
};
