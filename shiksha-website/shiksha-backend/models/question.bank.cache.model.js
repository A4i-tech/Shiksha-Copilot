const mongoose = require("mongoose");
const { Schema } = mongoose;

const questionSchema = new Schema({
  question: {
    type: Schema.Types.Mixed,
    required: true,
  },
  marks: {
    type: Number,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  objective: {
    type: String,
    required: true,
    index: true,
  },
});

const questionBankCacheSchema = new Schema(
  {
    chapterId: { type: String, required: true, index: true },
    unitName: { type: String, required: true, index: true },
    unitLevel: { type: String, required: true, index: true },
    questions: { type: [questionSchema], default: [] },
    version: { type: String },
  },
  { timestamps: true }
);

questionBankCacheSchema.index({
  chapterId: 1,
  unitLevel: 1,
  unitName: 1,
  "questions.objective": 1,
  "questions.type": 1,
  "questions.marks": 1,
});

const QuestionBankCache = mongoose.model(
  "QuestionBankCache",
  questionBankCacheSchema
);

module.exports = QuestionBankCache;
