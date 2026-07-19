const MasterLessonController = require("../../../controllers/master.lesson.controller");
const MasterLessonManager = require("../../../managers/master.lesson.manager");
const handleError = require("../../../helper/handleError");

jest.mock("../../../managers/master.lesson.manager");
jest.mock("../../../helper/handleError");

describe("MasterLessonController", () => {
  let controller;
  let mockReq;
  let mockRes;
  let mockManager;

  beforeEach(() => {
    jest.clearAllMocks();

    // Setup mock manager methods before controller instantiation
    MasterLessonManager.mockImplementation(() => ({
      saveToTeacher: jest.fn(),
      getActivityById: jest.fn(),
      getByTeacher: jest.fn(),
      update: jest.fn(),
      regenerateLessonPlan: jest.fn(),
      comboScript: jest.fn(),
      getLessonOutcomes: jest.fn(),
      generateLessonPlan: jest.fn(),
      generate5ETables: jest.fn(),
      scriptLpDump: jest.fn(),
      uploadMasterLesson: jest.fn(),
      uploadMasterLessonOlderVersion: jest.fn(),
    }));

    controller = new MasterLessonController();
    mockManager = controller.manager;

    mockReq = {
      user: { _id: "teacher-123", role: "teacher", name: "Test Teacher" },
      permissions: [{ permission: "lesson-plan.edit" }, { permission: "lesson-resource.edit" }],
      params: {},
      query: {},
      body: {},
    };

    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
      send: jest.fn().mockReturnThis(),
    };
  });

  describe("saveToTeacher", () => {
    it("should save lesson to teacher successfully", async () => {
      const mockResult = {
        success: true,
        data: { lessonId: "lesson-123", saved: true },
      };
      mockManager.saveToTeacher = jest.fn().mockResolvedValue(mockResult);
      mockReq.body = { lessonId: "lesson-123", chapterId: "chapter-456" };

      await controller.saveToTeacher(mockReq, mockRes);

      expect(mockManager.saveToTeacher).toHaveBeenCalledWith("teacher-123", mockReq.body);
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(mockResult);
    });

    it("should handle error when save fails", async () => {
      const mockResult = { success: false, message: "Save failed" };
      mockManager.saveToTeacher = jest.fn().mockResolvedValue(mockResult);

      await controller.saveToTeacher(mockReq, mockRes);

      expect(handleError).toHaveBeenCalledWith(mockResult, mockRes);
    });

    it("should handle exceptions", async () => {
      mockManager.saveToTeacher = jest.fn().mockRejectedValue(new Error("Database error"));

      await controller.saveToTeacher(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith(expect.any(Error));
    });
  });

  describe("getActivityById", () => {
    it("should get activity by ID successfully", async () => {
      const mockResult = {
        success: true,
        data: { activityId: "activity-123", title: "Test Activity" },
      };
      mockManager.getActivityById = jest.fn().mockResolvedValue(mockResult);
      mockReq.params = { id: "activity-123" };

      await controller.getActivityById(mockReq, mockRes);

      expect(mockManager.getActivityById).toHaveBeenCalledWith("activity-123");
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(mockResult);
    });

    it("should handle error when activity not found", async () => {
      const mockResult = { success: false, message: "Activity not found" };
      mockManager.getActivityById = jest.fn().mockResolvedValue(mockResult);
      mockReq.params = { id: "invalid-id" };

      await controller.getActivityById(mockReq, mockRes);

      expect(handleError).toHaveBeenCalledWith(mockResult, mockRes);
    });

    it("should handle exceptions", async () => {
      mockManager.getActivityById = jest.fn().mockRejectedValue(new Error("Error"));
      mockReq.params = { id: "activity-123" };

      await controller.getActivityById(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
    });
  });

  describe("getByTeacher", () => {
    it("should get lessons by teacher successfully", async () => {
      const mockResult = {
        success: true,
        data: [{ lessonId: "lesson-1" }, { lessonId: "lesson-2" }],
      };
      mockManager.getByTeacher = jest.fn().mockResolvedValue(mockResult);
      mockReq.body = { chapterId: "chapter-123" };

      await controller.getByTeacher(mockReq, mockRes);

      expect(mockManager.getByTeacher).toHaveBeenCalledWith("teacher-123", mockReq.body);
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(mockResult);
    });

    it("should handle error when getting lessons fails", async () => {
      const mockResult = { success: false, message: "Failed to get lessons" };
      mockManager.getByTeacher = jest.fn().mockResolvedValue(mockResult);

      await controller.getByTeacher(mockReq, mockRes);

      expect(handleError).toHaveBeenCalledWith(mockResult, mockRes);
    });
  });

  describe("update", () => {
    it("should update master lesson successfully", async () => {
      const mockResult = {
        success: true,
        data: { lessonId: "lesson-123", updated: true },
      };
      mockManager.update = jest.fn().mockResolvedValue(mockResult);
      mockReq.params = { id: "lesson-123" };
      mockReq.body = { title: "Updated Title" };

      await controller.update(mockReq, mockRes);

      expect(mockManager.update).toHaveBeenCalledWith(mockReq);
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(mockResult);
    });

    it("should handle update failure", async () => {
      const mockResult = { success: false, message: "Update failed" };
      mockManager.update = jest.fn().mockResolvedValue(mockResult);

      await controller.update(mockReq, mockRes);

      expect(handleError).toHaveBeenCalledWith(mockResult, mockRes);
    });
  });

  describe("regenerateLessonPlan", () => {
    it("should regenerate lesson plan for power user", async () => {
      const mockResult = {
        success: true,
        data: { lessonId: "lesson-123", regenerated: true },
      };
      mockManager.regenerateLessonPlan = jest.fn().mockResolvedValue(mockResult);
      mockReq.permissions = ["lesson-plan.generate"];
      mockReq.body = { lessonId: "lesson-123", reason: "Outdated content" };

      await controller.regenerateLessonPlan(mockReq, mockRes);

      expect(mockManager.regenerateLessonPlan).toHaveBeenCalledWith({
        lessonId: "lesson-123",
        reason: "Outdated content",
        userId: "teacher-123",
      });
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(mockResult.data);
    });

    it("should regenerate lesson plan for admin user", async () => {
      const mockResult = { success: true, data: { regenerated: true } };
      mockManager.regenerateLessonPlan = jest.fn().mockResolvedValue(mockResult);
      mockReq.permissions = ["content.activity.view"];
      mockReq.body = { lessonId: "lesson-123", reason: "Test" };

      await controller.regenerateLessonPlan(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(200);
    });

    it("should regenerate lesson plan for manager user", async () => {
      const mockResult = { success: true, data: { regenerated: true } };
      mockManager.regenerateLessonPlan = jest.fn().mockResolvedValue(mockResult);
      mockReq.permissions = ["content.activity.view"];
      mockReq.body = { lessonId: "lesson-123", reason: "Test" };

      await controller.regenerateLessonPlan(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(200);
    });

    it("should handle regeneration failure", async () => {
      const mockResult = { success: false, message: "Regeneration failed" };
      mockManager.regenerateLessonPlan = jest.fn().mockResolvedValue(mockResult);
      mockReq.permissions = ["content.activity.view"];
      mockReq.body = { lessonId: "lesson-123", reason: "Test" };

      await controller.regenerateLessonPlan(mockReq, mockRes);

      expect(handleError).toHaveBeenCalledWith(mockResult, mockRes);
    });
  });

  describe("comboScript", () => {
    it("should execute combo script with default values", async () => {
      const mockResult = { success: true, data: { processed: 100 } };
      mockManager.comboScript = jest.fn().mockResolvedValue(mockResult);

      await controller.comboScript(mockReq, mockRes);

      expect(mockManager.comboScript).toHaveBeenCalledWith("CBSE", "English", true);
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(mockResult.data);
    });

    it("should execute combo script with custom values", async () => {
      const mockResult = { success: true, data: { processed: 50 } };
      mockManager.comboScript = jest.fn().mockResolvedValue(mockResult);
      mockReq.body = { board: "ICSE", medium: "Hindi", isAll: false };

      await controller.comboScript(mockReq, mockRes);

      expect(mockManager.comboScript).toHaveBeenCalledWith("ICSE", "Hindi", false);
      expect(mockRes.status).toHaveBeenCalledWith(200);
    });

    it("should handle combo script failure", async () => {
      const mockResult = { success: false, message: "Script failed" };
      mockManager.comboScript = jest.fn().mockResolvedValue(mockResult);

      await controller.comboScript(mockReq, mockRes);

      expect(handleError).toHaveBeenCalledWith(mockResult, mockRes);
    });
  });

  describe("getLessonOutcomes", () => {
    it("should get lesson outcomes successfully", async () => {
      const mockResult = {
        success: true,
        data: { outcomes: ["Outcome 1", "Outcome 2"] },
      };
      mockManager.getLessonOutcomes = jest.fn().mockResolvedValue(mockResult);
      mockReq.body = { chapterId: "chapter-123", templateIds: ["t1", "t2"] };
      mockReq.query = { filters: { board: "CBSE" } };

      await controller.getLessonOutcomes(mockReq, mockRes);

      expect(mockManager.getLessonOutcomes).toHaveBeenCalledWith(
        "chapter-123",
        ["t1", "t2"],
        { board: "CBSE" }
      );
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(mockResult);
    });

    it("should handle empty filters", async () => {
      const mockResult = { success: true, data: { outcomes: [] } };
      mockManager.getLessonOutcomes = jest.fn().mockResolvedValue(mockResult);
      mockReq.body = { chapterId: "chapter-123", templateIds: [] };

      await controller.getLessonOutcomes(mockReq, mockRes);

      expect(mockManager.getLessonOutcomes).toHaveBeenCalledWith("chapter-123", [], {});
    });
  });

  describe("generateLessonPlan", () => {
    it("should generate lesson plan successfully", async () => {
      const mockResult = {
        success: true,
        data: { lessonPlanId: "lp-123", generated: true },
      };
      mockManager.generateLessonPlan = jest.fn().mockResolvedValue(mockResult);
      mockReq.params = { lessonId: "lesson-123" };
      mockReq.query = { filters: { board: "CBSE" } };

      await controller.generateLessonPlan(mockReq, mockRes);

      expect(mockManager.generateLessonPlan).toHaveBeenCalledWith(
        "teacher-123",
        "lesson-123",
        { board: "CBSE" }
      );
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(mockResult);
    });

    it("should handle generation failure", async () => {
      const mockResult = { success: false, message: "Generation failed" };
      mockManager.generateLessonPlan = jest.fn().mockResolvedValue(mockResult);
      mockReq.params = { lessonId: "lesson-123" };

      await controller.generateLessonPlan(mockReq, mockRes);

      expect(handleError).toHaveBeenCalledWith(mockResult, mockRes);
    });
  });

  describe("updateLessonPlan", () => {
    it("should return success message", async () => {
      await controller.updateLessonPlan(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: "Lesson plan updated successfully",
      });
    });
  });

  describe("get5ETables", () => {
    it("should get 5E tables successfully", async () => {
      const mockResult = {
        success: true,
        data: { tables: ["Engage", "Explore", "Explain", "Elaborate", "Evaluate"] },
      };
      mockManager.generate5ETables = jest.fn().mockResolvedValue(mockResult);
      mockReq.params = { lessonId: "lesson-123" };

      await controller.get5ETables(mockReq, mockRes);

      expect(mockManager.generate5ETables).toHaveBeenCalledWith(
        "lesson-123",
        "teacher-123",
        "Test Teacher"
      );
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(mockResult);
    });

    it("should handle generation failure", async () => {
      const mockResult = { success: false, message: "Failed to generate tables" };
      mockManager.generate5ETables = jest.fn().mockResolvedValue(mockResult);
      mockReq.params = { lessonId: "lesson-123" };

      await controller.get5ETables(mockReq, mockRes);

      expect(handleError).toHaveBeenCalledWith(mockResult, mockRes);
    });
  });

  describe("scriptLpDump", () => {
    it("should execute script LP dump successfully", async () => {
      const mockResult = { success: true, data: { dumped: 1000 } };
      mockManager.scriptLpDump = jest.fn().mockResolvedValue(mockResult);

      await controller.scriptLpDump(mockReq, mockRes);

      expect(mockManager.scriptLpDump).toHaveBeenCalledWith(mockReq);
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(mockResult);
    });

    it("should handle script failure", async () => {
      const mockResult = { success: false, message: "Dump failed" };
      mockManager.scriptLpDump = jest.fn().mockResolvedValue(mockResult);

      await controller.scriptLpDump(mockReq, mockRes);

      expect(handleError).toHaveBeenCalledWith(mockResult, mockRes);
    });
  });

  describe("uploadMasterLesson", () => {
    it("should upload master lesson successfully", async () => {
      const mockResult = { success: true, data: { uploaded: true } };
      mockManager.uploadMasterLesson = jest.fn().mockResolvedValue(mockResult);

      await controller.uploadMasterLesson(mockReq, mockRes);

      expect(mockManager.uploadMasterLesson).toHaveBeenCalledWith(mockReq);
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(mockResult);
    });

    it("should handle upload failure", async () => {
      const mockResult = { success: false, message: "Upload failed" };
      mockManager.uploadMasterLesson = jest.fn().mockResolvedValue(mockResult);

      await controller.uploadMasterLesson(mockReq, mockRes);

      expect(handleError).toHaveBeenCalledWith(mockResult, mockRes);
    });
  });

  describe("uploadMasterLessonOlderVersion", () => {
    it("should upload older version successfully", async () => {
      const mockResult = { success: true, data: { uploaded: true } };
      mockManager.uploadMasterLessonOlderVersion = jest.fn().mockResolvedValue(mockResult);

      await controller.uploadMasterLessonOlderVersion(mockReq, mockRes);

      expect(mockManager.uploadMasterLessonOlderVersion).toHaveBeenCalledWith(mockReq);
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(mockResult);
    });

    it("should handle upload failure", async () => {
      const mockResult = { success: false, message: "Upload failed" };
      mockManager.uploadMasterLessonOlderVersion = jest.fn().mockResolvedValue(mockResult);

      await controller.uploadMasterLessonOlderVersion(mockReq, mockRes);

      expect(handleError).toHaveBeenCalledWith(mockResult, mockRes);
    });

    it("should handle exceptions", async () => {
      mockManager.uploadMasterLessonOlderVersion = jest.fn().mockRejectedValue(new Error("Error"));

      await controller.uploadMasterLessonOlderVersion(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
    });
  });
});
