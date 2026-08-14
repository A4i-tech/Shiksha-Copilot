const Facility = require("../models/facility.model");
const BaseDao = require("./base.dao");

class FacilityDao extends BaseDao {
	constructor() {
		super(Facility);
	}

	async getById(id) {
		let result = await this.Model.findOne({ _id: id, isDeleted: false });
		return result;
	}

	async update(data, session = null) {
		const result = await Facility.findOneAndUpdate(
			{
				_id: data?._id,
				isDeleted: false,
			},
			{
				$set: data,
			},
			{ new: true, useFindAndModify: false, session: session }
		);
		return result;
	}
}

module.exports = FacilityDao;
