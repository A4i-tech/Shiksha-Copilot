const ScheduleDao = require("../dao/schedule.dao");
const formatApiReponse = require("../helper/response");
const BaseManager = require("./base.manager");
const overlap = require("../helper/overlap")
const { schoolDependency } = require("../helper/permission.helper");
const { isResourceAllowed } = require("../helper/scope.helper");
const School = require("../models/school.model");

/** @extends {BaseManager<ScheduleDao>} */
class ScheduleManager extends BaseManager {
	constructor() {
		super(new ScheduleDao());
	}

	async create(req) {
		try {
			const teacherId = req.user._id;
			const schoolId = schoolDependency(req.user.roles);

			let { scheduleDateTime, class: teacherClass, board, medium } = req.body;

			if(overlap(scheduleDateTime)){
				return formatApiReponse(
					false,
					"Overlap in entries",
					null,
				);
			}

			let seenSlots = new Set();
			for (let entry of scheduleDateTime) {
				let { date, fromTime, toTime } = entry;
				
				if (fromTime === toTime) {
					return formatApiReponse(
						false,
						"fromTime and toTime cannot be the same",
						{ date, fromTime, toTime }
					);
				}
	
				let key = `${date}-${fromTime}-${toTime}`;
				if (seenSlots.has(key)) {
					return formatApiReponse(
						false,
						"Duplicate time slot detected",
						{ date, fromTime, toTime }
					);
				}
				seenSlots.add(key);
			}

			let parallelSchedules = await this.dao.getParallelSchedules(
				schoolId,
				teacherClass,
				board,
				medium,
				teacherId,
				scheduleDateTime
			);

			if (!parallelSchedules.canSchedule) {
				return formatApiReponse(
					false,
					"parallel schedules exist",
					parallelSchedules
				);
			}

			let data = await this.dao.create({ ...req.body, teacherId, schoolId });
			if (data) {
				return formatApiReponse(true, "schedule created successfully!", data);
			}

			return formatApiReponse(false, "failed to create schedule", data);
		} catch (err) {
			return formatApiReponse(false, err.message, err);
		}
	}

	async update(scheduleId , data, user ) {
		try {
			let teacherId = user._id;

			let schedule = await this.dao.getById(scheduleId);

			if (!schedule) {
				return formatApiReponse(false, "Failed to update schedule info", null);
			}

			if (schedule.teacherId.toString() != teacherId.toString()) {
				return formatApiReponse(
					false,
					"You don't have permission to update the schedules of other teachers.",
					null
				);
			}

			const schoolId = schoolDependency(user.roles);

			let { scheduleDateTime, class: teacherClass, board, medium } = data;

			if(overlap(scheduleDateTime)){
				return formatApiReponse(
					false,
					"Overlap in entries",
					null
				);
			}

			let seenSlots = new Set();
			for (let entry of scheduleDateTime) {
				let { date, fromTime, toTime } = entry;
				
				// Check if fromTime is equal to toTime
				if (fromTime === toTime) {
					return formatApiReponse(
						false,
						"fromTime and toTime cannot be the same",
						{ date, fromTime, toTime }
					);
				}
	
				let key = `${date}-${fromTime}-${toTime}`;
				if (seenSlots.has(key)) {
					return formatApiReponse(
						false,
						"Duplicate time slot detected",
						{ date, fromTime, toTime }
					);
				}
				seenSlots.add(key);
			}

			let parallelSchedules = await this.dao.getParallelSchedules(
				schoolId,
				teacherClass,
				board,
				medium,
				teacherId,
				scheduleDateTime,
				scheduleId
			);

			if (!parallelSchedules.canSchedule) {
				return formatApiReponse(
					false,
					"parallel schedules exist",
					parallelSchedules
				);
			}

			schedule = await this.dao.update(scheduleId, { ...data, teacherId, schoolId });

			return formatApiReponse(true, "update success!", schedule);
		} catch (err) {
			return formatApiReponse(false, err?.message, err);
		}
	}

	async getAllSchedulesBasedOnTeacherId(teacherId) {
		try {
			let schedules = await this.dao.getAllSchedulesBasedOnTeacherId(
				teacherId
			);

			if (!schedules) {
				return formatApiReponse(false, "failed to get schedule info", null);
			}

			return formatApiReponse(true, "", schedules);
		} catch (err) {
			return formatApiReponse(false, err?.message, err);
		}
	}

	async getBySchool(user, fromDate, toDate, teacherClass ,teacherSchedule) {
		try {
			const teacherId = user._id;
			const schoolId = schoolDependency(user.roles);
			const classes = user.profiles.teacher.classes;

			let teacherClasses = [];

			if (teacherClass) {
				teacherClasses = [Number(teacherClass)];
			} else {
				for (let _class of classes) {
					if (!teacherClasses.includes(_class.class)) {
						teacherClasses.push(_class.class);
					}
				}
			}

			let schedules = await this.dao.getBySchool(
				schoolId,
				teacherClasses,
				fromDate,
				toDate,
				teacherId,
				teacherSchedule
			);

			if (!schedules) {
				return formatApiReponse(false, "failed to get schedule info", null);
			}

			return formatApiReponse(true, "", schedules);
		} catch (err) {
			return formatApiReponse(false, err?.message, err);
		}
	}

	async getMySchedules(teacherId, date) {
		try {
			let schedules = await this.dao.getMySchedules(teacherId, date);

			if (!schedules) {
				return formatApiReponse(false, "failed to get schedule info", null);
			}

			return formatApiReponse(true, "", schedules);
		} catch (err) {
			return formatApiReponse(false, err?.message, err);
		}
	}

	async getById(req) {
		try {
			const schedule = await this.dao.getById(req.params.id);
			if (!schedule) return formatApiReponse(false, "Schedule not found", null);
			const school = await School.findById(schedule.schoolId).lean();
			if (!school) throw new Error("Schedule school does not exist");
			if (!isResourceAllowed(req.permissions, "schedule.view", school)) return formatApiReponse(false, "Schedule not found", null);
			return formatApiReponse(true, "", schedule);
		} catch (err) {
			return formatApiReponse(false, err.message, err);
		}
	}

	async delete(req) {
		try {
			let { id, timeId } = req.params;

			let schedule = await this.dao.getOne({
				_id: id,
				teacherId: req.user._id,
				isDeleted: false,
			});

			if (!schedule) {
				return formatApiReponse(false, "failed to find schedule!", null);
			}

			let data = await this.dao.deleteDateTime(id, timeId);

			if (data.scheduleDateTime.length == 0) {
				data = await this.dao.delete(id);
			}

			if (!data) {
				return formatApiReponse(false, "failed to update schedule!", data);
			}

			return formatApiReponse(true, "schedule deleted successfully!", data);
		} catch (err) {
			return formatApiReponse(false, err.message, err);
		}
	}
}

module.exports = ScheduleManager;
