const User = require("../models/user.model.js");
const BaseDao = require("./base.dao.js");
const userAggregation = require("../aggregation/user.aggregation.js");
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;
const UserActivityLogs = require("../models/user.activity.logs.model.js")

function mapFilters(filters) {
	const mapped = {};
	const pathMap = {
		school: "school._id",
		state: "school.state",
		zone: "school.zone",
		district: "school.district",
		block: "school.block",
	};
	for (const [key, value] of Object.entries(filters)) {
		if (key === "$and" || key === "$or" || key === "$nor") {
			mapped[key] = value.map(mapFilters);
		} else if (key === "profileType") {
			mapped[`profiles.${value}`] = { $exists: true, $type: "object" };
		} else if (key === "role") {
			mapped["roles.role"] = { $in: [].concat(value).map((role) => new ObjectId(role)) };
		} else if (!Array.isArray(value) || value.length) {
			const path = pathMap[key] || key;
			const converted = [].concat(value).map((item) => key === "school" ? new ObjectId(item) : item);
			mapped[path] = Array.isArray(value) ? { $in: converted } : converted[0];
		}
	}
	return mapped;
}

/** @extends {BaseDao<typeof User>} */
class UserDao extends BaseDao {
	constructor() {
		super(User);
	}

	async getUsersBySchoolId(schoolId) {
		const users = await this.Model.find({ "roles.dep": new ObjectId(schoolId), "profiles.teacher": { $exists: true } })
		return users;
	}

	async getAll(page, limit, filters, sort, status) {
		const processedFilters = { ...mapFilters(filters), ...status };

		let results = await userAggregation.getUserList(page,
			limit,
			processedFilters,
			sort);

		const totalItems =
			results[0].totalCount.length > 0 ? results[0].totalCount[0].count : 0;

		const result = {
			page,
			totalItems,
			limit: limit > 0 ? limit : totalItems,
			results: results[0].data,
		};

		return result;
	}

	async getById(userId) {
		const user = await this.Model.findById(userId).populate("roles.role")
		return user;
	}

	async getByPhone(phone, includeSecrets) {
		try {
			let query = this.Model.findOne({ "identity.phone": phone }).populate("roles.role")
			if (includeSecrets) query = query.select("+otp +rememberMeToken +loginAttempts +recovery");
			return query;
		} catch (err) {
			console.log("Error -> UserDao -> getByPhone", err);
		}
	}

	async update(id, data, session = null) {
		const result = await this.Model.findOneAndUpdate(
			{ _id: id },
			{ $set: data },
			{ new: true, useFindAndModify: false, runValidators: true, session: session }
		).populate("roles.role");
		return result;
	}

	async setProfile(userId, profileData) {
		let updateData = { "profiles.teacher.isProfileCompleted": true };
		for (const [key, value] of Object.entries(profileData)) updateData[`profiles.teacher.${key}`] = value;

		const updatedUser = await this.Model.findOneAndUpdate(
			{ _id: userId, "profiles.teacher": { $exists: true } },
			{ $set: updateData },
			{ new: true, runValidators: true }
		).populate("roles.role");

		return updatedUser;
	}

	async activityLog(userId,data){
		const { planId, draftId, idleTime, interactionTime, moduleName, isCompleted } = data;

		if (draftId) {
			let activityLog = await UserActivityLogs.findOne({ draftId , userId});

			if (activityLog) {
				activityLog.idleTime = (activityLog.idleTime || 0) + idleTime;
				activityLog.interactionTime = (activityLog.interactionTime || 0) + interactionTime;
				activityLog.isCompleted = isCompleted;

				if (isCompleted) {
					activityLog.draftId = undefined;
				}

				await activityLog.save();
				return activityLog
			} else {
				activityLog = new UserActivityLogs({
					planId,
					draftId,
					idleTime,
					interactionTime,
					moduleName,
					userId,
					isCompleted
				});

				await activityLog.save();
				return activityLog
			}
		} else if(planId)
			{
				const activityLog = new UserActivityLogs({
					planId,
					idleTime,
					interactionTime,
					moduleName,
					userId
				});

				await activityLog.save();
				return activityLog
			}
		else {
			const activityLog = new UserActivityLogs({
				idleTime,
				interactionTime,
				moduleName,
				userId
			});

			await activityLog.save();
			return activityLog
		}
	}
}

module.exports = UserDao;
