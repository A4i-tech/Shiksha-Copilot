// index path is a warning not a hard error, because the ingestion pipeline writes it after indexing the PDF
const Joi = require("joi");
const { objectId, textProblem, duplicates } = require("./bulk.validation.helpers");

const MAX_ROWS = 500;

const INDEX_PATH_TEMPLATE =
	"shiksha/data_new_book/<board>/<medium>/<standard>/<subjectName>/pdf/<orderNumber>/index/pdf_idx";

const uploadRowSchema = Joi.object({
	subjectId: objectId.required(),
	topics: Joi.string().required(),
	medium: Joi.string().required(),
	standard: Joi.number().integer().min(1).max(12).required(),
	board: Joi.string().required(),
	orderNumber: Joi.number().integer().min(1).required(),
	subTopics: Joi.array().items(Joi.string()).min(1).required(),
	// server derives topicsLearningOutcomes from subTopics, so upload strips it; old files with it stay valid
	topicsLearningOutcomes: Joi.any().strip(),
	learningOutcomes: Joi.array().items(Joi.string()).min(1).required(),
	indexPath: Joi.string().allow(""),
	isGrammar: Joi.boolean(),
	grammarTopics: Joi.array().items(Joi.string()),
	grammarSourceChapters: Joi.array().items(Joi.string()),
});

// rows can arrive as `chapters` (original name) or `rows` (shared with lesson bulk upload), not both
const rowsSchema = Joi.array().items(Joi.object()).min(1).max(MAX_ROWS);

const bulkUploadSchema = Joi.object({
	chapters: rowsSchema,
	rows: rowsSchema,
	dryRun: Joi.boolean(),
}).xor("chapters", "rows");

function buildIndexPath(chapter, subjectName) {
	return [
		"shiksha/data_new_book",
		chapter.board,
		String(chapter.medium).toLowerCase(),
		chapter.standard,
		subjectName,
		"pdf",
		chapter.orderNumber,
		"index/pdf_idx",
	].join("/");
}

function identityKey(chapter) {
	return [
		chapter.subjectId,
		chapter.board,
		String(chapter.medium).toLowerCase(),
		chapter.standard,
		String(chapter.topics).trim().toLowerCase(),
	].join("|");
}

function orderKey(chapter) {
	return [
		chapter.subjectId,
		chapter.board,
		String(chapter.medium).toLowerCase(),
		chapter.standard,
		chapter.orderNumber,
	].join("|");
}

function checkRow(chapter) {
	const errors = [];
	const warnings = [];

	const { error } = uploadRowSchema.validate(chapter, {
		abortEarly: false,
		convert: false,
	});

	if (error) {
		error.details.forEach((detail) => errors.push(detail.message));
		return { errors, warnings };
	}

	const titleProblem = textProblem(chapter.topics);
	if (titleProblem) errors.push(`topics ${titleProblem}`);

	chapter.subTopics.forEach((subTopic, index) => {
		const problem = textProblem(subTopic);
		if (problem) errors.push(`subTopics[${index}] ${problem}`);
	});

	duplicates(chapter.subTopics).forEach((value) =>
		errors.push(`subTopics repeats "${value}"`)
	);

	chapter.learningOutcomes.forEach((outcome, index) => {
		const problem = textProblem(outcome);
		if (problem) errors.push(`learningOutcomes[${index}] ${problem}`);
	});

	duplicates(chapter.learningOutcomes).forEach((value) =>
		errors.push(`learningOutcomes repeats "${value}"`)
	);

	if (chapter.isGrammar === true) {
		if (!chapter.grammarTopics || chapter.grammarTopics.length === 0) {
			errors.push("isGrammar is true but grammarTopics is empty");
		}

		(chapter.grammarTopics || []).forEach((topic, index) => {
			const problem = textProblem(topic);
			if (problem) errors.push(`grammarTopics[${index}] ${problem}`);
		});
	}

	if (chapter.subTopics.length === 1 && chapter.learningOutcomes.length > 5) {
		warnings.push(
			`the chapter has one subtopic and ${chapter.learningOutcomes.length} learning outcomes. Check that the subtopic list is complete.`
		);
	}

	return { errors, warnings };
}

function checkBatch(chapters) {
	const perRow = chapters.map(() => []);
	const identitySeen = new Map();
	const orderSeen = new Map();

	chapters.forEach((chapter, index) => {
		if (!chapter || !chapter.subjectId) return;

		const identity = identityKey(chapter);
		if (identitySeen.has(identity)) {
			perRow[index].push(
				`row ${index + 1} repeats the chapter in row ${identitySeen.get(identity) + 1}`
			);
		} else {
			identitySeen.set(identity, index);
		}

		const order = orderKey(chapter);
		if (orderSeen.has(order)) {
			perRow[index].push(
				`row ${index + 1} uses order number ${chapter.orderNumber}, which row ${orderSeen.get(order) + 1} already uses for the same subject, board, medium and class`
			);
		} else {
			orderSeen.set(order, index);
		}
	});

	return perRow;
}

module.exports = {
	MAX_ROWS,
	INDEX_PATH_TEMPLATE,
	bulkUploadSchema,
	uploadRowSchema,
	buildIndexPath,
	textProblem,
	identityKey,
	orderKey,
	checkRow,
	checkBatch,
};
