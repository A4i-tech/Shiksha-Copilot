const handleError = require("../helper/handleError");
const formatApiReponse = require("../helper/response");
const ScheduleManager = require("../managers/schedule.manager");
const BaseController = require("./base.controller");

/** @extends {BaseController<ScheduleManager>} */
class ScheduleController extends BaseController {
	constructor() {
		super(new ScheduleManager());
	}

	async update(req, res) {
		const { _id } = req.body;

		req.body._id = undefined;

		const result = await this.manager.update(
			_id,
			req.body,
			req.user,
		);

		if (result.success) {
			return res.status(200).json(result);
		}

		handleError(result, res);
	}

	async getAllSchedulesBasedOnTeacherId(req, res) {
		const { teacherId } = req.params;

		const result = await this.manager.getAllSchedulesBasedOnTeacherId(
			teacherId
		);

		if (result.success) {
			return res.status(200).json(result);
		}

		handleError(result, res);
	}

	async getBySchool(req, res) {
		const { fromDate, toDate, teacherClass ,teacherSchedule } = req.query;

		const result = await this.manager.getBySchool(
			req.user,
			fromDate,
			toDate,
			teacherClass,
			teacherSchedule
		);

		if (result.success) {
			return res.status(200).json(result);
		}

		handleError(result, res);
	}

	async getMySchedules(req, res) {
		const { date } = req.query;

		const result = await this.manager.getMySchedules(
			req.user._id,
			date
		);

		if (result.success) {
			return res.status(200).json(result);
		}

		handleError(result, res);
	}
}

module.exports = ScheduleController;
