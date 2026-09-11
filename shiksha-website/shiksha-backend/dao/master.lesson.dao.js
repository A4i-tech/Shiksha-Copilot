const masterLessonAggregation = require("../aggregation/master.lesson.aggregation");
const MasterLesson = require("../models/master.lesson.model");
const BaseDao = require("./base.dao.js");
const mongoose = require("mongoose");
const TeacherLessonPlanDao = require("./teacher.lesson.plan.dao");
const AppError = require("../helper/app.error");

class MasterLessonDao extends BaseDao {
	constructor() {
		super(MasterLesson);
		this.teacherLessonPlanDao = new TeacherLessonPlanDao();
	}

	async getAll(
		page = 1,
		limit = 10,
		filters = {},
		sort = {},
		status = {},
		userId
	) {
		const processedFilters = {};

		try {
			for (const key in filters) {
				if (key === "class") {
					processedFilters[key] = Number(filters[key]);
				} else if (key === "includeVideos" && filters[key] === "true") {
					processedFilters["videos"] = {
						$exists: true,
						$not: {
							$size: 0,
						},
					};
				} else if (key === "topics" || key === "board" || key === "medium") {
					processedFilters[`chapter.${key}`] = filters[key];
				} else if (key === "subTopics") {
					let targetItems = JSON.parse(filters[key]);
					processedFilters["$expr"] = {
						$and: [
							{ $isArray: "$subTopics" },
							{ $gt: [{ $size: "$subTopics" }, 0] },
							{ $eq: [{ $size: "$subTopics" }, targetItems.length] },
							{ $eq: [{ $type: "$subTopics" }, "array"] },
							{ $setIsSubset: [targetItems, "$subTopics"] },
							{ $setIsSubset: ["$subTopics", targetItems] },
						],
					};
				} else if (key === "includeVideos" && filters[key] !== "true") {
					processedFilters["videos"] = { $size: 0 };
				} else if (key === "isDeleted") {
					// query strings arrive as text; the aggregation needs a boolean
					processedFilters[key] = filters[key] === "true";
				} else {
					processedFilters[key] = filters[key];
				}
			}

			// `status` carries the isDeleted choice of the caller (includeDeleted
			// query parameter). It wins over the plain filters.
			Object.assign(processedFilters, status);

			const results = await masterLessonAggregation.getMasterLessonFilter(
				page,
				limit,
				processedFilters,
				sort
			);
			if (results[0].data.length === 1) {
				const lessonId = results[0].data[0]._id;
				const existingPlan = await this.teacherLessonPlanDao.getOne({
					teacherId: userId,
					lessonId: lessonId,
				});
				if (existingPlan) {
					throw new AppError(
						"There is a single LP available and the lesson plan already exists.",
						400
					);
				}
			}
			const totalItems =
				results[0].totalCount.length > 0 ? results[0].totalCount[0].count : 0;

			return {
				page,
				totalItems,
				limit,
				results: results[0].data,
			};
		} catch (err) {
			console.log("Error --> MasterLessonDao -> getAll()", err);
			throw err;
		}
	}

	async getByType(type) {
		let plan = await MasterLesson.findOne({ type, isDeleted: false });
		if (plan) return plan;
		return false;
	}

	async update(data, session = null) {
		const result = await MasterLesson.findOneAndUpdate(
			{
				_id: data?.id,
				isDeleted: false,
			},
			{
				$set: {
					sections:data?.sections
				},
			},
			{ new: true, useFindAndModify: false, session: session }
		);
		return result;
	}

	async updateByFilter(filter, updateData) {
		const result = await MasterLesson.findOneAndUpdate(
			filter,
			{ $set: updateData },
			{ new: true, timestamps:true }
		);

		return result;
	}

	async getLessonOutcomes(chapterId,templateIds, filters = {}) {
		const result = await masterLessonAggregation.getLessonOutcomes(
			chapterId,
			templateIds,
			filters
		);

		if (result.success) {
			return result.data;
		} else {
			throw new AppError("Failed to retrieve lesson outcomes", 400);
		}
	}

	async generateLessonPlan(lessonId, filters = {}) {
		let processedFilters = { ...filters };

		const result = await masterLessonAggregation.generateLessonPlan(
			lessonId,
			processedFilters
		);

		if (result.success) {
			return result.data;
		}

		throw new AppError("Failed to generate lesson plan", 400);
	}
}

module.exports = MasterLessonDao;
