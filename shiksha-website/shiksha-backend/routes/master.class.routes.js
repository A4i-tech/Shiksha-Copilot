const express = require("express");
const router = express.Router();
const asyncMiddleware = require("../middlewares/asyncMiddleware.js");
const MasterClassController = require("../controllers/master.class.controller.js");
const { validateMasterClass } = require("../validations/master.class.validation.js");
const { isAuthenticated, requirePermission } = require("../middlewares/auth.js");

const masterClassController = new MasterClassController();

router.post(
  "/master-class/create",
  isAuthenticated,
  requirePermission("content.manage"),
  validateMasterClass,
  asyncMiddleware(masterClassController.create.bind(masterClassController))
);

router.get(
  "/master-class/list",
  isAuthenticated,
  asyncMiddleware(masterClassController.getAll.bind(masterClassController))
);

router.get(
  "/master-class/:id",
  isAuthenticated,
  asyncMiddleware(masterClassController.getById.bind(masterClassController))
);

router.put(
  "/master-class/update",
  isAuthenticated,
  requirePermission("content.manage"),
  validateMasterClass,
  asyncMiddleware(masterClassController.update.bind(masterClassController))
);

router.delete(
  "/master-class/:id",
  isAuthenticated,
  requirePermission("content.manage"),
  asyncMiddleware(masterClassController.delete.bind(masterClassController))
);

module.exports = router;
