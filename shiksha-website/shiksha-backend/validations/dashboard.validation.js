const Joi = require("joi");
const CHARTS = require("../config/analytics.charts.json");
const validateRequest = require("./common.validation");

const boardSchema = Joi.object({
  boardKey: Joi.string().trim().min(1).required(),
  chartKeys: Joi.array().items(Joi.string().valid(...CHARTS.map((chart) => chart.key))).min(1).required(),
  desktopUuid: Joi.string().uuid().required(),
  mobileUuid: Joi.string().uuid().allow(null).required(),
});

module.exports = {
  validateBoardSave: validateRequest(boardSchema),
};
