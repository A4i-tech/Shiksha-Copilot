// required fields here mirror the MasterResource model's required fields; everything else stays optional to match
const Joi = require("joi");
const { objectId } = require("./bulk.validation.helpers");

const MAX_ROWS = 500;

const uploadRowSchema = Joi.object({
	lessonName: Joi.string().required(),
	medium: Joi.string().required(),
	semester: Joi.alternatives().try(Joi.string(), Joi.number()).required(),
	chapterId: objectId.required(),
	class: Joi.number().integer().min(1).max(12),
	board: Joi.string(),
	subject: Joi.string(),
	levels: Joi.string(),
	isAll: Joi.boolean(),
	subTopics: Joi.array().items(Joi.string()),
	learningOutcomes: Joi.array().items(Joi.alternatives().try(Joi.string(), Joi.object())),
	resources: Joi.array().items(Joi.object()),
	additionalResources: Joi.array().items(Joi.object()),
});

const rowsSchema = Joi.array().items(Joi.object()).min(1).max(MAX_ROWS);

const bulkUploadSchema = Joi.object({
	rows: rowsSchema,
	dryRun: Joi.boolean(),
});

function checkRow(resource) {
	const errors = [];

	const { error } = uploadRowSchema.validate(resource, {
		abortEarly: false,
		convert: false,
	});

	if (error) {
		error.details.forEach((detail) => errors.push(detail.message));
	}

	return { errors, warnings: [] };
}

module.exports = {
	bulkUploadSchema,
	checkRow,
};
