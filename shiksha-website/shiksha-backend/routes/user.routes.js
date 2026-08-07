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
	validateUserList,
	validateSetProfile,
	validatePreferredLanguageUpdate,
	validateUserActivityLog,
} = require("../validations/user.validation.js");

const userController = new UserController();

router.post(
	"/users",
	isAuthenticated,
	validateUserCreate,
	requirePermission("user.create"),
	asyncMiddleware(userController.create.bind(userController))
);

router.post(
	"/users/lookup",
	isAuthenticated,
	requirePermission("user.view"),
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
	validateUserList,
	requirePermission("user.view"),
	asyncMiddleware(userController.getAll.bind(userController))
);

router.get(
	"/users/export",
	isAuthenticated,
	requirePermission("user.export"),
	asyncMiddleware(userController.export.bind(userController))
);

router.get(
	"/users/:id/profile",
	isAuthenticated,
	requireAnyPermission("profile.view", "user.view"),
	asyncMiddleware(userController.getProfile.bind(userController))
);

router.put(
	"/users/:id",
	isAuthenticated,
	requirePermission("user.edit"),
	(req, res, next) => req.body.roles ? requirePermission("role.assign")(req, res, next) : next(),
	validateUserUpdate,
	asyncMiddleware(userController.update.bind(userController))
);

router.get(
	"/users/:id",
	isAuthenticated,
	requireAnyPermission("profile.view", "user.view"),
	asyncMiddleware(userController.getUserWithSchoolId.bind(userController))
);

router.delete(
	"/users/:id",
	isAuthenticated,
	requirePermission("user.delete"),
	asyncMiddleware(userController.delete.bind(userController))
);

router.post(
"/users/import",
	isAuthenticated,
	requirePermission("user.import"),
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
	requirePermission("user.delete"),
	asyncMiddleware(userController.activate.bind(userController))
);

router.put(
	"/users/:id/deactivate",
	isAuthenticated,
	requirePermission("user.delete"),
	asyncMiddleware(userController.deactivate.bind(userController))
);

router.post(
	"/activity-log",
	isAuthenticated,
	validateUserActivityLog,
	asyncMiddleware(userController.activityLog.bind(userController))
);

module.exports = router;
