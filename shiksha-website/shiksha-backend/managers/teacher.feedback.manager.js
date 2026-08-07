const BaseManager = require("./base.manager");
const TeacherResourceFeedbackDao = require("../dao/teacher.feedback.dao");
const formatApiReponse = require("../helper/response");

/** @extends {BaseManager<TeacherResourceFeedbackDao>} */
class TeacherResourceFeedbackManager extends BaseManager {
	constructor() {
		super(new TeacherResourceFeedbackDao());
	}

	async create(req) {
		try {
			let { _id: teacherId } = req.user;

			let { resourceId, isCompleted } = req.body;

			let resourceFeedback = await this.dao.getOne({
				teacherId,
				resourceId,
				isDeleted: { $ne: true },
			});

			if (!resourceFeedback) {
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
		} catch (err) {
			return formatApiReponse(false, err.message, err);
		}
	}

	async update(id, updates) {
		try {
			const updatedFeedback = await this.dao.update(
				id,
				updates
			);
			if (!updatedFeedback) {
				return formatApiReponse(false, "Feedback not found", null);
			}
			return formatApiReponse(true, "", updatedFeedback);
		} catch (err) {
			return formatApiReponse(false, err?.message, err);
		}
	}
}

module.exports = TeacherResourceFeedbackManager;
