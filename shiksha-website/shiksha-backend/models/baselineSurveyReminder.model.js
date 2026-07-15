const mongoose = require('mongoose');

const baselineSurveyReminderSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true, index: true },
    remindLaterCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const BaselineSurveyReminder = mongoose.model(
  'BaselineSurveyReminder',
  baselineSurveyReminderSchema
);

module.exports = BaselineSurveyReminder;
