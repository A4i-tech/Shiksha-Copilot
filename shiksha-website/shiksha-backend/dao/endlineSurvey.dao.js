const BaseDao = require('./base.dao');
const EndlineSurvey = require('../models/endlineSurvey.model');

class EndlineSurveyDao extends BaseDao {
  constructor() { super(EndlineSurvey); }
  async existsByUser(userId, academicYear) { return !!await this.Model.exists({ userId, academicYear }); }
  async createSurvey(payload) { return this.Model.create(payload); }
}

module.exports = EndlineSurveyDao;
