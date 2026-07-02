const BaseDao = require('./base.dao');
const TeacherTrainingBatch = require('../models/teacher.training.batch.model');

class TeacherTrainingBatchDao extends BaseDao {
  constructor() {
    super(TeacherTrainingBatch);
  }

  async getTrainingDateForUser(userId) {
    const batch = await this.Model.findOne({ attendance: userId, isSubmitted: true })
      .sort({ scheduleDate: -1 }).select('scheduleDate').lean();
    return batch?.scheduleDate || null;
  }
}

module.exports = TeacherTrainingBatchDao;
