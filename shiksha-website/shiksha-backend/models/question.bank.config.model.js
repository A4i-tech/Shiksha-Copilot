const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = mongoose.Types.ObjectId;

const marksDistributionSchema = new Schema({
  unitName: { type: String },
  marks: { type: Number },
  percentageDistribution: { type: Number }
});

const objectiveDistributionSchema = new Schema({
  objective: { type: String },
  shortName: { type: String },
  percentageDistribution: { type: Number }
});

const questionBankTemplateSchema = new Schema({
  type: { type: String },
  numberOfQuestions: { type: Number },
  marksPerQuestion: { type: Number }
});

const questionDistributionSchema = new Schema({
  unitName: { type: String },
  objective: { type: String }
});

const bluePrintTemplateSchema = new Schema({
  type: { type: String },
  numberOfQuestions: { type: Number },
  marksPerQuestion: { type: Number },
  questionDistribution: [questionDistributionSchema]
});

const questionBankConfigurationSchema = new Schema(
  {
    teacherId: {
      type: ObjectId,
      ref: "User",
      required: true,
    },
    board: { type: String, required: true },
    medium: { type: String, required: true },
    grade: { type: Number, required: true },
    subject: { type: String, required: true },
    examinationName: { type: String, required: false },
    chapterIds: [{ type: String, ref: "Chapter" }],
    topics: [{ type: String }],
    isMultiChapter: { type: Boolean },
    totalMarks: { type: Number },
    marksDistribution: [marksDistributionSchema],
    objectiveDistribution: [objectiveDistributionSchema],
    questionBankTemplate: [questionBankTemplateSchema],
    bluePrintTemplate: [bluePrintTemplateSchema],
    questionBank: {
      type: ObjectId,
      ref: "QuestionBank",
    },
  },
  { 
    timestamps: true,
    // Add this to prevent auto-indexing from crashing the app on startup
    autoIndex: false 
  }
);

// Define the index in the schema, but don't force build it immediately
questionBankConfigurationSchema.index({ teacherId: 1 });

// Check if model exists before defining (prevents OverwriteModelError)
const QuestionBankConfiguration = mongoose.models.QuestionBankConfiguration || mongoose.model(
  "QuestionBankConfiguration",
  questionBankConfigurationSchema
);

module.exports = QuestionBankConfiguration;
