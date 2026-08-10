const LessonPlanTemplate = require("../models/lesson.plan.template.model.js");
const BaseDao = require("./base.dao.js");
/** @extends {BaseDao<typeof LessonPlanTemplate>} */
class LessonPlanTemplateDao extends BaseDao {
  constructor() {
    super(LessonPlanTemplate);
  }
}

module.exports = LessonPlanTemplateDao;
