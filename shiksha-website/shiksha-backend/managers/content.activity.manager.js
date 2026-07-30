const formatApiReponse = require("../helper/response");
const RegeneratedLessonResourceDao = require("../dao/regenerate.log.dao");
const { Worker } = require("worker_threads");
const path = require("path");
const { permissionScopeFilter, intersectFilters } = require("../helper/scope.helper");

class ContentActivityManager {
  constructor() {
    this.regeneratedLogDao = new RegeneratedLessonResourceDao();
  }

  async getContentActivity(page, limit, filters, sort, grants) {
    try {
      filters = intersectFilters(filters, permissionScopeFilter(grants, "content.activity.view", "user.school"));
      const result = await this.regeneratedLogDao.getContentActivity(page, limit, filters, sort);
      return formatApiReponse(true, "", result);
    } catch (err) {
      return formatApiReponse(false, err.message, err);
    }
  }

  async exportContentActivity(req) {
    try {
      const { filter = {}, search = "" } = req.query;
      const searchFilter = search ? { $or: ["user.identity.name", "user.school.name", "content.name", "content.topics"].map((field) => ({ [field]: { $regex: new RegExp(search, "i") } })) } : {};
      const scopeFilter = permissionScopeFilter(req.permissions, "content.activity.export", "user.school");
      const activities = await this.regeneratedLogDao.getAllContentActivity(intersectFilters({ ...filter, ...searchFilter }, scopeFilter));
      const worker = new Worker(path.resolve(__dirname, "../worker/exportcontentactivityworker.js"));
      worker.on("error", (err) => console.error("Content activity export worker error", { userId: String(req.user._id), error: err.message }));
      worker.on("exit", (code) => {
        if (code !== 0) console.error("Content activity export worker exited", { userId: String(req.user._id), code });
      });
      worker.postMessage({
        contentActivities: activities.results,
        userId: String(req.user._id),
        userName: req.user.identity.name,
      });
      return formatApiReponse(true, "Content activity export initiated, please verify the audit log.", "");
    } catch (err) {
      return formatApiReponse(false, err.message, err);
    }
  }
}

module.exports = ContentActivityManager;
