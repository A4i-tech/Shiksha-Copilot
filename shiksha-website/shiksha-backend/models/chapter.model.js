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
    status: { type: String, enum: ['draft', 'under_review', 'approved'], default: 'approved' },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },

    learningOutcomes: { type: [String], default: [] },

    topicsLearningOutcomes: [
      {
        title: { type: String },
        learningOutcomes: { type: [String], default: [] }
      }
    ],

    indexPath: { type: String },

    isGrammar: { type: Boolean, default: false },
    grammarTopics: { type: [String], default: [] },
    grammarSourceChapters: { type: [String], default: [] }
  },
  { timestamps: true }
);

ChapterSchema.index({ standard: 1, medium: 1, board: 1, subjectId: 1 });
ChapterSchema.index({ isDeleted: 1, status: 1, createdBy: 1 });

module.exports = mongoose.model('Chapters', ChapterSchema, 'chapters');