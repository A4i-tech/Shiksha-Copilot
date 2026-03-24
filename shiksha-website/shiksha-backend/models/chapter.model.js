'use strict';
const mongoose = require('mongoose');

const i18nString = { type: Map, of: String, default: {} };
const i18nStringArray = { type: Map, of: [String], default: {} };

const topicsLearningOutcomesSchema = new mongoose.Schema({
  title: i18nString,
  learningOutcomes: i18nStringArray,
}, { _id: true });

const ChapterSchema = new mongoose.Schema(
  {
    subjectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'MasterSubject',
      required: true,
      index: true
    },
    topics: i18nString,
    subTopics: i18nStringArray,
    medium: { type: String, index: true },
    standard: { type: Number, index: true },
    board: { type: String, index: true },
    orderNumber: { type: Number, index: true },
    isDeleted: { type: Boolean, default: false },

    learningOutcomes: i18nStringArray,

    topicsLearningOutcomes: [topicsLearningOutcomesSchema],

    indexPath: { type: String }
  },
  { timestamps: true }
);

ChapterSchema.index({ standard: 1, medium: 1, board: 1, subjectId: 1 });

module.exports = mongoose.model('Chapters', ChapterSchema, 'chapters');
