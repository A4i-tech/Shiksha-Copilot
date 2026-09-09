const mongoose = require("mongoose");
const BaseManager = require("./base.manager");
const MasterResourceDao = require("../dao/master.resource.dao");
const RegeneratedLessonResourceDao = require("../dao/regenerate.log.dao");
const formatApiResponse = require("../helper/response");
const regenerateLessonPlan = require("../services/copilot.bot.service");
const Chapter = require("../models/chapter.model");
const MasterResource = require("../models/master.resource.model");
const MasterSubjectDao = require("../dao/master.subject.dao");
const { checkRow } = require("../validations/master.resource.bulk.validation");
const { buildIdOrNameResolver } = require("../helper/id.or.name.resolver");
const { createData, subjectRegex, titleRegex, mediumRegex, boardRegex, standardRegex, orderNumberRegex } = require("../helper/data.helper");
const { uniqueSubsets } = require("../helper/filter.helper");
const formatApiReponse = require("../helper/response");
const TeacherLessonPlanDao = require("../dao/teacher.lesson.plan.dao");
const { sortDataBySubTopics, transformSections, transformOldResources, getSemester, formatSubject } = require("../helper/formatter");
const ChapterDao = require("../dao/chapter.dao");
const LessonPlanTemplate = require("../models/lesson.plan.template.model");
const compareChapter = require("../helper/chapter.helper");

/** @extends {BaseManager<MasterResourceDao>} */
class MasterResourceManager extends BaseManager {
	constructor() {
		super(new MasterResourceDao());
		this.teacherLessonPlanDao = new TeacherLessonPlanDao();
		this.regenerateResourceLog = new RegeneratedLessonResourceDao();
		this.masterSubjectDao = new MasterSubjectDao();
		this.chapterDao = new ChapterDao();
	}

	/**
	 * Validates an uploaded resource-plan file and, unless the caller asks for
	 * a dry run, writes the resource plans. The response carries one report
	 * line per row. A failed row blocks the whole file, so the answer is 400
	 * and nothing is saved.
	 */
	async bulkUpload(resources, dryRun = false, userId) {
		try {
			if (!Array.isArray(resources) || resources.length === 0) {
				return formatApiReponse(
					false,
					"resources must be a non-empty array.",
					{}
				);
			}

			// chapterId can be a chapter _id or its topics (name), resolved against
			// the resource's own board, medium and class.
			const allChapters = await Chapter.find({
				isDeleted: { $ne: true },
			})
				.select("board medium standard topics")
				.lean();

			const chapterResolver = buildIdOrNameResolver(allChapters, (chapter) => [
				`${String(chapter.board).toLowerCase()}|${String(chapter.medium).toLowerCase()}|${chapter.standard}|${String(chapter.topics).trim().toLowerCase()}`,
			]);

			const resolveChapter = (resource) =>
				chapterResolver.resolve(
					resource?.chapterId,
					typeof resource?.chapterId === "string"
						? `${String(resource?.board).toLowerCase()}|${String(resource?.medium).toLowerCase()}|${resource?.class}|${resource.chapterId.trim().toLowerCase()}`
						: null
				);

			const resolvedChapters = resources.map((resource) => resolveChapter(resource));

			const normalizedResources = resources.map((resource, index) =>
				resolvedChapters[index]
					? { ...resource, chapterId: String(resolvedChapters[index]._id) }
					: resource
			);

			const rows = normalizedResources.map((resource, index) => {
				const chapter = resolvedChapters[index];

				if (!chapter) {
					return {
						row: index + 1,
						identity: resources[index]?.lessonName ?? "",
						errors: [
							`chapterId "${resources[index]?.chapterId}" matches no active chapter for board "${resource?.board}", medium "${resource?.medium}" and class ${resource?.class}. Give the chapter's id, or its exact name.`,
						],
						warnings: [],
					};
				}

				const { errors, warnings } = checkRow(resource);

				return {
					row: index + 1,
					identity: resource?.lessonName ?? "",
					errors,
					warnings,
				};
			});

			const invalid = rows.filter((row) => row.errors.length > 0);

			const report = {
				dryRun,
				total: rows.length,
				valid: rows.length - invalid.length,
				invalid: invalid.length,
				inserted: 0,
				insertedIds: [],
				rows,
			};

			if (invalid.length > 0) {
				return formatApiReponse(
					false,
					`${invalid.length} of ${rows.length} resources failed validation. Nothing was saved.`,
					report
				);
			}

			if (dryRun) {
				return formatApiReponse(true, "All resources passed validation.", report);
			}

			const documents = normalizedResources.map((resource) => ({
				...resource,
				status: "draft",
				isDeleted: true,
				createdBy: userId,
			}));

			const saved = await MasterResource.insertMany(documents, { ordered: true });

			report.inserted = saved.length;
			report.insertedIds = saved.map((resource) => String(resource._id));

			return formatApiReponse(
				true,
				`${saved.length} resources were added.`,
				report
			);
		} catch (err) {
			return formatApiReponse(false, err?.message, err);
		}
	}

	async updateMasterResource(id, updates) {
		const updatedResource = await this.dao.update(id, updates);
		if (!updatedResource) {
			return formatApiResponse(false, "Master resource not found", null);
		}
		return formatApiResponse(true, "", updatedResource);
	}

	async regenerateResourcePlan({ resourceId, reason, userId }) {
		const resourcePlan = await this.dao.getById(resourceId);
		if (!resourcePlan) {
			return formatApiResponse(false, "Resource plan not found", null);
		}

		const regeneratedResource = await regenerateLessonPlan();

		const newResourcePlan = {
			lessonName: resourcePlan.lessonName,
			class: resourcePlan.class,
			medium: resourcePlan.medium,
			board: resourcePlan.board,
			semester: resourcePlan.semester,
			subject: resourcePlan.subject,
			levels: resourcePlan.levels,
			topics: resourcePlan.topics,
			resources: regeneratedResource.resources,
		};

		const savedResourcePlan = await this.dao.create(
			newResourcePlan
		);

		const regeneratedLog = {
			contentId: resourceId,
			genContentId: savedResourcePlan._id,
			isLesson: false,
			reasons: reason,
			generatedBy: userId,
		};

		await this.regenerateResourceLog.create(regeneratedLog);

		return formatApiResponse(
			true,
			"Resource plan generated successfully",
			savedResourcePlan
		);
	}

	async comboScript(board, medium) {
		const chapters = await Chapter.find({ board, medium });
		for (const chapter of chapters) {
			const subject = await this.masterSubjectDao.getById(chapter.subjectId);
			let subTopicSubSets = uniqueSubsets(chapter.subTopics);
			for (const subTopic of subTopicSubSets) {
				const newResourcePlan = createData(false, chapter, subTopic, subject);
				await this.dao.create(newResourcePlan);
			}
		}
		return formatApiResponse(true, "", "Data inserted!");
	}

	async getSubtopicResourceList(chapterId, templateIds) {
		let result = await this.dao.getSubtopicResourceList(
			chapterId,
			templateIds
		);

		result = sortDataBySubTopics(result);

		if (result) {
			return formatApiReponse(true, "", result);
		}

		return formatApiResponse(true, "", result);
	}

	async generateResourcePlan(teacherId, resourceId, filters) {
		const resourcePlan =
			await this.teacherLessonPlanDao.getByTeacherAndResource(
				teacherId,
				resourceId
			);

		if (resourcePlan && !resourcePlan.isCompleted) {
			return formatApiReponse(false, "Draft Exists", resourcePlan);
		}

		if (resourcePlan) {
			return formatApiReponse(
				false,
				"Lesson Resource Plan with this combination has already been saved!",
				resourcePlan
			);
		}

		const result = await this.dao.generateResourcePlan(
			resourceId,
			filters
		);

		if (result) {
			return formatApiReponse(true, "", result);
		}

		return formatApiReponse(false, "No Data available", null);
	}



	async uploadMasterResources(req) {
		let lessonPlans = req.body;
		let failedLessonPlan = [];
		let createCount = 0;
		let updateCount = 0

		if (typeof lessonPlans === 'object' && !Array.isArray(lessonPlans)) {
			lessonPlans = [lessonPlans];
		}

		for (let i = 0; i < lessonPlans.length; i++) {
			let subjectName = lessonPlans[i].chapter_id.match(subjectRegex)[1];
			let title = lessonPlans[i].chapter_id.match(titleRegex)[1];
			let medium = lessonPlans[i].chapter_id.match(mediumRegex)[1];
			let board = lessonPlans[i].chapter_id.match(boardRegex)[1];
			let standard = lessonPlans[i].chapter_id.match(standardRegex)[1];
			let orderNumber = lessonPlans[i].chapter_id.match(orderNumberRegex)[1];
			let learningOutcomes = lessonPlans[i].learning_outcomes;
			let templateDetails = await LessonPlanTemplate.find({ workFlowId: lessonPlans[i]?.workflow_id });
			let templateId = templateDetails[0]?._id || null;

			if (typeof learningOutcomes[0] === 'string' && learningOutcomes[0].includes('\n')) {
				learningOutcomes = (learningOutcomes?.[0] || "").split('\n').map(outcome => outcome.trim());
			}

			if (!templateId) {
				failedLessonPlan.push(lessonPlans[i]);
				continue;
			}

			let chapter = await this.chapterDao.getOne({
				board,
				medium,
				orderNumber,
				topics: title,
				standard: Number(standard),
			});

			if (chapter && lessonPlans[i]?.index_path) {
				chapter.indexPath = lessonPlans[i]?.index_path
				await chapter.save();
			}

			let subject = await this.masterSubjectDao.getByNameAndBoard(
				subjectName,
				board
			);
			if (!chapter?._id) {
				if (!subject) {
					let subjectData = await this.masterSubjectDao.getOne({ subjectName });
					if (subjectData && !subjectData.boards.includes(board)) {
						subjectData.boards.push(board);
						subjectData.applicableClasses.push(
							{
								board: board,
								Classes: [standard]
							}
						)
						subject = await subjectData.save();
					} else {
						subject = await this.masterSubjectDao.create({
							subjectName,
							boards: [board],
							sem: getSemester(subjectName),
							name: formatSubject(subjectName),
							applicableClasses: [
								{
									board: board,
									Classes: [standard]
								}
							]
						});
					}
				}

				let chapterObj = {
					subjectId: subject._id,
					topics: title,
					subTopics: lessonPlans[i].subtopics,
					medium: medium,
					board: board,
					standard: Number(standard),
					orderNumber: Number(orderNumber),
					indexPath: lessonPlans[i]?.index_path
				};

				chapter = await this.chapterDao.create(chapterObj);
			}

			let boardEntry = subject.applicableClasses.find(
				(entry) => entry.board === board
			);

			if (boardEntry) {
				if (!boardEntry.classes.includes(standard)) {
					boardEntry.classes.push(standard);
					await subject.save();
				}
			} else {
				subject.applicableClasses.push({
					board: board,
					classes: [standard]
				});

				if (!subject.boards.includes(board)) {
					subject.boards.push(board);
				}

				await subject.save();
			}


			let queryingObj = {
				lessonName: `${subjectName}-${board} Class${standard} ${title}`,
				class: Number(standard),
				board,
				medium,
				subject: subjectName,
				chapterId: chapter._id,
				subTopics: lessonPlans[i].subtopics,
				isAll: lessonPlans[i].lp_level === 'CHAPTER',
				templateId
			}

			const existingLr = await this.dao.getOne(queryingObj);

			let resource;

			const transformedResource = transformSections(lessonPlans[i]?.sections, templateDetails[0]?.sections);

			if (existingLr && compareChapter(lessonPlans[i]._id, chapter, existingLr)) {
				const lrQuery = {
					_id: existingLr._id,
				}


				const lrData = {
					resources: transformedResource,
					learningOutcomes: lessonPlans[i]?.learning_outcomes,
				}

				resource = await this.dao.updateByFilter(lrQuery, lrData)
				updateCount += 1
			} else {
				let resourcePlanObj = {
					lessonName: `${subjectName}-${board} Class${standard} ${title}`,
					class: Number(standard),
					isAll: lessonPlans[i].lp_level === "CHAPTER",
					board,
					medium,
					semester: "1",
					subject: subjectName,
					chapterId: chapter._id, //fetch id
					subTopics: lessonPlans[i].subtopics,
					resources: transformedResource,
					learningOutcomes,
					templateId
				};
				resource = await this.dao.create(resourcePlanObj);
				createCount += 1
			}
		}

		return {
			success: true,
			message: "Data Added!",
			data: {
				createCount,
				updateCount,
				failCount: failedLessonPlan.length,
				failedLessonPlan,
			},
		};
	}

	async uploadOldMasterResources(req) {
		let lessonPlans = req.body;
		let failedLessonPlan = [];
		let createCount = 0;
		let updateCount = 0

		if (typeof lessonPlans === 'object' && !Array.isArray(lessonPlans)) {
			lessonPlans = [lessonPlans];
		}

		for (let i = 0; i < lessonPlans.length; i++) {
			let subjectName = lessonPlans[i].chapter_id.match(subjectRegex)[1];
			let title = lessonPlans[i].chapter_id.match(titleRegex)[1];
			let medium = lessonPlans[i].chapter_id.match(mediumRegex)[1];
			let board = lessonPlans[i].chapter_id.match(boardRegex)[1];
			let standard = lessonPlans[i].chapter_id.match(standardRegex)[1];
			let orderNumber = lessonPlans[i].chapter_id.match(orderNumberRegex)[1];
			let learningOutcomes = lessonPlans[i].learning_outcomes;
			let templateDetails = await LessonPlanTemplate.find({ workFlowId: 'karnataka-additional-resources' });
			let templateId = templateDetails[0]?._id || null;

			if (board !== 'KSEEB') {
				failedLessonPlan.push(lessonPlans[i]);
				continue;
			}

			if (typeof learningOutcomes[0] === 'string' && learningOutcomes[0].includes('\n')) {
				learningOutcomes = (learningOutcomes?.[0] || "").split('\n').map(outcome => outcome.trim());
			}

			if (!templateId) {
				failedLessonPlan.push(lessonPlans[i]);
				continue;
			}

			let chapter = await this.chapterDao.getOne({
				board,
				medium,
				orderNumber,
				topics: title,
				standard: Number(standard),
			});

			if (chapter && lessonPlans[i]?.index_path) {
				chapter.indexPath = lessonPlans[i]?.index_path
				await chapter.save();
			}
			let subject = await this.masterSubjectDao.getByNameAndBoard(
				subjectName,
				board
			);
			if (!chapter?._id) {
				if (!subject) {
					let subjectData = await this.masterSubjectDao.getOne({ subjectName });
					if (subjectData && !subjectData.boards.includes(board)) {
						subjectData.boards.push(board);
						subjectData.applicableClasses.push(
							{
								board: board,
								Classes: [standard]
							}
						)
						subject = await subjectData.save();
					} else {
						subject = await this.masterSubjectDao.create({
							subjectName,
							boards: [board],
							sem: getSemester(subjectName),
							name: formatSubject(subjectName),
							applicableClasses: [
								{
									board: board,
									Classes: [standard]
								}
							]
						});
					}
				}

				let chapterObj = {
					subjectId: subject._id,
					topics: title,
					subTopics: lessonPlans[i].subtopics,
					medium: medium,
					board: board,
					standard: Number(standard),
					orderNumber: Number(orderNumber),
					indexPath: lessonPlans[i]?.index_path
				};

				chapter = await this.chapterDao.create(chapterObj);
			}

			let boardEntry = subject.applicableClasses.find(
				(entry) => entry.board === board
			);

			if (boardEntry) {
				if (!boardEntry.classes.includes(standard)) {
					boardEntry.classes.push(standard);
					await subject.save();
				}
			} else {
				subject.applicableClasses.push({
					board: board,
					classes: [standard]
				});

				if (!subject.boards.includes(board)) {
					subject.boards.push(board);
				}

				await subject.save();
			}


			let queryingObj = {
				lessonName: `${subjectName}-${board} Class${standard} ${title}`,
				class: Number(standard),
				board,
				medium,
				subject: subjectName,
				chapterId: chapter._id,
				isAll: lessonPlans[i].lp_level === 'CHAPTER',
				templateId
			}

			const existingLr = await this.dao.getOne(queryingObj);

			let resource;

			const { extracted, additional } = transformOldResources(lessonPlans[i]?.extracted_resources, lessonPlans[i]?.additional_resources);

			if (existingLr && compareChapter(lessonPlans[i]._id, chapter, existingLr)) {
				const lrQuery = {
					_id: existingLr._id,
				}


				const lrData = {
					resources: extracted,
					additionalResources: additional,
					learningOutcomes: lessonPlans[i]?.learning_outcomes,
					subTopics: lessonPlans[i]?.subtopics,
				}

				resource = await this.dao.updateByFilter(lrQuery, lrData)
				updateCount += 1
			} else {
				let resourcePlanObj = {
					lessonName: `${subjectName}-${board} Class${standard} ${title}`,
					class: Number(standard),
					isAll: lessonPlans[i].lp_level === "CHAPTER",
					board,
					medium,
					semester: "1",
					subject: subjectName,
					chapterId: chapter._id,
					subTopics: lessonPlans[i].subtopics,
					resources: extracted,
					additionalResources: additional,
					learningOutcomes,
					templateId
				};
				resource = await this.dao.create(resourcePlanObj);
				createCount += 1
			}
		}

		return {
			success: true,
			message: "Data Added!",
			data: {
				createCount,
				updateCount,
				failCount: failedLessonPlan.length,
				failedLessonPlan,
			},
		};
	}
}

module.exports = MasterResourceManager;
