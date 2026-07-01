const BaseDao = require('./base.dao');
const EndlineSurvey = require("../models/endlineSurvey.model");

class EndlineSurveyDao extends BaseDao {
  constructor() {
    super(EndlineSurvey);
    this.model = EndlineSurvey;
  }

  async existsByUser(userId, academicYear) {
    const exists = await this.model.exists({ userId, academicYear });
    return !!exists;
  }

  async findByUser(userId, academicYear) {
    return this.model.findOne({ userId, academicYear }).lean();
  }

  async createSurvey(payload, session = null) {
      // payload must already contain academicYear
    return this.model.create([payload], { session }).then(([doc]) => doc);
  }
}

module.exports = EndlineSurveyDao;
