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
	 */
	constructor(manager, searchFields) {
		/** @protected @type {TManager} */
		this.manager = manager;
		/** @protected @type {string[]} */
		this.searchFields = searchFields || ["identity.name", "identity.phone"];
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

		if (includeDeleted === '2') {
			status = { isDeleted: true };
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
		try {
			let result = await this.manager.adminUpdate(req);

			if (result.success) {
				return res.status(200).json(result);
			}

			handleError(result, res);

			return;
		} catch (err) {
			console.error("Error --> BaseController -> adminUpdate()", err);
			return res.status(500).json({
				success: false,
				message: err?.message || "Internal server error",
			});
		}
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
