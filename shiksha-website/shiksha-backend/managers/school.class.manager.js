const BaseManager = require("./base.manager");
const ClassDao = require("../dao/school.class.dao");
const formatApiReponse = require("../helper/response");
const AppError = require("../helper/app.error");
const School = require("../models/school.model");
const { readableSchools, isResourceAllowed } = require("../helper/scope.helper");

const NOT_FOUND = "Record not found. Refresh the page and try again.";
const OUT_OF_SCOPE = "This class belongs to a school outside your scope. Choose a class from your own school.";

/** @extends {BaseManager<ClassDao>} */
class ClassManager extends BaseManager {
	constructor() {
		super(new ClassDao());
	}

	async classScope(permissions) {
		const schools = readableSchools(permissions);
		if (!Object.keys(schools).length) return {};
		return { schoolId: { $in: await School.distinct("_id", schools) } };
	}

	async canRead(permissions, schoolId) {
		const schools = readableSchools(permissions);
		if (!Object.keys(schools).length) return true;
		return await School.exists({ $and: [{ _id: schoolId }, schools] });
	}

	async assertCanRead(permissions, schoolId) {
		if (!await this.canRead(permissions, schoolId)) throw new AppError(OUT_OF_SCOPE, 403);
	}

	async assertCanWrite(permissions, schoolId) {
		const school = await School.findById(schoolId).lean();
		if (!school) throw new AppError("The selected school does not exist. Select an existing school and save again.", 400);
		if (!isResourceAllowed(permissions, "content.manage", school)) throw new AppError(OUT_OF_SCOPE, 403);
	}

	async getById(req) {
		const data = await this.dao.getById(req.params.id);
		if (!data || !await this.canRead(req.permissions, data.schoolId)) return formatApiReponse(false, NOT_FOUND, null);
		return formatApiReponse(true, "", data);
	}

	async getGroupClassesByBoard(schoolId, permissions) {
		await this.assertCanRead(permissions, schoolId);
		let classes = await this.dao.getGroupClassesByBoard(schoolId);

		return formatApiReponse(true, "", classes);
	}

	async updateClass(id, updates, permissions) {
		const existing = await this.dao.getById(id);
		if (!existing) return formatApiReponse(false, "Class not found", null);
		await this.assertCanWrite(permissions, existing.schoolId);
		const updatedClass = await this.dao.update(id, updates);
		return formatApiReponse(true, "", updatedClass);
	}

	async create(req) {
		await this.assertCanWrite(req.permissions, req.body.schoolId);
		return super.create(req);
	}

	async delete(req) {
		const existing = await this.dao.getById(req.params.id);
		if (!existing) return formatApiReponse(false, "Class not found", null);
		await this.assertCanWrite(req.permissions, existing.schoolId);
		return super.delete(req);
	}
}

module.exports = ClassManager;
