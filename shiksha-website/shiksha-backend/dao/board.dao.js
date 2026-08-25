const Board = require("../models/board.model.js");
const BaseDao = require("./base.dao.js");

/** @extends {BaseDao<typeof Board>} */
class BoardDao extends BaseDao {
	constructor() {
		super(Board);
	}

	async getByName(name) {
		let board = await this.Model.findOne({ boardName: name, isDeleted: false });
		if (board) return board;
		return false;
	}

	async getByAbbreviation(abbreviation) {
		let board = await this.Model.findOne({ abbreviation, isDeleted: false });
		if (board) return board;
		return false;
	}

	async update(data, session = null) {
		const result = await this.Model.findOneAndUpdate(
			{
				_id: data?.id,
				isDeleted: false,
			},
			{
				$set: {
					boardName: data?.boardName,
					state: data?.state,
				},
			},
			{ new: true, useFindAndModify: false, session: session }
		);
		return result;
	}
}

module.exports = BoardDao;
