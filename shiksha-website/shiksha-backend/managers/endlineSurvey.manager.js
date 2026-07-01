const endlineSurveyDao = new (require('../dao/endlineSurvey.dao'))();
const baselineSurveyDao = new (require('../dao/baselineSurvey.dao'))();
const teacherTrainingBatchDao = new (require('../dao/teacher.training.batch.dao'))();
const TeacherLessonPlan = require('../models/teacher.lesson.plan.model');
const QuestionBankConfiguration = require('../models/question.bank.config.model');


class EndlineSurveyManager {
  
  /**
   * Calculate Academic Year.
   * Academic Year X starts June 1, Year X and ends May 30, Year X+1.
   * No closed window - survey is always open within the academic year.
   */
  getAcademicYearInfo() {
    const now = new Date();
    const month = now.getMonth(); // 0-11. June is 5, May is 4.
    const year = now.getFullYear();

    // Months:
    // 0: Jan, 1: Feb, 2: Mar, 3: Apr, 4: May  -> Academic Year = Current Year - 1
    // 5: Jun ... 11: Dec                        -> Academic Year = Current Year

    if (month >= 5) { // June onwards
      return { academicYear: year, isOpen: true };
    } else { // Jan - May
      return { academicYear: year - 1, isOpen: true };
    }
  }

  async checkStatus(userId) {
    const { academicYear, isOpen } = this.getAcademicYearInfo();

    // 1️⃣ Check survey window open
    if (!isOpen) {
        return { 
            success: true, 
            data: { 
                status: 'closed', 
                message: 'Survey is only available from June 1st to May 30th.' 
            } 
        };
    }

    // 2️⃣ Check user trained at least once
    const trainingDate = await teacherTrainingBatchDao.getTrainingDateForUser(userId);
    if (!trainingDate) {
        return { 
            success: true, 
            data: { 
                status: 'not_trained', 
                message: 'You have not attended the training yet.' 
            } 
        };
    }

    // 3️⃣ Check baseline filled this academic year
    const baseline = await baselineSurveyDao.findByUser(userId, academicYear);
    if (!baseline) {
        return { 
            success: true, 
            data: { 
                status: 'baseline_missing', 
                message: 'Please complete the Baseline Survey first.' 
            } 
        };
    }

    // 4️⃣ Wait 30 days from baseline.createdAt
    const thirtyDaysInMs = 30 * 24 * 60 * 60 * 1000;
    const timeSinceBaseline = new Date() - new Date(baseline.createdAt);

    if (timeSinceBaseline < thirtyDaysInMs) {
         // Calculate remaining days for better UX
         const daysRemaining = Math.ceil((thirtyDaysInMs - timeSinceBaseline) / (24 * 60 * 60 * 1000));
         return { 
            success: true, 
            data: { 
                status: 'waiting_period', 
                message: `Endline survey will be available in ${daysRemaining} day(s).` 
            } 
        };
    }

    // 5️⃣ Check minimum usage: at least 2 total items (Lesson Plan / Lesson Resource / Question Bank)
    const totalItems = await this.getTotalUserItems(userId, academicYear);
    if (totalItems < 2) {
        return {
            success: true,
            data: {
                status: 'minimum_usage_not_met',
                message: `You need to create at least 2 items (Lesson Plans, Lesson Resources, or Question Banks) to access the endline survey. Current: ${totalItems} item(s).`,
                currentCount: totalItems,
                requiredCount: 2
            }
        };
    }

    // 6️⃣ Check if already filled
    const alreadyFilled = await endlineSurveyDao.existsByUser(userId, academicYear);
    
    // 7️⃣ If already filled → completed, else → open
    return {
        success: true,
        data: {
            status: alreadyFilled ? 'completed' : 'open',
            academicYear: academicYear,
            completed: alreadyFilled
        }
    };
  }

  async submitSurvey(userId, payload) {
    const { academicYear, isOpen } = this.getAcademicYearInfo();
    
    if (!isOpen) {
        throw new Error('Survey window is closed');
    }

    // Check training status
    const trainingDate = await teacherTrainingBatchDao.getTrainingDateForUser(userId);
    if (!trainingDate) {
        throw new Error('Training not completed');
    }

    // Double check baseline in case of direct API call and get createdAt for 30-day validation
    const baseline = await baselineSurveyDao.findByUser(userId, academicYear);
    if (!baseline) {
        throw new Error('Baseline survey not completed');
    }

    // Wait 30 days from baseline.createdAt
    const thirtyDaysInMs = 30 * 24 * 60 * 60 * 1000;
    if (new Date() - new Date(baseline.createdAt) < thirtyDaysInMs) {
        throw new Error('30-day waiting period from baseline survey has not passed');
    }

    // Check minimum usage: at least 1 total item
    const totalItems = await this.getTotalUserItems(userId, academicYear);
    if (totalItems < 1) {
        throw new Error(`Minimum usage not met. You have created ${totalItems} item(s), need at least 1 item.`);
    }

    // Backend validation for mutual exclusivity and required fields
    this.validateSurveyData(payload);

    const data = {
        userId,
        academicYear,
        ...payload
    };

    return endlineSurveyDao.createSurvey(data).then(doc => ({ success: true, data: doc }));
  }

  /**
   * Count total items created by user in academic year:
   * - Lesson Plans (isLesson = true)
   * - Lesson Resources (isLesson = false)
   * - Question Banks
   * Academic Year X: June 1, Year X → May 30, Year X+1
   */
  async getTotalUserItems(userId, academicYear) {
    const startDate = new Date(academicYear, 5, 1);                  // June 1 of academic year
    const endDate = new Date(academicYear + 1, 4, 30, 23, 59, 59);  // May 30 of next year

    const [lessonPlanCount, questionBankCount] = await Promise.all([
      // Count Lesson Plans + Lesson Resources (both stored in TeacherLessonPlan)
      TeacherLessonPlan.countDocuments({
        teacherId: userId,
        createdAt: { $gte: startDate, $lte: endDate },
        isDeleted: { $ne: true }
      }),
      // Count Question Banks
      QuestionBankConfiguration.countDocuments({
        teacherId: userId,
        createdAt: { $gte: startDate, $lte: endDate }
      })
    ]);

    return lessonPlanCount + questionBankCount;
  }

  validateSurveyData(payload) {
    // Validate Question 3 (Benefits) - Mutual exclusivity
    const benefits = payload.shikshaBenefits || [];
    const hasExploring = benefits.includes('Still exploring its usefulness');
    const hasOtherBenefits = benefits.some(b => b !== 'Still exploring its usefulness');
    
    if (hasExploring && hasOtherBenefits) {
        throw new Error('"Still exploring its usefulness" cannot be selected with other benefits');
    }

    // Validate Question 5 (Content Used) - Mutual exclusivity
    const contentUsed = payload.shikshaContentUsed || [];
    const hasNotUsed = contentUsed.includes('I have not used any of these in my classroom');
    const hasOtherContent = contentUsed.some(c => c !== 'I have not used any of these in my classroom');
    
    if (hasNotUsed && hasOtherContent) {
        throw new Error('"I have not used any of these in my classroom" cannot be selected with other content types');
    }

    // Validate Question 6 (Student Impact) - Mutual exclusivity
    const studentImpact = payload.shikshaStudentImpact || [];
    const hasNotEnough = studentImpact.includes('I have not used it enough to notice changes');
    const hasOtherImpact = studentImpact.some(s => s !== 'I have not used it enough to notice changes');
    
    if (hasNotEnough && hasOtherImpact) {
        throw new Error('"I have not used it enough to notice changes" cannot be selected with other impact options');
    }

    // Validate Question 4 - If "Other:" is selected, other field is required
    const timeUtilization = payload.shikshaTimeUtilization || '';
    const otherTimeUtilization = payload.shikshaTimeUtilizationOther || '';
    
    if (timeUtilization === 'Other:' && !otherTimeUtilization.trim()) {
        throw new Error('Please specify how you utilize the saved time when "Other:" is selected');
    }
  }
}

module.exports = new EndlineSurveyManager();