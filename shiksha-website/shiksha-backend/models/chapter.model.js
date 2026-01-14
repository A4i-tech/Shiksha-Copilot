'use strict';
const mongoose = require('mongoose');

const ChapterSchema = new mongoose.Schema(
  {
    subjectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'MasterSubject',
      required: true,
      index: true
    },
    topics: { type: String, required: true },
    subTopics: { type: [String], default: [] },
    medium: { type: String, index: true },
    standard: { type: Number, index: true },
    board: { type: String, index: true },
    orderNumber: { type: Number, index: true },
    isDeleted: { type: Boolean, default: false },

    learningOutcomes: { type: [String], default: [] },

    topicsLearningOutcomes: [
      {
        title: { type: String },
        learningOutcomes: { type: [String], default: [] }
      }
    ],

    indexPath: { type: String }
  },
  { timestamps: true }
);

ChapterSchema.index({ standard: 1, medium: 1, board: 1, subjectId: 1 });

module.exports = mongoose.model('Chapters', ChapterSchema, 'chapters');