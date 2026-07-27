const express = require("express");
const asyncMiddleware = require("../middlewares/asyncMiddleware");
const { isAuthenticated, requirePermission } = require("../middlewares/auth");
const controller = require("../controllers/devtools.controller");

const router = express.Router();

router.post("/sessions", isAuthenticated, requirePermission("devtools.session"), asyncMiddleware(controller.session));
router.post("/fixtures", isAuthenticated, requirePermission("devtools.fixture"), asyncMiddleware(controller.fixtures));
router.delete("/fixtures", isAuthenticated, requirePermission("devtools.cleanup"), asyncMiddleware(controller.cleanup));

module.exports = router;
