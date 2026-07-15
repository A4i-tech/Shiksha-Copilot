const express = require("express");
const router = express.Router();
const asyncMiddleware = require("../middlewares/asyncMiddleware.js");
const { isAuthenticated, requireAnyPermission, requirePermission } = require("../middlewares/auth.js");
const MasterLessonController = require("../controllers/master.lesson.controller.js");
const {
	validateMasterLessonCreate,
} = require("../validations/master.lesson.validation.js");
const MulterUploadMiddleware = require("../middlewares/multerUploadMiddleware.js");


const masterLessonController = new MasterLessonController();

router.post(
	"/master-lesson/create",
	validateMasterLessonCreate,
	asyncMiddleware(masterLessonController.create.bind(masterLessonController))
);

router.get(
	"/master-lesson/list",
	isAuthenticated,
	asyncMiddleware(masterLessonController.getAll.bind(masterLessonController))
);

router.post(
	"/lesson-plan/save-to-teacher",
	isAuthenticated,
	requireAnyPermission("lesson-plan.edit", "lesson-resource.edit"),
	asyncMiddleware(
		masterLessonController.saveToTeacher.bind(masterLessonController)
	)
);

router.post(
	"/lesson-plan/get-by-teacher",
	isAuthenticated,
	asyncMiddleware(
		masterLessonController.getByTeacher.bind(masterLessonController)
	)
);

router.get(
	"/master-lesson/activity/:id",
	isAuthenticated,
	requirePermission("content.activity.view"),
	asyncMiddleware(
		masterLessonController.getActivityById.bind(masterLessonController)
	)
);

router.post(
	"/lesson-plan/regenerate",
	isAuthenticated,
	requirePermission("lesson-plan.generate"),
	asyncMiddleware(
		masterLessonController.regenerateLessonPlan.bind(masterLessonController)
	)
);

router.post(
	"/lesson-plan/combo",
	asyncMiddleware(
		masterLessonController.comboScript.bind(masterLessonController)
	)
);

router.post(
	"/master-lesson/learning-outcomes",
	asyncMiddleware(
		masterLessonController.getLessonOutcomes.bind(masterLessonController)
	)
);

router.get(
	"/master-lesson/:lessonId",
	isAuthenticated,
	requirePermission("lesson-plan.generate"),
	asyncMiddleware(
		masterLessonController.generateLessonPlan.bind(masterLessonController)
	)
);

router.post(
    "/webhook/lesson-plan/update",
    asyncMiddleware(
        masterLessonController.updateLessonPlan.bind(masterLessonController)
    )
);

router.get(
	"/master-lesson/lesson/tables/:lessonId",
	isAuthenticated,
	asyncMiddleware(
		masterLessonController.get5ETables.bind(
			masterLessonController
		)
	)
);

router.post(
	"/master-lesson/upload",
	isAuthenticated,
	requirePermission("content.manage"),
	MulterUploadMiddleware,
	asyncMiddleware(
		masterLessonController.uploadMasterLesson.bind(masterLessonController)
	)
);

router.post(
	"/master-lesson/old-version-upload",
	isAuthenticated,
	requirePermission("content.manage"),
	MulterUploadMiddleware,
	asyncMiddleware(
		masterLessonController.uploadMasterLessonOlderVersion.bind(masterLessonController)
	)
);

module.exports = router;
