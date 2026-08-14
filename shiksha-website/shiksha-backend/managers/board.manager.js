const BaseManager = require("./base.manager");
const BoardDao = require("../dao/board.dao");
const formatApiReponse = require("../helper/response");

/** @extends {BaseManager<BoardDao>} */
class BoardManager extends BaseManager {
	constructor() {
		super(new BoardDao());
	}

	async getByName(req) {
		let data = await this.dao.getByName(req.body?.name);
		if (data) return formatApiReponse(true, "", data);
		return formatApiReponse(false, "", null);
	}

	async update(req) {
		let data = await this.dao.update(req.body);
		if (data) return formatApiReponse(true, "", data);
		return formatApiReponse(false, "", null);
	}
}

module.exports = BoardManager;
