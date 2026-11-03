const BaseManager = require("./base.manager");
const TeacherResourceFeedbackDao = require("../dao/teacher.feedback.dao");
const formatApiReponse = require("../helper/response");
const { getScopedFeedback, updateScopedFeedback } = require("../helper/training.scope.helper");

const UPDATABLE_FIELDS = ["feedback", "feedbackPerSets", "overallFeedbackReason", "isCompleted"];

/** @extends {BaseManager<TeacherResourceFeedbackDao>} */
class TeacherResourceFeedbackManager extends BaseManager {
	constructor() {
		super(new TeacherResourceFeedbackDao());
	}

	async create(req) {
		let { _id: teacherId } = req.user;

		let { resourceId, isCompleted } = req.body;

		let resourceFeedback = await this.dao.getOne({
			teacherId,
			resourceId,
		});

		if (!resourceFeedback) {
			let data = await this.dao.create({
				...req.body,
				teacherId,
				resourceId,
				isDeleted: false,
			});

			return formatApiReponse(
				true,
				isCompleted ? "Feedback submitted!" : "Saved Feedback as Draft!",
				data
			);
		}

		if (!resourceFeedback.isCompleted) {
			let data = await this.dao.update(
				resourceFeedback._id,
				{
					...req.body,
					teacherId,
				}
			);

			return formatApiReponse(true, isCompleted ? "Feedback submitted!" : "Saved Feedback as Draft!", data);
		}

		return formatApiReponse(
			false,
			"Feedback already submitted!",
			resourceFeedback
		);
	}

	getById(req) {
		return getScopedFeedback(this.dao, req);
	}

	update(id, updates, permissions) {
		return updateScopedFeedback(this.dao, id, updates, permissions, UPDATABLE_FIELDS);
	}
}

module.exports = TeacherResourceFeedbackManager;
