const express = require("express");
const router = express.Router();
const asyncMiddleware = require("../middlewares/asyncMiddleware.js");
const { isAuthenticated, requireAnyPermission, requirePermission } = require("../middlewares/auth.js");
const uploadMiddleware = require("../middlewares/uploadMiddleware.js");
const UserController = require("../controllers/user.controller.js");
const {
	validateUserCreate,
	validateUserUpdate,
	validateUserGetByPhone,
	validateSetProfile,
	validatePreferredLanguageUpdate,
	validateUserActivityLog,
} = require("../validations/user.validation.js");

const userController = new UserController();

router.post(
	"/users",
	isAuthenticated,
	requireAnyPermission("teacher.create", "staff.create"),
	requirePermission("role.assign"),
	validateUserCreate,
	asyncMiddleware(userController.create.bind(userController))
);

router.post(
	"/users/lookup",
	isAuthenticated,
	requireAnyPermission("teacher.view", "staff.view"),
	validateUserGetByPhone,
	asyncMiddleware(userController.getByPhone.bind(userController))
);

router.put(
	"/profile",
	isAuthenticated,
	requirePermission("profile.edit"),
	validateSetProfile,
	asyncMiddleware(userController.setProfile.bind(userController))
);

router.patch(
	"/profile/language",
	isAuthenticated,
	requirePermission("profile.edit"),
	validatePreferredLanguageUpdate,
	asyncMiddleware(userController.updatePreferredLanguage.bind(userController))
);

router.get(
	"/users",
	isAuthenticated,
	requireAnyPermission("teacher.view", "staff.view"),
	asyncMiddleware(userController.getAll.bind(userController))
);

router.get(
	"/users/export",
	isAuthenticated,
	requirePermission("teacher.export"),
	asyncMiddleware(userController.export.bind(userController))
);

router.get(
	"/users/:id/profile",
	isAuthenticated,
	requireAnyPermission("profile.view", "teacher.view", "staff.view"),
	asyncMiddleware(userController.getProfile.bind(userController))
);

router.put(
	"/users/:id",
	isAuthenticated,
	requireAnyPermission("teacher.edit", "staff.edit"),
	(req, res, next) => req.body.roles ? requirePermission("role.assign")(req, res, next) : next(),
	validateUserUpdate,
	asyncMiddleware(userController.update.bind(userController))
);

router.get(
	"/users/:id",
	isAuthenticated,
	requireAnyPermission("profile.view", "teacher.view", "staff.view"),
	asyncMiddleware(userController.getUserWithSchoolId.bind(userController))
);

router.delete(
	"/users/:id",
	isAuthenticated,
	requireAnyPermission("teacher.delete", "staff.delete"),
	asyncMiddleware(userController.delete.bind(userController))
);

router.post(
	"/users/import",
	isAuthenticated,
	requireAnyPermission("teacher.import", "staff.import"),
	requirePermission("role.assign"),
	uploadMiddleware,
	asyncMiddleware(userController.bulkUpload.bind(userController))
);

router.post(
	"/profile/image",
	isAuthenticated,
	requirePermission("profile.edit"),
	uploadMiddleware,
	asyncMiddleware(userController.uploadProfileImage.bind(userController))
);

router.delete(
	"/profile/image",
	isAuthenticated,
	requirePermission("profile.edit"),
	asyncMiddleware(userController.removeProfileImage.bind(userController))
);

router.put(
	"/users/:id/activate",
	isAuthenticated,
	requireAnyPermission("teacher.edit", "staff.edit"),
	asyncMiddleware(userController.activate.bind(userController))
);

router.put(
	"/users/:id/deactivate",
	isAuthenticated,
	requireAnyPermission("teacher.edit", "staff.edit"),
	asyncMiddleware(userController.deactivate.bind(userController))
);

router.post(
	"/activity-log",
	isAuthenticated,
	validateUserActivityLog,
	asyncMiddleware(userController.activityLog.bind(userController))
);

module.exports = router;
