const mongoose = require('mongoose');

const baselineSurveyReminderSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    academicYear: { type: Number, required: true },
    remindLaterCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// One reminder config per user per academic year
baselineSurveyReminderSchema.index({ userId: 1, academicYear: 1 }, { unique: true });

const BaselineSurveyReminder = mongoose.model(
  'BaselineSurveyReminder',
  baselineSurveyReminderSchema
);

module.exports = BaselineSurveyReminder;
