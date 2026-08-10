const Joi = require("joi");
const validateRequest = require("./common.validation");
const { validateRequestForUpdates } = require("./common.validation");

const schema = Joi.object({
	lessonName: Joi.string().required(),
	medium: Joi.string().required(),
	class: Joi.number().required(),
	board: Joi.string().required(),
	levels: Joi.string().required(),
	subject: Joi.string().required(),
	semester: Joi.string().required(),
	chapterId: Joi.string().required(),
	subTopics: Joi.array().items(Joi.string()),
	resources: Joi.array().required(),
	additionalResources: Joi.array().optional(),
	learningOutcomes: Joi.array(),
	isAll: Joi.boolean(),
});

const validateMasterResource = validateRequest(schema);

// Admin edit of an ingested resource plan. Every field is optional, but the
// body must carry at least one. `chapterId` stays out: a resource plan cannot
// move to a different chapter through this route.
const updateSchema = Joi.object({
	lessonName: Joi.string(),
	medium: Joi.string(),
	class: Joi.number(),
	board: Joi.string(),
	levels: Joi.string(),
	subject: Joi.string(),
	semester: Joi.string(),
	subTopics: Joi.array().items(Joi.string()),
	resources: Joi.array(),
	additionalResources: Joi.array(),
	learningOutcomes: Joi.array(),
	isAll: Joi.boolean(),
}).min(1);

const validateMasterResourceUpdate = validateRequestForUpdates(updateSchema);

module.exports = {
	validateMasterResource,
	validateMasterResourceUpdate,
	schema,
};
