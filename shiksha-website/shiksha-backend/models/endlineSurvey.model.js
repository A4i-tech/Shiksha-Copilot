const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  academicYear: { type: Number, required: true, index: true },
  shikshaTimeUsage: { type: String, required: true },
  shikshaUsability: { type: String, required: true },
  shikshaBenefits: { type: [String], required: true },
  shikshaTimeUtilization: { type: String, required: true },
  shikshaTimeUtilizationOther: { type: String, default: '' },
  shikshaContentUsed: { type: [String], required: true },
  shikshaStudentImpact: { type: [String], required: true },
}, { timestamps: true });

schema.index({ userId: 1, academicYear: 1 }, { unique: true });
module.exports = mongoose.model('EndlineSurvey', schema);
