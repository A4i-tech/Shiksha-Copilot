const handleError = require("../helper/handleError.js");
const MasterResourceManager = require("../managers/master.resource.manager.js");
const BaseController = require("./base.controller.js");

/** @extends {BaseController<MasterResourceManager>} */
class MasterResourceController extends BaseController {
	constructor() {
		super(new MasterResourceManager());
	}

	async update(req, res) {
		const { id } = req.params;
		const result = await this.manager.updateMasterResource(
			id,
			req.body
		);
		if (!result.success) {
			return res.status(404).json({ message: result.message });
		}
		return res.status(200).json(result.data);
	}

	async regenerate(req, res) {
		const { resourceId, reason } = req.body;
		const result = await this.manager.regenerateResourcePlan({
			resourceId,
			reason,
			userId: req.user._id,
		});
		if (!result.success) {
			return res.status(404).json({ message: result.message });
		}
		return res.status(200).json(result.data);
	}

	async comboScript(req, res) {
		const { board = "CBSE", medium = "English" } = req.body;
		const result = await this.manager.comboScript(
			board,
			medium
		);
		if (result.success) {
			return res.status(200).json(result.data);
		}
		handleError(result, res);
	}

	async getSubtopicResourceList(req, res) {
		const { chapterId, templateIds } = req.body;
		const result = await this.manager.getSubtopicResourceList(
			chapterId,
			templateIds
		);
		if (result) {
			return res.status(200).json(result);
		}
		handleError(result, res);
	}

	async generateResourcePlan(req, res) {
		const { resourceId } = req.params;
		const { _id: teacherId } = req.user;
		const { filters = {} } = req.query;

		const result = await this.manager.generateResourcePlan(
			teacherId,
			resourceId,
			filters
		);

		if (result.success) {
			return res.status(200).json(result);
		}

		handleError(result, res);
	}

	async uploadMasterResource(req, res) {
		let result = await this.manager.uploadMasterResources(req);

		if (result.success) {
			return res.status(200).json(result);
		}

		handleError(result, res);
	}

	async uploadOldMasterResource(req, res) {
		let result = await this.manager.uploadOldMasterResources(req);

		if (result.success) {
			return res.status(200).json(result);
		}

		handleError(result, res);
	}
}

module.exports = MasterResourceController;
