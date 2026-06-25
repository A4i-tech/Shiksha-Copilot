const FacilityManager = require("../managers/facility.manager");
const BaseController = require("./base.controller");

/** @extends {BaseController<FacilityManager>} */
class FacilityController extends BaseController {
	constructor() {
		super(new FacilityManager());
	}
}

module.exports = FacilityController;
