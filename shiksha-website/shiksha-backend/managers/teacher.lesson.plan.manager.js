const BaseManager = require("./base.manager");
const formatApiReponse = require("../helper/response");
const TeacherLessonPlanModel = require("../models/teacher.lesson.plan.model");
const TeacherLessonPlanDao = require("../dao/teacher.lesson.plan.dao");
const teacherLessonPlanAggregation = require("../aggregation/teacher.lesson.plan.aggregation");
const { postToCopilotBot, postToSectionEditBot, postToPlanEditBot } = require("../services/copilot.bot.service.js");
const ChapterDao = require("../dao/chapter.dao");
const MasterSubjectDao = require("../dao/master.subject.dao");
const MasterLessonDao = require("../dao/master.lesson.dao");
const MasterResourceDao = require("../dao/master.resource.dao");
const logger = require("../config/loggers"); 
const RegeneratedLessonResourceDao = require("../dao/regenerate.log.dao");
const LessonFeedbackDao = require("../dao/feedback.lesson.dao");
const TeacherResourceFeedbackDao = require("../dao/teacher.feedback.dao");
const {
	formatTemplate,
	formatSections
} = require("../helper/formatter");
const { REGENERATION_LIMIT } = require("../config/constants.js");
const LessonPlanTemplateDao = require("../dao/lesson.plan.template.dao.js");
const LessonPlanTemplate = require("../models/lesson.plan.template.model.js");
const TeacherLessonPlan = require("../models/teacher.lesson.plan.model");
const mongoose = require("mongoose");

/** @extends {BaseManager<TeacherLessonPlanDao>} */
class TeacherLessonPlanManager extends BaseManager {
	constructor() {
		super(new TeacherLessonPlanDao());
		this.chapterDao = new ChapterDao();
		this.masterLessonDao = new MasterLessonDao();
		this.lessonPlanTemplateDao = new LessonPlanTemplateDao();
		this.subjectDao = new MasterSubjectDao();
		this.regeneratedLessonResource = new RegeneratedLessonResourceDao();
		this.lessonFeedbackDao = new LessonFeedbackDao();
		this.teacherResourceFeedbackDao = new TeacherResourceFeedbackDao();
		this.masterResourceDao = new MasterResourceDao();
	}

	async _resolveIndexPath(teacherId, recordId, isLesson) {
		try {
			const teacherLessonPlan = isLesson
				? await this.dao.getByTeacherAndLesson(teacherId, recordId)
				: await this.dao.getByTeacherAndResource(teacherId, recordId);
			if (!teacherLessonPlan) return null;

			const chapterId = teacherLessonPlan.lessonId
				? (await this.masterLessonDao.getById(teacherLessonPlan.lessonId))?.chapterId
				: (await this.masterResourceDao.getById(teacherLessonPlan.resourceId))?.chapterId;
			if (!chapterId) return null;

			const chapter = await this.chapterDao.getById(chapterId);
			if (!chapter) return null;

			const subject = await this.subjectDao.getById(chapter.subjectId);
			return chapter.indexPath ?? `shiksha/data_new_book/${chapter.board}/${chapter.medium}/${chapter.standard}/${subject?.subjectName}/pdf/${chapter.orderNumber}/index/pdf_idx`;
		} catch (error) {
			logger.error('Error resolving index path for AI edit', { message: error.message, stack: error.stack });
			return null;
		}
	}

	async getByTeacherAndPagination(
		teacherId,
		page = 1,
		limit = 999,
		filters = {},
		sort = {}
	) {
		if (filters.type != "all") {
			let lessons = await this.dao.getByTeacherAndPagination(
				teacherId,
				filters.type,
				page,
				limit,
				filters,
				sort
			);

			return formatApiReponse(
				true,
				"",
				lessons.results.sort((a, b) => b.updatedAt - a.updatedAt)
			);
		} else {
			let lessons = await this.dao.getByTeacherAndPagination(
				teacherId,
				"lesson",
				page,
				limit,
				filters,
				sort
			);

			let resources =
				await this.dao.getByTeacherAndPagination(
					teacherId,
					"resource",
					page,
					limit,
					filters,
					sort
				);

			return formatApiReponse(
				true,
				"",
				[...lessons.results, ...resources.results].sort(
					(a, b) => b.updatedAt - a.updatedAt
				)
			);
		}
	}

	async getMonthlyCount(teacherId, filter) {
		const monthlyCounts = await teacherLessonPlanAggregation.getMonthlyCount(
			teacherId,
			filter
		);
		return formatApiReponse(true, "", monthlyCounts);
	}

	async getRegenerationLimit(teacherId){
		const regenerationCounts = await this.regeneratedCount(teacherId);

		return formatApiReponse(true, "", {regenerationLimitReached:regenerationCounts >= REGENERATION_LIMIT });
	}

	async checkIfLessonPlanExists(teacherId, lessonPlanId) {
		const lessonPlan = await TeacherLessonPlanModel.findOne({
			teacherId,
			lessonId: lessonPlanId,
			isDeleted: { $ne: true },
		});
		return !!lessonPlan;
	}

	async getLessonPlanById(teacherId, lessonPlanId) {
		const lessonPlan = await this.dao.getLessonPlanById(
			teacherId,
			lessonPlanId
		);
		if (lessonPlan) {
			return formatApiReponse(true, "", lessonPlan);
		} else {
			return formatApiReponse(false, "Lesson plan not found", null);
		}
	}

	async generateContent(teacherId, payload) {
		const regenerationCount = await this.regeneratedCount(teacherId);
		if(regenerationCount >= REGENERATION_LIMIT){
			return formatApiReponse(false, `Daily regeneration limit of ${REGENERATION_LIMIT} has been reached.`, null);
		}
		const masterLesson = await this.masterLessonDao.getById(payload.lessonId);
		if (!masterLesson) {
			throw new Error(`Master lesson with ID ${payload.lessonId} not found`);
		  }

		const template = await this.lessonPlanTemplateDao.getById(masterLesson?.templateId)

		const chapter = await this.chapterDao.getById(masterLesson.chapterId);
		if (!chapter) {
			throw new Error(`Chapter with ID ${masterLesson.chapterId} not found`);
		  }
		const subject = await this.subjectDao.getById(chapter.subjectId);
		if (!subject) {
			throw new Error(`Subject with ID ${chapter.subjectId} not found`);
		  }
		const highestVersionEntry = await this.regeneratedLessonResource.getOne({
			isLoGeneratedContent: true,
			isMasterContent: true,
			contentId: masterLesson._id,
		});
		const version = highestVersionEntry
			? highestVersionEntry._version + 1
			: 1;
		const requestData = this._createBotPayload(chapter, subject, payload, template);
		const result = await postToCopilotBot(requestData);

		if (result.status !== 202) {
			logger.error(`Unexpected status code from Copilot bot: ${result.status}`);
			throw new Error(`Unexpected status code from Copilot bot: ${result.status}`);
		  }

		  logger.info(`Successfully received expected response from Copilot bot ${result.data.instance_id}`);
		const lesson = await this.masterLessonDao.create({
			name: `Version-${version} ${masterLesson.name}`,
			isAll: masterLesson.isAll,
			class: chapter.standard,
			chapterId: chapter._id,
			board: chapter.board,
			subTopics: masterLesson.subTopics,
			medium: chapter.medium,
			subject: subject.subjectName,
			learningOutcomes: payload.learningOutcomes,
			isRegenerated: true,
			templateId:masterLesson?.templateId
		});
		if (!lesson) {
			throw new Error("Failed to create new teacher master lesson");
		  }

		const teacherLessonPlanData = {
			teacherId: teacherId,
			lessonId: lesson._id,
			status: "running",
			learningOutcomes: payload.learningOutcomes,
			isGenerated: true,
			instanceId: result.data.instance_id,
		};

		let newTeacherLessonPlan = await this.dao.create(
			teacherLessonPlanData
		);

		if (!newTeacherLessonPlan) {
			throw new Error("Failed to create teacher lesson plan");
		  }

		await this.regeneratedLessonResource.create({
			isLesson: true,
			isMasterContent: !masterLesson.isRegenerated,
			isLoGeneratedContent: true,
			recordId: newTeacherLessonPlan._id,
			contentId: masterLesson._id,
			status:"running",
			genContentId: newTeacherLessonPlan.lessonId,
			generatedBy: newTeacherLessonPlan.teacherId,
			_version: version,
		});

		return formatApiReponse(true, "Generation is in progress!",{data: result.data,requestData});
	}

	async getResourcePlanById(teacherId, resourcePlanId) {
		const resourcePlan = await this.dao.getResourcePlanById(
			teacherId,
			resourcePlanId
		);
		if (resourcePlan) {
			return formatApiReponse(true, "", resourcePlan);
		} else {
			return formatApiReponse(false, " Resource plan not found", null);
		}
	}

	async deleteLessonPlan(teacherId, lessonPlanId) {
		const lessonPlan = await this.dao.deleteLessonPlan(teacherId, lessonPlanId);
		if (lessonPlan) {
			await this._deleteLessonFeedbackSafely(teacherId, lessonPlan.lessonId);
			return formatApiReponse(true, "Lesson plan deleted successfully", lessonPlan);
		} else {
			return formatApiReponse(false, "Lesson plan not found", null);
		}
	}

	async deleteResourcePlan(teacherId, resourcePlanId) {
		const resourcePlan = await this.dao.deleteResourcePlan(teacherId, resourcePlanId);
		if (resourcePlan) {
			await this._deleteResourceFeedbackSafely(teacherId, resourcePlan.resourceId);
			return formatApiReponse(true, "Resource plan deleted successfully", resourcePlan);
		} else {
			return formatApiReponse(false, "Resource plan not found", null);
		}
	}

	// Best-effort cleanup: remove any prior feedback tied to the deleted lesson/resource plan
	// so a freshly regenerated lesson/resource isn't blocked by a stale "already submitted" feedback record.
	async _deleteLessonFeedbackSafely(teacherId, lessonId) {
		try {
			await this.lessonFeedbackDao.deleteByTeacherAndLessonId(teacherId, lessonId);
		} catch (error) {
			logger.error("Error deleting lesson feedback after lesson plan delete", {
				function: "_deleteLessonFeedbackSafely",
				teacherId,
				lessonId,
				message: error.message,
			});
		}
	}

	async _deleteResourceFeedbackSafely(teacherId, resourceId) {
		try {
			await this.teacherResourceFeedbackDao.deleteByTeacherAndResourceId(teacherId, resourceId);
		} catch (error) {
			logger.error("Error deleting resource feedback after resource plan delete", {
				function: "_deleteResourceFeedbackSafely",
				teacherId,
				resourceId,
				message: error.message,
			});
		}
	}

	async sectionAiEdit(teacherId, payload) {
		try {
			const { lessonId, sectionId, currentContent, prompt, isLesson } = payload;
			const indexPath = await this._resolveIndexPath(teacherId, lessonId, isLesson);
			const requestData = {
				user_id: teacherId,
				index_path: indexPath,
				section_id: sectionId,
				current_content: currentContent,
				prompt,
			};
			const result = await postToSectionEditBot(requestData);

			if (result.status !== 200) {
				logger.error(`Unexpected status code from section-edit bot: ${result.status}`);
				throw new Error(`Unexpected status code from section-edit bot: ${result.status}`);
			}

			const proposedContent = result.data;
			return formatApiReponse(true, "Section edit generated", { proposedContent });
		} catch (error) {
			logger.error('Error handling section AI edit', { message: error.message, stack: error.stack });
			return formatApiReponse(false, "Failed to generate section edit", error);
		}
	}

	async planAiEdit(teacherId, payload) {
		try {
			const { lessonId, sections, learningOutcomes, prompt, isLesson } = payload;
			const indexPath = await this._resolveIndexPath(teacherId, lessonId, isLesson);
			const requestData = {
				user_id: teacherId,
				index_path: indexPath,
				sections: sections.map((s) => ({ id: s.id, title: s.title, content: s.content })),
				learning_outcomes: learningOutcomes,
				prompt,
			};
			const result = await postToPlanEditBot(requestData);

			if (result.status !== 200) {
				logger.error(`Unexpected status code from plan-edit bot: ${result.status}`);
				throw new Error(`Unexpected status code from plan-edit bot: ${result.status}`);
			}

			const proposedSections = result.data || [];
			return formatApiReponse(true, "Plan edit generated", { proposedSections });
		} catch (error) {
			logger.error('Error handling plan AI edit', { message: error.message, stack: error.stack });
			return formatApiReponse(false, "Failed to generate plan edit", error);
		}
	}

	async regenerateContent(teacherId, payload) {
		const regenerationCount = await this.regeneratedCount(teacherId);
		if(regenerationCount >= REGENERATION_LIMIT){
			return formatApiReponse(false, `Daily regeneration limit of ${REGENERATION_LIMIT} has been reached.`, null);
		}
		const masterLesson = await this.masterLessonDao.getById(payload.lessonId);
		if (!masterLesson) {
			throw new Error(`Master lesson with ID ${payload.lessonId} not found`);
		  }
		const template = await this.lessonPlanTemplateDao.getById(masterLesson?.templateId)

		const chapter = await this.chapterDao.getById(masterLesson.chapterId);
		if (!chapter) {
			throw new Error(`Chapter with ID ${masterLesson.chapterId} not found`);
		  }
		const subject = await this.subjectDao.getById(chapter.subjectId);
		if (!subject) {
			throw new Error(`Subject with ID ${chapter.subjectId} not found`);
		  }
		payload.lessonPlan = this._createLessonPlanPayload(
			masterLesson.sections,
			payload.regenFeedback
		);
		payload.learningOutcomes = masterLesson.learningOutcomes;
		let requestData = this._createBotPayload(chapter, subject, payload,template);
		const result = await postToCopilotBot(requestData);

		  if (result.status !== 202) {
			logger.error(`Unexpected status code from Copilot bot: ${result.status}`);
			throw new Error(`Unexpected status code from Copilot bot: ${result.status}`);
		  }
		  logger.info(`Successfully received expected response from Copilot bot ${result.data.instance_id}`);

		const lesson = await this.masterLessonDao.create({
			name: masterLesson.name,
			isAll:masterLesson.isAll,
			class: chapter.standard,
			chapterId: chapter._id,
			board: chapter.board,
			subTopics: masterLesson.subTopics,
			medium: chapter.medium,
			subject: subject.subjectName,
			learningOutcomes: masterLesson.learningOutcomes,
			isRegenerated: true,
			templateId:masterLesson.templateId
		});

		const feedbackPayload = {
			feedbackPerSets: payload.feedbackPerSets,
			feedback: payload.feedback,
			overallFeedbackReason: payload.overallFeedbackReason,
			isCompleted: false,
			regenFeedback:payload.regenFeedback
		};

		const existingLessonPlan = await this.dao.getOne({
			teacherId: teacherId,
			lessonId: payload.lessonId,
		});

		if (!existingLessonPlan) {
			const newTeacherLessonPlanData = {
				teacherId: teacherId,
				lessonId: lesson._id,
				baseLessonId: masterLesson._id,
				status: "running",
				isGenerated: true,
				learningOutcomes: masterLesson.learningOutcomes,
				sections: masterLesson.sections,
				instanceId: result.data.instance_id,
			};

			const newTeacherLessonPlan = await this.dao.create(
				newTeacherLessonPlanData
			);
			await this.lessonFeedbackDao.create({
				...feedbackPayload,
				teacherId: teacherId,
				lessonId: masterLesson._id,
			});
		} else {
			const existingLessonPlan =
				await this.dao.updateForRegenerate(
					teacherId,
					payload.lessonId,
					lesson._id,
					result.data.instance_id
				);

			const existingFeedback = await this.lessonFeedbackDao.getOne({
				teacherId: teacherId,
				lessonId: payload.lessonId,
			});
			if (!existingFeedback) {
				await this.lessonFeedbackDao.create({
					...feedbackPayload,
					teacherId: teacherId,
					lessonId: payload.lessonId,
				});
			} else {
				await this.lessonFeedbackDao.update(
					existingFeedback._id,
					feedbackPayload
				);
			}
		}

		return formatApiReponse(
			true,
			"Regeneration is in progress!",
			result.data
		);
	}

	async regeneratedCount(teacherId){
		const todayStart = new Date();
		todayStart.setUTCHours(0, 0, 0, 0);

		const todayEnd = new Date();
		todayEnd.setUTCHours(23, 59, 59, 999);

        const regenerationCount = await this.dao.getRegeneratedLessonPlansCount(teacherId, todayStart, todayEnd);
		return regenerationCount
	}

	async processWebhookData(webhookData) {

		const { instance_id , status, output } = webhookData;

		const existingLessonPlan = await this.dao.getOne({
			instanceId: instance_id,
		});

		const regeneratedLog = await this.regeneratedLessonResource.getOne({
			genContentId: existingLessonPlan.lessonId,
			recordId: existingLessonPlan._id
		});

		if (!existingLessonPlan) {
			return formatApiReponse(false, "Lesson plan not found", null);
		}
		if (status.toLowerCase() === "completed") {
			const masterLessonPlan = await this.masterLessonDao.getById(
				existingLessonPlan.lessonId
			);

			const lessonPlanTemplate = await LessonPlanTemplate.findById(masterLessonPlan?.templateId)

			const sections = formatSections(output.sections,lessonPlanTemplate.sections);

			const masterLessonUpdate = {
				id: masterLessonPlan._id,
				sections
			};

			await this.masterLessonDao.update(masterLessonUpdate);
			const updateTeacherLessonPlanData = {
				status: status.toLowerCase(),
				sections
			};

			await this.dao.updatePlan(
				existingLessonPlan._id,
				updateTeacherLessonPlanData
			);
			if (regeneratedLog) {
				await this.regeneratedLessonResource.update(
					regeneratedLog._id,
					{ status: status.toLowerCase() }
				);
			}
		}
		else {
			const updateTeacherLessonPlanData = {
				status: status.toLowerCase(),
			};

			await this.dao.updatePlan(
				existingLessonPlan._id,
				updateTeacherLessonPlanData
			);

			if (regeneratedLog) {
				await this.regeneratedLessonResource.update(
					regeneratedLog._id,
					{ status: status.toLowerCase() }
				);
			}
		}

		return formatApiReponse(
			true,
			"Webhook data processed successfully",
			existingLessonPlan
		);
	}

    async lessonUploadMedia(teacherId, lessonId, data) {
    try {
      const lessonPlan = await TeacherLessonPlan.findOne({
        teacherId,
        lessonId,
        isLesson: true,
      });

      if (!lessonPlan) {
        throw new Error("Lesson plan not found");
      }

      const section = lessonPlan.sections.find(
        (sec) => sec.id === data.sectionId
      );
      if (!section) {
        throw new Error("Section not found");
      }

      if (!section.media) section.media = [];

      if (section.media.length >= 3) {
        throw new Error("Maximum 3 uploads allowed per section");
      }

      const newMedia = {
        title: data?.title,
        type: data.type,
        link: data.link,
      };

      section.media.push(newMedia);

      await lessonPlan.save();

      return formatApiReponse(true, "Media uploaded successfully");
    } catch (error) {
      console.error("Error uploading media:", error);
      throw error.message;
    }
  }

  async deleteLessonMedia(teacherId, lessonId, data) {
  try {
    const lessonPlan = await TeacherLessonPlan.findOne({
      teacherId,
      lessonId,
      isLesson: true,
    });

    if (!lessonPlan) throw new Error("Lesson plan not found");

    const section = lessonPlan.sections.find(
      sec => sec.id === data.sectionId
    );

    if (!section) throw new Error("Section not found");

    if (!section.media || section.media.length === 0) {
      throw new Error("No media to delete");
    }

    section.media = section.media.filter(
      m => m._id.toString() !== data.mediaId
    );

    lessonPlan.markModified("sections");
    await lessonPlan.save();

    return formatApiReponse(true, "Media deleted successfully");
  } catch (error) {
    console.error("Error deleting lesson media:", error);
    throw error.message;
  }
}

async deleteResourceMedia(teacherId, resourceId, data) {
  try {
    const resourcePlan = await TeacherLessonPlan.findOne({
      teacherId,
      resourceId,
      isLesson: false,
    });

    if (!resourcePlan) throw new Error("Resource plan not found");

    const resource = resourcePlan.resources.find(
      r => r.id === data.resourceId
    );

    if (!resource) throw new Error("Resource not found");

    const item = resource.content.find(
      c => c.id === data.itemId
    );

    if (!item || !item.media || item.media.length === 0) {
      throw new Error("No media to delete");
    }

    item.media = item.media.filter(
      m => m._id.toString() !== data.mediaId
    );

    resourcePlan.markModified("resources");
    await resourcePlan.save();

    return formatApiReponse(true, "Media deleted successfully");
  } catch (error) {
    console.error("Error deleting resource media:", error);
    throw error.message;
  }
}


  async resourceUploadMedia(teacherId, resourceId, data) {
    try {
      const resourcePlan = await TeacherLessonPlan.findOne({
        teacherId,
        resourceId,
        isLesson: false,
      });

      if (!resourcePlan) {
        throw new Error("Resource plan not found");
      }

      const resource = resourcePlan.resources.find(
        (r) => r.id === data.resourceId
      );

      if (!resource) {
        throw new Error("Resource not found");
      }

      const item = resource.content.find((c) => c.id === data.itemId);

      if (!item) {
        throw new Error("Resource item not found");
      }

      if (!item.media) item.media = [];

      if (item.media.length >= 3) {
        throw new Error("Only 3 uploads allowed");
      }

      const newMedia = {
        _id:new mongoose.Types.ObjectId(),
        type: data.type,
        link: data.link,
        uploadedAt:new Date()
      };

      item.media.push(newMedia);

      resourcePlan.markModified("resources");

      await resourcePlan.save();

      return formatApiReponse(true, "Media uploaded successfully");
    } catch (error) {
      console.error("Error uploading media:", error);
      throw error.message;
    }
  }


	async _checkStatusAndThrowError(regeneratedId, recordId) {
        const regeneratedLog = await this.regeneratedLessonResource.getById(regeneratedId);
        const teacherLessonPlan = await this.dao.getById(recordId);

        if (!regeneratedLog || regeneratedLog.status.toLowerCase() !== "failed") {
            throw new Error("Regeneration log is either not found or not in a failed state.");
        }
        if (!teacherLessonPlan || teacherLessonPlan.status.toLowerCase() !== "failed") {
            throw new Error("Teacher lesson plan is either not found or not in a failed state.");
        }
        return true;
    }


	async retryLessonPlan(regeneratedId, recordId) {
        await this._checkStatusAndThrowError(regeneratedId, recordId);

		const regeneratedLog = await this.regeneratedLessonResource.getById(regeneratedId);
		const teacherLessonPlan = await this.dao.getById(recordId);

        const masterLesson = await this.masterLessonDao.getById(teacherLessonPlan.lessonId);
        if (!masterLesson) {
            throw new Error(`Master lesson with ID ${teacherLessonPlan.lessonId} not found`);
        }

        const chapter = await this.chapterDao.getById(masterLesson.chapterId);
        if (!chapter) {
            throw new Error(`Chapter with ID ${masterLesson.chapterId} not found`);
        }

        const subject = await this.subjectDao.getById(chapter.subjectId);
        if (!subject) {
            throw new Error(`Subject with ID ${chapter.subjectId} not found`);
        }

		let payload = {
			subTopics : masterLesson.subTopics,
			isAll: masterLesson.isAll,
			learningOutcomes : masterLesson.learningOutcomes,
		}
		if (!regeneratedLog.isLoGeneratedContent) {
			let feedback = await this.lessonFeedbackDao.getOne({
				teacherId: teacherLessonPlan.teacherId,
				lessonId:  teacherLessonPlan.baseLessonId,
			});
			payload.feedbackPerSets = feedback.feedbackPerSets;
			payload.lessonPlan = this._createLessonPlanPayload(
				masterLesson.instructionSet,
				payload.feedbackPerSets
			);
		}

		let requestData = this._createBotPayload(chapter, subject, payload);
		const result = await postToCopilotBot(requestData);

		if (result.status !== 202) {
			logger.error(`Unexpected status code from Copilot bot: ${result.status}`);
			throw new Error(`Unexpected status code from Copilot bot: ${result.status}`);
		  }
		    logger.info(`Successfully received expected response from Copilot bot ${result.data.instance_id}`);
		regeneratedLog.status="running";
		teacherLessonPlan.status ="running";
		teacherLessonPlan.instanceId = result.data.instance_id;

		regeneratedLog.save();
		teacherLessonPlan.save();

        return formatApiReponse(true, "Regeneration is in progress!", result.data);
    }

_createLessonPlanPayload(sections, regenFeedback) {
const payloadSections =[]
		 sections.forEach((e)=>{
			const phaseFeedback = regenFeedback.find((ele)=> ele.type === e.title);
			let section = {
				section_id:e.id,
				section_title:e.title,
				content:e.content,
				regen_feedback:phaseFeedback?.feedback ? phaseFeedback.feedback : 'None'
			}
			payloadSections.push(section)

		 })

		 return {sections:payloadSections}
	}

	_createBotPayload(chapter, subject, payload, template) {
	const subjectString = subject.name.trim().toLowerCase();
    const pattern = /^english(?:\s+\d+(_\d+)?)?$/;
    const isEnglish = pattern.test(subjectString);
	let lp_type;

	if(isEnglish){
		const match = chapter.topics.match(/(POEM|PROSE)/);
		lp_type = match ? match[0] : null;
	}

		return {
			user_id: "ADMIN",
			workflow:formatTemplate(template),
			lp_id: payload.lessonId,
			lp_level: payload.isAll ? "CHAPTER" : "SUBTOPIC",
			learning_outcomes: payload.learningOutcomes,
			lp_type_english: isEnglish ? lp_type : 'NONE',
			chapter_info: {
				id: `Board=${chapter.board},Medium=${chapter.medium},Grade=${chapter.standard},Subject=${subject.subjectName},Number=${chapter.orderNumber},Title=${chapter.topics}`,
				index_path: chapter.indexPath ?? `shiksha/data_new_book/${chapter.board}/${chapter.medium}/${chapter.standard}/${subject.subjectName}/pdf/${chapter.orderNumber}/index/pdf_idx`,
				chapter_title:chapter.topics
			},
			subtopics: payload.isAll ? [] : payload?.subTopics,
			lesson_plan: payload?.lessonPlan || null,
		};
	}

}

module.exports = TeacherLessonPlanManager;
