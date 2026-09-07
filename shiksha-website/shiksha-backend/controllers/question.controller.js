const QuestionManager = require("../managers/question.manager.js");
const BaseController = require("./base.controller.js");

/** @extends {BaseController<QuestionManager>} */
class QuestionController extends BaseController {
	constructor() {
		super(new QuestionManager(), ["text"]);
	}
}

module.exports = QuestionController;
