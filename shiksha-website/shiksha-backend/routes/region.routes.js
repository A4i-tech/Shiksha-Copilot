const express = require("express");
const router = express.Router();
const asyncMiddleware = require("../middlewares/asyncMiddleware.js");
const RegionController = require("../controllers/region.controller.js");
const { isAuthenticated } = require("../middlewares/auth.js");

const regionController = new RegionController();

router.get(
	"/regions/list",
	isAuthenticated,
	asyncMiddleware(regionController.getAll.bind(regionController))
);

// Get all states
router.get(
	"/regions/states",
	isAuthenticated,
	asyncMiddleware(regionController.getStates.bind(regionController))
);

// Get zones for a state
router.get(
	"/regions/zones",
	isAuthenticated,
	asyncMiddleware(regionController.getZones.bind(regionController))
);

// Get districts for a zone
router.get(
	"/regions/districts",
	isAuthenticated,
	asyncMiddleware(regionController.getDistricts.bind(regionController))
);

// Get taluks for a district
router.get(
	"/regions/taluks",
	isAuthenticated,
	asyncMiddleware(regionController.getTaluks.bind(regionController))
);

// Get schools for a taluk
router.get(
	"/regions/schools",
	isAuthenticated,
	asyncMiddleware(regionController.getSchools.bind(regionController))
);

module.exports = router;
