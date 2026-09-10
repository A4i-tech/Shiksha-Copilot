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

			const invalid = rows.filter((row) => row.errors.length > 0);

			const report = {
				dryRun,
				total: rows.length,
				valid: rows.length - invalid.length,
				invalid: invalid.length,
				inserted: 0,
				insertedIds: [],
				rows,
			};

			if (invalid.length > 0) {
				return formatApiReponse(
					false,
					`${invalid.length} of ${rows.length} questions failed validation. Nothing was saved.`,
					report
				);
			}

			if (dryRun) {
				return formatApiReponse(true, "All questions passed validation.", report);
			}

			const documents = questions.map((question) => ({
				...question,
				status: "draft",
				isDeleted: true,
				createdBy: userId,
			}));

			const saved = await Question.insertMany(documents, { ordered: true });

			report.inserted = saved.length;
			report.insertedIds = saved.map((question) => String(question._id));

			return formatApiReponse(
				true,
				`${saved.length} questions were added.`,
				report
			);
		} catch (err) {
			return formatApiReponse(false, err?.message, err);
		}
	}
}

module.exports = QuestionManager;
