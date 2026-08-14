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
	 */
	constructor(manager) {
		/** @protected @type {TManager} */
		this.manager = manager;
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
			const searchFields = ["identity.name", "identity.phone"];

			const regexExpressions = searchFields.map((field) => ({
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
			status = { isDeleted: false };
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
