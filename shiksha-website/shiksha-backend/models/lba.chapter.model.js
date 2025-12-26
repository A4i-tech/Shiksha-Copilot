'use strict';
const mongoose = require('mongoose');

const lbaChapterSchema = new mongoose.Schema(
  {
    class: { type: String, index: true },
    medium: { type: String, index: true },
    subject: { type: String, index: true },
    chapterNumber: { type: Number, index: true },
    title: { type: String },

  
    topics: { type: String },
    subTopics: { type: [String], default: [] }, 
    headings: { type: Array, default: [] } 
  },
  { timestamps: true, strict: false }
);

// Helpful compound index for your DAO queries
lbaChapterSchema.index({ class: 1, medium: 1, subject: 1, chapterNumber: 1 });

module.exports = mongoose.model('LBAChapter', lbaChapterSchema, 'lba_chapter');