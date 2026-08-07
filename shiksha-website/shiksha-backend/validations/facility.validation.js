const Joi = require("joi");
const validateRequest = require("./common.validation");

const createSchema = Joi.object({
	subject: Joi.string().required(),
	type: Joi.string().required(),
	facilities: Joi.array().items(Joi.string()).required(),
});

const updateSchema = Joi.object({
	_id: Joi.string().required(),
	subject: Joi.string().required(),
	type: Joi.string().required(),
	facilities: Joi.array().items(Joi.string()).required(),
});

const validateFacilityCreate = validateRequest(createSchema);
const validateFacilityUpdate = validateRequest(updateSchema);

module.exports = {
	validateFacilityCreate,
	validateFacilityUpdate,
};
