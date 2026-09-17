const mongoose = require("mongoose");
const BaseManager = require("./base.manager");
const QuestionDao = require("../dao/question.dao");
const Question = require("../models/question.model");
const Chapter = require("../models/chapter.model");
const formatApiReponse = require("../helper/response");
const { checkRow } = require("../validations/question.bulk.validation");

/** @extends {BaseManager<QuestionDao>} */
class QuestionManager extends BaseManager {
	constructor() {
		super(new QuestionDao());
	}

	async bulkUpload(questions, dryRun = false, userId) {
		try {
			if (!Array.isArray(questions) || questions.length === 0) {
				return formatApiReponse(
					false,
					"questions must be a non-empty array.",
					{}
				);
			}

			const chapterIds = [
				...new Set(
					questions
						.map((question) => question?.chapterId)
						.filter((id) => mongoose.Types.ObjectId.isValid(id))
				),
			];

			const existingChapters = await Chapter.find({
				_id: { $in: chapterIds },
				isDeleted: { $ne: true },
			})
				.select("_id")
				.lean();

			const validChapterIds = new Set(
				existingChapters.map((chapter) => String(chapter._id))
			);

			const rows = questions.map((question, index) => {
				const { errors, warnings } = checkRow(question);

				if (
					errors.length === 0 &&
					question?.chapterId &&
					!validChapterIds.has(String(question.chapterId))
				) {
					errors.push(
						`chapterId "${question.chapterId}" matches no active chapter. Give the id of an existing, non-deleted chapter.`
					);
				}

				return {
					row: index + 1,
					identity: (question?.text ?? "").slice(0, 80),
					errors,
					warnings,
				};
			});

			const documents = questions.map((question) =>
				this.withDraftMetadata({ ...question }, userId)
			);

			return this.finalizeBulkUpload({
				Model: Question,
				rows,
				documents,
				dryRun,
				entityLabel: "questions",
			});
		} catch (err) {
			console.error("bulkUpload failed:", err);
			return formatApiReponse(false, err?.message, null);
		}
	}
}

module.exports = QuestionManager;
