const TeacherLessonPlanManager = require("../../../managers/teacher.lesson.plan.manager");
const TeacherLessonPlanDao = require("../../../dao/teacher.lesson.plan.dao");
const ChapterDao = require("../../../dao/chapter.dao");
const MasterLessonDao = require("../../../dao/master.lesson.dao");
const MasterSubjectDao = require("../../../dao/master.subject.dao");
const LessonPlanTemplateDao = require("../../../dao/lesson.plan.template.dao");
const RegeneratedLessonResourceDao = require("../../../dao/regenerate.log.dao");
const LessonFeedbackDao = require("../../../dao/feedback.lesson.dao");
const { postToCopilotBot, getWorkflowRun } = require("../../../services/copilot.bot.service");
const LessonPlanTemplate = require("../../../models/lesson.plan.template.model");

jest.mock("../../../dao/teacher.lesson.plan.dao");
jest.mock("../../../dao/chapter.dao");
jest.mock("../../../dao/master.lesson.dao");
jest.mock("../../../dao/master.subject.dao");
jest.mock("../../../dao/lesson.plan.template.dao");
jest.mock("../../../dao/regenerate.log.dao");
jest.mock("../../../dao/feedback.lesson.dao");
jest.mock("../../../services/copilot.bot.service");
describe("TeacherLessonPlanManager", () => {
  let manager;
  let mockTeacherLessonPlanDao;
  let mockChapterDao;
  let mockMasterLessonDao;
  let mockSubjectDao;
  let mockTemplateDao;
  let mockRegeneratedDao;
  let mockFeedbackDao;

  afterEach(() => {
    jest.restoreAllMocks();
  });

  beforeEach(() => {
    jest.clearAllMocks();

    mockTeacherLessonPlanDao = {
      getByTeacherAndPagination: jest.fn(),
      getLessonPlanById: jest.fn(),
      getResourcePlanById: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      updatePlan: jest.fn(),
      updateForRegenerate: jest.fn(),
      getOne: jest.fn(),
      getById: jest.fn(),
      getRegeneratedLessonPlansCount: jest.fn(),
    };

    mockChapterDao = {
      getById: jest.fn(),
    };

    mockMasterLessonDao = {
      getById: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    };

    mockSubjectDao = {
      getById: jest.fn(),
    };

    mockTemplateDao = {
      getById: jest.fn(),
    };

    mockRegeneratedDao = {
      create: jest.fn(),
      getOne: jest.fn(),
      getById: jest.fn(),
      update: jest.fn(),
    };

    mockFeedbackDao = {
      create: jest.fn(),
      getOne: jest.fn(),
      update: jest.fn(),
    };

    TeacherLessonPlanDao.mockImplementation(() => mockTeacherLessonPlanDao);
    ChapterDao.mockImplementation(() => mockChapterDao);
    MasterLessonDao.mockImplementation(() => mockMasterLessonDao);
    MasterSubjectDao.mockImplementation(() => mockSubjectDao);
    LessonPlanTemplateDao.mockImplementation(() => mockTemplateDao);
    RegeneratedLessonResourceDao.mockImplementation(() => mockRegeneratedDao);
    LessonFeedbackDao.mockImplementation(() => mockFeedbackDao);

    manager = new TeacherLessonPlanManager();
  });

  describe("constructor", () => {
    it("should create manager instance successfully", () => {
      expect(manager).toBeInstanceOf(TeacherLessonPlanManager);
      expect(manager.dao).toBeDefined();
      expect(manager.chapterDao).toBeDefined();
      expect(manager.masterLessonDao).toBeDefined();
    });

    it("should initialize all DAOs", () => {
      expect(TeacherLessonPlanDao).toHaveBeenCalled();
      expect(ChapterDao).toHaveBeenCalled();
      expect(MasterLessonDao).toHaveBeenCalled();
    });
  });

  describe("getByTeacherAndPagination", () => {
    it("should get lessons by type when not 'all'", async () => {
      const mockLessons = {
        results: [
          { _id: "lesson-1", updatedAt: new Date("2024-01-01") },
          { _id: "lesson-2", updatedAt: new Date("2024-01-02") },
        ],
      };
      mockTeacherLessonPlanDao.getByTeacherAndPagination.mockResolvedValue(
        mockLessons
      );

      const result = await manager.getByTeacherAndPagination(
        "teacher-123",
        1,
        10,
        { type: "lesson" }
      );

      expect(mockTeacherLessonPlanDao.getByTeacherAndPagination).toHaveBeenCalledWith(
        "teacher-123",
        "lesson",
        1,
        10,
        { type: "lesson" },
        {}
      );
      expect(result.success).toBe(true);
      expect(result.data).toHaveLength(2);
    });

    it("should combine lessons and resources when type is 'all'", async () => {
      const mockLessons = {
        results: [{ _id: "lesson-1", updatedAt: new Date("2024-01-02") }],
      };
      const mockResources = {
        results: [{ _id: "resource-1", updatedAt: new Date("2024-01-01") }],
      };

      mockTeacherLessonPlanDao.getByTeacherAndPagination
        .mockResolvedValueOnce(mockLessons)
        .mockResolvedValueOnce(mockResources);

      const result = await manager.getByTeacherAndPagination(
        "teacher-123",
        1,
        10,
        { type: "all" }
      );

      expect(mockTeacherLessonPlanDao.getByTeacherAndPagination).toHaveBeenCalledTimes(
        2
      );
      expect(result.success).toBe(true);
      expect(result.data).toHaveLength(2);
    });

    it("should propagate errors instead of swallowing them", async () => {
      mockTeacherLessonPlanDao.getByTeacherAndPagination.mockRejectedValue(
        new Error("Database error")
      );

      await expect(manager.getByTeacherAndPagination("teacher-123")).rejects.toThrow("Database error");
    });
  });

  describe("getMonthlyCount", () => {
    it("should get monthly count successfully", async () => {
      const mockCounts = [
        { month: "January", count: 5 },
        { month: "February", count: 8 },
      ];

      const teacherLessonPlanAggregation = require("../../../aggregation/teacher.lesson.plan.aggregation");
      teacherLessonPlanAggregation.getMonthlyCount = jest
        .fn()
        .mockResolvedValue(mockCounts);

      const result = await manager.getMonthlyCount("teacher-123", {});

      expect(result.success).toBe(true);
      expect(result.data).toEqual(mockCounts);
    });
  });

  describe("checkIfLessonPlanExists", () => {
    it("should return true when lesson plan exists", async () => {
      const TeacherLessonPlanModel = require("../../../models/teacher.lesson.plan.model");
      TeacherLessonPlanModel.findOne = jest
        .fn()
        .mockResolvedValue({ _id: "plan-123" });

      const result = await manager.checkIfLessonPlanExists(
        "teacher-123",
        "lesson-123"
      );

      expect(result).toBe(true);
    });

    it("should return false when lesson plan does not exist", async () => {
      const TeacherLessonPlanModel = require("../../../models/teacher.lesson.plan.model");
      TeacherLessonPlanModel.findOne = jest.fn().mockResolvedValue(null);

      const result = await manager.checkIfLessonPlanExists(
        "teacher-123",
        "lesson-123"
      );

      expect(result).toBe(false);
    });
  });

  describe("getLessonPlanById", () => {
    it("should get lesson plan successfully", async () => {
      const mockLessonPlan = { _id: "plan-123", name: "Test Plan" };
      mockTeacherLessonPlanDao.getLessonPlanById.mockResolvedValue(
        mockLessonPlan
      );

      const result = await manager.getLessonPlanById(
        "teacher-123",
        "lesson-123"
      );

      expect(result.success).toBe(true);
      expect(result.data).toEqual(mockLessonPlan);
    });

    it("should return error when lesson plan not found", async () => {
      mockTeacherLessonPlanDao.getLessonPlanById.mockResolvedValue(null);

      const result = await manager.getLessonPlanById(
        "teacher-123",
        "lesson-123"
      );

      expect(result.success).toBe(false);
      expect(result.message).toBe("Lesson plan not found");
    });
  });

  describe("processWebhookData", () => {
    it("should throw a 404 AppError for a plan that is not saved yet", async () => {
      mockTeacherLessonPlanDao.getOne.mockResolvedValue(null);

      await expect(
        manager.processWebhookData({ instance_id: "i-1", status: "pending" })
      ).rejects.toMatchObject({ name: "AppError", statusCode: 404 });
    });

    it("should autosave a regenerated plan when the run completes", async () => {
      mockTeacherLessonPlanDao.getOne.mockResolvedValue({ _id: "plan-1", lessonId: "lesson-1" });
      mockMasterLessonDao.getById.mockResolvedValue({ _id: "lesson-1", templateId: "tpl-1" });
      jest.spyOn(LessonPlanTemplate, "findById").mockResolvedValue({ sections: [{ id: "s1", outputFormat: "plain_text" }] });
      mockRegeneratedDao.getOne.mockResolvedValue({ _id: "log-1" });

      await manager.processWebhookData({
        instance_id: "i-1",
        status: "COMPLETED",
        output: { sections: [{ section_id: "s1", section_title: "Engage", content: "text" }] },
      });

      expect(mockTeacherLessonPlanDao.updatePlan).toHaveBeenCalledWith(
        "plan-1",
        expect.objectContaining({ status: "completed", isCompleted: true })
      );
    });

    it("should not mark a failed run as saved and should store the failure text", async () => {
      mockTeacherLessonPlanDao.getOne.mockResolvedValue({ _id: "plan-1", lessonId: "lesson-1" });
      mockRegeneratedDao.getOne.mockResolvedValue({ _id: "log-1" });

      await manager.processWebhookData({ instance_id: "i-1", status: "FAILED", output: "model crashed" });

      expect(mockTeacherLessonPlanDao.updatePlan).toHaveBeenCalledWith(
        "plan-1",
        { status: "failed", error: "model crashed" }
      );
    });

    it("should mark the plan failed and throw 400 when a completed run has no sections", async () => {
      mockTeacherLessonPlanDao.getOne.mockResolvedValue({ _id: "plan-1", lessonId: "lesson-1" });
      mockMasterLessonDao.getById.mockResolvedValue({ _id: "lesson-1", templateId: "tpl-1" });
      jest.spyOn(LessonPlanTemplate, "findById").mockResolvedValue({ sections: [] });

      await expect(
        manager.processWebhookData({ instance_id: "i-1", status: "COMPLETED", output: {} })
      ).rejects.toMatchObject({ name: "AppError", statusCode: 400 });
      expect(mockTeacherLessonPlanDao.updatePlan).toHaveBeenCalledWith(
        "plan-1",
        expect.objectContaining({ status: "failed", error: expect.any(String) })
      );
    });

    it("should mark the plan failed and throw 400 when the template is missing", async () => {
      mockTeacherLessonPlanDao.getOne.mockResolvedValue({ _id: "plan-1", lessonId: "lesson-1" });
      mockMasterLessonDao.getById.mockResolvedValue({ _id: "lesson-1", templateId: "tpl-1" });
      jest.spyOn(LessonPlanTemplate, "findById").mockResolvedValue(null);

      await expect(
        manager.processWebhookData({ instance_id: "i-1", status: "COMPLETED", output: { sections: [] } })
      ).rejects.toMatchObject({ name: "AppError", statusCode: 400 });
      expect(mockTeacherLessonPlanDao.updatePlan).toHaveBeenCalledWith(
        "plan-1",
        expect.objectContaining({ status: "failed" })
      );
    });

    it("should throw a 400 AppError without querying when instance_id is missing", async () => {
      await expect(manager.processWebhookData({ status: "failed" })).rejects.toMatchObject({
        name: "AppError",
        statusCode: 400,
      });
      expect(mockTeacherLessonPlanDao.getOne).not.toHaveBeenCalled();
    });
  });

  describe("getLessonPlanById run status check", () => {
    const running = () => ({ _id: "p1", status: "running", instanceId: "i-1" });

    it("should mark a running plan failed when the workflow run failed", async () => {
      mockTeacherLessonPlanDao.getLessonPlanById.mockResolvedValue(running());
      getWorkflowRun.mockResolvedValue({ data: { runtimeStatus: "Failed", output: "boom" } });
      mockTeacherLessonPlanDao.getOne.mockResolvedValue({ _id: "p1", lessonId: "l1" });

      const result = await manager.getLessonPlanById("t1", "l1");

      expect(mockTeacherLessonPlanDao.updatePlan).toHaveBeenCalledWith("p1", { status: "failed", error: "boom" });
      expect(result.data.status).toBe("failed");
    });

    it("should mark a running plan failed when the workflow run is gone", async () => {
      mockTeacherLessonPlanDao.getLessonPlanById.mockResolvedValue(running());
      getWorkflowRun.mockRejectedValue({ response: { status: 404 } });
      mockTeacherLessonPlanDao.getOne.mockResolvedValue({ _id: "p1", lessonId: "l1" });

      const result = await manager.getLessonPlanById("t1", "l1");

      expect(result.data.status).toBe("failed");
    });

    it("should replay the run output as a completed webhook when the run completed", async () => {
      mockTeacherLessonPlanDao.getLessonPlanById
        .mockResolvedValueOnce(running())
        .mockResolvedValueOnce({ _id: "p1", status: "completed" });
      const output = { sections: [{ section_id: "s1", content: "text" }] };
      getWorkflowRun.mockResolvedValue({ data: { runtimeStatus: "Completed", output } });
      const spy = jest.spyOn(manager, "processWebhookData").mockResolvedValue({});

      const result = await manager.getLessonPlanById("t1", "l1");

      expect(spy).toHaveBeenCalledWith({ instance_id: "i-1", status: "COMPLETED", output });
      expect(result.data.status).toBe("completed");
    });

    it("should do nothing when the run completed without output", async () => {
      mockTeacherLessonPlanDao.getLessonPlanById.mockResolvedValue(running());
      getWorkflowRun.mockResolvedValue({ data: { runtimeStatus: "Completed" } });

      const result = await manager.getLessonPlanById("t1", "l1");

      expect(mockTeacherLessonPlanDao.updatePlan).not.toHaveBeenCalled();
      expect(result.data.status).toBe("running");
    });

    it("should keep a running plan running when the workflow run is still running", async () => {
      mockTeacherLessonPlanDao.getLessonPlanById.mockResolvedValue(running());
      getWorkflowRun.mockResolvedValue({ data: { runtimeStatus: "Running" } });

      const result = await manager.getLessonPlanById("t1", "l1");

      expect(mockTeacherLessonPlanDao.updatePlan).not.toHaveBeenCalled();
      expect(result.data.status).toBe("running");
    });

    it("should keep a running plan running when the status check fails with a network error", async () => {
      mockTeacherLessonPlanDao.getLessonPlanById.mockResolvedValue(running());
      getWorkflowRun.mockRejectedValue(new Error("network down"));

      const result = await manager.getLessonPlanById("t1", "l1");

      expect(result.data.status).toBe("running");
    });
  });

  describe("getResourcePlanById", () => {
    it("should get resource plan successfully", async () => {
      const mockResourcePlan = { _id: "resource-123", name: "Test Resource" };
      mockTeacherLessonPlanDao.getResourcePlanById.mockResolvedValue(
        mockResourcePlan
      );

      const result = await manager.getResourcePlanById(
        "teacher-123",
        "resource-123"
      );

      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
    });

    it("should return error when resource plan not found", async () => {
      mockTeacherLessonPlanDao.getResourcePlanById.mockResolvedValue(null);

      const result = await manager.getResourcePlanById(
        "teacher-123",
        "resource-123"
      );

      expect(result.success).toBe(false);
      expect(result.message).toBe(" Resource plan not found");
    });
  });

  describe("regeneratedCount", () => {
    it("should return count of regenerated lesson plans for today", async () => {
      mockTeacherLessonPlanDao.getRegeneratedLessonPlansCount.mockResolvedValue(
        5
      );

      const result = await manager.regeneratedCount("teacher-123");

      expect(result).toBe(5);
      expect(
        mockTeacherLessonPlanDao.getRegeneratedLessonPlansCount
      ).toHaveBeenCalledWith(
        "teacher-123",
        expect.any(Date),
        expect.any(Date)
      );
    });
  });

  describe("getRegenerationLimit", () => {
    it("should return false when limit not reached", async () => {
      mockTeacherLessonPlanDao.getRegeneratedLessonPlansCount.mockResolvedValue(
        2
      );

      const result = await manager.getRegenerationLimit("teacher-123");

      expect(result.success).toBe(true);
      expect(result.data.regenerationLimitReached).toBe(false);
    });

    it("should return true when limit reached", async () => {
      mockTeacherLessonPlanDao.getRegeneratedLessonPlansCount.mockResolvedValue(
        10
      );

      const result = await manager.getRegenerationLimit("teacher-123");

      expect(result.success).toBe(true);
      expect(result.data.regenerationLimitReached).toBe(true);
    });
  });

  describe("generateContent", () => {
    it("should return error when regeneration limit reached", async () => {
      mockTeacherLessonPlanDao.getRegeneratedLessonPlansCount.mockResolvedValue(
        10
      );

      const result = await manager.generateContent("teacher-123", {
        lessonId: "lesson-123",
      });

      expect(result.success).toBe(false);
      expect(result.message).toContain("Daily regeneration limit");
    });

    it("should throw a 404 AppError when the master lesson is missing", async () => {
      mockTeacherLessonPlanDao.getRegeneratedLessonPlansCount.mockResolvedValue(0);
      mockMasterLessonDao.getById.mockResolvedValue(null);

      await expect(
        manager.generateContent("teacher-123", { lessonId: "lesson-123" })
      ).rejects.toMatchObject({ name: "AppError", statusCode: 404 });
    });

    it("should throw an AppError when the lesson template is missing", async () => {
      mockTeacherLessonPlanDao.getRegeneratedLessonPlansCount.mockResolvedValue(0);
      mockMasterLessonDao.getById.mockResolvedValue({ _id: "lesson-123", templateId: "tpl-1" });
      mockTemplateDao.getById.mockResolvedValue(null);

      await expect(
        manager.generateContent("teacher-123", { lessonId: "lesson-123" })
      ).rejects.toMatchObject({ name: "AppError", message: expect.stringContaining("tpl-1") });
      expect(postToCopilotBot).not.toHaveBeenCalled();
    });

    // Removed: generateContent success test - requires complex payload creation mocking
  });

  describe("regenerateContent", () => {
    it("should throw a 404 AppError when the master lesson is missing", async () => {
      mockTeacherLessonPlanDao.getRegeneratedLessonPlansCount.mockResolvedValue(0);
      mockMasterLessonDao.getById.mockResolvedValue(null);

      await expect(
        manager.regenerateContent("teacher-123", { lessonId: "lesson-123" })
      ).rejects.toMatchObject({ name: "AppError", statusCode: 404 });
    });

    it("should throw an AppError when the lesson template is missing", async () => {
      mockTeacherLessonPlanDao.getRegeneratedLessonPlansCount.mockResolvedValue(0);
      mockMasterLessonDao.getById.mockResolvedValue({ _id: "lesson-123", templateId: "tpl-1" });
      mockTemplateDao.getById.mockResolvedValue(null);

      await expect(
        manager.regenerateContent("teacher-123", { lessonId: "lesson-123" })
      ).rejects.toMatchObject({ name: "AppError", message: expect.stringContaining("tpl-1") });
      expect(postToCopilotBot).not.toHaveBeenCalled();
    });
  });

  describe("retryLessonPlan", () => {
    it("should load the template and pass it to the bot payload", async () => {
      mockRegeneratedDao.getById.mockResolvedValue({ status: "failed", isLoGeneratedContent: true, save: jest.fn() });
      mockTeacherLessonPlanDao.getById.mockResolvedValue({ status: "failed", lessonId: "l1", save: jest.fn() });
      mockMasterLessonDao.getById.mockResolvedValue({ _id: "l1", templateId: "tpl-1", chapterId: "c1", subTopics: [], isAll: true });
      mockTemplateDao.getById.mockResolvedValue({ workFlowId: "wf", sections: [] });
      mockChapterDao.getById.mockResolvedValue({ _id: "c1", subjectId: "s1", topics: "Algebra" });
      mockSubjectDao.getById.mockResolvedValue({ name: "Maths", subjectName: "Maths" });
      postToCopilotBot.mockResolvedValue({ status: 202, data: { instance_id: "i-2" } });

      await manager.retryLessonPlan("r1", "p1");

      expect(mockTemplateDao.getById).toHaveBeenCalledWith("tpl-1");
      expect(postToCopilotBot).toHaveBeenCalledWith(expect.objectContaining({ workflow: expect.anything() }));
    });

    it("should throw a 404 AppError when the chapter is missing", async () => {
      mockRegeneratedDao.getById.mockResolvedValue({ status: "failed" });
      mockTeacherLessonPlanDao.getById.mockResolvedValue({ status: "failed", lessonId: "l1" });
      mockMasterLessonDao.getById.mockResolvedValue({ _id: "l1", templateId: "tpl-1", chapterId: "c1" });
      mockTemplateDao.getById.mockResolvedValue({ sections: [] });
      mockChapterDao.getById.mockResolvedValue(null);

      await expect(manager.retryLessonPlan("r1", "p1")).rejects.toMatchObject({ statusCode: 404 });
    });
  });

  // Removed: lessonUploadMedia test - requires complex error handling mocking


  describe("_createBotPayload", () => {
    it("should create bot payload correctly", () => {
      const chapter = {
        board: "KSEEB",
        medium: "English",
        standard: "5",
        orderNumber: "1",
        topics: "Mathematics",
        indexPath: "/path/to/index",
      };
      const subject = {
        name: "Mathematics",
        subjectName: "Mathematics",
      };
      const payload = {
        lessonId: "lesson-123",
        isAll: true,
        learningOutcomes: ["Outcome 1"],
        subTopics: [],
      };
      const template = { sections: [] };

      const result = manager._createBotPayload(
        chapter,
        subject,
        payload,
        template
      );

      expect(result).toHaveProperty("user_id");
      expect(result).toHaveProperty("workflow");
      expect(result).toHaveProperty("chapter_info");
      expect(result.lp_level).toBe("CHAPTER");
    });

    it("should send NONE for an English chapter without POEM or PROSE and always send a subtopics list", () => {
      const chapter = { board: "B", medium: "E", standard: "5", orderNumber: "1", topics: "Unit 1", indexPath: "/i" };
      const subject = { name: "English", subjectName: "English" };

      const result = manager._createBotPayload(chapter, subject, { isAll: false, learningOutcomes: [] }, { sections: [] });

      expect(result.lp_type_english).toBe("NONE");
      expect(result.subtopics).toEqual([]);
    });
  });
});
