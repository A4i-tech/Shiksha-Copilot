const mongoose = require('mongoose');

const baselineSurveySchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    academicYear: { type: Number, required: true, index: true },
    // Q1..Q7
    plans: { type: [String], default: [] },
    devices: { type: [String], default: [] },
    weeklyLessonPlans: { type: String, default: '' },
    lessonPlanComponents: { type: [String], default: [] },
    timePerLessonPlan: { type: String, default: '' },
    resourcesUsed: { type: [String], default: [] },
    timeForAssessments: { type: String, default: '' },
    otherNotes: { type: String, default: '' },
  },
  { timestamps: true }
);

baselineSurveySchema.index({ userId: 1, academicYear: 1 }, { unique: true });

const BaselineSurvey = mongoose.model(
  "BaselineSurvey",
  baselineSurveySchema
);

module.exports = BaselineSurvey;
