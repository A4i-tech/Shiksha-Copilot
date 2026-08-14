const formatApiReponse = require("../helper/response");

require("dotenv").config();

/**
 * @template TDao
 */
class BaseManager {
	/**
	 * @param {TDao} dao
	 */
	constructor(dao) {
		/** @protected @type {TDao} */
		this.dao = dao;
	}

	async getAll(
		page = 1,
		limit,
		filters = {},
		sort = {},
		status,
		userId
	) {
		let data = await this.dao.getAll(
			page,
			limit,
			filters,
			sort,
			status,
			userId
		);
		return formatApiReponse(true, "", data);
	}

	async getById(req) {
		let data = await this.dao.getById(req.params.id);
		if (data) return formatApiReponse(true, "", data);
		return formatApiReponse(false, "", data);
	}

	async create(req) {
		let data = await this.dao.create(req.body);
		return formatApiReponse(true, "success!", data);
	}

	async delete(req) {
		await this.dao.delete(req.params?.id);
		return formatApiReponse(true, "Deactivated successfully!", null);
	}

	async activate(req) {
		let data = await this.dao.activate(req.params.id);
		return formatApiReponse(true, "School is activated!", data);
	}
}


module.exports = BaseManager;
