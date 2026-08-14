const handleError = require("../helper/handleError.js");
const SchoolManager = require("../managers/school.manager.js");
const BaseController = require("./base.controller.js");
const dbService = require("../config/db");
const { permissionScopeFilter, intersectFilters } = require("../helper/scope.helper");

/** @extends {BaseController<SchoolManager>} */
class SchoolController extends BaseController {
	constructor() {
		super(new SchoolManager());
	}

	getAll(req, res) {
		req.query.filter = intersectFilters(req.query.filter || {}, permissionScopeFilter(req.permissions, "school.list"));
		return super.getAll(req, res);
	}

	async create(req, res) {
		let db = await dbService.getConnection();
		const session = await db.startSession();

		let result = await this.manager.create(req, session);

		await session.endSession();

		if (result.success) {
			return res.status(200).json(result);
		}

		handleError(result, res);
	}

	async update(req, res) {
		const { id } = req.params;
		let result = await this.manager.update(id, req.body, req.permissions);

		if (result.success) {
			return res.status(200).json(result);
		}
		handleError(result, res);
	}

	async updateFacility(req, res) {
		const { id } = req.params;
		let result = await this.manager.updateFacility(id, req.body, req.permissions);

		if (result.success) {
			return res.status(200).json(result);
		}
		handleError(result, res);
	}

	async bulkUpload(req, res) {
		const userId = req.user._id;
		const userName = req.user.identity.name;
		if (!req.file) {
			return res.status(400).json({ error: "File not provided" });
		}
		const result = await this.manager.bulkUpload(req.file.buffer, userId.toString(), userName, req.permissions);
		if (result.success)
			return res.status(200).json(result);

		handleError(result, res);
	}

	async export(req,res){
		const result = await this.manager.exportSchool(req);
		if (result.success) {
			return res.status(200).json(result);
		}

		handleError(result, res);
	}
}

module.exports = SchoolController;
