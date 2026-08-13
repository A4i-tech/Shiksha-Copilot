const express = require("express");
const router = express.Router();
const asyncMiddleware = require("../middlewares/asyncMiddleware.js");
const { isAuthenticated, requirePermission } = require("../middlewares/auth.js");
const TeacherResourceFeedbackController = require("../controllers/teacher.feedback.controller.js");
const {
	validateTeacherResourceFeedback
} = require("../validations/teacher.feedback.validation.js");

const teacherResourceFeedbackController = new TeacherResourceFeedbackController();

router.post(
	"/teacher-resource-feedback/create",
	isAuthenticated,
	validateTeacherResourceFeedback,
	asyncMiddleware(teacherResourceFeedbackController.create.bind(teacherResourceFeedbackController))
);

router.get(
	"/teacher-resource-feedback/list",
	isAuthenticated,
	requirePermission("content.manage"),
	asyncMiddleware(teacherResourceFeedbackController.getAll.bind(teacherResourceFeedbackController))
);

router.get(
	"/teacher-resource-feedback/:id",
	isAuthenticated,
	requirePermission("content.manage"),
	validateTeacherResourceFeedback,
	asyncMiddleware(teacherResourceFeedbackController.getById.bind(teacherResourceFeedbackController))
);

router.put(
	"/teacher-resource-feedback/update/:id",
	isAuthenticated,
	requirePermission("content.manage"),
	validateTeacherResourceFeedback,
	asyncMiddleware(teacherResourceFeedbackController.update.bind(teacherResourceFeedbackController))
);

module.exports = router;
