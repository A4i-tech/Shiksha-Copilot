const express = require("express");
const router = express.Router();
const asyncMiddleware = require("../middlewares/asyncMiddleware.js");
const ScheduleController = require("../controllers/schedule.controller.js");
const {
	validateScheduleCreate,
	validateScheduleUpdate,
} = require("../validations/schedule.validation.js");
const { isAuthenticated, requirePermission } = require("../middlewares/auth.js");

const scheduleController = new ScheduleController();

router.post(
	"/schedule/create",
	isAuthenticated,
	requirePermission("schedule.edit"),
	validateScheduleCreate,
	asyncMiddleware(scheduleController.create.bind(scheduleController))
);

router.get(
	"/schedule/get-by-school",
	isAuthenticated,
	requirePermission("schedule.view"),
	asyncMiddleware(scheduleController.getBySchool.bind(scheduleController))
);

router.get(
	"/schedule/my-schedules",
	isAuthenticated,
	requirePermission("schedule.view"),
	asyncMiddleware(scheduleController.getMySchedules.bind(scheduleController))
);

router.get(
	"/schedule/:id",
	isAuthenticated,
	requirePermission("schedule.view"),
	asyncMiddleware(scheduleController.getById.bind(scheduleController))
);

router.put(
	"/schedule/update",
	validateScheduleUpdate,
	isAuthenticated,
	requirePermission("schedule.edit"),
	asyncMiddleware(scheduleController.update.bind(scheduleController))
);

router.delete(
	"/schedule/:id/:timeId",
	isAuthenticated,
	requirePermission("schedule.edit"),
	asyncMiddleware(scheduleController.delete.bind(scheduleController))
);

module.exports = router;
