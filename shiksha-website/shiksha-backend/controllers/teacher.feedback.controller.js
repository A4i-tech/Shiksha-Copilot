const handleError = require("../helper/handleError.js");
const TeacherResourceFeedbackManager = require("../managers/teacher.feedback.manager.js");
const BaseController = require("./base.controller.js");

/** @extends {BaseController<TeacherResourceFeedbackManager>} */
class TeacherResourceFeedbackController extends BaseController {
	constructor() {
		super(new TeacherResourceFeedbackManager());
	}

	async update(req, res) {
		try {
			const { id } = req.params;
			const result = await this.manager.update(id, req.body);
			if (!result.success) {
				return res.status(404).json({ message: result.message });
			}
			return res.status(200).json(result.data);
		} catch (err) {
			console.log("Error --> TeacherResourceFeedbackController -> update()", err);
			return res.status(400).json(err);
		}
	}
}

module.exports = TeacherResourceFeedbackController;