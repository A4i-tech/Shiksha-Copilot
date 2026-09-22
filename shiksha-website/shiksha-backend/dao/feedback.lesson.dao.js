const LessonFeedback = require("../models/feedback.lesson.model");
const BaseDao = require("./base.dao.js");

/** @extends {BaseDao<typeof LessonFeedback>} */
class LessonFeedbackDao extends BaseDao {
	constructor() {
		super(LessonFeedback);
	}

	async getByTeacher(teacherId) {
		let result = await this.Model.find({ teacherId });
		return result;
	}

	async getByTeacherAndLessonId(teacherId, lessonId) {
		let result = await this.Model.findOne({
			teacherId,
			lessonId,
			isDeleted: { $ne: true },
		});
		return result;
	}

	async deleteByTeacherAndLessonId(teacherId, lessonId) {
		try {
			const result = await this.Model.findOneAndUpdate(
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
		const result = await this.Model.findOneAndUpdate(
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
