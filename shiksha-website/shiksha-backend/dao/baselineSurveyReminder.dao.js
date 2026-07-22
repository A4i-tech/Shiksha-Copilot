const BaseDao = require('./base.dao');
const BaselineSurveyReminder = require('../models/baselineSurveyReminder.model');

class BaselineSurveyReminderDao extends BaseDao {
  constructor() {
    super(BaselineSurveyReminder);
  }

  /**
   * Get the current remind-later count for a user in a given academic year.
   * Returns 0 if no record exists.
   */
  async getCount(userId, academicYear) {
    const rec = await this.Model.findOne({ userId, academicYear }).lean();
    return rec ? rec.remindLaterCount : 0;
  }

  /**
   * Atomically increment the remind-later count.
   * Creates the record if it doesn't exist (upsert).
   * @param {string} userId
   * @param {number} academicYear
   * @param {object|null} session - optional Mongoose session for transactions
   * @returns {object} updated document
   */
  async increment(userId, academicYear, session = null) {
    const opts = { upsert: true, new: true };
    if (session) opts.session = session;
    return this.Model.findOneAndUpdate(
      { userId, academicYear },
      { $inc: { remindLaterCount: 1 } },
      opts
    );
  }
}

module.exports = BaselineSurveyReminderDao;
