const BaseDao = require('./base.dao');
const BaselineSurvey = require("../models/baselineSurvey.model");
const AppError = require("../helper/app.error");

class BaselineSurveyDao extends BaseDao {
  constructor() {
    super(BaselineSurvey);
    this.model = BaselineSurvey;
  }

  async existsByUser(userId, academicYear) {
    if (!academicYear) {
      throw new AppError('Academic year is required', 400);
    }
    const exists = await this.model.exists({ userId, academicYear });
    return !!exists;
  }

  async findByUser(userId, academicYear) {
    if (!academicYear) {
      throw new AppError('Academic year is required', 400);
    }
    return this.model.findOne({ userId, academicYear }).lean();
  }

  async createSurvey(payload, session = null) {
    if (!payload.academicYear) {
      throw new AppError('Academic year is required in payload', 400);
    }
    return this.model.create([payload], { session }).then(([doc]) => doc);
  }
}

module.exports = BaselineSurveyDao;
