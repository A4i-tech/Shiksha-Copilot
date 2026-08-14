const teacherLessonPlanAggregation = require("../aggregation/teacher.lesson.plan.aggregation.js");
const TeacherLessonPlan = require("../models/teacher.lesson.plan.model.js");
const BaseDao = require("./base.dao.js");
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;
const AppError = require("../helper/app.error");

class TeacherLessonPlanDao extends BaseDao {
	constructor() {
		super(TeacherLessonPlan);
	}

	async saveToTeacher(teacherId, data, session = null) {
		data["isLesson"] = false;

		if (data?.lessonId) {
			data["isLesson"] = true;
		}

		let model = new TeacherLessonPlan({ ...data, teacherId });
		let result = await model.save(session ? { session } : {});

		return result;
	}

	async updatePlan(planId, data) {
		let update = {
			...data
		};

		let options = { new: true };

		return await TeacherLessonPlan.findByIdAndUpdate(planId, update, options);
	}

	async getByTeacher(teacherId, filters) {
		const processedFilters = {};
		let collection = "resource";

		if (filters.isLesson === "1") {
			collection = "lesson";
		}

		for (const key in filters) {
			if (key == "class") {
				processedFilters[`${collection}.class`] = Number(filters[key]);
			} else if (key == "isLesson") {
				continue;
			} else {
				processedFilters[`${collection}.${key}`] = filters[key];
			}
		}

		let lessonPlans =
			await teacherLessonPlanAggregation.getLessonBasedOnTeacherAndFilters(
				teacherId,
				processedFilters
			);

		return lessonPlans;
	}

	async getByTeacherAndPagination(
		teacherId,
		collection,
		page = 1,
		limit = 10,
		filters = {},
		sort = {}
	) {
		filters = { ...filters };
		const { fields } = filters;
		delete filters.fields;
		const processedFilters = {};

		for (const key in filters) {
			switch (key) {
				case "class": {
					processedFilters[`${collection}.class`] = Number(filters[key]);
					break;
				}
				case "type": {
					processedFilters["isLesson"] = collection == "lesson";
					break;
				}
				case "isCompleted" :{
					processedFilters["isCompleted"] = filters[key] === "true";
					break;
				}
				case "createdMonth": {
					processedFilters[key] = Number(filters[key]);
					break;
				}
				case "subTopics": {
					processedFilters[`${collection}.${key}`] = {
						$in: [filters[key], "$lesson.subTopics"],
					};
					break;
				}
				case "isGroupedSubTopics": {
					processedFilters[key] = filters[key] === "true";
					break;
				}
				case "isGenerated": {
					if (filters[key] === "true") {
							processedFilters["$and"] = [
							{ isGenerated: true },
							{ isCompleted: false }
						];
					} else {
						processedFilters["$or"] = [
							{ isGenerated: { $ne: true } },
							{ isCompleted: { $ne: false } }
						];
					}
					break;
				}
				case "topics":
				case "board":
				case "medium": {
					processedFilters[`${collection}.chapter.${key}`] = filters[key];
					break;
				}
				case "$or": {
					processedFilters[key] = filters[key];
					break;
				}
				default: {
					processedFilters[`${collection}.${key}`] = filters[key];
					break;
				}
			}
		}

		if (processedFilters['lesson.chapter.medium'] === "kannada" && processedFilters['lesson.subject']?.startsWith("english")) {
			delete processedFilters['lesson.chapter.medium']
		}

		let results =
			await teacherLessonPlanAggregation.getByTeacherAndPagination(
				teacherId,
				page,
				limit,
				processedFilters,
				sort,
				fields
			);


		const totalItems =
			results[0].totalCount.length > 0 ? results[0].totalCount[0].count : 0;
		return {
			page,
			totalItems,
			limit,
			results: results[0].data,
		};
	}

	async getByTeacherAndLesson(teacherId, lessonId) {
		return await TeacherLessonPlan.findOne({ teacherId, lessonId, isDeleted: { $ne: true } });
	}

	async getByTeacherAndResource(teacherId, resourceId) {
		return await TeacherLessonPlan.findOne({ teacherId, resourceId, isDeleted: { $ne: true } });
	}

	async updateForRegenerate(teacherId, oldLessonId, newLessonId, instanceId  ) {
		const lessonPlan = await TeacherLessonPlan.findOneAndUpdate(
			{ teacherId, lessonId: oldLessonId, isDeleted: { $ne: true } },
			{
				$set: {
					lessonId: newLessonId,
					instanceId,
					baseLessonId:oldLessonId,
					status :'running',
					isGenerated:true
				},
			},
			{ new: true }
		);

		if (!lessonPlan) {
			throw new AppError("Lesson plan not found", 404);
		}

		return lessonPlan;
	}

	async getLessonPlanById(teacherId, lessonPlanId) {
		try {
			const lessonPlan = await teacherLessonPlanAggregation.getLessonPlanById(
				teacherId,
				lessonPlanId
			);
			return lessonPlan;
		} catch (error) {
			console.error("Error getting lesson plan by ID:", error);
			throw new Error("Internal server error");
		}
	}

	async getResourcePlanById(teacherId, resourcePlanId) {
		try {
			const resourcePlan = await teacherLessonPlanAggregation.getResourcePlanById(
				teacherId,
				resourcePlanId
			);
			return resourcePlan;
		} catch (error) {
			console.error("Error getting resource plan by ID:", error);
			throw new Error("Internal server error");
		}
	}

	async deleteLessonPlan(teacherId, lessonPlanId) {
		try {
			const lessonPlan = await TeacherLessonPlan.findOneAndUpdate(
				{ teacherId, lessonId: lessonPlanId, isLesson: true, isDeleted: { $ne: true } },
				{ $set: { isDeleted: true } },
				{ new: true }
			);
			return lessonPlan;
		} catch (error) {
			console.error("Error deleting lesson plan:", error);
			throw new Error("Internal server error");
		}
	}

	async deleteResourcePlan(teacherId, resourcePlanId) {
		try {
			const resourcePlan = await TeacherLessonPlan.findOneAndUpdate(
				{ teacherId, resourceId: resourcePlanId, isLesson: false, isDeleted: { $ne: true } },
				{ $set: { isDeleted: true } },
				{ new: true }
			);
			return resourcePlan;
		} catch (error) {
			console.error("Error deleting resource plan:", error);
			throw new Error("Internal server error");
		}
	}

	async getRegeneratedLessonPlansCount(teacherId, fromDate, toDate){
		try{
			const query = {
				teacherId: new ObjectId(teacherId),  
				createdAt :{ 
					$gte: fromDate, 
					$lte: toDate  
				},
				isGenerated:true
			};
	
			const regeneratedLpsCount = await TeacherLessonPlan.countDocuments(query);
			return regeneratedLpsCount
		}catch(error){
			console.error("Error getting regenerated lessonplan:", error);
			throw new Error("Internal server error");
		}
	}
}

module.exports = TeacherLessonPlanDao;

