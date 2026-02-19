const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;
const User = require("../models/user.model");
const Chat = require("../models/chat.model");
const TeacherLessonPlan = require("../models/teacher.lesson.plan.model");
const LessonChat = require("../models/lesson.chats.model");
const LessonFeedback = require("../models/feedback.lesson.model");
const { parseDate } = require("../helper/formatter");
const logger = require("../config/loggers");

class DashboardAggregation {

	_createHierarchicalMatchAndGroup(query, prefix = "") {
		const p = prefix ? prefix + "." : "";
		const f = (field) => "$" + p + field;

		let matchConditions = {};
		let groupByFields = {
			_id: {},
			lessonPlanCount: { $sum: 1 },
		};

		if (query.schoolId && ObjectId.isValid(query.schoolId)) {
			matchConditions[p + "school"] = new ObjectId(query.schoolId);
			// One row per teacher at this school; group by teacher _id.
			groupByFields._id = f("_id");
			groupByFields.name = { $first: f("name") };
		}
		else {

			groupByFields._id.state = f("state");

			if (query.state) {
				matchConditions[p + "state"] = query.state;
				groupByFields._id.zone = f("zone");

				if (query.zone) {
					matchConditions[p + "zone"] = query.zone;
					groupByFields._id.district = f("district");

					if (query.district) {
						matchConditions[p + "district"] = query.district;
						groupByFields._id.block = f("block");

						if (query.block) {
							matchConditions[p + "block"] = query.block;
							groupByFields._id.school = f("school");
							groupByFields.schoolName = { $first: "$schoolDetails.name" }
						}
					}
				}
			}
		}
		return { matchConditions, groupByFields };
	}


	async getDashboardMetrics(query) {
		query = query || {};
		// User-level match: same hierarchy as lesson plans (school/state/zone/district/block) so dashboard metrics are consistent.
		const { matchConditions: userMatchConditions } = this._createHierarchicalMatchAndGroup(query, "");

		// 1. Prepare User Aggregation (Activity/Counts) - runs on User collection
		const userCountsPipeline = [
			...(Object.keys(userMatchConditions).length > 0 ? [{ $match: userMatchConditions }] : []),
			{
				$facet: {
					counts: [
						{
							$group: {
								_id: null,
								activeCount: {
									$sum: {
										$cond: [{ $eq: ["$isDeleted", false] }, 1, 0],
									},
								},
								inactiveCount: {
									$sum: {
										$cond: [{ $eq: ["$isDeleted", true] }, 1, 0],
									},
								},
							},
						},
						{
							$project: {
								_id: 0,
								activeUsers: "$activeCount",
								inactiveUsers: "$inactiveCount",
							},
						},
					],
					allUsers: [
						{
							$project: {
								_id: 1,
								name: 1,
								isDeleted: 1,
								role: 1,
							},
						},
						{
							$sort: { name: 1 },
						},
						{
							$limit: 3,
						},
					],
					activeUsers: [
						{
							$match: { isDeleted: false },
						},
						{
							$project: {
								_id: 1,
								name: 1,
							},
						},
						{
							$sort: { name: 1 },
						},
						{
							$limit: 3,
						},
					],
					inactiveUsers: [
						{
							$match: { isDeleted: true },
						},
						{
							$project: {
								_id: 1,
								name: 1,
							},
						},
						{
							$sort: { name: 1 },
						},
						{
							$limit: 3,
						},
					],
				},
			},
			{
				$project: {
					allUsers: 1,
					activeUsers: 1,
					inactiveUsers: 1,
					userCounts: {
						$ifNull: [{ $arrayElemAt: ["$counts", 0] }, { activeUsers: 0, inactiveUsers: 0 }]
					}
				},
			},
		];

		const userMediumsPipeline = [
			...(Object.keys(userMatchConditions).length > 0 ? [{ $match: userMatchConditions }] : []),
			{
				$unwind: {
					path: "$classes",
					preserveNullAndEmptyArrays: true,
				},
			},
			{
				$group: {
					_id: {
						medium: "$classes.medium",
						userId: "$_id",
					},
					user: { $first: "$$ROOT" },
				},
			},
			{
				$group: {
					_id: "$_id.medium",
					users: { $addToSet: "$user" },
				},
			},
			{
				$match: {
					_id: { $ne: null }
				},
			},
			{
				$project: {
					medium: "$_id",
					users: {
						$slice: [
							{
								$map: {
									input: "$users",
									as: "user",
									in: {
										_id: "$$user._id",
										name: "$$user.name",
										isDeleted: "$$user.isDeleted",
										role: "$$user.role",
									},
								},
							},
							3 // Limit the number of users to 3
						],
					},
					_id: 0,
				},
			},
		];

		// 2. Prepare Lesson Plan Aggregations - runs on TeacherLessonPlan collection
		// We invert the join: Start from Plans -> Lookup Users

		const { matchConditions, groupByFields } = this._createHierarchicalMatchAndGroup(query, "teacher");

		const safeParseDate = (str, isStartOfDay) => {
			if (!str || typeof str !== "string") return undefined;
			try {
				const d = parseDate(str, isStartOfDay);
				return d && !isNaN(d.getTime()) ? d : undefined;
			} catch {
				return undefined;
			}
		};

		let dateMatch = {};
		const fromDate = safeParseDate(query.fromDate, true);
		const toDate = safeParseDate(query.toDate, false);
		if (fromDate || toDate) {
			dateMatch = {
				createdAt: {
					...(fromDate ? { $gte: fromDate } : {}),
					...(toDate ? { $lte: toDate } : {}),
				}
			};
		}

		// Initial match on the Plans collection (indexed fields).
		// Only filter by isLesson when explicitly set (avoids undefined excluding all docs).
		const planMatchStage = {
			$match: {
				...(query.isLesson !== undefined ? { isLesson: query.isLesson } : {}),
				isCompleted: true,
				...dateMatch
			}
		};

		// Reuseable stages for subject/medium counts (masterlessons when isLesson true, else masterresources).
		let masterDataStages = [
			{
				$lookup: {
					from: "masterlessons",
					localField: "lessonId", // Direct field in TeacherLessonPlan
					foreignField: "_id",
					as: "lessonDetails",
				},
			},
		];

		// When isLesson is false or undefined, use masterresources; when true, use masterlessons (set above).
		if (!query.isLesson) {
			masterDataStages = [
				{
					$lookup: {
						from: "masterresources",
						localField: "resourceId", // Direct field in TeacherLessonPlan
						foreignField: "_id",
						as: "lessonDetails",
					},
				},
			];
		}

		const lessonPlanCount = [
			planMatchStage,
			{
				$lookup: {
					from: "users",
					localField: "teacherId",
					foreignField: "_id",
					as: "teacher"
				}
			},
			{ $unwind: "$teacher" },
			// Apply Location Filters on the joined 'teacher' object
			...(Object.keys(matchConditions).length > 0 ? [{ $match: matchConditions }] : []),
			{
				$lookup: {
					from: "schools",
					localField: "teacher.school", // teacher.school is from the joined user
					foreignField: "_id",
					as: "schoolDetails",
				},
			},
			{
				$unwind: {
					path: "$schoolDetails",
					preserveNullAndEmptyArrays: true,
				},
			},
			{
				$group: groupByFields
			},
			{
				$project: {
					_id: 0,
					lessonPlanCount: 1,
					name: {
						$ifNull: [
							"$name",
							{
								$ifNull: [
									"$schoolName",
									{
										$ifNull: [
											"$_id.block",
											{
												$ifNull: [
													"$_id.district",
													{
														$ifNull: [
															"$_id.zone",
															"$_id.state"
														]
													}
												]
											}
										]
									}
								]
							}
						]
					}
				}
			},
			{
				$sort: {
					state: 1,
					zone: 1,
					district: 1,
					block: 1,
					school: 1,
					name: 1,
				},
			},
		];

		// Subject here = grouping field from lessonDetails; mastersubjects join is by subjectName.
		const lessonPlanCountBySubject = [
			planMatchStage,
			{
				$lookup: {
					from: "users",
					localField: "teacherId",
					foreignField: "_id",
					as: "teacher"
				}
			},
			{ $unwind: "$teacher" },
			...(Object.keys(matchConditions).length > 0 ? [{ $match: matchConditions }] : []),

			...masterDataStages,
			{
				$unwind: {
					path: "$lessonDetails",
					preserveNullAndEmptyArrays: true,
				},
			},
			{
				$group: {
					_id: "$lessonDetails.subject",
					count: { $sum: 1 },
				},
			},
			{
				$lookup: {
					from: 'mastersubjects',
					localField: '_id',
					foreignField: 'subjectName',
					as: 'subjectDetails'
				}
			},
			{
				$unwind: {
					path: '$subjectDetails',
					preserveNullAndEmptyArrays: true
				}
			},
			{
				$project: {
					_id: 0,
					subject: '$subjectDetails',
					lessonPlanCount: '$count'
				}
			},
			{
				$sort: {
					'subject.subjectName': 1
				}
			}
		];

		const lessonPlanCountByMedium = [
			planMatchStage,
			{
				$lookup: {
					from: "users",
					localField: "teacherId",
					foreignField: "_id",
					as: "teacher"
				}
			},
			{ $unwind: "$teacher" },
			...(Object.keys(matchConditions).length > 0 ? [{ $match: matchConditions }] : []),

			...masterDataStages,
			{
				$unwind: {
					path: "$lessonDetails",
					preserveNullAndEmptyArrays: true,
				},
			},
			{
				$group: {
					_id: "$lessonDetails.medium",
					count: { $sum: 1 },
				},
			},
			{
				$project: {
					_id: 0,
					medium: "$_id",
					lessonPlanCount: "$count",
				},
			},
		];

		// 3. Feedback aggregation - Apply hierarchy filters to match dashboard scope (match on teacher.* after lookup)
		const { matchConditions: feedbackMatchConditions } = this._createHierarchicalMatchAndGroup(query, "teacher");
		const feedbackCountBySubject = [
			{
				$lookup: {
					from: "users",
					localField: "teacherId",
					foreignField: "_id",
					as: "teacher",
				},
			},
			{
				$unwind: {
					path: "$teacher",
					preserveNullAndEmptyArrays: false,
				},
			},
			// Apply hierarchy filters on teacher to match dashboard scope
			...(Object.keys(feedbackMatchConditions).length > 0 ? [{ $match: feedbackMatchConditions }] : []),
			{
				$lookup: {
					from: "masterlessons",
					localField: "lessonId",
					foreignField: "_id",
					as: "lesson",
				},
			},
			{
				$unwind: {
					path: "$lesson",
					preserveNullAndEmptyArrays: false,
				},
			},
			{
				$match: {
					feedback: { $exists: true, $ne: null, $ne: "" }
				}
			},
			{
				$group: {
					_id: "$feedback",
					count: {
						$sum: 1,
					},
				},
			},
		];

		// 4. Chat Request Count (Optimized). Time window is second-precision by createdAt; same window used for Chat and LessonChat below.
		const sixMonthsAgo = new Date();
		sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
		const now = new Date();

		// Generate last 6 months array (MongoDB compatible - works on all versions)
		const months = [];
		const today = new Date();
		for (let i = 5; i >= 0; i--) {
			const date = new Date(today.getFullYear(), today.getMonth() - i, 1);
			months.push({
				month: date.toISOString().substr(0, 7),
				requestCount: 0,
			});
		}

		// Optimized: Start from Chat collection; 6-month window by createdAt.
		// Apply hierarchy filters by joining with users first
		const { matchConditions: chatUserMatchConditions } = this._createHierarchicalMatchAndGroup(query, "user");
		const requestCountPipeline = [
			{
				$match: {
					createdAt: { $gte: sixMonthsAgo, $lte: now }
				}
			},
			// Join with users to apply hierarchy filters
			{
				$lookup: {
					from: "users",
					localField: "userId",
					foreignField: "_id",
					as: "user",
				},
			},
			{
				$unwind: {
					path: "$user",
					preserveNullAndEmptyArrays: false,
				},
			},
			// Apply hierarchy filters on user (fields prefixed with "user.")
			...(Object.keys(chatUserMatchConditions).length > 0 ? [{ $match: chatUserMatchConditions }] : []),
			{
				$addFields: {
					yearMonth: {
						$dateToString: { format: "%Y-%m", date: "$createdAt" },
					},
				},
			},
			{
				$group: {
					_id: "$yearMonth",
					requestCount: { $sum: "$requestCount" },
				},
			},
			{
				$sort: {
					_id: 1,
				},
			},
			{
				$project: {
					_id: 0,
					month: "$_id",
					requestCount: 1,
				},
			},
			{
				$group: {
					_id: null,
					data: { $push: "$$ROOT" },
				},
			},
			{
				$project: {
					_id: 0,
					data: {
						$concatArrays: ["$data", months],
					},
				},
			},
			{
				$unwind: "$data",
			},
			{
				$group: {
					_id: "$data.month",
					requestCount: { $sum: "$data.requestCount" },
				},
			},
			{
				$sort: { _id: 1 },
			},
			{
				$project: {
					_id: 0,
					month: "$_id",
					requestCount: 1,
				},
			},
		];

		// 5. Lesson Chat Count (Optimized). Time window by createdAt.
		// Apply hierarchy filters by joining with users (LessonChat has teacherId directly)
		const { matchConditions: lessonChatUserMatchConditions } = this._createHierarchicalMatchAndGroup(query, "user");
		const lessonChatCountPipeline = [
			{
				$match: {
					createdAt: { $gte: sixMonthsAgo, $lte: now }
				},
			},
			// Join with users directly since LessonChat has teacherId
			{
				$lookup: {
					from: "users",
					localField: "teacherId",
					foreignField: "_id",
					as: "user",
				},
			},
			{
				$unwind: {
					path: "$user",
					preserveNullAndEmptyArrays: false,
				},
			},
			// Apply hierarchy filters on user (fields prefixed with "user.")
			...(Object.keys(lessonChatUserMatchConditions).length > 0 ? [{ $match: lessonChatUserMatchConditions }] : []),
			{
				$addFields: {
					yearMonth: {
						$dateToString: {
							format: "%Y-%m",
							date: "$createdAt",
						},
					},
				},
			},
			{
				$group: {
					_id: "$yearMonth",
					requestCount: {
						$sum: 1,
					},
				},
			},
			{
				$sort: {
					_id: 1,
				},
			},
			{
				$project: {
					_id: 0,
					month: "$_id",
					requestCount: 1,
				},
			},
			{
				$group: {
					_id: null,
					data: { $push: "$$ROOT" },
				},
			},
			{
				$project: {
					_id: 0,
					data: {
						$concatArrays: ["$data", months],
					},
				},
			},
			{
				$unwind: "$data",
			},
			{
				$group: {
					_id: "$data.month",
					requestCount: { $sum: "$data.requestCount" },
				},
			},
			{
				$sort: { _id: 1 },
			},
			{
				$project: {
					_id: 0,
					month: "$_id",
					requestCount: 1,
				},
			},
		];

		try {
			const [
				userMetrics,
				userMediumMetrics,
				userLessonPlanCount,
				subjectLessonPlanCount,
				mediumLessonPlanCount,
				feedbackCountResult,
				botRequestCount,
				lessonChatCount
			] = await Promise.all([
				User.aggregate(userCountsPipeline),
				User.aggregate(userMediumsPipeline),
				TeacherLessonPlan.aggregate(lessonPlanCount), // CHANGED from User
				TeacherLessonPlan.aggregate(lessonPlanCountBySubject), // CHANGED from User
				TeacherLessonPlan.aggregate(lessonPlanCountByMedium), // CHANGED from User
				LessonFeedback.aggregate(feedbackCountBySubject),
				Chat.aggregate(requestCountPipeline), // CHANGED from User
				LessonChat.aggregate(lessonChatCountPipeline) // Kept LessonChat, but pipeline optimized
			]);

			// Ensure all arrays are returned (not null/undefined) to prevent frontend errors
			return {
				success: true,
				userCounts: userMetrics[0] || { userCounts: { activeUsers: 0, inactiveUsers: 0 }, allUsers: [], activeUsers: [], inactiveUsers: [] },
				userMediums: userMediumMetrics || [],
				lessonPlanCount: userLessonPlanCount || [],
				lessonPlanCountBySubject: subjectLessonPlanCount || [],
				lessonPlanCountByMedium: mediumLessonPlanCount || [],
				feedbackCount: feedbackCountResult || [],
				botRequestCount: botRequestCount || [],
				lessonbotRequestCount: lessonChatCount || []
			};

		} catch (err) {
			logger.error("DashboardAggregation.getDashboardMetrics failed", {
				error: err,
				message: err?.message,
				stack: err?.stack,
				filterKeys: query ? Object.keys(query) : []
			});
			throw new Error("Dashboard metrics could not be loaded", { cause: err });
		}
	}
}

const dashboardAggregation = new DashboardAggregation();

module.exports = dashboardAggregation;
