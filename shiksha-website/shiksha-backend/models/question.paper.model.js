const mongoose = require('mongoose');

const QuestionPaperSchema = new mongoose.Schema(
  {
    teacherId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    config: {
      class: String,
      medium: String,
      subject: String,
      examName: String,
      examMarks: Number,
      chapterNumbers: [Number],
      selectedHeadings: [String]
    },
    QpgeneratedStatus: { type: String, enum: ['Pending', 'In Progress', 'Completed', 'Failed'], default: 'Pending' },
    totalMarks: Number,
    schoolName: String,
    // documentUrl: String, // URL to generated Word document
    type: {
      type: String,
      default: 'PREGENERATED'
    }
  },
  { timestamps: true }
);

// Explicitly bind to users_lba_qp collection
module.exports = mongoose.model('LBAQuestionPaper', QuestionPaperSchema, 'users_lba_qp');
