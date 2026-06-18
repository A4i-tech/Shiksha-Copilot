const express = require("express");
const router = express.Router();
const asyncMiddleware = require("../middlewares/asyncMiddleware.js");
const SchoolController = require("../controllers/school.controller.js");
const { validateSchool } = require("../validations/school.validation.js");
const uploadMiddleware = require("../middlewares/uploadMiddleware.js");
const schoolController = new SchoolController();
const { isAuthenticated, requirePermission } = require("../middlewares/auth.js");

router.post(
	"/school/create",
	isAuthenticated,
	requirePermission("school.create"),
	validateSchool,
	asyncMiddleware(schoolController.create.bind(schoolController))
);

router.get(
	"/school/list",
	isAuthenticated,
	requirePermission("school.read"),
	asyncMiddleware(schoolController.getAll.bind(schoolController))
);

router.get(
	"/school/export",
	isAuthenticated,
	requirePermission("school.export"),
	asyncMiddleware(schoolController.export.bind(schoolController))
);

router.get(
	"/school/:id",
	isAuthenticated,
	requirePermission("school.read"),
	asyncMiddleware(schoolController.getById.bind(schoolController))
);

router.put(
	"/school/update/:id",
	isAuthenticated,
	requirePermission("school.edit"),
	validateSchool,
	asyncMiddleware(schoolController.update.bind(schoolController))
);

router.put(
	"/school/activate/:id",
	isAuthenticated,
	requirePermission("school.edit"),
	asyncMiddleware(schoolController.activate.bind(schoolController))
);

router.put(
	"/school/deactivate/:id",
	isAuthenticated,
	requirePermission("school.edit"),
	asyncMiddleware(schoolController.deactivate.bind(schoolController))
);

router.put(
	"/school/facility/:id",
	isAuthenticated,
	requirePermission("school.edit"),
	asyncMiddleware(schoolController.updateFacility.bind(schoolController))
);

router.delete(
	"/school/:id",
	isAuthenticated,
	requirePermission("school.delete"),
	asyncMiddleware(schoolController.delete.bind(schoolController))
);

router.post(
  "/school/bulk-upload",
  isAuthenticated,
  requirePermission("school.create"),
  uploadMiddleware,
  asyncMiddleware(schoolController.bulkUpload.bind(schoolController))
);

module.exports = router;
