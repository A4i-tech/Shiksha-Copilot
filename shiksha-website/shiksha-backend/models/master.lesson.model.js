require("dotenv").config();
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;
const masterLessonSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    class: {
      type: Number,
      required: true,
    },
    isAll: {
      type: Boolean,
    },
    board: {
      type: String,
      required: true,
    },
    medium: {
      type: String,
      required: true,
    },
    semester: {
      type: String,
    },
    subject: {
      type: String,
      required: true,
    },
    chapterId: {
      type: ObjectId,
      ref: "Chapter",
      required: true,
    },
    isRegenerated: {
      type: Boolean,
      default:false
    },
    subTopics: [
      {
        type: String,
      },
    ],
    teachingModel: [
      {
        type: String,
        ref: "TeachingModel",
      },
    ],
    instructionSet: {
      type: Object,
      default: {},
    },
    learningOutcomes: [{ type: Object, default: {} }],
    extractedResources: [
      {
        type: Object,
      },
    ],
    videos: [
      {
        title: { type: String },
        url: { type: String },
        selected: { type: Boolean}
      }
    ],
    documents: [
      {
        type: String,
      },
    ],
    interactOutput: [
      {
        type: String,
      },
    ],
    isDeleted: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: ['draft', 'under_review', 'approved'],
      default: 'approved',
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
	checkList: [
		{
			type: Object,
			default: {},
		},
	],
  sections: [
    {
      type: Object,
    },
  ],
  templateId:{
    type:ObjectId,
    ref:"LessonPlanTemplate"
  }
  },
  { timestamps: true }
);

masterLessonSchema.index({ isDeleted: 1, status: 1, createdBy: 1 });

const MasterLesson = mongoose.model("MasterLesson", masterLessonSchema);

module.exports = MasterLesson;
