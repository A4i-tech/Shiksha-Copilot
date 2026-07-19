const BaseManager = require('./base.manager');
const TeacherTrainingBatchDao = require('../dao/teacher.training.batch.dao');
const TeacherTrainingBatch = require('../models/teacher.training.batch.model');
const formatApiReponse = require('../helper/response');
const { getRolePermissions, hasGlobalPermission } = require('../helper/permission.helper');

/** @extends {BaseManager<TeacherTrainingBatchDao>} */
class TeacherTrainingBatchManager extends BaseManager {
  constructor() {
    super(new TeacherTrainingBatchDao());
  }

  async getBatches(user) {
    try {
      const permissions = getRolePermissions(user.roles);
      const query = hasGlobalPermission(permissions, 'training.view') ? {} : { createdBy: user._id };
      const batches = await TeacherTrainingBatch.find(query).populate([
        { path: 'assignedTeachers', select: 'identity profiles.teacher' },
        { path: 'createdBy', select: 'identity' },
      ]);
      return formatApiReponse(true, '', batches);
    } catch (err) {
      return formatApiReponse(false, err.message, null);
    }
  }
}

module.exports = TeacherTrainingBatchManager;
