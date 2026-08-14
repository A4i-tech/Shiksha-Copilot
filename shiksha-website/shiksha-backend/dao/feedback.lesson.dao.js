const LessonFeedback = require("../models/feedback.lesson.model");
const BaseDao = require("./base.dao.js");

class LessonFeedbackDao extends BaseDao {
	constructor() {
		super(LessonFeedback);
	}

	async getByTeacher(teacherId) {
		let result = await LessonFeedback.find({ teacherId });
		return result;
	}

	async getByTeacherAndLessonId(teacherId, lessonId) {
		let result = await LessonFeedback.findOne({
			teacherId,
			lessonId,
			isDeleted: { $ne: true },
		});
		return result;
	}

	async deleteByTeacherAndLessonId(teacherId, lessonId) {
		try {
			const result = await LessonFeedback.findOneAndUpdate(
				{ teacherId, lessonId, isDeleted: { $ne: true } },
				{ $set: { isDeleted: true } },
				{ new: true, useFindAndModify: false }
			);
			return result;
		} catch (err) {
			console.log(
				"Error --> LessonFeedbackDao -> deleteByTeacherAndLessonId()",
				err
			);
			throw err;
		}
	}

	async update(id, updates, session = null) {
		const result = await LessonFeedback.findOneAndUpdate(
			{
				_id: id,
			},
			{
				$set: updates,
			},
			{ new: true, useFindAndModify: false, session: session }
		);
		return result;
	}
}

module.exports = LessonFeedbackDao;
