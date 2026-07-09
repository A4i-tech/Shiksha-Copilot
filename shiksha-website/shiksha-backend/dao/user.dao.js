const User = require("../models/user.model.js");
const BaseDao = require("./base.dao.js");
const userAggregation = require("../aggregation/user.aggregation.js");
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;
const UserActivityLogs = require("../models/user.activity.logs.model.js")

function normalizedPhone(phone) {
	const digits = String(phone || "").replace(/\D/g, "");
	return digits.length === 12 && digits.startsWith("91") ? digits.slice(2) : digits;
}

class UserDao extends BaseDao {
	constructor() {
		super(User);
	}

	async getUsersBySchoolId(schoolId) {
		try {
			const users = await User.find({ "profiles.teacher.school": new ObjectId(schoolId) })
			return users;
		} catch (err) {
			console.log("Error --> UserDao -> getUsersBySchoolId()", err);
			throw err;
		}
	}

	async getAll(
		page = 1,
		limit,
		filters = {},
		sort = {},
		status
	) {
		try {
			let processedFilters = { ...filters, ...status };

			// List kind: teacher vs staff (explicit profile, not a permission proxy).
			if (processedFilters.profileType === "teacher") {
				processedFilters["profiles.teacher.school"] = { $exists: true, $ne: null };
				delete processedFilters.profileType;
			} else if (processedFilters.profileType === "admin") {
				processedFilters["profiles.admin"] = { $exists: true, $type: "object" };
				delete processedFilters.profileType;
			}

			const pathMap = {
				school: "profiles.teacher.school",
				state: "profiles.teacher.state",
				zone: "profiles.teacher.zone",
				district: "profiles.teacher.district",
				block: "profiles.teacher.block",
				zones: "profiles.admin.zones",
				districts: "profiles.admin.districts",
			};

			for (const key of Object.keys(filters)) {
				if (key === "profileType") continue;
				if (key === "role") {
					const value = filters.role;
					processedFilters.roles = {
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
			const user = await User.findById(userId).populate("roles").populate("profiles.teacher.school","name facilities medium board")
			return user;
		} catch (err) {
			console.log("Error --> UserDao -> getById()", err);
			throw err;
		}
	}

	async getByPhone(phone, includeSecrets) {
		try {
			let query = User.findOne({ "identity.normalizedPhone": normalizedPhone(phone) }).populate("roles").populate("profiles.teacher.school", "_id name")
			if (includeSecrets) query = query.select("+otp +rememberMeToken +loginAttempts +recovery");
			return query;
		} catch (err) {
			console.log("Error -> UserDao -> getByPhone", err);
		}
	}

	async update(id, data, session = null) {
		try {
			if (data.identity) data.identity.normalizedPhone = normalizedPhone(data.identity.phone);
			const result = await User.findOneAndUpdate(
				{ _id: id },
				{ $set: data },
				{ new: true, useFindAndModify: false, runValidators: true, session: session }
			).populate("roles");
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
			).populate("roles").populate("profiles.teacher.school", "_id name");

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
