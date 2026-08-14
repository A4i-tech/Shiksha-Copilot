
const BaseManager = require('./base.manager');
const formatApiResponse = require('../helper/response');
const BaselineSurveyDao = require('../dao/baselineSurvey.dao');
const BaselineSurveyReminderDao = require('../dao/baselineSurveyReminder.dao');
const { getAcademicYear } = require('../helper/academic.year.helper');
const { MAX_REMIND_LATER } = require('../config/constants');
const logger = require('../config/loggers');

/**
 * Helper: if the array contains 'Other' and there is a corresponding
 * text value, replace the 'Other' entry with 'Other: <text>'.
 */
const mergeOthers = (arr, otherText) => {
  if (!Array.isArray(arr)) return [];
  if (!otherText) return arr;
  return arr.map(v => (v === 'Other' ? `Other: ${otherText.trim()}` : v));
};

/**
 * Helper: for single-select radio fields that support an 'Other' option,
 * replace the value with the free-text entry when selected.
 */
const resolveOther = (value, otherText) =>
  value === 'Other' && otherText ? otherText.trim() : value;

class BaselineSurveyManager extends BaseManager {
  constructor() {
    const dao = new BaselineSurveyDao();
    super(dao);
    this.dao = dao;
    this.reminderDao = new BaselineSurveyReminderDao();
  }

  /**
   * Get the remind-later count for a user.
   * DB errors propagate to the caller — they must NOT be swallowed.
   */
  async getRemindLaterCount(userId, academicYear) {
    return this.reminderDao.getCount(userId, academicYear);
  }

  async checkCompleted(userId) {
    if (!userId) return formatApiResponse(false, 'Missing userId', null);

    const academicYear = getAcademicYear();
    const exists = await this.dao.existsByUser(userId, academicYear);
    const remindLaterCount = await this.getRemindLaterCount(userId, academicYear);

    return formatApiResponse(true, 'OK', {
      completed: !!exists,
      academicYear,
      remindLaterCount,
      isMandatory: remindLaterCount >= MAX_REMIND_LATER,
      maxReminders: MAX_REMIND_LATER,
    });
  }

  async incrementRemindLater(userId, session = null) {
    if (!userId) return formatApiResponse(false, 'Missing userId', null);

    const academicYear = getAcademicYear();

    // Guard: do not mutate reminder records for users who already submitted
    const alreadyCompleted = await this.dao.existsByUser(userId, academicYear);
    if (alreadyCompleted) {
      const remindLaterCount = await this.getRemindLaterCount(userId, academicYear);
      return formatApiResponse(true, 'Survey already completed', {
        remindLaterCount,
        isMandatory: remindLaterCount >= MAX_REMIND_LATER,
        completed: true,
      });
    }

    // Ceiling: do not increment past the maximum
    const currentCount = await this.getRemindLaterCount(userId, academicYear);
    if (currentCount >= MAX_REMIND_LATER) {
      return formatApiResponse(true, 'Maximum reminders reached', {
        remindLaterCount: currentCount,
        isMandatory: true,
      });
    }

    const rec = await this.reminderDao.increment(userId, academicYear, session);

    return formatApiResponse(true, 'Remind later recorded', {
      remindLaterCount: rec.remindLaterCount,
      isMandatory: rec.remindLaterCount >= MAX_REMIND_LATER,
    });
  }

  async submitSurvey(userId, body, session = null) {
    try {
      if (!userId) return formatApiResponse(false, 'Missing userId', null);

      const academicYear = getAcademicYear();
      const already = await this.dao.findByUser(userId, academicYear);
      if (already) return formatApiResponse(false, 'Already submitted for this academic year', null, 'ALREADY_SUBMITTED');

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
      logger.error('submitSurvey failed', { functionName: 'submitSurvey', userId, message: err.message, stack: err.stack });
      if (err && err.code === 11000) {
        return formatApiResponse(false, 'Already submitted for this academic year', null, 'ALREADY_SUBMITTED');
      }
      return formatApiResponse(false, 'Server error', null);
    }
  }
}

module.exports = new BaselineSurveyManager();
