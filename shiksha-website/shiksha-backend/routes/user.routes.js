const express = require("express");
const router = express.Router();
const asyncMiddleware = require("../middlewares/asyncMiddleware");
const {
  isAuthenticated,
  requireAnyPermission,
  requirePermission,
} = require("../middlewares/auth");
const uploadMiddleware = require("../middlewares/uploadMiddleware");
const UserController = require("../controllers/user.controller");
const {
  validateUserCreate,
  validateUserUpdate,
  validateUserGetByPhone,
  validateSetProfile,
  validatePreferredLanguageUpdate,
  validateUserActivityLog,
} = require("../validations/user.validation");

const controller = new UserController();

router.post(
  "/users",
  isAuthenticated,
  requireAnyPermission("teacher.create", "staff.create"),
  validateUserCreate,
  asyncMiddleware(controller.create.bind(controller))
);
router.post(
  "/users/lookup",
  isAuthenticated,
  requireAnyPermission("teacher.view", "staff.view"),
  validateUserGetByPhone,
  asyncMiddleware(controller.getByPhone.bind(controller))
);
router.get(
  "/users",
  isAuthenticated,
  requireAnyPermission("teacher.view", "staff.view"),
  asyncMiddleware(controller.getAll.bind(controller))
);
router.get(
  "/users/export",
  isAuthenticated,
  requirePermission("teacher.export"),
  asyncMiddleware(controller.export.bind(controller))
);
router.get(
  "/users/:id/profile",
  isAuthenticated,
  requireAnyPermission("profile.view", "teacher.view", "staff.view"),
  asyncMiddleware(controller.getProfile.bind(controller))
);
router.get(
  "/users/:id",
  isAuthenticated,
  requireAnyPermission("profile.view", "teacher.view", "staff.view"),
  asyncMiddleware(controller.getUserWithSchoolId.bind(controller))
);
router.put(
  "/users/:id",
  isAuthenticated,
  requireAnyPermission("teacher.edit", "staff.edit"),
  (req, res, next) => req.body.roles ? requirePermission("role.assign")(req, res, next) : next(),
  validateUserUpdate,
  asyncMiddleware(controller.update.bind(controller))
);
router.delete(
  "/users/:id",
  isAuthenticated,
  requireAnyPermission("teacher.delete", "staff.delete"),
  asyncMiddleware(controller.delete.bind(controller))
);
router.put(
  "/users/:id/activate",
  isAuthenticated,
  requireAnyPermission("teacher.edit", "staff.edit"),
  asyncMiddleware(controller.activate.bind(controller))
);
router.put(
  "/users/:id/deactivate",
  isAuthenticated,
  requireAnyPermission("teacher.edit", "staff.edit"),
  asyncMiddleware(controller.deactivate.bind(controller))
);
router.post(
  "/users/import",
  isAuthenticated,
  requireAnyPermission("teacher.import", "staff.import"),
  uploadMiddleware,
  asyncMiddleware(controller.bulkUpload.bind(controller))
);
router.put(
  "/profile",
  isAuthenticated,
  requirePermission("profile.edit"),
  validateSetProfile,
  asyncMiddleware(controller.setProfile.bind(controller))
);
router.patch(
  "/profile/language",
  isAuthenticated,
  requirePermission("profile.edit"),
  validatePreferredLanguageUpdate,
  asyncMiddleware(controller.updatePreferredLanguage.bind(controller))
);
router.post(
  "/profile/image",
  isAuthenticated,
  requirePermission("profile.edit"),
  uploadMiddleware,
  asyncMiddleware(controller.uploadProfileImage.bind(controller))
);
router.delete(
  "/profile/image",
  isAuthenticated,
  requirePermission("profile.edit"),
  asyncMiddleware(controller.removeProfileImage.bind(controller))
);
router.post(
  "/activity-log",
  isAuthenticated,
  validateUserActivityLog,
  asyncMiddleware(controller.activityLog.bind(controller))
);

module.exports = router;
