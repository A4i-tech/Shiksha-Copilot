const BaseManager = require('./base.manager');
const TeacherTrainingBatchDao = require('../dao/teacher.training.batch.dao');
const TeacherTrainingBatch = require('../models/teacher.training.batch.model');
const formatApiReponse = require('../helper/response');
const { hasGlobalPermission } = require('../helper/permission.helper');
const { scopedTeacherIds, batchTeachersInScope } = require('../helper/training.scope.helper');

/** @extends {BaseManager<TeacherTrainingBatchDao>} */
class TeacherTrainingBatchManager extends BaseManager {
  constructor() {
    super(new TeacherTrainingBatchDao());
  }

  async getBatches(user, permissions) {
    try {
      const global = hasGlobalPermission(permissions, 'training.view');
      const teacherIds = global ? [] : await scopedTeacherIds(permissions, 'training.view');
      const query = global ? {} : { $or: [
        { assignedTeachers: { $in: teacherIds } },
        { createdBy: user._id, assignedTeachers: { $size: 0 } },
      ] };
      const batches = await TeacherTrainingBatch.find(query).populate([
        { path: 'assignedTeachers', select: 'identity profiles.teacher' },
        { path: 'createdBy', select: 'identity' },
      ]);
      return formatApiReponse(true, '', global ? batches : batches.filter((batch) => batchTeachersInScope(batch, teacherIds)));
    } catch (err) {
      return formatApiReponse(false, err.message, null);
    }
  }
}

module.exports = TeacherTrainingBatchManager;
