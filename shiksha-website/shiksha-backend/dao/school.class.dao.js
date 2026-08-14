const classAggregation = require("../aggregation/school.class.aggregation.js");
const ClassModel = require("../models/school.class.model.js");
const BaseDao = require("./base.dao.js");

class ClassDao extends BaseDao {
	constructor() {
		super(ClassModel);
	}

	async update(id, updates, session = null) {
		const result = await ClassModel.findOneAndUpdate(
			{
				_id: id,
				isDeleted: false,
			},
			{
				$set:
				{
					start : updates.start,
					end : updates.end
				}
			},
			{ new: true, useFindAndModify: false, session: session }
		);
		return result;
	}

	async getClassesBySchoolId(schoolId) {
		const classes = await classAggregation.getClassesBySchoolId(schoolId);
		return classes;
	}


	async updateOne(filter, updates, session = null) {
		const result = await ClassModel.updateOne(
			filter,
			updates,
			{ session: session }
		);
		return result;
	}

	async getGroupClassesByBoard(schoolId) {
		const classes = await classAggregation.getGroupClassesByBoard(schoolId);
		return classes;
	}
}

module.exports = ClassDao;
