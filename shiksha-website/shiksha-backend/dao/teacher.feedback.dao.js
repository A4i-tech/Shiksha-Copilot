const TeacherResourceFeedback = require("../models/feedback.resource.model");
const BaseDao = require("./base.dao.js");

class TeacherResourceFeedbackDao extends BaseDao {
	constructor() {
		super(TeacherResourceFeedback);
	}

	async deleteByTeacherAndResourceId(teacherId, resourceId) {
		try {
			const result = await TeacherResourceFeedback.findOneAndUpdate(
				{ teacherId, resourceId, isDeleted: { $ne: true } },
				{ $set: { isDeleted: true } },
				{ new: true, useFindAndModify: false }
			);
			return result;
		} catch (err) {
			console.log(
				"Error --> TeacherResourceFeedbackDao -> deleteByTeacherAndResourceId()",
				err
			);
			throw err;
		}
	}

	async update(id, updates, session = null) {
		const result = await TeacherResourceFeedback.findOneAndUpdate(
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

module.exports = TeacherResourceFeedbackDao;