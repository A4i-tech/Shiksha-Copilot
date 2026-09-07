/**
 * Validation rules for the admin lesson-resource bulk upload.
 *
 * The write allow-list mirrors the required fields of the MasterResource
 * model (`models/master.resource.model.js`): lessonName, medium, semester
 * and chapterId. Every other field is optional there, so it stays optional
 * here too.
 */

const Joi = require("joi");
const { objectId } = require("./bulk.validation.helpers");

/** Maximum number of resources in one upload. */
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

/**
 * Checks the shape of one resource row.
 * @param {object} resource - resource row to check
 * @returns {{errors: string[], warnings: string[]}} the result
 */
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
