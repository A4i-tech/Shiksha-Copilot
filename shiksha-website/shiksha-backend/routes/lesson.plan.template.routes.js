const LessonPlanTemplateController = require("../controllers/lesson.plan.template.controller");
const asyncMiddleware = require("../middlewares/asyncMiddleware");
const { isAuthenticated, requirePermission } = require("../middlewares/auth.js");

const router = require("express").Router();
const lessonPlanController = new LessonPlanTemplateController();

router.post(
  "/lesson-plan-template/create",
  isAuthenticated,
	requirePermission("content.manage"),
  asyncMiddleware(lessonPlanController.create.bind(lessonPlanController))
);

router.get(
  "/lesson-plan-template/list",
  isAuthenticated,
  requirePermission("content.view"),
  asyncMiddleware(lessonPlanController.findTemplates.bind(lessonPlanController))
);

router.get(
  "/lesson-plan-template/:id",
  isAuthenticated,
  requirePermission("content.view"),
  asyncMiddleware(lessonPlanController.getById.bind(lessonPlanController))
);
module.exports = router;
