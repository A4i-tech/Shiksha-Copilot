const TeacherAbsent = require('../models/teacher.absent.model');
const TeacherTrainingBatch = require('../models/teacher.training.batch.model');
const { teacherScopeFilter, canAccessBatch } = require('../helper/training.scope.helper');

const newestFirst = { createdAt: -1 };

module.exports = {
  async getAll(permissions) {
    return TeacherAbsent.find(await teacherScopeFilter(permissions, 'training.view')).sort(newestFirst);
  },

  // Returns null when the batch is missing or outside the caller's scope.
  async getByBatch(batchId, userId, permissions) {
    const batch = await TeacherTrainingBatch.findById(batchId);
    if (!batch || !await canAccessBatch(permissions, userId, batch, 'training.view')) return null;
    return TeacherAbsent.find({ batchId }).sort(newestFirst);
  },
};
