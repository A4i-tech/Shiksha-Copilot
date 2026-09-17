const formatApiReponse = require("../helper/response");
const { CONTENT_STATUS } = require("../constants/content-status");

require("dotenv").config();

/**
 * @template TDao
 */
class BaseManager {
	/**
	 * @param {TDao} dao
	 */
	constructor(dao) {
		/** @protected @type {TDao} */
		this.dao = dao;
	}

	async getAll(
		page = 1,
		limit,
		filters = {},
		sort = {},
		status,
		userId
	) {
		let data = await this.dao.getAll(
			page,
			limit,
			filters,
			sort,
			status,
			userId
		);
		return formatApiReponse(true, "", data);
	}

	async getById(req) {
		let data = await this.dao.getById(req.params.id);
		if (data) return formatApiReponse(true, "", data);
		return formatApiReponse(false, "", data);
	}

	async create(req) {
		let data = await this.dao.create(req.body);
		return formatApiReponse(true, "success!", data);
	}

	async adminUpdate(req, allowDeletedStatusUpdate = false) {
		try {
			let data = await this.dao.adminUpdate(
				req.params?.id,
				req.body,
				null,
				allowDeletedStatusUpdate
			);
			if (!data) return formatApiReponse(false, "Record not found", null);
			return formatApiReponse(true, "Updated successfully!", data);
		} catch (err) {
			console.error("adminUpdate failed:", err);
			return formatApiReponse(false, err.message, null);
		}
	}

	withDraftMetadata(doc, userId) {
		return {
			...doc,
			status: CONTENT_STATUS.DRAFT,
			isDeleted: true,
			createdBy: userId,
		};
	}

	async finalizeBulkUpload({ Model, rows, documents, dryRun, entityLabel }) {
		const invalid = rows.filter((row) => row.errors.length > 0);

		const report = {
			dryRun,
			total: rows.length,
			valid: rows.length - invalid.length,
			invalid: invalid.length,
			inserted: 0,
			insertedIds: [],
			rows,
		};

		if (invalid.length > 0) {
			return formatApiReponse(
				false,
				`${invalid.length} of ${rows.length} ${entityLabel} failed validation. Nothing was saved.`,
				report
			);
		}

		if (dryRun) {
			return formatApiReponse(true, `All ${entityLabel} passed validation.`, report);
		}

		try {
			const saved = await Model.insertMany(documents, { ordered: true });
			report.inserted = saved.length;
			report.insertedIds = saved.map((doc) => String(doc._id));
			return formatApiReponse(true, `${saved.length} ${entityLabel} were added.`, report);
		} catch (err) {
			console.error(`bulkUpload insert failed for ${entityLabel}:`, err);
			return formatApiReponse(false, err?.message, null);
		}
	}

	async delete(req) {
		await this.dao.delete(req.params?.id);
		return formatApiReponse(true, "Deactivated successfully!", null);
	}

	async activate(req) {
		let data = await this.dao.activate(req.params.id);
		return formatApiReponse(true, "School is activated!", data);
	}
}


module.exports = BaseManager;
