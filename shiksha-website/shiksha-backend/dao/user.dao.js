const User = require("../models/user.model");
const BaseDao = require("./base.dao");
const userAggregation = require("../aggregation/user.aggregation");
const UserActivityLogs = require("../models/user.activity.logs.model");
const mongoose = require("mongoose");
const Role = require("../models/role.model");

function normalizedPhone(phone) {
  const digits = String(phone || "").replace(/\D/g, "");
  return digits.length === 12 && digits.startsWith("91") ? digits.slice(2) : digits;
}

class UserDao extends BaseDao {
  constructor() {
    super(User);
  }

  async getUsersBySchoolId(schoolId) {
    return User.find({ "profiles.teacher.school": schoolId });
  }

  async getAll(page, limit, filters, sort, status) {
    const processedFilters = { ...filters, ...status };
    if (processedFilters.rolePermission) {
      processedFilters.roles = { $in: (await Role.find({ $or: [{ permissions: processedFilters.rolePermission }, { isSuperUser: true }], isDeleted: false }).select("_id")).map((role) => role._id) };
      delete processedFilters.rolePermission;
    }
    const pathMap = {
      role: "roles",
      school: "profiles.teacher.school",
      state: "profiles.teacher.state",
      zone: "profiles.teacher.zone",
      district: "profiles.teacher.district",
      block: "profiles.teacher.block",
      zones: "profiles.admin.zones",
      districts: "profiles.admin.districts",
    };
    for (const [inputPath, storedPath] of Object.entries(pathMap)) {
      if (processedFilters[inputPath] === undefined) continue;
      let value = processedFilters[inputPath];
      if (["school", "role"].includes(inputPath)) {
        value = Array.isArray(value)
          ? value.map((item) => mongoose.Types.ObjectId.isValid(item) ? new mongoose.Types.ObjectId(item) : item)
          : mongoose.Types.ObjectId.isValid(value) ? new mongoose.Types.ObjectId(value) : value;
      }
      processedFilters[storedPath] = Array.isArray(value) ? { $in: value } : value;
      delete processedFilters[inputPath];
    }
    const [result] = await userAggregation.getUserList(page, limit, processedFilters, sort);
    const totalItems = result.totalCount[0]?.count || 0;
    return {
      page,
      totalItems,
      limit: limit > 0 ? limit : totalItems,
      results: result.data,
    };
  }

  async getById(userId) {
    return User.findById(userId).populate("roles").populate("profiles.teacher.school", "name facilities medium board");
  }

  async getByPhone(phone, includeSecrets) {
    let query = User.findOne({ "identity.normalizedPhone": normalizedPhone(phone) }).populate("roles").populate("profiles.teacher.school", "_id name");
    if (includeSecrets) query = query.select("+otp +rememberMeToken +loginAttempts +recovery");
    return query;
  }

  async update(id, data, session) {
    if (data.identity?.phone) data.identity.normalizedPhone = normalizedPhone(data.identity.phone);
    return User.findByIdAndUpdate(id, { $set: data }, { new: true, runValidators: true, session }).populate("roles");
  }

  async setProfile(userId, profileData) {
    const user = await User.findById(userId);
    if (!user) return null;
    return this.update(userId, { "profiles.teacher": { ...profileData, isProfileCompleted: true } });
  }

  async activityLog(userId, data) {
    const { planId, draftId, idleTime, interactionTime, moduleName, isCompleted } = data;
    if (draftId) {
      let activityLog = await UserActivityLogs.findOne({ draftId, userId });
      if (activityLog) {
        activityLog.idleTime = (activityLog.idleTime || 0) + idleTime;
        activityLog.interactionTime = (activityLog.interactionTime || 0) + interactionTime;
        activityLog.isCompleted = isCompleted;
        if (isCompleted) activityLog.draftId = undefined;
        await activityLog.save();
        return activityLog;
      }
    }
    return UserActivityLogs.create({
      planId,
      draftId,
      idleTime,
      interactionTime,
      moduleName,
      userId,
      isCompleted,
    });
  }
}

module.exports = UserDao;
