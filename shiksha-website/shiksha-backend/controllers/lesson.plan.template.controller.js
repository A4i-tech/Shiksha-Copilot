const handleError = require("../helper/handleError");
const LessonPlanTemplateManager = require("../managers/lesson.plan.template.manager");
const BaseController = require("./base.controller");

/** @extends {BaseController<LessonPlanTemplateManager>} */
class LessonPlanTemplateController extends BaseController {
  constructor() {
    super(new LessonPlanTemplateManager());
  }

  async findTemplates(req, res) {
    let { filter = {} } = req.query;

    filter.classes = parseInt(filter.classes);

    const result = await this.manager.findAllTemplates(
      filter
    );

    if (result.success) {
      return res.status(200).json(result);
    }

    handleError(result, res);
  }
}

module.exports = LessonPlanTemplateController;
