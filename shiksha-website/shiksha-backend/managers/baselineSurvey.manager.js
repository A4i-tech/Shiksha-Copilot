

const BaseManager = require('./base.manager');
const formatApiResponse = require('../helper/response');
const BaselineSurveyDao = require('../dao/baselineSurvey.dao');

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

    // Months:
    // 0: Jan, 1: Feb, 2: Mar  -> Academic Year = Current Year - 1
    // 3: Apr, 4: May          -> Window CLOSED (but baseline should still allow submission)
    // 5: Jun ... 11: Dec      -> Academic Year = Current Year

    if (month >= 5) { // June onwards
      return year;
    } else { // Jan, Feb, Mar, Apr, May
      return year - 1;
    }
  }

  async checkCompleted(userId) {
    try {
      if (!userId) return formatApiResponse(false, 'Missing userId', null);
      
      const academicYear = this.getAcademicYearInfo();
      const exists = await this.dao.existsByUser(userId, academicYear);
      return formatApiResponse(true, 'OK', { completed: !!exists, academicYear });
    } catch (err) {
      console.error('BaselineSurveyManager.checkCompleted', err);
      return formatApiResponse(false, 'Server error', null);
    }
  }

  async submitSurvey(userId, body, session = null) {
    try {
      if (!userId) return formatApiResponse(false, 'Missing userId', null);

      const academicYear = this.getAcademicYearInfo();
      const already = await this.dao.findByUser(userId, academicYear);
      if (already) return formatApiResponse(false, 'Already submitted for this academic year', null);

      // ---- NORMALIZE ARRAYS ----
      const plans = Array.isArray(body.plans) ? body.plans : [];
      const devices = Array.isArray(body.devices) ? body.devices : [];
      let lessonPlanComponents = Array.isArray(body.lessonPlanComponents)
        ? body.lessonPlanComponents
        : [];
      let resourcesUsed = Array.isArray(body.resourcesUsed) ? body.resourcesUsed : [];

      const otherLessonPlanComponent = (body.otherLessonPlanComponent || '').trim();
      const otherResourceUsed = (body.otherResourceUsed || '').trim();

      // If user typed "Others" for components, store it as "Others: <text>"
      if (otherLessonPlanComponent) {
        // remove bare "Others" from array if present
        lessonPlanComponents = lessonPlanComponents.filter(v => v !== 'Others');
        lessonPlanComponents.push(`Others: ${otherLessonPlanComponent}`);
      }

      // If user typed "Others" for resources, store it as "Others: <text>"
      if (otherResourceUsed) {
        resourcesUsed = resourcesUsed.filter(v => v !== 'Others');
        resourcesUsed.push(`Others: ${otherResourceUsed}`);
      }

      // ---- NORMALIZE TIME FIELDS ----
      let timePerLessonPlan = body.timePerLessonPlan || '';
      let timeForAssessments = body.timeForAssessments || '';

      const otherTimePerLessonPlan = (body.otherTimePerLessonPlan || '').trim();
      const otherTimeForAssessments = (body.otherTimeForAssessments || '').trim();

      // If dropdown value is "Others" and text is given, replace it with the text
      if (timePerLessonPlan === 'Others' && otherTimePerLessonPlan) {
        timePerLessonPlan = otherTimePerLessonPlan;
      }

      if (timeForAssessments === 'Others' && otherTimeForAssessments) {
        timeForAssessments = otherTimeForAssessments;
      }

      const payload = {
        userId,
        academicYear,
        plans,
        devices,
        weeklyLessonPlans: body.weeklyLessonPlans || '',
        lessonPlanComponents,
        timePerLessonPlan,
        resourcesUsed,
        timeForAssessments,
        otherNotes: body.otherNotes || '',
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
