const Joi = require("joi");
const validateRequest = require("./common.validation");

const validateTeacherLessonPlan = (req, res, next) => {
	if (req.query.filter) {
		let filter = req.query.filter;

		if (Object.keys(filter).length > 0 && !filter.type) {
			return res.status(400).json({
				success: false,
				data: false,
				message: "Filter 'type' is required",
			});
		}
	}
	next();
};

const validateWebhook = validateRequest(
	Joi.object({
		instance_id: Joi.string().required(),
		status: Joi.string()
			.insensitive()
			.valid("pending", "running", "completed", "failed")
			.required(),
		output: Joi.when("status", {
			is: Joi.string().insensitive().valid("completed").required(),
			then: Joi.object({ sections: Joi.array().required() }).unknown(true).required(),
		}),
	}).unknown(true)
);

const validateRegenerate = validateRequest(
	Joi.object({
		regenFeedback: Joi.array()
			.items(
				Joi.object({
					type: Joi.string().required(),
					feedback: Joi.string().allow("").required(),
				}).unknown(true)
			)
			.required(),
	}).unknown(true)
);

module.exports = {
	validateTeacherLessonPlan,
	validateWebhook,
	validateRegenerate,
};
