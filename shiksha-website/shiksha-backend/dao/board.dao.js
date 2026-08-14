const Board = require("../models/board.model.js");
const BaseDao = require("./base.dao.js");

class BoardDao extends BaseDao {
	constructor() {
		super(Board);
	}

	async getByName(name) {
		let board = await Board.findOne({ boardName: name, isDeleted: false });
		if (board) return board;
		return false;
	}

	async getByAbbreviation(abbreviation) {
		let board = await Board.findOne({ abbreviation, isDeleted: false });
		if (board) return board;
		return false;
	}

	async update(data, session = null) {
		const result = await Board.findOneAndUpdate(
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
