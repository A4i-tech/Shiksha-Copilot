const BaseManager = require("./base.manager");
const LessonFeedbackDao = require("../dao/feedback.lesson.dao");
const formatApiReponse = require("../helper/response");

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

	async getByTeacher(teacherId) {
		const feedbacks = await this.dao.getByTeacher(teacherId);
		if (!feedbacks) {
			return formatApiReponse(false, "failed to load feedbacks", null);
		}
		return formatApiReponse(true, "", feedbacks);
	}

	async update(id, updates) {
		const updatedFeedback = await this.dao.update(id, updates);
		if (!updatedFeedback) {
			return formatApiReponse(
				false,
				"failed to update lesson feedback",
				null
			);
		}
		return formatApiReponse(true, "", updatedFeedback);
	}
}

module.exports = LessonFeedbackManager;
