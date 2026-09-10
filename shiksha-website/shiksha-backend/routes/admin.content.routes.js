// List routes take includeDeleted: 0 for live records only, 2 for deleted only, omitted for both.

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
const {
	bulkUploadSchema: resourceBulkUploadSchema,
} = require("../validations/master.resource.bulk.validation.js");
const validateResourceBulkUpload = validateRequest(resourceBulkUploadSchema);
const {
	bulkUploadSchema: questionBulkUploadSchema,
} = require("../validations/question.bulk.validation.js");
const validateQuestionBulkUpload = validateRequest(questionBulkUploadSchema);

const chapterController = new ChapterController();
const masterLessonController = new MasterLessonController();
const masterResourceController = new MasterResourceController();
const questionController = new QuestionController();

// Every route below this line needs the `admin.ingest` permission.
router.use(
	"/admin/content",
	isAuthenticated,
	requirePermission("admin.ingest")
);

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

// Custom 10mb body limit: a chapter file can hold up to 500 chapters, more than the default limit.
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

// Registered before the :id routes below so "bulk-upload" is never matched as an :id.
router.post(
	"/admin/content/lesson-plans/bulk-upload",
	chapterUploadBody,
	validateLessonPlanBulkUpload,
	asyncMiddleware(masterLessonController.adminBulkUpload.bind(masterLessonController))
);

router.post(
	"/admin/content/lesson-plans",
	chapterUploadBody,
	asyncMiddleware(masterLessonController.adminCreate.bind(masterLessonController))
);

registerEntity("lesson-plans", masterLessonController, validateMasterLessonUpdate);

router.post(
	"/admin/content/resources/bulk-upload",
	chapterUploadBody,
	validateResourceBulkUpload,
	asyncMiddleware(masterResourceController.bulkUpload.bind(masterResourceController))
);

router.post(
	"/admin/content/resources",
	chapterUploadBody,
	asyncMiddleware(masterResourceController.adminCreate.bind(masterResourceController))
);

registerEntity("resources", masterResourceController, validateMasterResourceUpdate);

router.post(
	"/admin/content/questions/bulk-upload",
	chapterUploadBody,
	validateQuestionBulkUpload,
	asyncMiddleware(questionController.bulkUpload.bind(questionController))
);

router.post(
	"/admin/content/questions",
	chapterUploadBody,
	asyncMiddleware(questionController.adminCreate.bind(questionController))
);

registerEntity("questions", questionController, validateQuestionContentUpdate);

module.exports = router;
