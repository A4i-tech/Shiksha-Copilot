const ChapterManager = require("../managers/chapter.manager");
const BaseController = require("./base.controller");
const handleError = require("../helper/handleError")

class ChapterController extends BaseController {
	constructor() {
		super(new ChapterManager());
		this.chapterManager = new ChapterManager();
	}

	async getAll(req, res) {
		try {
			const {
				page = 1,
				limit,
				filter = {},
				sortBy = "createdAt",
				sortOrder = "desc",
				lang,
			} = req.query;

			const sortOrderObject =
				sortOrder === "desc" ? { [sortBy]: -1 } : { [sortBy]: 1 };

			const result = await this.chapterManager.getAll(
				parseInt(page),
				parseInt(limit),
				{ ...filter },
				sortOrderObject,
				{},
				null,
				lang
			);

			if (result.success) {
				return res.status(200).json(result);
			}

			handleError(result, res);
			return;
		} catch (err) {
			console.log("Error --> ChapterController -> getAll()", err);
			return res.status(400).json(err);
		}
	}

	async getBySemester(req, res){
		try {
			const {
				filter = {},
				lang,
			} = req.query;

			const transformedFilter = { ...filter };
			const result = await this.chapterManager.getBySemester(transformedFilter, lang);
			if (result.success) {
				return res.status(200).json(result);
			}

			handleError(result, res);

			return;
		} catch (err) {
			console.log("Error --> ChapterController -> getBySemester()", err);
			return res.status(400).json(err);
		}
	}

	async scriptFromLp(req, res) {
		try {
			let result = await this.chapterManager.scriptFromLp(req);

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
			let result = await this.chapterManager.updateChapter(req);

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
