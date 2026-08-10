const BaseDao = require('./base.dao');
const BaselineSurvey = require("../models/baselineSurvey.model");
const AppError = require("../helper/app.error");

/** @extends {BaseDao<typeof BaselineSurvey>} */
class BaselineSurveyDao extends BaseDao {
  constructor() {
    super(BaselineSurvey);
  }

  async existsByUser(userId, academicYear) {
    if (!academicYear) {
      throw new AppError('Academic year is required', 400);
    }
    const exists = await this.Model.exists({ userId, academicYear });
    return !!exists;
  }

  async findByUser(userId, academicYear) {
    if (!academicYear) {
      throw new AppError('Academic year is required', 400);
    }
    return this.Model.findOne({ userId, academicYear }).lean();
  }

  async createSurvey(payload, session = null) {
    if (!payload.academicYear) {
      throw new AppError('Academic year is required in payload', 400);
    }
    return this.Model.create([payload], { session }).then(([doc]) => doc);
  }
}

module.exports = BaselineSurveyDao;
