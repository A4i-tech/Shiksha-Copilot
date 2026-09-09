const handleError = require("../helper/handleError.js");
const QuestionManager = require("../managers/question.manager.js");
const BaseController = require("./base.controller.js");

/** @extends {BaseController<QuestionManager>} */
class QuestionController extends BaseController {
	constructor() {
		super(new QuestionManager(), ["text"], true);
	}

	async bulkUpload(req, res) {
		const dryRun =
			req.query.dryRun === "true" || req.body.dryRun === true;

		const result = await this.manager.bulkUpload(req.body.rows, dryRun, req.user?._id);

		if (result.success) {
			return res.status(200).json(result);
		}

		handleError(result, res);
	}

	async adminCreate(req, res) {
		const result = await this.manager.bulkUpload([req.body], false, req.user?._id);

		if (result.success) {
			return res.status(200).json(result);
		}

		handleError(result, res);
	}
}

module.exports = QuestionController;
