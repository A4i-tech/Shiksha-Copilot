const express = require("express");
const router = express.Router();
const asyncMiddleware = require("../middlewares/asyncMiddleware");
const { isAuthenticated, requirePermission, requireUnscopedPermission } = require("../middlewares/auth");
const RoleController = require("../controllers/role.controller");
const { validateRoleCreate, validateRoleUpdate } = require("../validations/role.validation");

const controller = new RoleController();

router.get("/roles/permissions", isAuthenticated, requirePermission("role.view"), asyncMiddleware(controller.permissions.bind(controller)));
router.get("/roles/scope-types", isAuthenticated, requirePermission("role.view"), asyncMiddleware(controller.scopeTypes.bind(controller)));
router.get("/roles", isAuthenticated, requirePermission("role.view"), asyncMiddleware(controller.getAll.bind(controller)));
router.get("/roles/:id", isAuthenticated, requirePermission("role.view"), asyncMiddleware(controller.getById.bind(controller)));
router.post("/roles", isAuthenticated, requireUnscopedPermission("role.manage"), validateRoleCreate, asyncMiddleware(controller.create.bind(controller)));
router.put("/roles/:id", isAuthenticated, requireUnscopedPermission("role.manage"), validateRoleUpdate, asyncMiddleware(controller.update.bind(controller)));
router.delete("/roles/:id", isAuthenticated, requireUnscopedPermission("role.manage"), asyncMiddleware(controller.delete.bind(controller)));

module.exports = router;
