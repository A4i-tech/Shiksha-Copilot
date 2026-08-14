const FacilityDao = require("../dao/facility.dao");
const formatApiReponse = require("../helper/response");
const BaseManager = require("./base.manager");

/** @extends {BaseManager<FacilityDao>} */
class FacilityManager extends BaseManager {
	constructor() {
		super(new FacilityDao());
	}

	async update(req) {
		let data = await this.dao.update(req.body);
		if (data) return formatApiReponse(true, "", data);
		return formatApiReponse(false, "failed to update facilities", null);
	}
}

module.exports = FacilityManager;
