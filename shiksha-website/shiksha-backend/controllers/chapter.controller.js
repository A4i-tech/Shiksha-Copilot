const ChapterManager = require("../managers/chapter.manager");
const BaseController = require("./base.controller");
const handleError = require("../helper/handleError")

/** @extends {BaseController<ChapterManager>} */
class ChapterController extends BaseController {
	constructor() {
		super(new ChapterManager(), ["topics"], true);
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

	async bulkUpload(req, res) {
		const dryRun =
			req.query.dryRun === "true" || req.body.dryRun === true;

		const result = await this.manager.bulkUpload(
			req.body.chapters || req.body.rows,
			dryRun,
			req.user?._id
		);

		if (result.success) {
			return res.status(200).json(result);
		}

		handleError(result, res);
	}

	// Reuses the bulk-upload check, so a form entry and a file entry cannot differ.
	async adminCreate(req, res) {
		const result = await this.manager.bulkUpload([req.body], false, req.user?._id);

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
