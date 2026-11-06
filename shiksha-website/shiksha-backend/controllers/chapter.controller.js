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
		return super.bulkUpload(req, res, "chapters");
	}

	async scriptFromLp(req, res) {
		let result = await this.manager.scriptFromLp(req);

		if (result.success) {
			return res.status(200).json(result);
		}

		handleError(result, res);
	}


	async assign(req, res) {
		const result = await this.manager.assign(req.params.id, req.body.curatorId, req.user._id);
		return res.status(200).json(result);
	}

	async unassign(req, res) {
		const result = await this.manager.unassign(req.params.id);
		return res.status(200).json(result);
	}

	async submit(req, res) {
		const result = await this.manager.submit(req.params.id, req.user._id);
		return res.status(200).json(result);
	}

	async requestChanges(req, res) {
		const result = await this.manager.requestChanges(req.params.id, req.body.comment, req.user._id);
		return res.status(200).json(result);
	}

	async curators(req, res) {
		return res.status(200).json(await this.manager.curators());
	}

	async exportCsv(req, res) {
		const { args, error } = this.listArgs(req);
		if (error) return res.status(400).json({ error });

		const [, , filters, sort, status] = args;
		const csv = await this.manager.exportCsv(filters, sort, status);
		res.setHeader("Content-Type", "text/csv; charset=utf-8");
		res.setHeader("Content-Disposition", 'attachment; filename="chapters.csv"');
		// BOM so Excel reads Kannada and Telugu text as UTF-8.
		return res.send(Buffer.concat([Buffer.from("\uFEFF"), csv]));
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
