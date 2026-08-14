const LessonPlanTemplateDao = require("../dao/lesson.plan.template.dao");
const formatApiReponse = require("../helper/response");
const BaseManager = require("./base.manager");
/** @extends {BaseManager<LessonPlanTemplateDao>} */
class LessonPlanTemplateManager extends BaseManager {
  constructor() {
    super(new LessonPlanTemplateDao());
  }

  async findAllTemplates(filter) {
    const templates = await this.dao.filter(filter);
    if (!templates) {
      return formatApiReponse(false, "Templates not found", null);
    }
    return formatApiReponse(true, "", templates);
  }
}

module.exports = LessonPlanTemplateManager;
