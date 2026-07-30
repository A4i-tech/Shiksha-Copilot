const express = require("express");
const asyncMiddleware = require("../middlewares/asyncMiddleware");
const { isAuthenticated, requirePermission } = require("../middlewares/auth");
const ContentActivityController = require("../controllers/content.activity.controller");

const router = express.Router();
const controller = new ContentActivityController();

router.get(
  "/content-activity",
  isAuthenticated,
  requirePermission("content.activity.view"),
  asyncMiddleware(controller.contentActivity.bind(controller))
);
router.get(
  "/content-activity/export",
  isAuthenticated,
  requirePermission("content.activity.export"),
  asyncMiddleware(controller.exportContentActivity.bind(controller))
);

module.exports = router;
