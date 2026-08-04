const Joi = require("joi");
const { ALL_PERMISSIONS } = require("../helper/permission.helper");
const { ROLE_SCOPE_TYPES } = require("../config/role.scope");
const validateRequest = require("./common.validation");

const roleSchema = Joi.object({
  name: Joi.string().trim().min(2).required(),
  description: Joi.string().allow("", null),
  permissions: Joi.array().items(Joi.string().valid(...ALL_PERMISSIONS)).required(),
  scopeType: Joi.string().valid(...ROLE_SCOPE_TYPES).required(),
});

const updateSchema = roleSchema.fork(["name", "permissions", "scopeType"], (schema) => schema.optional()).min(1);

module.exports = {
  validateRoleCreate: validateRequest(roleSchema),
  validateRoleUpdate: validateRequest(updateSchema),
};
