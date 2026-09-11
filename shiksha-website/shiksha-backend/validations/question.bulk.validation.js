// Question model itself requires nothing; text is required here anyway since a question with no text is unusable
const Joi = require("joi");
const { objectId } = require("./bulk.validation.helpers");

const MAX_ROWS = 500;

const uploadRowSchema = Joi.object({
	text: Joi.string().required(),
	subject: Joi.string().allow(""),
	medium: Joi.string().allow(""),
	class: Joi.string().allow(""),
	chapterId: objectId,
	chapter: Joi.object({
		chapterNumber: Joi.number(),
		title: Joi.string(),
	}),
	groupHeading: Joi.string().allow(""),
	answerType: Joi.string().allow(""),
	difficulty: Joi.string().allow(""),
	marksPerQuestion: Joi.number(),
	keyAnswer: Joi.string().allow(""),
	options: Joi.array(),
	pairs: Joi.array(),
	items: Joi.array(),
	correctOrderById: Joi.array().items(Joi.number()),
	correctOrderIndices: Joi.array().items(Joi.number()),
});

const rowsSchema = Joi.array().items(Joi.object()).min(1).max(MAX_ROWS);

const bulkUploadSchema = Joi.object({
	rows: rowsSchema,
	dryRun: Joi.boolean(),
});

function checkRow(question) {
	const errors = [];

	const { error } = uploadRowSchema.validate(question, {
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
