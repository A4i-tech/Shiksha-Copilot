const Joi = require("joi");
const validateRequest = require("./common.validation");

const phoneNumberPattern = /^[6789]\d{9}$/;
const objectId = Joi.string().hex().length(24);
const regionDependency = Joi.object({
	state: Joi.string().required(),
	zone: Joi.string(),
	district: Joi.string(),
	block: Joi.string(),
});
const roleAssignment = Joi.object({
	_id: objectId,
	roleId: objectId.required(),
	dep: Joi.alternatives().try(objectId, regionDependency).allow(null),
});

const identitySchema = Joi.object({
	name: Joi.string().min(2).required(),
	phone: Joi.string().pattern(phoneNumberPattern).required(),
	email: Joi.string().email().allow("", null),
	address: Joi.string().allow("", null),
});

const teacherProfileSchema = Joi.object({
	facilities: Joi.array(),
	classes: Joi.array(),
	isProfileCompleted: Joi.boolean(),
});

const adminProfileSchema = Joi.object({
	state: Joi.string().allow("", null),
});

const profilesSchema = Joi.object({
	teacher: teacherProfileSchema,
	admin: adminProfileSchema,
}).or("teacher", "admin");

const userSchema = Joi.object({
	identity: identitySchema.required(),
	roles: Joi.array().items(roleAssignment).min(1).required(),
	profiles: profilesSchema.required(),
	preferredLanguage: Joi.string().valid("en", "kn", "tg"),
});

const bulkUploadSchema = Joi.object({
	identity: identitySchema.required(),
	roles: Joi.array().items(roleAssignment).min(1).required(),
	profiles: Joi.object({ teacher: teacherProfileSchema.required() }).required(),
});

const validatePreferredLanguageUpdate = validateRequest(Joi.object({ preferredLanguage: Joi.string().valid("en", "kn", "tg").required() }));
const validateUserCreate = validateRequest(userSchema);
const validateUserGetByPhone = validateRequest(Joi.object({ phone: Joi.string().pattern(phoneNumberPattern).required() }));

const validateUserList = (req, res, next) => {
	const isValid = Joi.object({
		filter: Joi.object({ profileType: Joi.string().valid("teacher", "admin").required() }).unknown(true).required(),
	}).unknown(true).validate(req.query);
	if (isValid.error) return res.status(400).json({ success: false, data: false, error: isValid.error.details.map((i) => i.message) });
	next();
};

const validateUserUpdate = validateRequest(Joi.object({
	identity: identitySchema,
	roles: Joi.array().items(roleAssignment).min(1),
	profiles: profilesSchema,
}).min(1));

const classSchema = Joi.object({
	class: Joi.number().required(),
	board: Joi.string().required(),
	medium: Joi.string().required(),
	section: Joi.string().optional(),
	subject: Joi.string().required(),
	sem: Joi.number().required(),
	name: Joi.string().required(),
	boysStrength: Joi.number().integer().min(0),
	girlsStrength: Joi.number().integer().min(0),
});

const profileSchema = Joi.object({
	classes: Joi.array().items(classSchema),
	facilities: Joi.array(),
});

const validateSetProfile = validateRequest(profileSchema);
const validateUserActivityLog = validateRequest(Joi.object({
	moduleName: Joi.string().required(),
	idleTime: Joi.number().required(),
	interactionTime: Joi.number().required(),
	draftId: Joi.string().allow("", null),
	planId: Joi.string().allow("", null),
	isCompleted: Joi.boolean(),
}));

module.exports = {
	userSchema,
	bulkUploadSchema,
	validateUserCreate,
	validateUserGetByPhone,
	validateUserList,
	validateUserUpdate,
	validateSetProfile,
	validatePreferredLanguageUpdate,
	validateUserActivityLog
};
