const School = require("../models/school.model");
const User = require("../models/user.model");
const { permissionScopeFilter } = require("./scope.helper");
const { hasGlobalPermission } = require("./permission.helper");
const formatApiReponse = require("./response");
const AppError = require("./app.error");
const pick = require("lodash/pick");

const NOT_FOUND = "Record not found. Refresh the page and try again.";
const OUT_OF_SCOPE ="This feedback belongs to a teacher outside your scope. Choose a teacher from your own schools.";

async function scopedTeacherIds(permissions, permission) {
  const schoolIds = await School.distinct("_id", permissionScopeFilter(permissions, permission));
  return User.distinct("_id", { "profiles.teacher": { $exists: true }, "roles.dep": { $in: schoolIds } });
}

function batchTeachersInScope(batch, teacherIds) {
  const allowed = new Set(teacherIds.map(String));
  return batch.assignedTeachers.every((teacher) => allowed.has(String(teacher._id || teacher)));
}

async function canAccessBatch(permissions, userId, batch, permission) {
  if (hasGlobalPermission(permissions, permission)) return true;
  if (!batch.assignedTeachers.length) return String(batch.createdBy._id || batch.createdBy) === String(userId);
  return batchTeachersInScope(batch, await scopedTeacherIds(permissions, permission));
}

async function isTeacherInScope(permissions, permission, teacherId) {
  if (hasGlobalPermission(permissions, permission)) return true;
  return (await scopedTeacherIds(permissions, permission)).some((id) => String(id) === String(teacherId));
}

async function teacherScopeFilter(permissions, permission) {
  if (hasGlobalPermission(permissions, permission)) return {};
  return { teacherId: { $in: await scopedTeacherIds(permissions, permission) } };
}

// An out-of-scope id answers like a missing one, so ids do not leak.
async function getScopedFeedback(dao, req) {
  const data = await dao.getById(req.params.id);
  if (!data || !await isTeacherInScope(req.permissions, "content.manage", data.teacherId)) return formatApiReponse(false, NOT_FOUND, null);
  return formatApiReponse(true, "", data);
}

async function updateScopedFeedback(dao, id, updates, permissions, fields) {
  const existing = await dao.getById(id);
  if (!existing) return formatApiReponse(false, "Feedback not found. Refresh the page and try again.", null);
  if (!await isTeacherInScope(permissions, "content.manage", existing.teacherId)) throw new AppError(OUT_OF_SCOPE, 403);
  return formatApiReponse(true, "", await dao.update(id, pick(updates, fields)));
}

module.exports = { OUT_OF_SCOPE, NOT_FOUND, getScopedFeedback, updateScopedFeedback, scopedTeacherIds, batchTeachersInScope, canAccessBatch, isTeacherInScope, teacherScopeFilter };
