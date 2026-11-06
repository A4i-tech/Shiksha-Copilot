const handleError = require("../helper/handleError.js");
const TeacherResourceFeedbackManager = require("../managers/teacher.feedback.manager.js");
const BaseController = require("./base.controller.js");
const { intersectFilters } = require("../helper/scope.helper");
const { teacherScopeFilter } = require("../helper/training.scope.helper");

/** @extends {BaseController<TeacherResourceFeedbackManager>} */
class TeacherResourceFeedbackController extends BaseController {
	constructor() {
		super(new TeacherResourceFeedbackManager());
	}

	async getAll(req, res) {
		req.query.filter = intersectFilters(req.query.filter, await teacherScopeFilter(req.permissions, "content.manage"));
		return super.getAll(req, res);
	}

	async update(req, res) {
		const { id } = req.params;
		const result = await this.manager.update(id, req.body, req.permissions);
		if (!result.success) {
			return res.status(404).json({ message: result.message });
		}
		return res.status(200).json(result.data);
	}
}

module.exports = TeacherResourceFeedbackController;