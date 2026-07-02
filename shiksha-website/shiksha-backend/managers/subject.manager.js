const BaseManager = require("./base.manager");
const SubjectDao = require("../dao/subject.dao");
const formatApiReponse = require("../helper/response");

/** @extends {BaseManager<SubjectDao>} */
class SubjectManager extends BaseManager {
	constructor() {
		super(new SubjectDao());
	}

	async updateSubject(id, updates) {
		try {
			const updatedSubject = await this.dao.update(id, updates);
			if (!updatedSubject) {
				return formatApiReponse(false, "Subject not found", null);
			}
			return formatApiReponse(true, "", updatedSubject);
		} catch (err) {
			return formatApiReponse(false, err?.message, err);
		}
	}
}

module.exports = SubjectManager;
