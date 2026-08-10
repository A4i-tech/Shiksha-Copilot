/**
 * Validation rules for the admin master lesson plan bulk upload.
 *
 * The admin team used to add lesson plans with one-off scripts
 * (`uploadMasterLessonOlderVersion`) that wrote straight into MongoDB against
 * a `chapter_id` string the script parsed with regular expressions. Those
 * scripts skipped every application-level check and wrote fields the model
 * does not even declare (for example `preferredMot`), which Mongoose silently
 * drops. The database also collected lesson plans with no `chapterId`, no
 * content, and duplicate rows for the same chapter and subtopic set.
 *
 * This module holds the gate that stops the same mistakes from arriving
 * again. Every rule here is a hard failure. The soft rules are the fields
 * that content generation and outcome lookup need later but that do not stop
 * the row from being saved: `sections`, `learningOutcomes` and `templateId`.
 */

const Joi = require("joi");
const { objectId, textProblem, duplicates } = require("./bulk.validation.helpers");

/** Maximum number of lesson plans in one upload. */
const MAX_ROWS = 500;

const videoSchema = Joi.object({
	title: Joi.string().allow(""),
	url: Joi.string().allow(""),
	selected: Joi.boolean(),
});

// The write allow-list. Every key here is a real field of the MasterLesson
// model (`models/master.lesson.model.js`). `preferredMot` and every other key
// the old scripts wrote but the model never declared is left out on purpose:
// Mongoose silently drops it, so accepting it here would only hide the
// mistake instead of rejecting it.
const uploadRowSchema = Joi.object({
	name: Joi.string().required(),
	class: Joi.number().integer().min(1).max(12).required(),
	board: Joi.string().required(),
	medium: Joi.string().required(),
	semester: Joi.alternatives().try(Joi.string(), Joi.number()),
	subject: Joi.string().required(),
	chapterId: objectId.required(),
	isAll: Joi.boolean(),
	isRegenerated: Joi.boolean(),
	subTopics: Joi.array().items(Joi.string()),
	teachingModel: Joi.array().items(Joi.string()),
	instructionSet: Joi.alternatives().try(
		Joi.object(),
		Joi.array().items(Joi.object())
	),
	learningOutcomes: Joi.array().items(Joi.alternatives().try(Joi.string(), Joi.object())),
	extractedResources: Joi.array().items(Joi.object()),
	videos: Joi.array().items(videoSchema),
	documents: Joi.array().items(Joi.string()),
	interactOutput: Joi.array().items(Joi.string()),
	checkList: Joi.array().items(Joi.object()),
	sections: Joi.array().items(Joi.object()),
	templateId: objectId,
});

// The envelope check only looks at the container. `checkRow` checks each
// lesson plan, so that the answer can name the row that failed instead of
// stopping at the first Joi error. The rows array can arrive under `rows` or
// under `lessonPlans` (the name the older scripts and the admin UI already
// use for this payload) but not both.
const rowsSchema = Joi.array().items(Joi.object()).min(1).max(MAX_ROWS);

const bulkUploadSchema = Joi.object({
	rows: rowsSchema,
	lessonPlans: rowsSchema,
	dryRun: Joi.boolean(),
}).xor("rows", "lessonPlans");

/**
 * Builds the identity key of a lesson plan. Two lesson plans with the same
 * key describe the same content: the same chapter, either the whole chapter
 * (`isAll: true`) or the same set of subtopics.
 * @param {object} lessonPlan - lesson plan to key
 * @returns {string} the key
 */
function identityKey(lessonPlan) {
	const subTopicKey =
		lessonPlan.isAll === true
			? "ALL"
			: (lessonPlan.subTopics || [])
					.map((subTopic) => String(subTopic).trim().toLowerCase())
					.sort()
					.join(",");

	return [String(lessonPlan.chapterId), subTopicKey].join("|");
}

/**
 * Checks the shape and the content of one lesson plan. The check does not
 * read the database.
 * @param {object} lessonPlan - lesson plan to check
 * @returns {{errors: string[], warnings: string[]}} the result
 */
function checkRow(lessonPlan) {
	const errors = [];
	const warnings = [];

	const { error } = uploadRowSchema.validate(lessonPlan, {
		abortEarly: false,
		convert: false,
	});

	if (error) {
		error.details.forEach((detail) => errors.push(detail.message));
		return { errors, warnings };
	}

	const nameProblem = textProblem(lessonPlan.name);
	if (nameProblem) errors.push(`name ${nameProblem}`);

	const subjectProblem = textProblem(lessonPlan.subject);
	if (subjectProblem) errors.push(`subject ${subjectProblem}`);

	(lessonPlan.subTopics || []).forEach((subTopic, index) => {
		const problem = textProblem(subTopic);
		if (problem) errors.push(`subTopics[${index}] ${problem}`);
	});

	duplicates(lessonPlan.subTopics || []).forEach((value) =>
		errors.push(`subTopics repeats "${value}"`)
	);

	if (lessonPlan.isAll === false && (lessonPlan.subTopics || []).length === 0) {
		errors.push(
			"isAll is false but subTopics is empty. A subtopic-level lesson plan must list the subtopics it covers."
		);
	}

	(lessonPlan.learningOutcomes || []).forEach((outcome, index) => {
		if (typeof outcome !== "string") return;
		const problem = textProblem(outcome);
		if (problem) errors.push(`learningOutcomes[${index}] ${problem}`);
	});

	duplicates(
		(lessonPlan.learningOutcomes || []).filter((outcome) => typeof outcome === "string")
	).forEach((value) => errors.push(`learningOutcomes repeats "${value}"`));

	(lessonPlan.sections || []).forEach((section, index) => {
		if (!section || Object.keys(section).length === 0) {
			errors.push(`sections[${index}] is empty`);
		}
	});

	(lessonPlan.videos || []).forEach((video, index) => {
		if (!video.url || video.url.trim() === "") {
			errors.push(`videos[${index}] has no url`);
		}
	});

	if (!lessonPlan.sections || lessonPlan.sections.length === 0) {
		warnings.push(
			"sections is empty. This lesson plan has no content until the admin or the generation pipeline adds sections."
		);
	}

	if (!lessonPlan.learningOutcomes || lessonPlan.learningOutcomes.length === 0) {
		warnings.push(
			"learningOutcomes is empty. Outcome-based features (getLessonOutcomes) have nothing to return for this lesson plan."
		);
	}

	if (!lessonPlan.templateId) {
		warnings.push(
			"templateId is missing. Regeneration cannot look up the template's section shape without one."
		);
	}

	return { errors, warnings };
}

/**
 * Checks a batch of lesson plans against each other. Two rows in one upload
 * must not describe the same chapter and subtopic set.
 * @param {object[]} lessonPlans - lesson plans to check
 * @returns {string[][]} one error list per row, by row index
 */
function checkBatch(lessonPlans) {
	const perRow = lessonPlans.map(() => []);
	const identitySeen = new Map();

	lessonPlans.forEach((lessonPlan, index) => {
		if (!lessonPlan || !lessonPlan.chapterId) return;

		const identity = identityKey(lessonPlan);
		if (identitySeen.has(identity)) {
			perRow[index].push(
				`row ${index + 1} repeats the lesson plan in row ${identitySeen.get(identity) + 1}`
			);
		} else {
			identitySeen.set(identity, index);
		}
	});

	return perRow;
}

module.exports = {
	MAX_ROWS,
	bulkUploadSchema,
	uploadRowSchema,
	textProblem,
	identityKey,
	checkRow,
	checkBatch,
};
