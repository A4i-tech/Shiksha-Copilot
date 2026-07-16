const mongoose = require('mongoose');

const baselineSurveySchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    academicYear: { type: Number, required: true, index: true },

    // Q1 – How do you currently prepare your lesson plans? (multi-select)
    // Values can include "Other: <custom text>" when the teacher selects Other
    plans: { type: [String], default: [] },

    // Q2 – Which devices do you use while preparing lesson plans? (multi-select)
    devices: { type: [String], default: [] },

    // Q3 – How many lesson plans do you create in a week? (single select)
    weeklyLessonPlans: { type: String, default: '' },

    // Q4 – Which components do you include in your lesson plans? (multi-select)
    lessonPlanComponents: { type: [String], default: [] },

    // Q5 – How much time per lesson plan? (single radio)
    // Value may be free-text when teacher picks Other
    timePerLessonPlan: { type: String, default: '' },

    // Q6 – Which resources do you use? (multi-select)
    resourcesUsed: { type: [String], default: [] },

    // Q7 – How much time for one Formative Assessment? (single radio)
    timeForAssessments: { type: String, default: '' },

    // Q8 – How do you ensure question paper balance? (multi-select)
    questionBalance: { type: [String], default: [] },

    // Q9 – Additional comments
    otherNotes: { type: String, default: '' },
  },
  { timestamps: true }
);

// one survey per user per academic year
baselineSurveySchema.index({ userId: 1, academicYear: 1 }, { unique: true });

const BaselineSurvey = mongoose.model('BaselineSurvey', baselineSurveySchema);

module.exports = BaselineSurvey;
