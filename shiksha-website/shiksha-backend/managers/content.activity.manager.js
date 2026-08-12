const formatApiReponse = require("../helper/response");
const RegeneratedLessonResourceDao = require("../dao/regenerate.log.dao");
const ExcelJS = require("exceljs");
const { PassThrough } = require("stream");
const { uploadStreamToStorage } = require("../services/azure.blob.service");
const AuditLog = require("../models/audit.log.model");
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
      const activityCursor = this.regeneratedLogDao.getContentActivityCursor(intersectFilters(activityFilters(req.query), scopeFilter));
      const fileStream = new PassThrough();
      const filename = `Content-Activity-Export-${userId}--${Date.now()}`;
      const upload = uploadStreamToStorage(
        fileStream,
        filename,
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      ).catch((err) => {
        fileStream.destroy();
        throw err;
      });

      const workbook = new ExcelJS.stream.xlsx.WorkbookWriter({ stream: fileStream, useStyles: true });
      const worksheet = workbook.addWorksheet("ContentActivity");
      worksheet.columns = [
        { header: "Teacher Name", key: "userName", width: 30 },
        { header: "Content generated", key: "genContent", width: 50 },
        { header: "Generated Date", key: "createdAt", width: 30 },
        { header: "Status", key: "teacherLessonPlanStatus", width: 15 },
      ];

      const headerRow = worksheet.getRow(1);
      headerRow.height = 20;
      headerRow.eachCell((cell) => {
        cell.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "FF46A0F1" },
        };
        cell.font = {
          bold: true,
          color: { argb: "FFFFFFFF" },
          size: 12,
        };
      });
      headerRow.commit();

      const write = (async () => {
        for await (const activity of activityCursor) {
          worksheet.addRow(activity).commit();
        }
        worksheet.commit();
        await workbook.commit();
      })().catch((err) => {
        fileStream.destroy();
        throw err;
      });

      const [, fileUrl] = await Promise.all([write, upload]);

      await AuditLog.create({
        eventType: "Content Activity Export",
        status: "success",
        logUrl: fileUrl,
        userId,
        name: userName,
      });

      return formatApiReponse(true, "Content activity export completed.", { fileUrl });
    } catch (err) {
      await AuditLog.create({
        eventType: "Content Activity Export",
        status: "failure",
        logUrl: null,
        userId,
        name: userName,
      });
      return formatApiReponse(false, err.message, err);
    }
  }
}

module.exports = ContentActivityManager;
