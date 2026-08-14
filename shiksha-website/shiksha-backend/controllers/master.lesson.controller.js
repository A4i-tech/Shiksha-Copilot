const handleError = require("../helper/handleError.js");
const MasterLessonManger = require("../managers/master.lesson.manager.js");
const BaseController = require("./base.controller.js");
const { hasPermission } = require("../helper/permission.helper.js");

/** @extends {BaseController<MasterLessonManger>} */
class MasterLessonController extends BaseController {
	constructor() {
		super(new MasterLessonManger());
	}

	async saveToTeacher(req, res) {
		let { _id: teacherId } = req.user;
		const permission = req.body.lessonId ? "lesson-plan.edit" : "lesson-resource.edit";
		if (!hasPermission(req.permissions, permission)) return res.status(403).json({ message: "Forbidden: You do not have the required permissions to perform this action." });

		let result = await this.manager.saveToTeacher(
			teacherId,
			req.body
		);

		if (result.success) {
			return res.status(200).json(result);
		}

		handleError(result, res);
	}

	async getActivityById(req, res) {
		const { id } = req.params;

		const result = await this.manager.getActivityById(id, req.query.activityId, req.permissions);

		if (result.success) {
			return res.status(200).json(result);
		}

		handleError(result, res);
	}

	async getByTeacher(req, res) {
		let { _id: teacherId } = req.user;
		let reqBody = req.body;
		let result = await this.manager.getByTeacher(
			teacherId,
			reqBody
		);

		if (result.success) {
			return res.status(200).json(result);
		}

		handleError(result, res);
	}

	async update(req, res) {
		let result = await this.manager.update(req);

		if (result.success) {
			return res.status(200).json(result);
		}

		handleError(result, res);
	}

	async regenerateLessonPlan(req, res) {
		const { lessonId, reason } = req.body;

		const result = await this.manager.regenerateLessonPlan({
			lessonId,
			reason,
			userId: req.user._id,
		});

		if (result.success) {
			return res.status(200).json(result.data);
		}

		handleError(result, res);
	}

	async comboScript(req, res) {
		const { board = "CBSE", medium = "English", isAll = true } = req.body;
		const result = await this.manager.comboScript(
			board,
			medium,
			isAll
		);
		if (result.success) {
			return res.status(200).json(result.data);
		}
		handleError(result, res);
	}

	async getLessonOutcomes(req, res) {
		const { chapterId,templateIds } = req.body;
		const { filters = {} } = req.query;
		const result = await this.manager.getLessonOutcomes(
			chapterId,
			templateIds,
			filters
		);

		if (result.success) {
			return res.status(200).json(result);
		}

		handleError(result, res);
	}

	async generateLessonPlan(req, res) {
		const { lessonId } = req.params;
		const { _id: teacherId } = req.user;
		const { filters = {} } = req.query;
		const result = await this.manager.generateLessonPlan(
			teacherId,
			lessonId,
			filters
		);

		if (result.success) {
			return res.status(200).json(result);
		}

		handleError(result, res);
	}

	async updateLessonPlan(req, res) {
		return res.status(200).json({ message: "Lesson plan updated successfully" });
	}

	async get5ETables(req,res) {
		const { lessonId } = req.params;
		const { _id: user_id , name : user_name }  = req.user
		const result = await this.manager.generate5ETables(
			lessonId,
			user_id,
			user_name
		);

		if (result.success) {
			return res.status(200).json(result);
		}

		handleError(result, res);
	}

	async scriptLpDump(req, res) {
		let result = await this.manager.scriptLpDump(req);

		if (result.success) {
			return res.status(200).json(result);
		}

		handleError(result, res);
	}


	async uploadMasterLesson(req, res) {
		let result = await this.manager.uploadMasterLesson(req);

		if (result.success) {
			return res.status(200).json(result);
		}

		handleError(result, res);
	}

	async uploadMasterLessonOlderVersion(req, res) {
		let result = await this.manager.uploadMasterLessonOlderVersion(req);

		if (result.success) {
			return res.status(200).json(result);
		}

		handleError(result, res);
	}

}


module.exports = MasterLessonController;
