const User = require("../models/user.model.js");
const BaseDao = require("./base.dao.js");
const userAggregation = require("../aggregation/user.aggregation.js");
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;
const UserActivityLogs = require("../models/user.activity.logs.model.js")

class UserDao extends BaseDao {
	constructor() {
		super(User);
	}

	async getUsersBySchoolId(schoolId) {
		try {
			const users = await User.find({ "roles.dep": new ObjectId(schoolId), "profiles.teacher": { $exists: true } })
			return users;
		} catch (err) {
			console.log("Error --> UserDao -> getUsersBySchoolId()", err);
			throw err;
		}
	}

	async getAll(page, limit, filters, sort, status) {
		try {
			let processedFilters = { ...filters, ...status };

			// List kind: teacher vs staff (explicit profile, not a permission proxy).
			if (processedFilters.profileType === "teacher") {
				processedFilters["profiles.teacher"] = { $exists: true, $type: "object" };
				delete processedFilters.profileType;
			} else if (processedFilters.profileType === "admin") {
				processedFilters["profiles.admin"] = { $exists: true, $type: "object" };
				delete processedFilters.profileType;
			}

			const pathMap = {
				school: "school._id",
				state: "school.state",
				zone: "school.zone",
				district: "school.district",
				block: "school.block",
			};

			for (const key of Object.keys(filters)) {
				if (key === "profileType") continue;
				if (key === "role") {
					const value = filters.role;
					processedFilters["roles.role"] = {
						$in: (Array.isArray(value) ? value : [value]).map((role) => new ObjectId(role)),
					};
					delete processedFilters.role;
					continue;
				}
				if (key === "$or") {
					processedFilters.$or = filters.$or;
					continue;
				}
				const storedPath = pathMap[key] || key;
				let value = filters[key];
				if (key === "school") value = new ObjectId(value);
				if (Array.isArray(value)) {
					if (!value.length) {
						delete processedFilters[key];
						continue;
					}
					processedFilters[storedPath] = { $in: value };
				} else {
					processedFilters[storedPath] = value;
				}
				if (storedPath !== key) delete processedFilters[key];
			}

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
		} catch (err) {
			console.log("Error --> UserDao -> getAll()", err);
			throw err;
		}
	}

	async getById(userId) {
		try {
			const user = await User.findById(userId).populate("roles.role")
			return user;
		} catch (err) {
			console.log("Error --> UserDao -> getById()", err);
			throw err;
		}
	}

	async getByPhone(phone, includeSecrets) {
		try {
			let query = User.findOne({ "identity.phone": phone }).populate("roles.role")
			if (includeSecrets) query = query.select("+otp +rememberMeToken +loginAttempts +recovery");
			return query;
		} catch (err) {
			console.log("Error -> UserDao -> getByPhone", err);
		}
	}

	async update(id, data, session = null) {
		try {
			const result = await User.findOneAndUpdate(
				{ _id: id },
				{ $set: data },
				{ new: true, useFindAndModify: false, runValidators: true, session: session }
			).populate("roles.role");
			return result;
		} catch (err) {
			console.log("Error -> UserDao -> update", err);
			throw err;
		}
	}

	async setProfile(userId, profileData) {
		try {
			let updateData = { "profiles.teacher.isProfileCompleted": true };
			for (const [key, value] of Object.entries(profileData)) updateData[`profiles.teacher.${key}`] = value;

			const updatedUser = await User.findByIdAndUpdate(
				userId,
				{ $set: updateData },
				{ new: true, runValidators: true }
			).populate("roles.role");

			return updatedUser;
		} catch (err) {
			console.log("Error --> UserDao -> setProfile()", err);
			throw err;
		}
	}


	async activityLog(userId,data){
		try{
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


		}catch(err){
			console.log("Error --> UserDao -> activity", err);
			throw err;
		}
	}
}

module.exports = UserDao;
