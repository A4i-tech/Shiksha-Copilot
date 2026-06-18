const express = require("express");
const router = express.Router();
const asyncMiddleware = require("../middlewares/asyncMiddleware.js");
const TeacherLessonPlanController = require("../controllers/teacher.lesson.plan.controller.js");
const { isAuthenticated, requirePermission } = require("../middlewares/auth.js");
const {
	validateTeacherLessonPlan,
} = require("../validations/teacher.lesson.plan.validation.js");

const teacherLessonPlanController = new TeacherLessonPlanController();

router.get(
	"/teacher-lesson-plan/list",
	isAuthenticated,
	validateTeacherLessonPlan,
	asyncMiddleware(
		teacherLessonPlanController.getByTeacherAndPagination.bind(
			teacherLessonPlanController
		)
	)
);

router.get(
	"/teacher-lesson-plan/monthly-count",
	isAuthenticated,
	asyncMiddleware(
		teacherLessonPlanController.getMonthlyCount.bind(
			teacherLessonPlanController
		)
	)
);

router.get(
    "/teacher-lesson-plan/regeneration-limit",
    isAuthenticated,
    asyncMiddleware(
        teacherLessonPlanController.getRegenerationLimit.bind(
            teacherLessonPlanController
        )
    )
);

router.post(
    "/teacher-lesson-plan/generate",
    isAuthenticated,
    requirePermission("lesson-plan.generate"),
    asyncMiddleware(
        teacherLessonPlanController.generateContent.bind(
            teacherLessonPlanController
        )
    )
);

router.post(
    "/teacher-lesson-plan/regenerate",
    isAuthenticated,
    requirePermission("lesson-plan.generate"),
    asyncMiddleware(
        teacherLessonPlanController.regenerateContent.bind(
            teacherLessonPlanController
        )
    )
);

router.post(
	"/teacher-lesson-plan/retry",
	isAuthenticated,
	requirePermission("lesson-plan.generate"),
	asyncMiddleware(
		teacherLessonPlanController.retryLessonPlan.bind(
			teacherLessonPlanController
		)
	)
);

router.post(
	"/teacher-lesson-plan/section-ai-edit",
	isAuthenticated,
	asyncMiddleware(
		teacherLessonPlanController.sectionAiEdit.bind(
			teacherLessonPlanController
		)
	)
);

router.post(
	"/teacher-lesson-plan/plan-ai-edit",
	isAuthenticated,
	asyncMiddleware(
		teacherLessonPlanController.planAiEdit.bind(
			teacherLessonPlanController
		)
	)
);

router.post(
    "/teacher-lesson-plan/webhook",
    asyncMiddleware(
        teacherLessonPlanController.handleWebhook.bind(
            teacherLessonPlanController
        )
    )
);

router.post(
    "/teacher-lesson-plan/lesson/:lessonPlanId/media",
	isAuthenticated,
    requirePermission("lesson-plan.edit"),
    asyncMiddleware(
        teacherLessonPlanController.lessonMediaUploads.bind(
            teacherLessonPlanController
        )
    )
);

router.delete(
    "/teacher-lesson-plan/lesson/:lessonPlanId/media",
	isAuthenticated,
    requirePermission("lesson-plan.edit"),
    asyncMiddleware(
        teacherLessonPlanController.deleteLessonMediaUploads.bind(
            teacherLessonPlanController
        )
    )
);

router.post(
    "/teacher-lesson-plan/resource/:resourcePlanId/media",
	isAuthenticated,
    requirePermission("lesson-resource.edit"),
    asyncMiddleware(
        teacherLessonPlanController.resourceMediaUploads.bind(
            teacherLessonPlanController
        )
    )
);

router.delete(
    "/teacher-lesson-plan/resource/:resourcePlanId/media",
	isAuthenticated,
    requirePermission("lesson-resource.edit"),
    asyncMiddleware(
        teacherLessonPlanController.deleteResourceMediaUploads.bind(
            teacherLessonPlanController
        )
    )
);

router.get(
	"/teacher-lesson-plan/exists/:lessonPlanId",
	isAuthenticated,
	asyncMiddleware(
		teacherLessonPlanController.checkIfLessonPlanExists.bind(
			teacherLessonPlanController
		)
	)
);


router.get(
	"/teacher-lesson-plan/lesson/:lessonPlanId",
	isAuthenticated,
	asyncMiddleware(
		teacherLessonPlanController.getLessonPlanById.bind(
			teacherLessonPlanController
		)
	)
);


router.get(
	"/teacher-lesson-plan/presentation/:lessonPlanId",
	isAuthenticated,
	asyncMiddleware(
		teacherLessonPlanController.getLessonPlanPresentation.bind(
			teacherLessonPlanController
		)
	)
);


router.post(
	"/teacher-lesson-plan/presentation/:lessonPlanId",
	isAuthenticated,
	asyncMiddleware(
		teacherLessonPlanController.generateLessonPlanPresentation.bind(
			teacherLessonPlanController
		)
	)
);

router.get(
	"/teacher-lesson-plan/resource/:resourcePlanId",
	isAuthenticated,
	asyncMiddleware(
		teacherLessonPlanController.getResourcePlanById.bind(
			teacherLessonPlanController
		)
	)
);

router.delete(
	"/teacher-lesson-plan/lesson/:lessonPlanId",
	isAuthenticated,
	asyncMiddleware(
		teacherLessonPlanController.deleteLessonPlan.bind(
			teacherLessonPlanController
		)
	)
);

router.delete(
	"/teacher-lesson-plan/resource/:resourcePlanId",
	isAuthenticated,
	asyncMiddleware(
		teacherLessonPlanController.deleteResourcePlan.bind(
			teacherLessonPlanController
		)
	)
);


module.exports = router;
