const Joi = require("joi");
const validateRequest = require("./common.validation");

const baseBoardSchema = Joi.object({
	boardName: Joi.string().required(),
	state: Joi.string().required(),
	abbreviation: Joi.string().required()
});

const validateBoardCreate = validateRequest(baseBoardSchema);
const validateBoardUpdate = validateRequest(baseBoardSchema.keys({
	id: Joi.string().required(),
}));

module.exports = {
	validateBoardCreate,
	validateBoardUpdate,
};
