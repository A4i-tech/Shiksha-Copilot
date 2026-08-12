const AuditLog = require("../models/audit.log.model");
const logger = require("../config/loggers");

async function startAuditJob(eventType, userId, name, job) {
  const auditLog = await AuditLog.create({ eventType, status: "in_progress", logUrl: null, userId, name });
  setImmediate(async () => {
    try {
      const logUrl = await job();
      await AuditLog.findByIdAndUpdate(auditLog._id, { status: "success", logUrl });
    } catch (error) {
      logger.error(`${eventType} failed`, { auditLogId: String(auditLog._id), error: error.message });
      try {
        await AuditLog.findByIdAndUpdate(auditLog._id, { status: "failure", logUrl: null });
      } catch (auditError) {
        logger.error(`${eventType} audit update failed`, { auditLogId: String(auditLog._id), error: auditError.message });
      }
    }
  });
  return auditLog;
}

module.exports = startAuditJob;
