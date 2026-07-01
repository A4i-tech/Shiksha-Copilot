const EndlineSurveyDao = require('../dao/endlineSurvey.dao');
const BaselineSurveyDao = require('../dao/baselineSurvey.dao');
const TeacherTrainingBatchDao = require('../dao/teacher.training.batch.dao');
const TeacherLessonPlan = require('../models/teacher.lesson.plan.model');
const QuestionBankConfiguration = require('../models/question.bank.config.model');
const { getAcademicYear, getAcademicYearRange } = require('../helper/academic.year.helper');

const WAIT_MS = 30 * 24 * 60 * 60 * 1000;
const REQUIRED_ITEMS = 2;
const exclusive = [
  ['shikshaBenefits', 'Still exploring its usefulness'],
  ['shikshaContentUsed', 'I have not used any of these in my classroom'],
  ['shikshaStudentImpact', 'I have not used it enough to notice changes'],
];

class EndlineSurveyManager {
  constructor() {
    this.dao = new EndlineSurveyDao();
    this.baselineDao = new BaselineSurveyDao();
    this.trainingDao = new TeacherTrainingBatchDao();
  }

  async eligibility(userId) {
    const academicYear = getAcademicYear();
    if (!await this.trainingDao.getTrainingDateForUser(userId)) return { status: 'not_trained' };
    const baseline = await this.baselineDao.findByUser(userId, academicYear);
    if (!baseline) return { status: 'baseline_missing' };
    const availableAt = new Date(baseline.createdAt).getTime() + WAIT_MS;
    if (availableAt > Date.now()) return { status: 'waiting_period', availableAt: new Date(availableAt) };
    const currentCount = await this.getTotalUserItems(userId, academicYear);
    if (currentCount < REQUIRED_ITEMS) return { status: 'minimum_usage_not_met', currentCount, requiredCount: REQUIRED_ITEMS };
    return { status: await this.dao.existsByUser(userId, academicYear) ? 'completed' : 'open', academicYear };
  }

  async checkStatus(userId) { return { success: true, data: await this.eligibility(userId) }; }

  async submitSurvey(userId, payload) {
    const eligibility = await this.eligibility(userId);
    if (eligibility.status !== 'open') {
      const error = new Error('Endline survey is not available');
      error.status = eligibility.status === 'completed' ? 409 : 403;
      throw error;
    }
    this.validate(payload);
    const data = await this.dao.createSurvey({ userId, academicYear: eligibility.academicYear, ...payload });
    return { success: true, message: 'Survey submitted', data };
  }

  async getTotalUserItems(userId, academicYear) {
    const { start, end } = getAcademicYearRange(academicYear);
    const dates = { $gte: start, $lt: end };
    const counts = await Promise.all([
      TeacherLessonPlan.countDocuments({ teacherId: userId, createdAt: dates, isDeleted: { $ne: true } }),
      QuestionBankConfiguration.countDocuments({ teacherId: userId, createdAt: dates }),
    ]);
    return counts[0] + counts[1];
  }

  validate(payload) {
    const required = ['shikshaTimeUsage', 'shikshaUsability', 'shikshaBenefits', 'shikshaTimeUtilization', 'shikshaContentUsed', 'shikshaStudentImpact'];
    if (required.some((key) => !payload[key] || !payload[key].length)) throw Object.assign(new Error('All questions are required'), { status: 400 });
    for (const [field, option] of exclusive) {
      if (payload[field].includes(option) && payload[field].length > 1) throw Object.assign(new Error(`${option} must be selected alone`), { status: 400 });
    }
    if (payload.shikshaTimeUtilization === 'Other:' && !payload.shikshaTimeUtilizationOther?.trim()) {
      throw Object.assign(new Error('Please specify how the saved time is used'), { status: 400 });
    }
  }
}

module.exports = new EndlineSurveyManager();
