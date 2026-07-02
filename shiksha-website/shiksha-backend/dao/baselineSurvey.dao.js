const BaseDao = require('./base.dao');
const BaselineSurvey = require("../models/baselineSurvey.model");


class BaselineSurveyDao extends BaseDao {
  constructor() {
    super(BaselineSurvey);
    this.model = BaselineSurvey;
  }

  async existsByUser(userId, academicYear) {
    const exists = await this.model.exists({ userId, academicYear });
    return !!exists;
  }

  async findByUser(userId, academicYear) {
    return this.model.findOne({ userId, academicYear }).lean();
  }

  async createSurvey(payload, session = null) {
    return this.model.create([payload], { session }).then(([doc]) => doc);
  }
}

module.exports = BaselineSurveyDao;
