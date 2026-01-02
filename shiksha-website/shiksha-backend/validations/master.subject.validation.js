const Joi = require("joi");
const validateRequest = require("./common.validation");

const applicableClassesSchema = Joi.object({
	board: Joi.string().required(),
	classes: Joi.array().items(Joi.number().integer().min(1).max(12)).required(),
});

const schema = Joi.object({
	subjectName: Joi.string().min(3).required(),
	name: Joi.string().min(3).optional(), // Auto-derived from subjectName if not provided
	sem: Joi.number().integer().min(0).max(4).optional(), // Auto-derived from subjectName if not provided
	boards: Joi.array().items(Joi.string().required()).min(1).required(),
	applicableClasses: Joi.array().items(applicableClassesSchema).optional(),
	isDeleted: Joi.boolean().optional(),
});

const validateMasterSubject = validateRequest(schema);

module.exports = {
	validateMasterSubject,
	schema,
};
