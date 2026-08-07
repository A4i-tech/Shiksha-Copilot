const express = require("express");
const router = express.Router();
const asyncMiddleware = require("../middlewares/asyncMiddleware.js");
const FacilityController = require("../controllers/facility.controller.js");
const { validateFacilityCreate, validateFacilityUpdate } = require("../validations/facility.validation.js");

const facilityController = new FacilityController();

router.post(
	"/facility/create",
	validateFacilityCreate,
	asyncMiddleware(facilityController.create.bind(facilityController))
);

router.get(
	"/facility/list",
	asyncMiddleware(facilityController.getAll.bind(facilityController))
);

router.get(
	"/facility/:id",
	asyncMiddleware(facilityController.getById.bind(facilityController))
);

router.put(
	"/facility/update",
	validateFacilityUpdate,
	asyncMiddleware(facilityController.update.bind(facilityController))
);

router.delete(
	"/facility/:id",
	asyncMiddleware(facilityController.delete.bind(facilityController))
);

module.exports = router;
