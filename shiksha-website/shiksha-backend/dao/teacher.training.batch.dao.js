const BaseDao = require('./base.dao');
const TeacherTrainingBatch = require('../models/teacher.training.batch.model');

class TeacherTrainingBatchDao extends BaseDao {
  constructor() {
    super(TeacherTrainingBatch);
  }
  /**
   * Get the latest training date for a user.
   * Checks for batches where the user is in the attendance list and the batch is submitted.
   * @param {string} userId 
   * @returns {Date|null} The date of the latest training or null if not found.
   */
  async getTrainingDateForUser(userId) {
    try {
      const batch = await this.Model.findOne({
        attendance: userId,
        isSubmitted: true
      })
      .sort({ scheduleDate: -1 }) // Get the latest one
      .select('scheduleDate');

      return batch ? batch.scheduleDate : null;
    } catch (err) {
      console.log("Error --> TeacherTrainingBatchDao -> getTrainingDateForUser()", err);
      throw err;
    }
  }
}

module.exports = TeacherTrainingBatchDao; 