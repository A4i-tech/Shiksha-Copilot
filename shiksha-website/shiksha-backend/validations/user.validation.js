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
}).required();

const userSchema = Joi.object({
  identity: identitySchema.required(),
  roles: Joi.array().items(objectId).min(1).required(),
  profiles: profilesSchema,
  isDeleted: Joi.boolean(),
});

const updateSchema = Joi.object({
  identity: identitySchema.required(),
  roles: Joi.array().items(objectId).min(1).required(),
  profiles: profilesSchema,
  isDeleted: Joi.boolean(),
  isLoginAllowed: Joi.boolean(),
  isSchoolChanged: Joi.boolean(),
});

function validate(schema) {
  return (req, res, next) => {
    const { error } = schema.validate(req.body, { abortEarly: false });
    if (error) return res.status(400).json({ success: false, data: false, error: error.details.map((detail) => detail.message) });
    next();
  };
}

const classSchema = Joi.object({
  class: Joi.number().required(),
  board: Joi.string().required(),
  medium: Joi.string().required(),
  section: Joi.string(),
  subject: Joi.string().required(),
  sem: Joi.number().required(),
  name: Joi.string().required(),
});

const profileSchema = Joi.object({
  preferredLanguage: Joi.string().valid("en", "kn"),
  classes: Joi.array().items(classSchema),
  facilities: Joi.array(),
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
});

const validateUserGetByPhone = validate(Joi.object({ phone: Joi.string().pattern(phoneNumberPattern).required() }));
const validatePreferredLanguageUpdate = validate(Joi.object({ preferredLanguage: Joi.string().valid("en", "kn").required() }));

const validateUserActivityLog = validate(
  Joi.object({
    planId: Joi.string().allow("", null),
    draftId: Joi.string().allow("", null),
    idleTime: Joi.number().required(),
    interactionTime: Joi.number().required(),
    moduleName: Joi.string().required(),
    isCompleted: Joi.boolean(),
  })
);

module.exports = {
  bulkUploadSchema,
  validatePreferredLanguageUpdate,
  validateSetProfile: validate(profileSchema),
  validateUserActivityLog,
  validateUserCreate: validate(userSchema),
  validateUserGetByPhone,
  validateUserUpdate: validate(updateSchema),
};
