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

	async resolveSubjectContext(identifier, board) {
		let subjectCode = str(identifier);
		let targetSubjectIds = [];
		const boardFilter = { boards: board };

		if (mongoose.Types.ObjectId.isValid(identifier)) {
			const subjectDoc = await MasterSubject.findById(identifier)
				.select("name")
				.lean();
			if (subjectDoc) {
				subjectCode = subjectDoc.name;
				const relatedSubjects = await MasterSubject.find({
					name: subjectCode,
					...boardFilter,
				})
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
				...boardFilter,
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
		let subject = await MasterSubject.findOne({
			subjectName: subjectName,
			boards: board,
		});

		return subject;
	}

	async update(id, updates, session = null) {
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
	}
}

module.exports = MasterSubjectDao;
