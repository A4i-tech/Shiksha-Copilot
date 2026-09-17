const School = require("../models/school.model.js");
const BaseDao = require("./base.dao.js");

/** @extends {BaseDao<typeof School>} */
class SchoolDao extends BaseDao {
	constructor() {
		super(School);
	}

	getCursor(filters, sort) {
		return School.find(filters).sort(sort).lean().cursor({ batchSize: 100 });
	}

	async getBySchoolId(data) {
		let result = await this.Model.findOne({
			schoolId: data,
		});
		return result;
	}

	async update(id, updates, session = null) {
		const result = await this.Model.findOneAndUpdate(
			{
				_id: id,
				isDeleted: false,
			},
			{
				$set: updates,
			},
			{ new: true, useFindAndModify: false, session: session }
		);
		return result;
	}
}

module.exports = SchoolDao;
