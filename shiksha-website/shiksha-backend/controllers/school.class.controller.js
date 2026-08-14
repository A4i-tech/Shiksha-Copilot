const handleError = require("../helper/handleError.js");
const ClassManager = require("../managers/school.class.manager.js");
const BaseController = require("./base.controller.js");

/** @extends {BaseController<ClassManager>} */
class ClassController extends BaseController {
	constructor() {
		super(new ClassManager());
	}

	async getGroupClassesByBoard(req, res) {
		let { schoolId } = req.params;

		let result = await this.manager.getGroupClassesByBoard(schoolId);

		if (result.success) {
			return res.status(200).json(result);
		}

		handleError(result, res);
	}

	async update(req, res) {
		const { id } = req.params;
		const result = await this.manager.updateClass(id, req.body);
		if (!result.success) {
			return res.status(404).json({ message: result.message });
		}
		return res.status(200).json(result.data);
	}
}

module.exports = ClassController;
