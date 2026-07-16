
const BaseManager = require('./base.manager');
const formatApiResponse = require('../helper/response');
const BaselineSurveyDao = require('../dao/baselineSurvey.dao');
const BaselineSurveyReminder = require('../models/baselineSurveyReminder.model');

const MAX_REMIND_LATER = 3;

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

  async getRemindLaterCount(userId, academicYear) {
    try {
      const rec = await BaselineSurveyReminder.findOne({ userId, academicYear }).lean();
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
      const remindLaterCount = await this.getRemindLaterCount(userId, academicYear);

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

      const academicYear = this.getAcademicYearInfo();
      const rec = await BaselineSurveyReminder.findOneAndUpdate(
        { userId, academicYear },
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

      /**
       * Helper: if the array contains 'Others' and there is a corresponding
       * text value, replace the 'Others' entry with 'Others: <text>'.
       */
      const mergeOthers = (arr, otherText) => {
        if (!Array.isArray(arr)) return [];
        if (!otherText) return arr;
        return arr.map(v => (v === 'Other' ? `Other: ${otherText.trim()}` : v));
      };

      /**
       * Helper: for single-select radio fields that support an 'Others' option,
       * replace the value with the free-text entry when selected.
       */
      const resolveOther = (value, otherText) =>
        value === 'Other' && otherText ? otherText.trim() : value;

      // ---- Q1: plans (multi-select) ----
      const plans = mergeOthers(body.plans, body.plansOther);

      // ---- Q2: devices (multi-select) ----
      const devices = mergeOthers(body.devices, body.devicesOther);

      // ---- Q3: weeklyLessonPlans (single) ----
      const weeklyLessonPlans = body.weeklyLessonPlans || '';

      // ---- Q4: lessonPlanComponents (multi-select) ----
      const lessonPlanComponents = mergeOthers(
        body.lessonPlanComponents,
        body.otherLessonPlanComponent || body.lessonPlanComponentsOther
      );

      // ---- Q5: timePerLessonPlan (radio) ----
      const timePerLessonPlan = resolveOther(
        body.timePerLessonPlan || '',
        body.otherTimePerLessonPlan || body.timePerLessonPlanOther
      );

      // ---- Q6: resourcesUsed (multi-select) ----
      const resourcesUsed = mergeOthers(
        body.resourcesUsed,
        body.otherResourceUsed || body.resourcesUsedOther
      );

      // ---- Q7: timeForAssessments (radio) ----
      const timeForAssessments = resolveOther(
        body.timeForAssessments || '',
        body.otherTimeForAssessments || body.timeForAssessmentsOther
      );

      // ---- Q8: questionBalance (multi-select) ----
      const questionBalance = mergeOthers(body.questionBalance, body.questionBalanceOther);

      // ---- Q9: additional comments ----
      const otherNotes = body.otherNotes || '';

      const payload = {
        userId,
        academicYear,
        plans,
        devices,
        weeklyLessonPlans,
        lessonPlanComponents,
        timePerLessonPlan,
        resourcesUsed,
        timeForAssessments,
        questionBalance,
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
