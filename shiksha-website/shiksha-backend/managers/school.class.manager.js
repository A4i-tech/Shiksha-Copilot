const BaseManager = require("./base.manager");
const ClassDao = require("../dao/school.class.dao");
const formatApiReponse = require("../helper/response");
const AppError = require("../helper/app.error");
const School = require("../models/school.model");
const { getPermission } = require("../helper/permission.helper");
const { permissionScopeFilter, isResourceAllowed } = require("../helper/scope.helper");

const { NOT_FOUND } = require("../helper/training.scope.helper");
const OUT_OF_SCOPE = "This class belongs to a school outside your scope. Choose a class from your own school.";

/** @extends {BaseManager<ClassDao>} */
class ClassManager extends BaseManager {
	constructor() {
		super(new ClassDao());
	}

	readableSchools(permissions) {
		const scoped = ["school.read", "school.list"]
			.filter((permission) => getPermission(permissions, permission))
			.map((permission) => permissionScopeFilter(permissions, permission));
		if (scoped.some((filter) => !Object.keys(filter).length)) return {};
		return scoped.length ? { $or: scoped } : { _id: { $in: [] } };
	}

	async classScope(permissions) {
		const schools = this.readableSchools(permissions);
		if (!Object.keys(schools).length) return {};
		return { schoolId: { $in: await School.distinct("_id", schools) } };
	}

	async canRead(permissions, schoolId) {
		const schools = this.readableSchools(permissions);
		if (!Object.keys(schools).length) return true;
		return schoolId && await School.exists({ $and: [{ _id: schoolId }, schools] });
	}

	async assertCanRead(permissions, schoolId) {
		if (!await this.canRead(permissions, schoolId)) throw new AppError(OUT_OF_SCOPE, 403);
	}

	// A class with no school only passes for a GLOBAL grant.
	async assertCanWrite(permissions, schoolId) {
		const school = await School.findById(schoolId).lean();
		if (!isResourceAllowed(permissions, "content.manage", school || {})) throw new AppError(OUT_OF_SCOPE, 403);
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
		req.body.schoolId = req.body.school_id;
		await this.assertCanWrite(req.permissions, req.body.schoolId);
		return super.create(req);
	}

	async delete(req) {
		const existing = await this.dao.getById(req.params.id);
		if (existing) await this.assertCanWrite(req.permissions, existing.schoolId);
		return super.delete(req);
	}
}

module.exports = ClassManager;
