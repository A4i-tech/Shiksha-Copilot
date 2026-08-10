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

	/**
	 * Validates an uploaded chapter file and, unless the caller asks for a dry
	 * run, writes the chapters. The response carries one report line per row.
	 * A failed row blocks the whole file, so the answer is 400 and nothing is
	 * saved.
	 */
	async bulkUpload(req, res) {
		try {
			const dryRun =
				req.query.dryRun === "true" || req.body.dryRun === true;

			const result = await this.manager.bulkUpload(
				req.body.chapters || req.body.rows,
				dryRun
			);

			if (result.success) {
				return res.status(200).json(result);
			}

			handleError(result, res);

			return;
		} catch (err) {
			console.log("Error --> ChapterController -> bulkUpload()", err);
			return res.status(400).json(err);
		}
	}

	/**
	 * Adds one chapter from the admin form. The check is the check that the bulk
	 * upload runs, so a form entry and a file entry cannot differ.
	 */
	async adminCreate(req, res) {
		try {
			const result = await this.manager.bulkUpload([req.body], false);

			if (result.success) {
				return res.status(200).json(result);
			}

			handleError(result, res);

			return;
		} catch (err) {
			console.log("Error --> ChapterController -> adminCreate()", err);
			return res.status(400).json(err);
		}
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
