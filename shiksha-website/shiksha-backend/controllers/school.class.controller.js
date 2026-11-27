const handleError = require("../helper/handleError.js");
const ClassManager = require("../managers/school.class.manager.js");
const BaseController = require("./base.controller.js");
const { intersectFilters } = require("../helper/scope.helper");

/** @extends {BaseController<ClassManager>} */
class ClassController extends BaseController {
	constructor() {
		super(new ClassManager());
	}

	async getAll(req, res) {
		req.query.filter = intersectFilters(req.query.filter, await this.manager.classScope(req.permissions));
		return super.getAll(req, res);
	}

	async getGroupClassesByBoard(req, res) {
		let { schoolId } = req.params;

		let result = await this.manager.getGroupClassesByBoard(schoolId, req.permissions);

		if (result.success) {
			return res.status(200).json(result);
		}

		handleError(result, res);
	}

	async update(req, res) {
		const { id } = req.params;
		const result = await this.manager.updateClass(id, req.body, req.permissions);
		if (!result.success) {
			return res.status(404).json({ message: result.message });
		}
		return res.status(200).json(result.data);
	}
}

module.exports = ClassController;
