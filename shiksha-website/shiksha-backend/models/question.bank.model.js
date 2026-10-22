const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const _ = require('lodash');

// One entry per teacher-authored alternate-choice group within a section,
// e.g. "Q3 or Q4, answer 1". Referenced by matching choiceGroupId on the
// Mixed question objects in `questions` below.
const choiceGroupSchema = new Schema({
  groupId: { type: String, required: true },
  answerCount: { type: Number, default: 1 }
}, { _id: false });

const questionsSchema = new Schema({
  type:{
    type:String,
    required: true
  },
  numberOfQuestions:{
    type:Number,
    required: true
  },
  marksPerQuestion:{
    type:Number,
    required: true
  },
  // "N" of "answer any N of M" internal choice for this section.
  // Equal to numberOfQuestions = no choice (answer all).
  answerCount: { type: Number, required: true },
  // Teacher-authored pairwise/multi-way alternate groups (see choiceGroupSchema).
  // Individual questions carry a matching `choiceGroupId` inside their Mixed object.
  choiceGroups: [choiceGroupSchema],
  questions:[{ type: Schema.Types.Mixed }]
});

const questionBankSchema = new Schema({
  metadata: {
    schoolName: {
      type: String
    },
    docxUrl: {
      type: String
    }
  },
  questions:[questionsSchema],
  feedback: {
    question: {
      type: String,
    },
    feedback: {
      type: String,
    },
    overallFeedback: {
      type: String,
    },
  },
},
{ timestamps: true }
);

const QuestionBank = mongoose.model("QuestionBank", questionBankSchema);

module.exports = QuestionBank;
