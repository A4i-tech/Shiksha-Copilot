const scheduleAggregation = require("../aggregation/schedule.aggreagtion");
const Schedule = require("../models/schedule.model");
const BaseDao = require("./base.dao");

/** @extends {BaseDao<typeof Schedule>} */
class ScheduleDao extends BaseDao {
	constructor() {
		super(Schedule);
	}

	async getById(id) {
		let result = await scheduleAggregation.getScheduleById(id);
		if (result.length > 0) {
			return result[0];
		}
		return false;
	}

	async update(id, updates, session = null) {
		const result = await this.Model.findOneAndUpdate(
			{
				_id: id,
				isDeleted: false,
			},
			{
				$set: updates,
			},
			{ new: true, useFindAndModify: false, session: session }
		);
		return result;
	}

	async getAllSchedulesBasedOnTeacherId(teacherId) {
		const schedules =
			await scheduleAggregation.getAllSchedulesBasedOnTeacherId(teacherId);
		return schedules;
	}

	async getBySchool(schoolId, teacherClasses, fromDate, toDate , teacherId, teacherSchedule) {
		const schedules = await scheduleAggregation.getBySchool(
			schoolId,
			teacherClasses,
			fromDate,
			toDate,
			teacherId,
			teacherSchedule
		);
		return schedules;
	}

	async getMySchedules(teacherId, date) {
		const schedules = await scheduleAggregation.getMySchedules(
			teacherId,
			date
		);
		return schedules;
	}

	async getParallelSchedules(
		schoolId,
		teacherClass,
		board,
		medium,
		teacherId,
		scheduleDateTime,
		scheduleId
	) {
		const schedules = await scheduleAggregation.getParallelSchedules(
			schoolId,
			teacherClass,
			board,
			medium,
			teacherId,
			scheduleDateTime,
			scheduleId
		);
		return schedules;
	}

	async deleteDateTime(scheduleId, timeId, session = null) {
		const result = await this.Model.findByIdAndUpdate(
			scheduleId,
			{
				$pull: {
					scheduleDateTime: {
						_id: timeId,
					},
				},
			},
			{
				new: true,
				runValidators: true,
				session: session,
			}
		);
		return result;
	}
}

module.exports = ScheduleDao;
