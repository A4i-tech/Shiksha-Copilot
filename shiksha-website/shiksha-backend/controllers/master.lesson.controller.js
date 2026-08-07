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
		try {
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

			return;
		} catch (err) {
			console.log("Error --> MasterLessonController -> saveToTeacher()", err);
			return res.status(400).json(err);
		}
	}

	async getActivityById(req, res) {
		try {
			const { id } = req.params;
	
			const result = await this.manager.getActivityById(id, req.query.activityId, req.permissions);
	
			if (result.success) {
				return res.status(200).json(result);
			}
	
			handleError(result, res);
			return;
		} catch (err) {
			console.log("Error --> MasterLessonController -> getActivityById()", err);
			return res.status(400).json(err);
		}
	}

	async getByTeacher(req, res) {
		try {
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

			return;
		} catch (err) {
			console.log("Error --> MasterLessonController -> getByTeacher()", err);
			return res.status(400).json(err);
		}
	}

	async update(req, res) {
		try {
			let result = await this.manager.update(req);

			if (result.success) {
				return res.status(200).json(result);
			}

			handleError(result, res);

			return;
		} catch (err) {
			console.log("Error --> MasterLessonController -> update()", err);
			return res.status(400).json(err);
		}
	}

	async regenerateLessonPlan(req, res) {
		try {
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

			return;
		} catch (err) {
			console.log(
				"Error --> MasterLessonController -> regenerateLessonPlan()",
				err
			);
			return res.status(400).json(err);
		}
	}

	async comboScript(req, res) {
		try {
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
			return;
		} catch (err) {
			console.log("Error --> MasterLessonController -> comboScript()", err);
			return res.status(400).json(err);
		}
	}

	async getLessonOutcomes(req, res) {
		try {
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
			return;
		} catch (err) {
			console.log(
				"Error --> MasterLessonController -> getLessonOutcomes()",
				err
			);
			return res.status(400).json(err);
		}
	}

	async generateLessonPlan(req, res) {
		try {
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
			return;
		} catch (err) {
			console.log(
				"Error --> MasterLessonController -> generateLessonPlan()",
				err
			);
			return res.status(400).json(err);
		}
	}

	async updateLessonPlan(req, res) {
        try {
            return res.status(200).json({ message: "Lesson plan updated successfully" });
        } catch (err) {
            console.log("Error --> MasterLessonController -> updateLessonPlan()", err);
            return res.status(400).json(err);
        }
    }

	async get5ETables(req,res)
	{
		try {
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
			return;
		} catch (err) {
			console.log(
				"Error --> MasterLessonController -> generate5ETables",
				err
			);
			return res.status(400).json(err);
		}
	}

	async scriptLpDump(req, res) {
		try {
			let result = await this.manager.scriptLpDump(req);

			if (result.success) {
				return res.status(200).json(result);
			}

			handleError(result, res);

			return;
		} catch (err) {
			console.log("Error --> MasterLessonController -> scriptLpDump()", err);
			return res.status(400).json(err);
		}
	}


	async uploadMasterLesson(req, res) {
		try {
			let result = await this.manager.uploadMasterLesson(req);

			if (result.success) {
				return res.status(200).json(result);
			}

			handleError(result, res);

			return;
		} catch (err) {
			console.log("Error --> MasterLessonController -> uploadMasterLesson()", err);
			return res.status(400).json(err);
		}
	}

	async uploadMasterLessonOlderVersion(req, res) {
		try {
			let result = await this.manager.uploadMasterLessonOlderVersion(req);

			if (result.success) {
				return res.status(200).json(result);
			}

			handleError(result, res);

			return;
		} catch (err) {
			console.log("Error --> MasterLessonController -> uploadMasterLessonOlderVersion()", err);
			return res.status(400).json(err);
		}
	}

}


module.exports = MasterLessonController;
