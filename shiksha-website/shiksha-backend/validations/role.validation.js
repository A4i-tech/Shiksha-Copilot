const Joi = require("joi");
const { ALL_PERMISSIONS } = require("../helper/permission.helper");
const { ROLE_SCOPE_TYPES } = require("../config/role.scope");

const roleSchema = Joi.object({
  name: Joi.string().trim().min(2).required(),
  description: Joi.string().allow("", null),
  permissions: Joi.array().items(Joi.string().valid(...ALL_PERMISSIONS)).required(),
  scopeType: Joi.string().valid(...ROLE_SCOPE_TYPES).required(),
});

const updateSchema = roleSchema.fork(["name", "permissions", "scopeType"], (schema) => schema.optional()).min(1);
const validate = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body, { abortEarly: false });
  if (error) return res.status(400).json({ success: false, data: false, error: error.details.map((detail) => detail.message) });
  next();
};

module.exports = {
  validateRoleCreate: validate(roleSchema),
  validateRoleUpdate: validate(updateSchema),
};
