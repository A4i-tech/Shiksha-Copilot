const axios = require("axios");
const handleError = require("../helper/handleError.js");
const TeacherLessonPlanManager = require("../managers/teacher.lesson.plan.manager.js");
const BaseController = require("./base.controller.js");
const { intersectFilters } = require("../helper/scope.helper");
/** @extends {BaseController<TeacherLessonPlanManager>} */
class TeacherLessonPlanController extends BaseController {
	constructor() {
		super(new TeacherLessonPlanManager());
	}

	async getByTeacherAndPagination(req, res) {
		const {
			page = 1,
			limit = 999,
			filter = {},
			sortBy = "createdAt",
			sortOrder = "desc",
			search = "",
			fields,
		} = req.query;

		const { _id: teacherId } = req.user;

		const sortOrderObject =
			sortOrder === "desc" ? { [sortBy]: -1 } : { [sortBy]: 1 };

		const searchFilter = {};

		if (search) {
			const searchFields = [
				"lesson.name",
				"resource.lessonName",
				"lesson.chapter.topics",
				"resource.chapter.topics",
				"lesson.chapter.subTopics",
				"resource.chapter.subTopics",
			];

			const regexExpressions = searchFields.map((field) => ({
				[field]: { $regex: new RegExp(search, "i") },
			}));

			searchFilter.$or = regexExpressions;
		}

		const result =
			await this.manager.getByTeacherAndPagination(
				teacherId,
				parseInt(page),
				parseInt(limit),
				{ ...intersectFilters(filter, searchFilter), fields },
				sortOrderObject
			);

		if (result.success) {
			return res.status(200).json(result);
		}

		handleError(result, res);

		return;
	}

	async getMonthlyCount(req, res) {
		const teacherId = req.user._id;

		let filter = req.query.filter;

		const monthlyCounts = await this.manager.getMonthlyCount(
			teacherId,
			filter
		);

		if (monthlyCounts.success) {
			return res.status(200).json(monthlyCounts.data);
		}

		handleError(monthlyCounts, res);

		return;
	}


	async getRegenerationLimit(req, res) {
		const teacherId = req.user._id;

		const regenerationLimit = await this.manager.getRegenerationLimit(
			teacherId
		);

		if (regenerationLimit.success) {
			return res.status(200).json(regenerationLimit);
		}

		handleError(regenerationLimit, res);

		return;
	}

	async checkIfLessonPlanExists(req, res) {
		const { lessonPlanId } = req.params;
		const teacherId = req.user._id;

		const doesLessonPlanExists =
			await this.manager.checkIfLessonPlanExists(
				teacherId,
				lessonPlanId
			);

		if (!doesLessonPlanExists) {
			return res.status(200).json({ choose: true });
		} else {
			return res.status(404).json({ choose: false });
		}
	}
	
	async getLessonPlanById(req, res) {
		const { lessonPlanId } = req.params;
		const teacherId = req.user._id;

		const lessonPlan = await this.manager.getLessonPlanById(
			teacherId,
			lessonPlanId
		);

		if (lessonPlan) {
			return res.status(200).json(lessonPlan);
		} else {
			return res.status(404).json({ message: "Lesson plan not found" });
		}
	}

	async getLessonPlanPresentation(req, res) {
		const { lessonPlanId } = req.params;
		const pythonUrl = process.env.LLM_API_BASE_URL;
		const response = await axios.get(`${pythonUrl}/presentation/jobs`, {
			headers: {"X-User-ID": "0".repeat(24)},
			params: {tags: `lesson-plan-${lessonPlanId}`, limit: 1}
		});
		if (response.data.length > 0) {
			return res.status(200).json(response.data[0]);
		} else {
			return res.status(404).json({ message: "Presentation not found" });
		}
	}

	async generateLessonPlanPresentation(req, res) {
		const { lessonPlanId } = req.params;
		const teacherId = req.user._id;

		const pythonUrl = process.env.LLM_API_BASE_URL;
		let response = await axios.get(`${pythonUrl}/presentation/jobs`, {
			headers: {"X-User-ID": "0".repeat(24)},
			params: {tags: `lesson-plan-${lessonPlanId}`, limit: 1}
		});
		if (response.data.length > 0) {
			return res.status(200).json(response.data[0]);
		}

		const [authorized, lessonPlan] = await Promise.all([
			this.manager.dao.getLessonPlanById(teacherId, lessonPlanId), // test whether teacher have access to this lp
			this.manager.masterLessonDao.getById(lessonPlanId)
		]);
		if (!authorized || !lessonPlan) {
			return res.status(404).json({ message: "Lesson plan not found" });
		}

		// this prefix is sufficient to evade libmagic's content-based file mime inference
		const blob = new Blob(["Lesson plan content:\n", JSON.stringify(lessonPlan)], { type: 'text/plain' });
		const formData = new FormData();
		formData.append("textbook_file", blob, `lesson-plan-${lessonPlanId}.json.txt`);
		formData.append("slides", 16);
		formData.append("tags", `lesson-plan-${lessonPlanId}`);
		formData.append("instruction", "");
		response = await axios.post(`${pythonUrl}/presentation/job`, formData, {headers: {"Content-Type": "multipart/form-data", "X-User-ID": "0".repeat(24)}});
		return res.status(200).json(response.data);
	}

	async getResourcePlanById(req, res) {
		const { resourcePlanId } = req.params;
		const teacherId = req.user._id;

		const resourcePlan = await this.manager.getResourcePlanById(
			teacherId,
			resourcePlanId
		);
		if (resourcePlan) {
			return res.status(200).json(resourcePlan);
		} else {
			return res.status(404).json({ message: "Resource plan not found" });
		}
	}

	async deleteLessonPlan(req, res) {
		const { lessonPlanId } = req.params;
		const teacherId = req.user._id;
		const result = await this.manager.deleteLessonPlan(teacherId, lessonPlanId);
		return result.success ? res.status(200).json(result) : res.status(404).json(result);
	}

	async deleteResourcePlan(req, res) {
		const { resourcePlanId } = req.params;
		const teacherId = req.user._id;
		const result = await this.manager.deleteResourcePlan(teacherId, resourcePlanId);
		return result.success ? res.status(200).json(result) : res.status(404).json(result);
	}

	async generateContent(req, res) {
        const payload = req.body;
        const teacherId = req.user._id;

        const result = await this.manager.generateContent(teacherId, payload);

        if (result.success) {
            return res.status(200).json(result);
        } else {
            handleError(result, res);
            return;
        }
    }

    async regenerateContent(req, res) {
        const payload = req.body;
        const teacherId = req.user._id;

        const result = await this.manager.regenerateContent(teacherId, payload);

        if (result.success) {
            return res.status(200).json(result);
        } else {
            handleError(result, res);
            return;
        }
    }

    async sectionAiEdit(req, res) {
        try {
            const payload = req.body;
            const teacherId = req.user._id;

            const result = await this.manager.sectionAiEdit(teacherId, payload);

            if (result.success) {
                return res.status(200).json(result);
            } else {
                handleError(result, res);
                return;
            }
        } catch (error) {
            console.error("Error -> TeacherLessonPlanController -> sectionAiEdit", error);
            return res.status(500).json({ error: "Internal server error" });
        }
    }

    async planAiEdit(req, res) {
        try {
            const payload = req.body;
            const teacherId = req.user._id;

            const result = await this.manager.planAiEdit(teacherId, payload);

            if (result.success) {
                return res.status(200).json(result);
            } else {
                handleError(result, res);
                return;
            }
        } catch (error) {
            console.error("Error -> TeacherLessonPlanController -> planAiEdit", error);
            return res.status(500).json({ error: "Internal server error" });
        }
    }

	async handleWebhook(req, res) {
        const data = req.body;
        await this.manager.processWebhookData(data);
        res.status(200).send({ success: true });
    }

	async lessonMediaUploads(req, res) {
		const { lessonPlanId } = req.params;
		const teacherId = req.user._id;
        const data = req.body;
        const result = await this.manager.lessonUploadMedia(teacherId,lessonPlanId,data);
        if (result.success) {
            return res.status(200).json(result);
        } else {
            handleError(result, res);
            return;
        }
    }

	async deleteLessonMediaUploads(req, res) {
		const { lessonPlanId } = req.params;
		const teacherId = req.user._id;
        const data = req.body;
        const result = await this.manager.deleteLessonMedia(teacherId,lessonPlanId,data);
        if (result.success) {
            return res.status(200).json(result);
        } else {
            handleError(result, res);
            return;
        }
    }

		async resourceMediaUploads(req, res) {
		const { resourcePlanId } = req.params;
		const teacherId = req.user._id;
            const data = req.body;
            const result = await this.manager.resourceUploadMedia(teacherId,resourcePlanId,data);
            if (result.success) {
                return res.status(200).json(result);
            } else {
                handleError(result, res);
                return;
            }
    }

	async deleteResourceMediaUploads(req, res) {
		const { resourcePlanId } = req.params;
		const teacherId = req.user._id;
            const data = req.body;
            const result = await this.manager.deleteResourceMedia(teacherId,resourcePlanId,data);
            if (result.success) {
                return res.status(200).json(result);
            } else {
                handleError(result, res);
                return;
            }
    }


	async resourceActivityRating(req, res) {
		const { resourcePlanId } = req.params;
		const teacherId = req.user._id;
            const data = req.body;
            const result = await this.manager.rateActivity(teacherId,resourcePlanId,data);
            if (result.success) {
                return res.status(200).json(result);
            } else {
                handleError(result, res);
                return;
            }
    }
	async retryLessonPlan(req, res) {
		const { regeneratedId, _id } = req.body;

		const result = await this.manager.retryLessonPlan(regeneratedId, _id);

		if (result.success) {
			return res.status(200).json(result);
		} else {
			handleError(result, res);
			return;
		}
	}

}

module.exports = TeacherLessonPlanController;
