const Joi = require("joi");
const CHARTS = require("../config/analytics.charts.json");
const { FIELD_ROLES } = require("../helper/dashboard.boards");
const validateRequest = require("./common.validation");

const boardSchema = Joi.object({
  boardKey: Joi.string().min(1).required(),
  chartKeys: Joi.array().items(Joi.string().valid(...CHARTS.map((chart) => chart.key))).unique().min(1).required(),
  desktopUuid: Joi.string().uuid().required(),
  mobileUuid: Joi.string().uuid().allow(null).optional().default(null),
  roles: Joi.array().items(Joi.string().valid(...FIELD_ROLES)).unique().min(1),
});

module.exports = {
  validateBoardSave: validateRequest(boardSchema),
};
