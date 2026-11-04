const Joi = require("joi");
const validateRequest = require("./common.validation");

const validateAbsentByBatch = validateRequest(Joi.object({ batchId: Joi.string().hex().length(24).required() }), "params");

module.exports = { validateAbsentByBatch };
