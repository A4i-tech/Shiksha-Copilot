const handleError = require("../helper/handleError.js");
const SubjectManager = require("../managers/subject.manager.js");
const BaseController = require("./base.controller.js");

/** @extends {BaseController<SubjectManager>} */
class SubjectController extends BaseController {
	constructor() {
		super(new SubjectManager());
	}

	async update(req, res) {
		try {
			const { id } = req.params;
			const result = await this.manager.updateSubject(id, req.body);
			if (!result.success) {
				return res.status(404).json({ message: result.message });
			}
			return res.status(200).json(result.data);
		} catch (err) {
			console.log("Error --> SubjectController -> update()", err);
			return res.status(400).json(err);
		}
	}
}

module.exports = SubjectController;