const Joi = require("joi");

const phoneNumberPattern = /^[6789]\d{9}$/;
const objectId = Joi.string().hex().length(24);

const identitySchema = Joi.object({
	name: Joi.string().min(2).required(),
	phone: Joi.string().pattern(phoneNumberPattern).required(),
	email: Joi.string().email().allow("", null),
	address: Joi.string().allow("", null),
});

const teacherProfileSchema = Joi.object({
	state: Joi.string().required(),
	zone: Joi.string().required(),
	district: Joi.string().required(),
	block: Joi.string().required(),
	school: Joi.string().required(),
	preferredLanguage: Joi.string().valid("en", "kn"),
	facilities: Joi.array(),
	classes: Joi.array(),
	isProfileCompleted: Joi.boolean(),
});

const adminProfileSchema = Joi.object({
	state: Joi.string().allow("", null),
	zones: Joi.array().items(Joi.string()),
	districts: Joi.array().items(Joi.string()),
});

const profilesSchema = Joi.object({
	teacher: teacherProfileSchema,
	admin: adminProfileSchema,
}).or("teacher", "admin");

const userSchema = Joi.object({
	identity: identitySchema.required(),
	roles: Joi.array().items(objectId).min(1).required(),
	profiles: profilesSchema.required(),
	isDeleted: Joi.boolean(),
});

const bulkUploadSchema = Joi.object({
	identity: identitySchema,
	roles: Joi.array().items(objectId).min(1).required(),
	profiles: Joi.object({
		teacher: Joi.object({
			school: Joi.alternatives().try(Joi.string(), Joi.number()).required(),
			preferredLanguage: Joi.string().valid("en", "kn"),
			facilities: Joi.array(),
			classes: Joi.array(),
			isProfileCompleted: Joi.boolean(),
		}).required(),
	}).required(),
})

const validatePreferredLanguageUpdate = (req, res, next) => {
	const data = req.body;

	const schema = Joi.object({
		preferredLanguage: Joi.string().valid("en", "kn").required(),
	});

	let isValid = schema.validate(data, { abortEarly: false });

	if (isValid.error) {
		return res.status(400).json({
			success: false,
			data: false,
			error: isValid.error.details.map((i) => i.message),
		});
	}
	next();
};

const validateUserCreate = (req, res, next) => {
	const data = req.body;

	let isValid = userSchema.validate(data, { abortEarly: false });

	if (isValid.error) {
		return res.status(400).json({
			success: false,
			data: false,
			error: isValid.error.details.map((i) => i.message),
		});
	}
	next();
};

const validateUserGetByPhone = (req, res, next) => {
	const data = req.body;

	const schema = Joi.object({
		phone: Joi.string().pattern(phoneNumberPattern).required(),
	});
	let isValid = schema.validate(data);
	if (isValid.error) {
		return res.status(400).json({
			success: false,
			data: false,
			error: isValid.error.details.map((i) => i.message),
		});
	}
	next();
};

const validateUserUpdate = (req, res, next) => {
	const data = req.body;

	const schema = Joi.object({
		identity: identitySchema,
		roles: Joi.array().items(objectId).min(1),
		profiles: profilesSchema,
		isDeleted: Joi.boolean(),
		isSchoolChanged: Joi.boolean(),
	}).min(1);

	let isValid = schema.validate(data, { abortEarly: false });

	if (isValid.error) {
		return res.status(400).json({
			success: false,
			data: false,
			error: isValid.error.details.map((i) => i.message),
		});
	}
	next();
};

const classSchema = Joi.object({
	class: Joi.number().required(),
	board: Joi.string().required(),
	medium: Joi.string().required(),
	section: Joi.string().optional(),
	subject: Joi.string().required(),
	sem: Joi.number().required(),
	name: Joi.string().required(),
});

const profileSchema = Joi.object({
	preferredLanguage: Joi.string().valid("en", "kn"),
	classes: Joi.array().items(classSchema),
	facilities: Joi.array().items(),
});

const validateSetProfile = (req, res, next) => {
	const data = req.body;

	const { error } = profileSchema.validate(data, { abortEarly: false });

	if (error) {
		return res.status(400).json({
			success: false,
			data: false,
			error: error.details.map((i) => i.message),
		});
	}
	next();
};

const validateUserActivityLog = (req,res,next)=>{
	const data = req.body;
	const schema = Joi.object({
		moduleName:Joi.string().required(),
		idleTime:Joi.number().required(),
		interactionTime:Joi.number().required(),
		draftId:Joi.string().allow("", null),
		planId:Joi.string().allow("", null),
		isCompleted:Joi.boolean().optional(),
	})

	const {error} = schema.validate(data);

	if(error){
		return res.status(400).json({
			success: false,
			data: false,
			error: error.details.map((i) => i.message),
		});
	}
	next()
}

module.exports = {
	userSchema,
	bulkUploadSchema,
	validateUserCreate,
	validateUserGetByPhone,
	validateUserUpdate,
	validateSetProfile,
	validatePreferredLanguageUpdate,
	validateUserActivityLog
};
