const handleError = require("../helper/handleError.js");
const QuestionManager = require("../managers/question.manager.js");
const BaseController = require("./base.controller.js");

/** @extends {BaseController<QuestionManager>} */
class QuestionController extends BaseController {
	constructor() {
		super(new QuestionManager(), ["text"]);
	}

	async bulkUpload(req, res) {
		try {
			const dryRun =
				req.query.dryRun === "true" || req.body.dryRun === true;

			const result = await this.manager.bulkUpload(req.body.rows, dryRun);

			if (result.success) {
				return res.status(200).json(result);
			}

			handleError(result, res);

			return;
		} catch (err) {
			console.error("Error --> QuestionController -> bulkUpload()", err);
			return res.status(500).json({
				success: false,
				message: err?.message || "Internal server error",
			});
		}
	}

	async adminCreate(req, res) {
		try {
			const result = await this.manager.bulkUpload([req.body], false);

			if (result.success) {
				return res.status(200).json(result);
			}

			handleError(result, res);

			return;
		} catch (err) {
			console.error("Error --> QuestionController -> adminCreate()", err);
			return res.status(500).json({
				success: false,
				message: err?.message || "Internal server error",
			});
		}
	}
}

module.exports = QuestionController;
