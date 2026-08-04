const School = require("../models/school.model");
const User = require("../models/user.model");
const { permissionScopeFilter } = require("./scope.helper");

async function scopedTeacherIds(permissions, permission) {
  const schoolIds = await School.distinct("_id", permissionScopeFilter(permissions, permission));
  return User.distinct("_id", { "profiles.teacher": { $exists: true }, "roles.dep": { $in: schoolIds } });
}

function batchTeachersInScope(batch, teacherIds) {
  const allowed = new Set(teacherIds.map(String));
  return batch.assignedTeachers.every((teacher) => allowed.has(String(teacher._id || teacher)));
}

async function canAccessBatch(permissions, userId, batch, permission) {
  if (!batch.assignedTeachers.length) return String(batch.createdBy._id || batch.createdBy) === String(userId);
  return batchTeachersInScope(batch, await scopedTeacherIds(permissions, permission));
}

module.exports = { scopedTeacherIds, batchTeachersInScope, canAccessBatch };
