const mongoose = require('mongoose');

const lbaFeedbackSchema = new mongoose.Schema(
  {
    questionPaperId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'LBAQuestionPaper',
      required: true
    },
    teacherId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    question: {
      type: String,
      required: true
    },
    feedback: {
      type: String,
      required: true
    },
    overallFeedback: {
      type: String
    },
    rating: {
      type: Number,
      min: 1,
      max: 5
    }
  },
  { timestamps: true }
);

// Explicitly bind to lba_feedback_collection
module.exports = mongoose.models.LBAFeedback || mongoose.model('LBAFeedback', lbaFeedbackSchema, 'lba_feedback_collection');
