const mongoose = require("mongoose");

const boardSchema = mongoose.Schema(
	{
		boardName: {
			type: String,
			required: true,
		},
		abbreviation: {
			type: String,
			required: false, // Explicitly set as optional
		},
		state: {
			type: String,
			required: true,
		},
		isDeleted: {
			type: Boolean,
			default: false,
		},
	},
	{ timestamps: true, strict: true } // Explicitly enable strict mode
);

const Board = mongoose.model("Board", boardSchema);

module.exports = Board;
