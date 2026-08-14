const handleError = require("../helper/handleError.js");
const LessonFeedbackManager = require("../managers/feedback.lesson.manager.js");
const BaseController = require("./base.controller.js");

/** @extends {BaseController<LessonFeedbackManager>} */
class LessonFeedbackController extends BaseController {
	constructor() {
		super(new LessonFeedbackManager());
	}

	async getByTeacher(req, res) {
		const { teacherId } = req.params;
		const result = await this.manager.getByTeacher(teacherId);
		if (!result.success) {
			return handleError(result, res);
		}
		return res.status(200).json(result);
	}

	async update(req, res) {
		const { id } = req.params;
		const result = await this.manager.update(id, req.body);
		if (!result.success) {
			return handleError(result, res);
		}
		return res.status(200).json(result);
	}
}

module.exports = LessonFeedbackController;
