const Joi = require("joi");
const validateRequest = require("./common.validation");

const shape = {
	teacherId: Joi.string().required(),
	subject: Joi.string().required(),
	scheduleType: Joi.string().required(),
	isDeleted: Joi.boolean(),
	class: Joi.number().required(),
	board: Joi.string().required(),
	medium: Joi.string().required(),
	section: Joi.string().optional(),
	lessonId: Joi.string().required(),
	topic: Joi.string(),
	schoolId: Joi.string(),
	subTopic: Joi.string(),
	otherClass: Joi.string().allow(""),
	scheduleDateTime: Joi.array()
		.items({
			date: Joi.date(),
			fromTime: Joi.string(),
			toTime: Joi.string(),
		})
		.required(),
};

const scheduleSchemaCreate = Joi.object({
	...shape,
});

const scheduleSchemaUpdate = Joi.object({
	...shape,
	_id: Joi.string().required(),
});

const validateScheduleCreate = validateRequest(scheduleSchemaCreate);
const validateScheduleUpdate = validateRequest(scheduleSchemaUpdate);

module.exports = {
	validateScheduleCreate,
	validateScheduleUpdate,
};
