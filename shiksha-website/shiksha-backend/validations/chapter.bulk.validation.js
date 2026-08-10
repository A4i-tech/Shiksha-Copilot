/**
 * Validation rules for the admin chapter bulk upload.
 *
 * The admin team used to add chapters with one-off scripts that wrote straight
 * into MongoDB. Those scripts skipped every application-level check, so the
 * database collected chapters with a missing subject, empty or duplicate
 * shells, titles that still carried Markdown asterisks, and colliding order
 * numbers.
 *
 * This module holds the gate that stops the same records from arriving again.
 * Every rule here is a hard failure. The only soft rule is the index path: a
 * missing or non-standard index path is a warning, because the ingestion
 * pipeline writes that field after it indexes the textbook PDF.
 */

const Joi = require("joi");
const { objectId, textProblem, duplicates } = require("./bulk.validation.helpers");

/** Maximum number of chapters in one upload. */
const MAX_ROWS = 500;

/** Index path template that the ingestion pipeline writes. */
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
	// The server builds `topicsLearningOutcomes` from `subTopics`, so the upload
	// ignores this field. Old files that still carry it stay valid.
	topicsLearningOutcomes: Joi.any().strip(),
	learningOutcomes: Joi.array().items(Joi.string()).min(1).required(),
	indexPath: Joi.string().allow(""),
	isGrammar: Joi.boolean(),
	grammarTopics: Joi.array().items(Joi.string()),
	grammarSourceChapters: Joi.array().items(Joi.string()),
});

// The envelope check only looks at the container. `checkRow` checks each
// chapter, so that the answer can name the row that failed instead of stopping
// at the first Joi error. The rows array can arrive under `chapters` (the
// original name) or under `rows` (the generic name the lesson plan bulk
// upload also uses), but not both.
const rowsSchema = Joi.array().items(Joi.object()).min(1).max(MAX_ROWS);

const bulkUploadSchema = Joi.object({
	chapters: rowsSchema,
	rows: rowsSchema,
	dryRun: Joi.boolean(),
}).xor("chapters", "rows");

/**
 * Builds the index path that the ingestion pipeline uses for a chapter.
 * @param {object} chapter - board, medium, standard and orderNumber
 * @param {string} subjectName - `subjectName` of the master subject
 * @returns {string} the index path
 */
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

/**
 * Builds the identity key of a chapter. Two chapters with the same key are the
 * same chapter.
 * @param {object} chapter - chapter to key
 * @returns {string} the key
 */
function identityKey(chapter) {
	return [
		chapter.subjectId,
		chapter.board,
		String(chapter.medium).toLowerCase(),
		chapter.standard,
		String(chapter.topics).trim().toLowerCase(),
	].join("|");
}

/**
 * Builds the order key of a chapter. Two chapters with the same key claim the
 * same position in the same book.
 * @param {object} chapter - chapter to key
 * @returns {string} the key
 */
function orderKey(chapter) {
	return [
		chapter.subjectId,
		chapter.board,
		String(chapter.medium).toLowerCase(),
		chapter.standard,
		chapter.orderNumber,
	].join("|");
}

/**
 * Checks the shape and the content of one chapter. The check does not read the
 * database.
 * @param {object} chapter - chapter to check
 * @returns {{errors: string[], warnings: string[]}} the result
 */
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

/**
 * Checks a batch of chapters against each other. Two rows in one upload must
 * not describe the same chapter or claim the same order number.
 * @param {object[]} chapters - chapters to check
 * @returns {string[][]} one error list per row, by row index
 */
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
