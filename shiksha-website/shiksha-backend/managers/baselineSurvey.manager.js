
const BaseManager = require('./base.manager');
const formatApiResponse = require('../helper/response');
const BaselineSurveyDao = require('../dao/baselineSurvey.dao');
const BaselineSurveyReminder = require('../models/baselineSurveyReminder.model');

const MAX_REMIND_LATER = 2;

class BaselineSurveyManager extends BaseManager {
  constructor() {
    const dao = new BaselineSurveyDao();
    super(dao);
    this.dao = dao;
  }

  /**
   * Calculate Academic Year.
   * Academic Year X starts June 1, Year X and ends March 31, Year X+1.
   */
  getAcademicYearInfo() {
    const now = new Date();
    const month = now.getMonth(); // 0-11. June is 5, March is 2.
    const year = now.getFullYear();

    if (month >= 5) { // June onwards
      return year;
    } else {
      return year - 1;
    }
  }

  async getRemindLaterCount(userId) {
    try {
      const rec = await BaselineSurveyReminder.findOne({ userId }).lean();
      return rec ? rec.remindLaterCount : 0;
    } catch (err) {
      console.error('BaselineSurveyManager.getRemindLaterCount', err);
      return 0;
    }
  }

  async checkCompleted(userId) {
    try {
      if (!userId) return formatApiResponse(false, 'Missing userId', null);

      const academicYear = this.getAcademicYearInfo();
      const exists = await this.dao.existsByUser(userId, academicYear);
      const remindLaterCount = await this.getRemindLaterCount(userId);

      return formatApiResponse(true, 'OK', {
        completed: !!exists,
        academicYear,
        remindLaterCount,
        isMandatory: remindLaterCount >= MAX_REMIND_LATER,
      });
    } catch (err) {
      console.error('BaselineSurveyManager.checkCompleted', err);
      return formatApiResponse(false, 'Server error', null);
    }
  }

  async incrementRemindLater(userId) {
    try {
      if (!userId) return formatApiResponse(false, 'Missing userId', null);

      const rec = await BaselineSurveyReminder.findOneAndUpdate(
        { userId },
        { $inc: { remindLaterCount: 1 } },
        { upsert: true, new: true }
      );

      return formatApiResponse(true, 'Remind later recorded', {
        remindLaterCount: rec.remindLaterCount,
        isMandatory: rec.remindLaterCount >= MAX_REMIND_LATER,
      });
    } catch (err) {
      console.error('BaselineSurveyManager.incrementRemindLater', err);
      return formatApiResponse(false, 'Server error', null);
    }
  }

  async submitSurvey(userId, body, session = null) {
    try {
      if (!userId) return formatApiResponse(false, 'Missing userId', null);

      const academicYear = this.getAcademicYearInfo();
      const already = await this.dao.findByUser(userId, academicYear);
      if (already) return formatApiResponse(false, 'Already submitted for this academic year', null);

      // ---- Q1: plans (multi-select) ----
      const plans = Array.isArray(body.plans) ? body.plans : [];
      const plansOther = (body.plansOther || '').trim();

      // ---- Q2: devices (multi-select) ----
      const devices = Array.isArray(body.devices) ? body.devices : [];
      const devicesOther = (body.devicesOther || '').trim();

      // ---- Q3: weeklyLessonPlans (single) ----
      const weeklyLessonPlans = body.weeklyLessonPlans || '';

      // ---- Q4: lessonPlanComponents (multi-select) ----
      const lessonPlanComponents = Array.isArray(body.lessonPlanComponents) ? body.lessonPlanComponents : [];
      const lessonPlanComponentsOther = (body.lessonPlanComponentsOther || '').trim();

      // ---- Q5: timePerLessonPlan (radio) ----
      const timePerLessonPlan = body.timePerLessonPlan || '';
      const timePerLessonPlanOther = (body.timePerLessonPlanOther || '').trim();

      // ---- Q6: resourcesUsed (multi-select) ----
      const resourcesUsed = Array.isArray(body.resourcesUsed) ? body.resourcesUsed : [];
      const resourcesUsedOther = (body.resourcesUsedOther || '').trim();

      // ---- Q7: timeForAssessments (radio) ----
      const timeForAssessments = body.timeForAssessments || '';
      const timeForAssessmentsOther = (body.timeForAssessmentsOther || '').trim();

      // ---- Q8: questionBalance (multi-select checkboxes) ----
      const questionBalance = Array.isArray(body.questionBalance) ? body.questionBalance : [];
      const questionBalanceOther = (body.questionBalanceOther || '').trim();

      // ---- Q9: additional comments ----
      const otherNotes = body.otherNotes || '';

      const payload = {
        userId,
        academicYear,
        plans,
        plansOther,
        devices,
        devicesOther,
        weeklyLessonPlans,
        lessonPlanComponents,
        lessonPlanComponentsOther,
        timePerLessonPlan,
        timePerLessonPlanOther,
        resourcesUsed,
        resourcesUsedOther,
        timeForAssessments,
        timeForAssessmentsOther,
        questionBalance,
        questionBalanceOther,
        otherNotes,
      };

      const doc = await this.dao.createSurvey(payload, session);
      return formatApiResponse(true, 'Survey submitted', doc);
    } catch (err) {
      console.error('BaselineSurveyManager.submitSurvey', err);
      if (err && err.code === 11000) {
        return formatApiResponse(false, 'Already submitted for this academic year', null);
      }
      return formatApiResponse(false, 'Server error', null);
    }
  }
}

module.exports = new BaselineSurveyManager();
