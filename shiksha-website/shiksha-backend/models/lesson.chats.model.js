const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ObjectId = mongoose.Types.ObjectId;

const lessonChatSchema = new Schema(
	{
		teacherId: {
			type: ObjectId,
			required: true,
			ref: "User",
		},
		recordId: {
			type: ObjectId,
			required: true,
			ref: "TeacherLessonPlan",
		},
		message: {
			question: {
				type: String,
				required: [true, "Question is required"],
			},
			answer: {
				type: String,
				required: [true, "Answer is required"],
			},
			references: [
				{
					title: { type: String },
					url: { type: String },
					text: { type: String },
				},
			],
			timestamp: {
				type: Date,
				default: Date.now,
			},
			version: {
				type: Number
			}
		},
	},
	{
		timestamps: true,
	}
);

lessonChatSchema.index(
	{ teacherId: 1, createdAt: -1 },
	{ name: "idx_lesson_chat_dashboard", background: true }
);

const LessonChat = mongoose.model("LessonChat", lessonChatSchema);

module.exports = LessonChat;
