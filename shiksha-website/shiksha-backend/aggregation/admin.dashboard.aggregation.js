const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;
const User = require("../models/user.model");
const Chat = require("../models/chat.model");
const TeacherLessonPlan = require("../models/teacher.lesson.plan.model");
const LessonFeedback = require("../models/feedback.lesson.model");
const { safeParseDate } = require("../helper/formatter");
const logger = require("../config/loggers");
const { getPermission } = require("../helper/permission.helper");
const { scopeFilter, intersectFilters } = require("../helper/scope.helper");

class DashboardAggregation {

	_createHierarchicalMatchAndGroup(query, prefix, scope) {
		const joinedUser = prefix === "teacher" || prefix === "user";
		const p = joinedUser ? "schoolDetails." : prefix ? `${prefix}.` : "";
		const f = (field) => joinedUser && field === "_id" ? `$${prefix}._id` : joinedUser && field === "name" ? `$${prefix}.identity.name` : `$${p}${field}`;

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
		return { matchConditions: intersectFilters(matchConditions, scope), groupByFields };
	}


	async getDashboardMetrics(query, grants) {
		const scopes = getPermission(grants, "dashboard.admin.view");
		const scope = scopeFilter(scopes, "schoolDetails", "_id");
		const userSchoolStages = [
			{ $lookup: { from: "schools", localField: "roles.dep", foreignField: "_id", as: "schoolDetails" } },
			{ $unwind: { path: "$schoolDetails", preserveNullAndEmptyArrays: false } },
		];
		const userShapeStage = {
			$set: {
				name: "$identity.name",
				role: "$roles",
				school: "$schoolDetails._id",
				state: "$schoolDetails.state",
				zone: "$schoolDetails.zone",
				district: "$schoolDetails.district",
				block: "$schoolDetails.block",
				classes: "$profiles.teacher.classes",
			},
		};
		// User-level match: same hierarchy as lesson plans (school/state/zone/district/block) so dashboard metrics are consistent.
		const { matchConditions: userMatchConditions } = this._createHierarchicalMatchAndGroup(query, "", scope);

		// 1. Prepare User Aggregation (Activity/Counts) - runs on User collection
		const userCountsPipeline = [
			...userSchoolStages,
			userShapeStage,
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
			...userSchoolStages,
			userShapeStage,
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

		const { matchConditions, groupByFields } = this._createHierarchicalMatchAndGroup(query, "teacher", scope);
		const teacherStages = [
			{ $lookup: { from: "users", localField: "teacherId", foreignField: "_id", as: "teacher" } },
			{ $unwind: { path: "$teacher", preserveNullAndEmptyArrays: true } },
			{ $lookup: { from: "schools", localField: "teacher.roles.dep", foreignField: "_id", as: "schoolDetails" } },
			{ $unwind: { path: "$schoolDetails", preserveNullAndEmptyArrays: true } },
		];

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
			...teacherStages,
			// Apply Location Filters on the joined 'teacher' object
			...(Object.keys(matchConditions).length > 0 ? [{ $match: matchConditions }] : []),
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
			...teacherStages,
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
			...teacherStages,
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
		const { matchConditions: feedbackMatchConditions } = this._createHierarchicalMatchAndGroup(query, "teacher", scope);
		const feedbackCountBySubject = [
			...teacherStages,
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

		// 4 & 5. Chat + LessonChat counts combined via $unionWith (MongoDB 4.4+).
		// Single DB round trip; users $lookup runs once shared by both sources.
		const today = new Date();

		// Generate last 6 months array (MongoDB compatible - works on all versions)
		const months = [];
		for (let i = 5; i >= 0; i--) {
			const date = new Date(today.getFullYear(), today.getMonth() - i, 1);
			months.push({
				month: date.toISOString().substr(0, 7),
				requestCount: 0,
			});
		}

		// Calculate sixMonthsAgo from the oldest month to drive the gte
		const oldestMonthSplit = months[0].month.split("-");
		const sixMonthsAgo = new Date(oldestMonthSplit[0], oldestMonthSplit[1] - 1, 1);

		const { matchConditions: chatUserMatchConditions } = this._createHierarchicalMatchAndGroup(query, "user", scope);
		const combinedChatPipeline = [
			// ── 1. Chat collection: filter date window + orphan guard ──
			{
				$match: {
					userId: { $exists: true, $ne: null },
					createdAt: { $gte: sixMonthsAgo }
				}
			},
			{ $addFields: { _source: "bot", _userId: "$userId" } },

			// ── 2. Union with LessonChat, normalise fields ──
			{
				$unionWith: {
					coll: "lessonchats",
					pipeline: [
						{
							$match: {
								teacherId: { $exists: true, $ne: null },
								createdAt: { $gte: sixMonthsAgo }
							}
						},
						// Alias teacherId → _userId so the shared users $lookup below is uniform.
						// LessonChat has no requestCount field; set to 1 so $sum works for both branches.
						{ $addFields: { _source: "lesson", _userId: "$teacherId", requestCount: 1 } }
					]
				}
			},

			// ── 3. Join users once (shared by both sources) for hierarchy filtering ──
			{
				$lookup: {
					from: "users",
					localField: "_userId",
					foreignField: "_id",
					as: "user"
				}
			},
			{ $unwind: { path: "$user", preserveNullAndEmptyArrays: false } },
			{ $lookup: { from: "schools", localField: "user.roles.dep", foreignField: "_id", as: "schoolDetails" } },
			{ $unwind: { path: "$schoolDetails", preserveNullAndEmptyArrays: false } },
			...(Object.keys(chatUserMatchConditions).length > 0 ? [{ $match: chatUserMatchConditions }] : []),

			// ── 4. Tag yearMonth ──
			{
				$addFields: {
					yearMonth: { $dateToString: { format: "%Y-%m", date: "$createdAt" } }
				}
			},

			// ── 5. $facet: one branch per source ──
			{
				$facet: {
					botRequests: [
						{ $match: { _source: "bot" } },
						{ $group: { _id: "$yearMonth", requestCount: { $sum: "$requestCount" } } },
						{ $sort: { _id: 1 } },
						{ $project: { _id: 0, month: "$_id", requestCount: 1 } }
					],
					lessonChatRequests: [
						{ $match: { _source: "lesson" } },
						{ $group: { _id: "$yearMonth", requestCount: { $sum: 1 } } },
						{ $sort: { _id: 1 } },
						{ $project: { _id: 0, month: "$_id", requestCount: 1 } }
					]
				}
			}
		];

		try {
			const [
				userMetrics,
				userMediumMetrics,
				userLessonPlanCount,
				subjectLessonPlanCount,
				mediumLessonPlanCount,
				feedbackCountResult,
				[combinedChatResult]
			] = await Promise.all([
				User.aggregate(userCountsPipeline),
				User.aggregate(userMediumsPipeline),
				TeacherLessonPlan.aggregate(lessonPlanCount),
				TeacherLessonPlan.aggregate(lessonPlanCountBySubject),
				TeacherLessonPlan.aggregate(lessonPlanCountByMedium),
				LessonFeedback.aggregate(feedbackCountBySubject),
				Chat.aggregate(combinedChatPipeline)
			]);

			// Merge Javascript array with result arrays for charts (zero-fills missing months)
			const mergeWithMonths = (data) => months.map(m => {
				const found = data.find(d => d.month === m.month);
				return { month: m.month, requestCount: found ? found.requestCount : 0 };
			});

			return {
				success: true,
				userCounts: userMetrics[0],
				userMediums: userMediumMetrics,
				lessonPlanCount: userLessonPlanCount,
				lessonPlanCountBySubject: subjectLessonPlanCount,
				lessonPlanCountByMedium: mediumLessonPlanCount,
				feedbackCount: feedbackCountResult,
				botRequestCount: mergeWithMonths(combinedChatResult?.botRequests ?? []),
				lessonbotRequestCount: mergeWithMonths(combinedChatResult?.lessonChatRequests ?? [])
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
