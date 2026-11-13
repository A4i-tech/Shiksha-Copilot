const Joi = require("joi");
const validateRequest = require("./common.validation");

const schema = Joi.object({
	resourceId: Joi.string(),
	teacherId: Joi.string().optional(),
	instructionSet: Joi.string().optional(),
	feedback: Joi.string().optional(),
	feedbackPerSets: Joi.object().optional(),
	overallFeedbackReason: Joi.string().allow(""),
	isCompleted: Joi.boolean().required(),
});

const validateTeacherResourceFeedback = validateRequest(schema);
const validateTeacherResourceFeedbackUpdate = validateRequest(
	schema.fork(["resourceId", "teacherId", "instructionSet"], (field) => field.strip()).options({ stripUnknown: true })
);

module.exports = {
	validateTeacherResourceFeedback,
	validateTeacherResourceFeedbackUpdate,
	schema,
};
