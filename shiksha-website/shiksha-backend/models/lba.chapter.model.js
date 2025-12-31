// const mongoose = require('mongoose');

// // Schema tailored to LBA chapter documents
// const lbaChapterSchema = new mongoose.Schema(
//   {
//     class: { type: String },
//     medium: { type: String },
//     subject: { type: String },
//     chapterNumber: { type: Number },
//     title: { type: String },
//   },
//   { timestamps: true, strict: false }
// );

// // Explicitly bind to lba_chapter collection in prod DB
// module.exports = mongoose.model('LBAChapter', lbaChapterSchema, 'lba_chapter');





/// nely made oct 13//////


'use strict';
const mongoose = require('mongoose');

const lbaChapterSchema = new mongoose.Schema(
  {
    class: { type: String, index: true },
    medium: { type: String, index: true },
    subject: { type: String, index: true },
    chapterNumber: { type: Number, index: true },
    title: { type: String },
  },
  { timestamps: true, strict: false }
);

// Helpful compound index for your DAO queries
lbaChapterSchema.index({ class: 1, medium: 1, subject: 1, chapterNumber: 1 });

module.exports = mongoose.model('LBAChapter', lbaChapterSchema, 'lba_chapter');
