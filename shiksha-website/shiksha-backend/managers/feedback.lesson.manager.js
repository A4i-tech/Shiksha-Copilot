const BaseManager = require("./base.manager");
const LessonFeedbackDao = require("../dao/feedback.lesson.dao");
const formatApiReponse = require("../helper/response");
const AppError = require("../helper/app.error");
const { isTeacherInScope, getScopedFeedback, updateScopedFeedback, OUT_OF_SCOPE } = require("../helper/training.scope.helper");

const UPDATABLE_FIELDS = ["assessment", "feedback", "feedbackPerSets", "overallFeedbackReason", "isCompleted"];

/** @extends {BaseManager<LessonFeedbackDao>} */
class LessonFeedbackManager extends BaseManager {
	constructor() {
		super(new LessonFeedbackDao());
	}

	async create(req) {
		let { _id: teacherId } = req.user;

		let { lessonId, isCompleted } = req.body;

		let lessonFeedback = await this.dao.getByTeacherAndLessonId(
			teacherId,
			lessonId
		);

		if (!lessonFeedback) {
			let data = await this.dao.create({
				...req.body,
				teacherId,
			});

			return formatApiReponse(
				true,
				isCompleted ? "Feedback submitted!" : "Saved Feedback as Draft!",
				data
			);
		}

		if (!lessonFeedback.isCompleted) {
			let data = await this.dao.update(lessonFeedback._id, {
				...req.body,
				teacherId,
			});

			return formatApiReponse(true, isCompleted ? "Feedback submitted!" : "Saved Feedback as Draft!", data);
		}

		return formatApiReponse(
			false,
			"Feedback already submitted!",
			lessonFeedback
		);
	}

	async getByTeacher(teacherId, permissions) {
		if (!await isTeacherInScope(permissions, "content.manage", teacherId)) throw new AppError(OUT_OF_SCOPE, 403);
		const feedbacks = await this.dao.getByTeacher(teacherId);
		if (!feedbacks) {
			return formatApiReponse(false, "failed to load feedbacks", null);
		}
		return formatApiReponse(true, "", feedbacks);
	}

	getById(req) {
		return getScopedFeedback(this.dao, req);
	}

	update(id, updates, permissions) {
		return updateScopedFeedback(this.dao, id, updates, permissions, UPDATABLE_FIELDS);
	}
}

module.exports = LessonFeedbackManager;
