const formatApiReponse = require("../helper/response");
const RegeneratedLessonResourceDao = require("../dao/regenerate.log.dao");
const exportExcel = require("../helper/excel.export.helper");
const startAuditJob = require("../helper/audit.job.helper");
const { permissionScopeFilter, intersectFilters } = require("../helper/scope.helper");
const escapeRegExp = require("lodash/escapeRegExp");

function activityFilters(query) {
  const { filter = {}, search } = query;
  const searchFilter = search ? { $or: ["user.identity.name", "user.school.name", "content.name", "content.topics"].map((field) => ({ [field]: { $regex: new RegExp(escapeRegExp(search), "i") } })) } : {};
  return intersectFilters(filter, searchFilter);
}

class ContentActivityManager {
  constructor() {
    this.regeneratedLogDao = new RegeneratedLessonResourceDao();
  }

  async getContentActivity(page, limit, query, sort, grants) {
    try {
      const filters = intersectFilters(activityFilters(query), permissionScopeFilter(grants, "content.activity.view", "user.school"));
      const result = await this.regeneratedLogDao.getContentActivity(page, limit, filters, sort);
      return formatApiReponse(true, "", result);
    } catch (err) {
      return formatApiReponse(false, err.message, err);
    }
  }

  async exportContentActivity(req) {
    const userId = String(req.user._id);
    const userName = req.user.identity.name;

    try {
      const scopeFilter = permissionScopeFilter(req.permissions, "content.activity.export", "user.school");
      const filters = intersectFilters(activityFilters(req.query), scopeFilter);
      const auditLog = await startAuditJob("Content Activity Export", userId, userName, () => exportExcel({
        filename: `Content-Activity-Export-${userId}--${Date.now()}`,
        worksheets: [{
          name: "ContentActivity",
          rows: this.regeneratedLogDao.getContentActivityCursor(filters),
          columns: [
            { header: "Teacher Name", key: "userName", width: 30 },
            { header: "Content generated", key: "genContent", width: 50 },
            { header: "Generated Date", key: "createdAt", width: 30 },
            { header: "Status", key: "teacherLessonPlanStatus", width: 15 },
          ],
          toRow: (activity) => activity,
        }],
      }));

      return formatApiReponse(true, "Content activity export started.", { auditLogId: auditLog._id });
    } catch (err) {
      return formatApiReponse(false, err.message, err);
    }
  }
}

module.exports = ContentActivityManager;
