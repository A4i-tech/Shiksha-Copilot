'use strict';
const mongoose = require('mongoose');

// ---- sub-schemas ----
const OptionSchema = new mongoose.Schema(
  {
    label: { type: String },
    text:  { type: String },
  },
  { _id: false }
);

const PairSchema = new mongoose.Schema(
  {
    left:      { type: String },
    right:     { type: String },
    keyAnswer: { type: String },
  },
  { _id: false }
);

// ---- helpers to sanitize arrays ----
const alpha = (i) => String.fromCharCode(65 + i); // A, B, C...

function normalizeOptions(arr) {
  if (!Array.isArray(arr)) return [];
  const out = [];
  let auto = 0;
  for (const raw of arr) {
    if (raw == null) continue;

    if (typeof raw === 'string') {
      out.push({ label: alpha(auto++), text: raw });
      continue;
    }

    const text = (raw.text ?? '').toString().trim();
    if (!text) continue;

    const label = (raw.label ?? raw.key ?? alpha(auto++)).toString();
    out.push({ label, text });
  }
  return out;
}

function normalizePairs(arr) {
  if (!Array.isArray(arr)) return [];
  return arr
    .filter((p) => p && (p.left || p.right))
    .map((p) => ({
      left: String(p.left ?? ''),
      right: String(p.right ?? ''),
      keyAnswer: p.keyAnswer ? String(p.keyAnswer) : undefined,
    }));
}

function normalizeItems(arr) {
  if (!Array.isArray(arr)) return [];
  return arr
    .map((x) =>
      typeof x === 'string'
        ? x
        : (x && (x.question || x.text)) ? String(x.question || x.text) : ''
    )
    .filter(Boolean);
}

// ---- main schema ----
const QuestionSchema = new mongoose.Schema(
  {
    subject: { type: String, index: true },
    medium:  { type: String, index: true },
    class:   { type: String, index: true },

    chapterId: { type: mongoose.Schema.Types.ObjectId, ref: 'Chapter' },
    chapter: {
      chapterNumber: { type: Number, index: true },
      title: String,
    },

    groupHeading:     { type: String, index: true },
    answerType:       { type: String, index: true },
    difficulty:       { type: String, index: true },
    marksPerQuestion: { type: Number, index: true },

    text:      { type: String },
    keyAnswer: { type: String },

    options: { type: [OptionSchema], default: [] },
    pairs:   { type: [PairSchema],   default: [] },
    items:   { type: [String],       default: [] },

    correctOrderById:    { type: [Number], default: [] },
    correctOrderIndices: { type: [Number], default: [] },
  },
  { timestamps: true, strict: true }
);

// Query performance
QuestionSchema.index({
  class: 1, medium: 1, subject: 1, 'chapter.chapterNumber': 1,
});
QuestionSchema.index({ groupHeading: 1, answerType: 1, difficulty: 1 });
// QuestionSchema.index({ marksPerQuestion: 1 });
// For search in DAO
QuestionSchema.index({ text: 'text', 'chapter.title': 'text' });

// Sanitize before save
QuestionSchema.pre('validate', function (next) {
  this.options = normalizeOptions(this.options);
  this.pairs   = normalizePairs(this.pairs);
  this.items   = normalizeItems(this.items);
  next();
});

// Sanitize on updates (findOneAndUpdate)
QuestionSchema.pre('findOneAndUpdate', function (next) {
  const update = this.getUpdate() || {};

  const setObj = update.$set ?? update;

  if (setObj.options !== undefined) {
    setObj.options = normalizeOptions(setObj.options);
  }
  if (setObj.pairs !== undefined) {
    setObj.pairs = normalizePairs(setObj.pairs);
  }
  if (setObj.items !== undefined) {
    setObj.items = normalizeItems(setObj.items);
  }

  // push back into update
  if (update.$set) update.$set = setObj;
  else this.setUpdate(setObj);

  next();
});

// Use explicit collection name "lba_questions"
module.exports = mongoose.model('Question', QuestionSchema, 'lba_questions');