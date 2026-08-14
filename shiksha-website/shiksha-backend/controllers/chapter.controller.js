const ChapterManager = require("../managers/chapter.manager");
const BaseController = require("./base.controller");
const handleError = require("../helper/handleError")

/** @extends {BaseController<ChapterManager>} */
class ChapterController extends BaseController {
	constructor() {
		super(new ChapterManager());
	}

	async getBySemester(req, res){
		const {
			filter = {},
		} = req.query;

		const transformedFilter = { ...filter };
		const result = await this.manager.getBySemester(transformedFilter);
		if (result.success) {
			return res.status(200).json(result);
		}

		handleError(result, res);
	}

	async scriptFromLp(req, res) {
		let result = await this.manager.scriptFromLp(req);

		if (result.success) {
			return res.status(200).json(result);
		}

		handleError(result, res);
	}


	async updateChapter(req, res) {
		let result = await this.manager.updateChapter(req);

		if (result.success) {
			return res.status(200).json(result);
		}

		handleError(result, res);
	}



}

module.exports = ChapterController;
