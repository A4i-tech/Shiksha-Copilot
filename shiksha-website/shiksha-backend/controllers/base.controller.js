const handleError = require("../helper/handleError");
const mongoose = require("mongoose");
const { intersectFilters } = require("../helper/scope.helper");
const escapeRegExp = require("lodash/escapeRegExp");
const { CONTENT_STATUS } = require("../constants/content-status");
const ObjectId = mongoose.Types.ObjectId;

const ASSIGNED_FILTERS = new Map([
	["assigned", { $ne: null }],
	["unassigned", null],
]);

/**
 * @template TManager
 */
class BaseController {
	/**
	 * @param {TManager} manager
	 * @param {string[]} [searchFields] fields the `search` query matches, defaults to the user identity fields
	 * @param {boolean} [hasContentStatus] true for the admin content-management entities (chapter, lesson plan, resource, question), which carry a draft/under_review/approved `status` field alongside `isDeleted`
	 */
	constructor(manager, searchFields, hasContentStatus) {
		/** @protected @type {TManager} */
		this.manager = manager;
		/** @protected @type {string[]} */
		this.searchFields = searchFields || ["identity.name", "identity.phone"];
		/** @protected @type {boolean} */
		this.hasContentStatus = !!hasContentStatus;
	}

	// Returns the manager.getAll arguments for a list request, or { error } for a bad filter.
	listArgs(req) {
		const {
			page = 1,
			limit,
			filter = {},
			sortBy = "createdAt",
			sortOrder = "desc",
			search,
			includeDeleted,
		} = req.query;
		const sortOrderObject =
			sortOrder === "desc" ? { [sortBy]: -1 } : { [sortBy]: 1 };

		const searchFilter = {};

		if (search) {
			const regexExpressions = this.searchFields.map((field) => ({
				[field]: { $regex: new RegExp(escapeRegExp(search), "i") },
			}));

			if (!isNaN(parseInt(search))) {
				regexExpressions.push({ schoolId: parseInt(search) });
			}

			searchFilter.$or = regexExpressions;
		}

		const { assigned, ...transformedFilter } = filter;
		for (const key of this.hasContentStatus ? ["_id", "assignedTo"] : ["_id"]) {
			if (!transformedFilter[key]) continue;
			try {
				transformedFilter[key] = new ObjectId(transformedFilter[key]);
			} catch (err) {
				console.error(`Invalid ${key} format`);
				return { error: `Invalid ${key} format` };
			}
		}
		// An explicit assignedTo wins, so the curator scope cannot be widened by `assigned`.
		if (this.hasContentStatus && !transformedFilter.assignedTo && ASSIGNED_FILTERS.has(assigned)) {
			transformedFilter.assignedTo = ASSIGNED_FILTERS.get(assigned);
		}
		const mergedFilter = intersectFilters(transformedFilter, searchFilter);

		let status = {};

		if (this.hasContentStatus && includeDeleted === '3') {
			// Draft tab: an admin sees own drafts, a curator sees every draft of the assigned chapters.
			status = { isDeleted: true, status: CONTENT_STATUS.DRAFT };
			if (!req.curatorScope) status.createdBy = req?.user?._id;
		} else if (this.hasContentStatus && includeDeleted === '4') {
			// Ready for review tab: every admin sees this, awaiting approval.
			status = { isDeleted: true, status: CONTENT_STATUS.UNDER_REVIEW };
		} else if (includeDeleted === '2') {
			status = this.hasContentStatus
				// Deleted tab: soft-deleted content that was live, not a draft or a review awaiting approval.
				? { isDeleted: true, status: { $nin: [CONTENT_STATUS.DRAFT, CONTENT_STATUS.UNDER_REVIEW] } }
				: { isDeleted: true };
		} else if (includeDeleted === '0') {
			status = { isDeleted: { $ne: true } };
		}

		return {
			args: [
				parseInt(page),
				parseInt(limit),
				mergedFilter,
				sortOrderObject,
				status,
				req?.user?._id,
			],
		};
	}

	async getAll(req, res) {
		const { args, error } = this.listArgs(req);
		if (error) return res.status(400).json({ error });

		const result = await this.manager.getAll(...args);

		if (result.success) {
			return res.status(200).json(result);
		}

		handleError(result, res);
	}

	async getById(req, res) {
		let result = await this.manager.getById(req);

		if (result.success) {
			return res.status(200).json(result);
		}

		handleError(result, res);
	}

	async create(req, res) {
		let result = await this.manager.create(req);

		if (result.success) {
			return res.status(200).json(result);
		}

		handleError(result, res);
	}

	async update(req, res) {
		let result = await this.manager.update(req);

		if (result.success) {
			return res.status(200).json(result);
		}

		handleError(result, res);
	}

	async adminUpdate(req, res) {
		let result = await this.manager.adminUpdate(req, this.hasContentStatus);

		if (result.success) {
			return res.status(200).json(result);
		}

		handleError(result, res);
	}

	async bulkUpload(req, res, rowsField = "rows") {
		const dryRun = req.query.dryRun === "true" || req.body.dryRun === true;
		const rows = req.body[rowsField] || req.body.rows;

		const result = await this.manager.bulkUpload(rows, dryRun, req.user?._id);

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

	async delete(req, res) {
		let result = await this.manager.delete(req);

		if (result.success) {
			return res.status(200).json(result);
		}

		handleError(result, res);
	}

	async activate(req, res) {
		let result = await this.manager.activate(req);

		if (result.success) {
			return res.status(200).json(result);
		}

		handleError(result, res);
	}

	async approve(req, res) {
		let result = await this.manager.approve(req);

		if (result.success) {
			return res.status(200).json(result);
		}

		handleError(result, res);
	}


	async deactivate(req, res) {
		let result = await this.manager.deactivate(req);

		if (result.success) {
			return res.status(200).json(result);
		}

		handleError(result, res);
	}
}


module.exports = BaseController;
