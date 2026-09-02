/**
 * Admin content-management routes.
 *
 * These routes replace the scripts under `reports/fixes/` and the direct
 * database edits that the admin team does today. Every route needs an
 * authenticated admin user. Every write route validates the body with a Joi
 * schema, and the schema is the write allow-list.
 *
 * Delete is a soft delete (`isDeleted: true`). Restore clears the flag.
 * A list route accepts `includeDeleted=0` for live records only,
 * `includeDeleted=2` for deleted records only, and no value for both.
 */

const express = require("express");
const router = express.Router();

const asyncMiddleware = require("../middlewares/asyncMiddleware.js");
const {
	isAuthenticated,
	requirePermission,
} = require("../middlewares/auth.js");

const ChapterController = require("../controllers/chapter.controller.js");
const MasterLessonController = require("../controllers/master.lesson.controller.js");
const MasterResourceController = require("../controllers/master.resource.controller.js");
const QuestionController = require("../controllers/question.controller.js");

const { validateChapterUpdate } = require("../validations/chapter.validation.js");
const validateRequest = require("../validations/common.validation.js");
const {
	bulkUploadSchema,
} = require("../validations/chapter.bulk.validation.js");

const validateChapterBulkUpload = validateRequest(bulkUploadSchema);
const {
	bulkUploadSchema: lessonPlanBulkUploadSchema,
} = require("../validations/master.lesson.bulk.validation.js");

const validateLessonPlanBulkUpload = validateRequest(lessonPlanBulkUploadSchema);
const {
	validateMasterLessonUpdate,
} = require("../validations/master.lesson.validation.js");
const {
	validateMasterResourceUpdate,
} = require("../validations/master.resource.validation.js");
const {
	validateQuestionContentUpdate,
} = require("../validations/question.content.validation.js");

const chapterController = new ChapterController();
const masterLessonController = new MasterLessonController();
const masterResourceController = new MasterResourceController();
const questionController = new QuestionController();

// Every route below this line needs the `content.manage` permission. The list
// routes also expose soft-deleted records, so they use the same permission as
// the write routes and not the weaker `content.view`.
router.use(
	"/admin/content",
	isAuthenticated,
	requirePermission("content.manage")
);

/**
 * Registers the five routes that each content entity gets.
 * @param {string} segment - path segment, for example "chapters"
 * @param {object} controller - controller instance
 * @param {Function} updateValidator - Joi middleware for the update body
 */
function registerEntity(segment, controller, updateValidator) {
	router.get(
		`/admin/content/${segment}`,
		asyncMiddleware(controller.getAll.bind(controller))
	);

	router.get(
		`/admin/content/${segment}/:id`,
		asyncMiddleware(controller.getById.bind(controller))
	);

	router.put(
		`/admin/content/${segment}/:id`,
		updateValidator,
		asyncMiddleware(controller.adminUpdate.bind(controller))
	);

	router.delete(
		`/admin/content/${segment}/:id`,
		asyncMiddleware(controller.delete.bind(controller))
	);

	router.patch(
		`/admin/content/${segment}/:id/restore`,
		asyncMiddleware(controller.activate.bind(controller))
	);
}

// Chapter upload. The admin team added chapters with scripts that wrote into
// MongoDB, so these two routes carry the whole gate: a JSON file of chapters,
// or one chapter from the admin form. `dryRun` validates and saves nothing.
// The file can hold up to 500 chapters, which is larger than the default body
// limit, so these routes parse the body with their own limit.
const chapterUploadBody = express.json({ limit: "10mb" });

router.post(
	"/admin/content/chapters/bulk-upload",
	chapterUploadBody,
	validateChapterBulkUpload,
	asyncMiddleware(chapterController.bulkUpload.bind(chapterController))
);

router.post(
	"/admin/content/chapters",
	chapterUploadBody,
	asyncMiddleware(chapterController.adminCreate.bind(chapterController))
);

registerEntity("chapters", chapterController, validateChapterUpdate);

// Lesson plan upload. Same shape as the chapter upload above: a JSON file of
// lesson plans, up to the same 10mb body limit, registered before the
// `:id` routes below so `bulk-upload` is never read as an `:id`.
router.post(
	"/admin/content/lesson-plans/bulk-upload",
	chapterUploadBody,
	validateLessonPlanBulkUpload,
	asyncMiddleware(masterLessonController.adminBulkUpload.bind(masterLessonController))
);

registerEntity("lesson-plans", masterLessonController, validateMasterLessonUpdate);
registerEntity("resources", masterResourceController, validateMasterResourceUpdate);
registerEntity("questions", questionController, validateQuestionContentUpdate);

module.exports = router;
