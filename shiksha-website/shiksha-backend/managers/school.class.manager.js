const BaseManager = require("./base.manager");
const ClassDao = require("../dao/school.class.dao");
const formatApiReponse = require("../helper/response");

/** @extends {BaseManager<ClassDao>} */
class ClassManager extends BaseManager {
	constructor() {
		super(new ClassDao());
	}

	async getGroupClassesByBoard(schoolId) {
		try {
			let classes = await this.dao.getGroupClassesByBoard(schoolId);

			return formatApiReponse(true, "", classes);
		} catch (err) {
			return formatApiReponse(false, err?.message, err);
		}
	}

	async updateClass(id, updates) {
		try {
			const updatedClass = await this.dao.update(id, updates);
			if (!updatedClass) {
				return formatApiReponse(false, "Class not found", null);
			}
			return formatApiReponse(true, "", updatedClass);
		} catch (err) {
			return formatApiReponse(false, err?.message, err);
		}
	}
}

module.exports = ClassManager;
