const mongoose = require('mongoose');

const endlineSurveySchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    academicYear: { type: Number, required: true, index: true }, // Year X of the academic year X-(X+1)
    
    // Shiksha Copilot Specific Questions
    shikshaTimeUsage: { type: String, default: '' }, // Q1: Time to prepare lesson plan
    shikshaUsability: { type: String, default: '' }, // Q2: Direct usability
    shikshaBenefits: { type: [String], default: [] }, // Q3: Benefits (checkbox)
    shikshaTimeUtilization: { type: String, default: '' }, // Q4: How time saved is used (dropdown)
    shikshaTimeUtilizationOther: { type: String, default: '' }, // Q4 Other text
    shikshaContentUsed: { type: [String], default: [] }, // Q5: Content used in classroom
    shikshaStudentImpact: { type: [String], default: [] }, // Q6: Student impact
  },
  { timestamps: true }
);

// one survey per user per academic year
endlineSurveySchema.index({ userId: 1, academicYear: 1 }, { unique: true });

const EndlineSurvey = mongoose.model(
  "EndlineSurvey",
  endlineSurveySchema
);

module.exports = EndlineSurvey;
