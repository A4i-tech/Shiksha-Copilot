const MasterSubject = require("../models/master.subject.model.js");
const BaseDao = require("./base.dao.js");
const mongoose = require("mongoose");

// --- Helpers ---
const regexExact = (val) => new RegExp(`^${String(val).trim()}$`, "i");
const str = (val) => String(val || "").trim();

class MasterSubjectDao extends BaseDao {
	constructor() {
		super(MasterSubject);
	}

	async resolveSubjectName(identifier) {
		if (mongoose.Types.ObjectId.isValid(identifier)) {
			const subjectDoc = await MasterSubject.findById(identifier)
				.select("name")
				.lean();
			return subjectDoc ? subjectDoc.name : str(identifier);
		}
		const subjectDoc = await MasterSubject.findOne({
			$or: [{ name: identifier }, { subjectName: regexExact(identifier) }],
		})
			.select("name")
			.lean();

		return subjectDoc ? subjectDoc.name : str(identifier);
	}

	async resolveSubjectContext(identifier) {
		let subjectCode = str(identifier);
		let targetSubjectIds = [];

		if (mongoose.Types.ObjectId.isValid(identifier)) {
			const subjectDoc = await MasterSubject.findById(identifier)
				.select("name")
				.lean();
			if (subjectDoc) {
				subjectCode = subjectDoc.name;
				const relatedSubjects = await MasterSubject.find({ name: subjectCode })
					.select("_id")
					.lean();
				targetSubjectIds = relatedSubjects.map((s) => s._id);
			} else {
				targetSubjectIds = [new mongoose.Types.ObjectId(identifier)];
			}
		} else {
			const relatedSubjects = await MasterSubject.find({
				$or: [
					{ name: subjectCode },
					{ subjectName: regexExact(subjectCode) },
				],
			})
				.select("_id name")
				.lean();

			if (relatedSubjects.length > 0) {
				targetSubjectIds = relatedSubjects.map((s) => s._id);
				if (relatedSubjects[0].name) subjectCode = relatedSubjects[0].name;
			}
		}

		return { subjectCode, targetSubjectIds };
	}

	async getByNameAndBoard(subjectName, board) {
		try {
			let subject = await MasterSubject.findOne({
				subjectName: subjectName,
				boards: board,
			});

			return subject;
		} catch (err) {
			console.log("Error -> MasterSubjectDao -> getByNameAndBoard", err);
			throw err;
		}
	}

	/**
	 * Find all subjects matching a name pattern, optionally filtered by board.
	 * @param {RegExp|string} namePattern - regex or string to match name/subjectName
	 * @param {string} [board] - optional board filter
	 * @returns {Promise<Array<{_id: ObjectId}>>} matching subject IDs
	 */
	async findEnglishSubjectIds(board) {
		const filter = {
			$or: [{ name: /english/i }, { subjectName: /english/i }],
		};
		if (board) filter.boards = board;
		return MasterSubject.find(filter).select('_id').lean();
	}

	async update(id, updates, session = null) {
		try {
			const result = await MasterSubject.findOneAndUpdate(
				{
					_id: id,
					isDeleted: false,
				},
				{
					$set: {
						subject: updates.subject,
						topics: updates.topics,
						boards: updates.boards,
						medium: updates.medium,
					},
				},
				{ new: true, useFindAndModify: false, session: session }
			);
			return result;
		} catch (err) {
			console.log("Error -> MasterSubjectDao -> update", err);
			throw err;
		}
	}
}

module.exports = MasterSubjectDao;
