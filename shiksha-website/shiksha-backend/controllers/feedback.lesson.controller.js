const handleError = require("../helper/handleError.js");
const LessonFeedbackManager = require("../managers/feedback.lesson.manager.js");
const BaseController = require("./base.controller.js");
const { intersectFilters } = require("../helper/scope.helper");
const { teacherScopeFilter } = require("../helper/training.scope.helper");

/** @extends {BaseController<LessonFeedbackManager>} */
class LessonFeedbackController extends BaseController {
	constructor() {
		super(new LessonFeedbackManager());
	}

	async getAll(req, res) {
		req.query.filter = intersectFilters(req.query.filter, await teacherScopeFilter(req.permissions, "content.manage"));
		return super.getAll(req, res);
	}

	async getByTeacher(req, res) {
		const { teacherId } = req.params;
		const result = await this.manager.getByTeacher(teacherId, req.permissions);
		if (!result.success) {
			return handleError(result, res);
		}
		return res.status(200).json(result);
	}

	async update(req, res) {
		const { id } = req.params;
		const result = await this.manager.update(id, req.body, req.permissions);
		if (!result.success) {
			return handleError(result, res);
		}
		return res.status(200).json(result);
	}
}

module.exports = LessonFeedbackController;
