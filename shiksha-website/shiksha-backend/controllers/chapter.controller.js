const ChapterManager = require("../managers/chapter.manager");
const BaseController = require("./base.controller");
const handleError = require("../helper/handleError")

/** @extends {BaseController<ChapterManager>} */
class ChapterController extends BaseController {
	constructor() {
		super(new ChapterManager());
	}

	async getBySemester(req, res){
		try {
			const {
				filter = {},
			} = req.query;

			const transformedFilter = { ...filter };
			const result = await this.manager.getBySemester(transformedFilter);
			if (result.success) {
				return res.status(200).json(result);
			}

			handleError(result, res);

			return;
		} catch (err) {
			console.log("Error --> BaseController -> getAll()", err);
			return res.status(400).json(err);
		}
	}

	async scriptFromLp(req, res) {
		try {
			let result = await this.manager.scriptFromLp(req);

			if (result.success) {
				return res.status(200).json(result);
			}

			handleError(result, res);

			return;
		} catch (err) {
			console.log("Error --> BaseController -> scriptFromLp()", err);
			return res.status(400).json(err);
		}
	}


	async updateChapter(req, res) {
		try {
			let result = await this.manager.updateChapter(req);

			if (result.success) {
				return res.status(200).json(result);
			}

			handleError(result, res);

			return;
		} catch (err) {
			console.log("Error --> ChapterController -> updateChapter()", err);
			return res.status(400).json(err);
		}
	}



}

module.exports = ChapterController;
