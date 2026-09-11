const handleError = require("../helper/handleError");
const mongoose = require("mongoose");
const { intersectFilters } = require("../helper/scope.helper");
const escapeRegExp = require("lodash/escapeRegExp");
const ObjectId = mongoose.Types.ObjectId;

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

	async getAll(req, res) {
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

		const transformedFilter = { ...filter };
		if (transformedFilter._id) {
			try {
				transformedFilter._id = new ObjectId(transformedFilter._id);
			} catch (err) {
				console.error("Invalid _id format:", transformedFilter._id);
				return res.status(400).json({ error: "Invalid _id format" });
			}
		}
		const mergedFilter = intersectFilters(transformedFilter, searchFilter);

		let status = {};

		if (this.hasContentStatus && includeDeleted === '3') {
			// Draft tab: content only its own author can see, awaiting a send for review.
			status = { isDeleted: true, status: "draft", createdBy: req?.user?._id };
		} else if (this.hasContentStatus && includeDeleted === '4') {
			// Ready for review tab: every admin sees this, awaiting approval.
			status = { isDeleted: true, status: "under_review" };
		} else if (includeDeleted === '2') {
			status = this.hasContentStatus
				// Deleted tab: soft-deleted content that was live, not a draft or a review awaiting approval.
				? { isDeleted: true, status: { $nin: ["draft", "under_review"] } }
				: { isDeleted: true };
		} else if (includeDeleted === '0') {
			status = { isDeleted: { $ne: true } };
		}
		const result = await this.manager.getAll(
			parseInt(page),
			parseInt(limit),
			mergedFilter,
			sortOrderObject,
			status,
			req?.user?._id
		);

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


	async deactivate(req, res) {
		let result = await this.manager.deactivate(req);

		if (result.success) {
			return res.status(200).json(result);
		}

		handleError(result, res);
	}
}


module.exports = BaseController;
