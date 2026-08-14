const express = require("express");
const router = express.Router();
const asyncMiddleware = require("../middlewares/asyncMiddleware.js");
const LessonFeedbackController = require("../controllers/feedback.lesson.controller.js");
const {
	validateFeedbackLesson,
} = require("../validations/feedback.lesson.validation.js");
const { isAuthenticated, requirePermission } = require("../middlewares/auth.js");

const lessonFeedbackController = new LessonFeedbackController();

router.post(
	"/lesson-feedback/create",
	validateFeedbackLesson,
	isAuthenticated,
	asyncMiddleware(
		lessonFeedbackController.create.bind(lessonFeedbackController)
	)
);

router.get(
	"/lesson-feedback/list",
	isAuthenticated,
	requirePermission("content.manage"),
	asyncMiddleware(
		lessonFeedbackController.getAll.bind(lessonFeedbackController)
	)
);

router.get(
	"/lesson-feedback/get-by-teacher/:teacherId",
	isAuthenticated,
	requirePermission("content.manage"),
	asyncMiddleware(
		lessonFeedbackController.getByTeacher.bind(lessonFeedbackController)
	)
);

router.get(
	"/lesson-feedback/:id",
	isAuthenticated,
	requirePermission("content.manage"),
	validateFeedbackLesson,
	asyncMiddleware(
		lessonFeedbackController.getById.bind(lessonFeedbackController)
	)
);

router.put(
	"/lesson-feedback/update/:id",
	isAuthenticated,
	requirePermission("content.manage"),
	validateFeedbackLesson,
	asyncMiddleware(
		lessonFeedbackController.update.bind(lessonFeedbackController)
	)
);

module.exports = router;
