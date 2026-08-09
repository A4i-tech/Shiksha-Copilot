const mongoose = require("mongoose");
const AppError = require("../helper/app.error");

class BaseDao {
	constructor(model) {
		this.Model = model;
	}

	async getAll(
		page = 1,
		limit,
		filters = {},
		sort = {},
		status
	) {
		let processedFilters = { ...filters, ...status }

		const pipeline = [
			{ $match: processedFilters }
		];

		// Only add $sort stage if sort object has keys
		if (sort && Object.keys(sort).length > 0) {
			pipeline.push({ $sort: sort });
		}

		if (limit > 0) {
			pipeline.push(
				{ $skip: (page - 1) * limit },
				{ $limit: limit }
			);
		}

		const results = await this.Model.aggregate(pipeline);

		const totalItems = await this.Model.countDocuments(processedFilters);

		return {
			page,
			totalItems,
			limit: limit > 0 ? limit : totalItems,
			results,
		};
	}

	async filter(filter) {
		return this.Model.find(filter);
	}

	async getOne(filter) {
		return this.Model.findOne(filter);
	}

	async getById(id) {
		if (!id || !mongoose.Types.ObjectId.isValid(id)) {
			return null;
		}
		return this.Model.findOne({ _id: id });
	}

	async create(data, session = null) {
		let model = new this.Model(data);
		return model.save(session ? { session } : {});
	}

	async delete(id, session = null) {
		if (!id || !mongoose.Types.ObjectId.isValid(id)) {
			throw new AppError("Invalid ID for delete operation", 400);
		}
		return this.Model.findByIdAndUpdate(
			id,
			{
				$set: {
					isDeleted: true,
				},
			},
			{
				new: true,
				runValidators: true,
				session: session,
			}
		);
	}

	async activate(id) {
		if (!id || !mongoose.Types.ObjectId.isValid(id)) {
			throw new AppError("Invalid ID for activate operation", 400);
		}
		return this.Model.findByIdAndUpdate(
			id,
			{
				$set: {
					isDeleted: false,
				},
			},
			{
				new: true,
			}
		);
	}

	reserveLoginAttempt(id, attemptedAt, limit) {
		return this.Model.findOneAndUpdate(
			{ _id: id, [`loginAttempts.${limit - 1}`]: { $exists: false } },
			{ $push: { loginAttempts: attemptedAt } },
			{ new: true }
		).select("+loginAttempts");
	}

	clearLoginAttempts(id) {
		return this.Model.findByIdAndUpdate(id, { $set: { loginAttempts: [] } });
	}

	reserveRecovery(id, recovery, cooldownAt) {
		return this.Model.findOneAndUpdate(
			{ _id: id, $or: [{ "recovery.sentAt": { $exists: false } }, { "recovery.sentAt": { $lt: cooldownAt } }] },
			{ $set: { recovery } }
		);
	}

	reserveRecoveryAttempt(id) {
		return this.Model.findOneAndUpdate(
			{ _id: id, "recovery.attempts": { $lt: 3 } },
			{ $inc: { "recovery.attempts": 1 } },
			{ new: true }
		).select("+recovery");
	}

	clearRecovery(id) {
		return this.Model.findByIdAndUpdate(id, { $unset: { recovery: 1 } });
	}

}

module.exports = BaseDao;
