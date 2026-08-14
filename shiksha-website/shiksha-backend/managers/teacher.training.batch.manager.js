const BaseManager = require('./base.manager');
const TeacherTrainingBatchDao = require('../dao/teacher.training.batch.dao');
const TeacherTrainingBatch = require('../models/teacher.training.batch.model');
const UserManager = require('./user.manager');
const formatApiReponse = require('../helper/response');
const { hasGlobalPermission } = require('../helper/permission.helper');
const { scopedTeacherIds, batchTeachersInScope } = require('../helper/training.scope.helper');
const { intersectFilters } = require('../helper/scope.helper');

/** @extends {BaseManager<TeacherTrainingBatchDao>} */
class TeacherTrainingBatchManager extends BaseManager {
  constructor() {
    super(new TeacherTrainingBatchDao());
  }

  async getBatches(user, permissions) {
    const global = hasGlobalPermission(permissions, 'training.view');
    const teacherIds = global ? [] : await scopedTeacherIds(permissions, 'training.view');
    const query = global ? {} : { $or: [
      { assignedTeachers: { $in: teacherIds } },
      { createdBy: user._id, assignedTeachers: { $size: 0 } },
    ] };
    const batches = await TeacherTrainingBatch.find(query)
      .select('batchName scheduleDate trainingType assignedTeachers isSubmitted createdBy')
      .populate({ path: 'createdBy', select: 'identity.name -_id' });
    const visibleBatches = global ? batches : batches.filter((batch) => batchTeachersInScope(batch, teacherIds));
    const data = visibleBatches.map((batch) => ({
      _id: batch._id,
      batchName: batch.batchName,
      scheduleDate: batch.scheduleDate,
      trainingType: batch.trainingType,
      isSubmitted: batch.isSubmitted,
      createdBy: batch.createdBy,
    }));
    return formatApiReponse(true, '', data);
  }

  async getAvailableTeachers(page, limit, search, permissions) {
    const [assigned, attended] = await Promise.all([
      TeacherTrainingBatch.distinct('assignedTeachers', { isSubmitted: false }),
      TeacherTrainingBatch.distinct('attendance', { isSubmitted: true }),
    ]);
    const searchFilter = search ? { $or: ['identity.name', 'identity.phone', 'school.zone', 'school.district'].map((field) => ({
      [field]: { $regex: new RegExp(search, 'i') },
    })) } : {};
    const unavailable = new Map([...assigned, ...attended].map((id) => [String(id), id]));
    const filters = intersectFilters({ profileType: 'teacher', _id: { $nin: [...unavailable.values()] } }, searchFilter);
    return new UserManager().getAll({ page, limit, filters, sort: {}, status: {}, permissions, permission: 'training.edit' });
  }
}

module.exports = TeacherTrainingBatchManager;
