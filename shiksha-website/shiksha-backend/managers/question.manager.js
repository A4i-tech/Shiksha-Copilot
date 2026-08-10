const BaseManager = require("./base.manager");
const QuestionDao = require("../dao/question.dao");

/**
 * Manager for single questions in the question pool.
 * The question-bank manager works on generated papers and on the blueprint.
 * This manager gives the admin content-management screens a route to one
 * question document.
 *
 * @extends {BaseManager<QuestionDao>}
 */
class QuestionManager extends BaseManager {
	constructor() {
		super(new QuestionDao());
	}
}

module.exports = QuestionManager;
