const Joi = require('joi');
const validateRequest = require("./common.validation");

const submitSurveySchema = Joi.object({
  plans: Joi.array().items(Joi.string()).min(1).required(),
  plansOther: Joi.string().allow('').optional(),
  devices: Joi.array().items(Joi.string()).min(1).required(),
  devicesOther: Joi.string().allow('').optional(),
  weeklyLessonPlans: Joi.string().required(),
  lessonPlanComponents: Joi.array().items(Joi.string()).min(1).required(),
  otherLessonPlanComponent: Joi.string().allow('').optional(),
  lessonPlanComponentsOther: Joi.string().allow('').optional(),
  timePerLessonPlan: Joi.string().required(),
  otherTimePerLessonPlan: Joi.string().allow('').optional(),
  timePerLessonPlanOther: Joi.string().allow('').optional(),
  resourcesUsed: Joi.array().items(Joi.string()).min(1).required(),
  otherResourceUsed: Joi.string().allow('').optional(),
  resourcesUsedOther: Joi.string().allow('').optional(),
  timeForAssessments: Joi.string().required(),
  otherTimeForAssessments: Joi.string().allow('').optional(),
  timeForAssessmentsOther: Joi.string().allow('').optional(),
  questionBalance: Joi.array().items(Joi.string()).min(1).required(),
  otherQuestionBalance: Joi.string().allow('').optional(),
  questionBalanceOther: Joi.string().allow('').optional(),
  otherNotes: Joi.string().allow('').optional(),
});

const remindLaterSchema = Joi.object({}).unknown(true); // allow any fields to avoid strict route checks

const validateSubmitSurvey = validateRequest(submitSurveySchema);
const validateRemindLater = validateRequest(remindLaterSchema);

module.exports = {
  validateSubmitSurvey,
  validateRemindLater,
};
