const TeacherLessonPlanController = require("../../../controllers/teacher.lesson.plan.controller");
const TeacherLessonPlanManager = require("../../../managers/teacher.lesson.plan.manager");
const handleError = require("../../../helper/handleError");

// Mock dependencies
jest.mock("../../../managers/teacher.lesson.plan.manager");
jest.mock("../../../helper/handleError");

describe("TeacherLessonPlanController", () => {
  let controller;
  let mockReq;
  let mockRes;
  let mockManager;

  beforeEach(() => {
    jest.clearAllMocks();

    controller = new TeacherLessonPlanController();
    mockManager = TeacherLessonPlanManager.mock.instances[TeacherLessonPlanManager.mock.instances.length - 1];
    controller.teacherLessonPlanManager = mockManager;

    mockReq = {
      params: {},
      body: {},
      query: {},
      user: { _id: "teacher-123", name: "Test Teacher", role: ["teacher"] },
    };

    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
      send: jest.fn().mockReturnThis(),
    };
  });

  describe("Instance creation", () => {
    it("should create an instance of TeacherLessonPlanController", () => {
      expect(controller).toBeInstanceOf(TeacherLessonPlanController);
    });

    it("should have a teacherLessonPlanManager property", () => {
      expect(controller.teacherLessonPlanManager).toBeDefined();
    });
  });

  describe("getByTeacherAndPagination", () => {
    it("should get lesson plans with default pagination", async () => {
      const mockResult = { success: true, data: { results: [], total: 0 } };
      mockManager.getByTeacherAndPagination = jest.fn().mockResolvedValue(mockResult);
      mockReq.query = {};

      await controller.getByTeacherAndPagination(mockReq, mockRes);

      expect(mockManager.getByTeacherAndPagination).toHaveBeenCalledWith(
        "teacher-123",
        1,
        999,
        {},
        { createdAt: -1 },
        "en"
      );
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(mockResult);
    });

    it("should get lesson plans with custom pagination and filters", async () => {
      const mockResult = { success: true, data: { results: [], total: 0 } };
      mockManager.getByTeacherAndPagination = jest.fn().mockResolvedValue(mockResult);
      mockReq.query = {
        page: "2",
        limit: "20",
        sortBy: "updatedAt",
        sortOrder: "asc",
        filter: { class: "10" }
      };

      await controller.getByTeacherAndPagination(mockReq, mockRes);

      expect(mockManager.getByTeacherAndPagination).toHaveBeenCalledWith(
        "teacher-123",
        2,
        20,
        { class: "10" },
        { updatedAt: 1 },
        "en"
      );
      expect(mockRes.status).toHaveBeenCalledWith(200);
    });

    it("should handle search filter", async () => {
      const mockResult = { success: true, data: { results: [], total: 0 } };
      mockManager.getByTeacherAndPagination = jest.fn().mockResolvedValue(mockResult);
      mockReq.query = { search: "math" };

      await controller.getByTeacherAndPagination(mockReq, mockRes);

      expect(mockManager.getByTeacherAndPagination).toHaveBeenCalledWith(
        "teacher-123",
        1,
        999,
        expect.objectContaining({
          $or: expect.arrayContaining([
            { "lesson.name": expect.objectContaining({ $regex: expect.any(RegExp) }) }
          ])
        }),
        { createdAt: -1 },
        "en"
      );
      expect(mockRes.status).toHaveBeenCalledWith(200);
    });

    it("should handle errors", async () => {
      const mockResult = { success: false, message: "Error fetching lesson plans" };
      mockManager.getByTeacherAndPagination = jest.fn().mockResolvedValue(mockResult);

      await controller.getByTeacherAndPagination(mockReq, mockRes);

      expect(handleError).toHaveBeenCalledWith(mockResult, mockRes);
    });

    it("should handle exceptions", async () => {
      const error = new Error("Database error");
      mockManager.getByTeacherAndPagination = jest.fn().mockRejectedValue(error);

      await controller.getByTeacherAndPagination(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith(error);
    });
  });

  describe("getMonthlyCount", () => {
    it("should get monthly count successfully", async () => {
      const mockResult = { success: true, data: [{ month: 1, count: 10 }] };
      mockManager.getMonthlyCount = jest.fn().mockResolvedValue(mockResult);
      mockReq.query = { filter: { class: "10" } };

      await controller.getMonthlyCount(mockReq, mockRes);

      expect(mockManager.getMonthlyCount).toHaveBeenCalledWith("teacher-123", { class: "10" });
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith([{ month: 1, count: 10 }]);
    });

    it("should handle errors in monthly count", async () => {
      const mockResult = { success: false, message: "Error" };
      mockManager.getMonthlyCount = jest.fn().mockResolvedValue(mockResult);

      await controller.getMonthlyCount(mockReq, mockRes);

      expect(handleError).toHaveBeenCalledWith(mockResult, mockRes);
    });

    it("should handle exceptions in monthly count", async () => {
      const error = new Error("Database error");
      mockManager.getMonthlyCount = jest.fn().mockRejectedValue(error);

      await controller.getMonthlyCount(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({ error: "Internal server error" });
    });
  });

  describe("getRegenerationLimit", () => {
    it("should get regeneration limit successfully", async () => {
      const mockResult = { success: true, data: { limit: 5, used: 2 } };
      mockManager.getRegenerationLimit = jest.fn().mockResolvedValue(mockResult);

      await controller.getRegenerationLimit(mockReq, mockRes);

      expect(mockManager.getRegenerationLimit).toHaveBeenCalledWith("teacher-123");
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(mockResult);
    });

    it("should handle errors in regeneration limit", async () => {
      const mockResult = { success: false, message: "Error" };
      mockManager.getRegenerationLimit = jest.fn().mockResolvedValue(mockResult);

      await controller.getRegenerationLimit(mockReq, mockRes);

      expect(handleError).toHaveBeenCalledWith(mockResult, mockRes);
    });
  });

  describe("checkIfLessonPlanExists", () => {
    it("should return choose:true when lesson plan does not exist", async () => {
      mockManager.checkIfLessonPlanExists = jest.fn().mockResolvedValue(false);
      mockReq.params = { lessonPlanId: "lesson-123" };

      await controller.checkIfLessonPlanExists(mockReq, mockRes);

      expect(mockManager.checkIfLessonPlanExists).toHaveBeenCalledWith("teacher-123", "lesson-123");
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({ choose: true });
    });

    it("should return choose:false when lesson plan exists", async () => {
      mockManager.checkIfLessonPlanExists = jest.fn().mockResolvedValue(true);
      mockReq.params = { lessonPlanId: "lesson-123" };

      await controller.checkIfLessonPlanExists(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({ choose: false });
    });

    it("should handle errors", async () => {
      const error = new Error("Database error");
      mockManager.checkIfLessonPlanExists = jest.fn().mockRejectedValue(error);
      mockReq.params = { lessonPlanId: "lesson-123" };

      await controller.checkIfLessonPlanExists(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({ error: "Internal server error" });
    });
  });

  describe("getLessonPlanById", () => {
    it("should get lesson plan by id successfully", async () => {
      const mockLesson = { _id: "lesson-123", name: "Math Lesson" };
      mockManager.getLessonPlanById = jest.fn().mockResolvedValue(mockLesson);
      mockReq.params = { lessonPlanId: "lesson-123" };

      await controller.getLessonPlanById(mockReq, mockRes);

      expect(mockManager.getLessonPlanById).toHaveBeenCalledWith("teacher-123", "lesson-123", "en");
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(mockLesson);
    });

    it("should return 404 when lesson plan not found", async () => {
      mockManager.getLessonPlanById = jest.fn().mockResolvedValue(null);
      mockReq.params = { lessonPlanId: "lesson-123" };

      await controller.getLessonPlanById(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({ message: "Lesson plan not found" });
    });

    it("should handle errors", async () => {
      const error = new Error("Database error");
      mockManager.getLessonPlanById = jest.fn().mockRejectedValue(error);
      mockReq.params = { lessonPlanId: "lesson-123" };

      await controller.getLessonPlanById(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
    });
  });

  describe("getResourcePlanById", () => {
    it("should get resource plan by id successfully", async () => {
      const mockResource = { _id: "resource-123", name: "Math Resource" };
      mockManager.getResourcePlanById = jest.fn().mockResolvedValue(mockResource);
      mockReq.params = { resourcePlanId: "resource-123" };

      await controller.getResourcePlanById(mockReq, mockRes);

      expect(mockManager.getResourcePlanById).toHaveBeenCalledWith("teacher-123", "resource-123", "en");
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(mockResource);
    });

    it("should return 404 when resource plan not found", async () => {
      mockManager.getResourcePlanById = jest.fn().mockResolvedValue(null);
      mockReq.params = { resourcePlanId: "resource-123" };

      await controller.getResourcePlanById(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({ message: "Resource plan not found" });
    });
  });

  describe("generateContent", () => {
    it("should generate content successfully for power user", async () => {
      const mockResult = { success: true, data: { lessonPlan: {} } };
      mockManager.generateContent = jest.fn().mockResolvedValue(mockResult);
      mockReq.user.role = ["power"];
      mockReq.body = { lessonId: "lesson-123" };

      await controller.generateContent(mockReq, mockRes);

      expect(mockManager.generateContent).toHaveBeenCalledWith("teacher-123", mockReq.body);
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(mockResult);
    });

    it("should generate content successfully for admin user", async () => {
      const mockResult = { success: true, data: { lessonPlan: {} } };
      mockManager.generateContent = jest.fn().mockResolvedValue(mockResult);
      mockReq.user.role = ["admin"];
      mockReq.body = { lessonId: "lesson-123" };

      await controller.generateContent(mockReq, mockRes);

      expect(mockManager.generateContent).toHaveBeenCalledWith("teacher-123", mockReq.body);
      expect(mockRes.status).toHaveBeenCalledWith(200);
    });

    it("should return 403 for non-power/admin users", async () => {
      mockReq.user.role = ["teacher"];

      await controller.generateContent(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(403);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: "Forbidden: You do not have the required role to perform this action"
      });
    });

    it("should handle errors in content generation", async () => {
      const mockResult = { success: false, message: "Generation failed" };
      mockManager.generateContent = jest.fn().mockResolvedValue(mockResult);
      mockReq.user.role = ["power"];

      await controller.generateContent(mockReq, mockRes);

      expect(handleError).toHaveBeenCalledWith(mockResult, mockRes);
    });

    it("should handle exceptions", async () => {
      const error = new Error("Server error");
      mockManager.generateContent = jest.fn().mockRejectedValue(error);
      mockReq.user.role = ["admin"];

      await controller.generateContent(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({ error: "Internal server error" });
    });
  });

  describe("regenerateContent", () => {
    it("should regenerate content successfully", async () => {
      const mockResult = { success: true, data: { lessonPlan: {} } };
      mockManager.regenerateContent = jest.fn().mockResolvedValue(mockResult);
      mockReq.user.role = ["power"];
      mockReq.body = { lessonPlanId: "lesson-123" };

      await controller.regenerateContent(mockReq, mockRes);

      expect(mockManager.regenerateContent).toHaveBeenCalledWith("teacher-123", mockReq.body);
      expect(mockRes.status).toHaveBeenCalledWith(200);
    });

    it("should return 403 for non-power/admin users", async () => {
      mockReq.user.role = ["teacher"];

      await controller.regenerateContent(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(403);
    });
  });

  describe("handleWebhook", () => {
    it("should handle webhook successfully", async () => {
      mockManager.processWebhookData = jest.fn().mockResolvedValue(undefined);
      mockReq.body = { event: "lesson.created", data: {} };

      await controller.handleWebhook(mockReq, mockRes);

      expect(mockManager.processWebhookData).toHaveBeenCalledWith(mockReq.body);
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.send).toHaveBeenCalledWith({ success: true });
    });

    it("should handle webhook errors", async () => {
      const error = new Error("Webhook error");
      mockManager.processWebhookData = jest.fn().mockRejectedValue(error);

      await controller.handleWebhook(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.send).toHaveBeenCalledWith({
        success: false,
        error: "Webhook handling failed"
      });
    });
  });

  describe("lessonMediaUploads", () => {
    it("should upload lesson media successfully", async () => {
      const mockResult = { success: true, data: { mediaUrl: "http://example.com/media" } };
      mockManager.lessonUploadMedia = jest.fn().mockResolvedValue(mockResult);
      mockReq.params = { lessonPlanId: "lesson-123" };
      mockReq.body = { mediaType: "image", url: "http://example.com/image.jpg" };

      await controller.lessonMediaUploads(mockReq, mockRes);

      expect(mockManager.lessonUploadMedia).toHaveBeenCalledWith(
        "teacher-123",
        "lesson-123",
        mockReq.body
      );
      expect(mockRes.status).toHaveBeenCalledWith(200);
    });

    it("should handle upload errors", async () => {
      const mockResult = { success: false, message: "Upload failed" };
      mockManager.lessonUploadMedia = jest.fn().mockResolvedValue(mockResult);
      mockReq.params = { lessonPlanId: "lesson-123" };

      await controller.lessonMediaUploads(mockReq, mockRes);

      expect(handleError).toHaveBeenCalledWith(mockResult, mockRes);
    });
  });

  describe("deleteLessonMediaUploads", () => {
    it("should delete lesson media successfully", async () => {
      const mockResult = { success: true, message: "Media deleted" };
      mockManager.deleteLessonMedia = jest.fn().mockResolvedValue(mockResult);
      mockReq.params = { lessonPlanId: "lesson-123" };
      mockReq.body = { mediaId: "media-123" };

      await controller.deleteLessonMediaUploads(mockReq, mockRes);

      expect(mockManager.deleteLessonMedia).toHaveBeenCalledWith(
        "teacher-123",
        "lesson-123",
        mockReq.body
      );
      expect(mockRes.status).toHaveBeenCalledWith(200);
    });
  });

  describe("resourceMediaUploads", () => {
    it("should upload resource media successfully", async () => {
      const mockResult = { success: true, data: { mediaUrl: "http://example.com/media" } };
      mockManager.resourceUploadMedia = jest.fn().mockResolvedValue(mockResult);
      mockReq.params = { resourcePlanId: "resource-123" };
      mockReq.body = { mediaType: "video", url: "http://example.com/video.mp4" };

      await controller.resourceMediaUploads(mockReq, mockRes);

      expect(mockManager.resourceUploadMedia).toHaveBeenCalledWith(
        "teacher-123",
        "resource-123",
        mockReq.body
      );
      expect(mockRes.status).toHaveBeenCalledWith(200);
    });
  });

  describe("deleteResourceMediaUploads", () => {
    it("should delete resource media successfully", async () => {
      const mockResult = { success: true, message: "Media deleted" };
      mockManager.deleteResourceMedia = jest.fn().mockResolvedValue(mockResult);
      mockReq.params = { resourcePlanId: "resource-123" };
      mockReq.body = { mediaId: "media-123" };

      await controller.deleteResourceMediaUploads(mockReq, mockRes);

      expect(mockManager.deleteResourceMedia).toHaveBeenCalledWith(
        "teacher-123",
        "resource-123",
        mockReq.body
      );
      expect(mockRes.status).toHaveBeenCalledWith(200);
    });
  });

  describe("resourceActivityRating", () => {
    it("should rate activity successfully", async () => {
      const mockResult = { success: true, message: "Activity rated" };
      mockManager.rateActivity = jest.fn().mockResolvedValue(mockResult);
      mockReq.params = { resourcePlanId: "resource-123" };
      mockReq.body = { activityId: "activity-1", rating: 5 };

      await controller.resourceActivityRating(mockReq, mockRes);

      expect(mockManager.rateActivity).toHaveBeenCalledWith(
        "teacher-123",
        "resource-123",
        mockReq.body
      );
      expect(mockRes.status).toHaveBeenCalledWith(200);
    });

    it("should handle rating errors", async () => {
      const error = new Error("Rating failed");
      mockManager.rateActivity = jest.fn().mockRejectedValue(error);
      mockReq.params = { resourcePlanId: "resource-123" };

      await controller.resourceActivityRating(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.send).toHaveBeenCalledWith({ success: false, error });
    });
  });

  describe("retryLessonPlan", () => {
    it("should retry lesson plan for power user", async () => {
      const mockResult = { success: true, data: {} };
      mockManager.retryLessonPlan = jest.fn().mockResolvedValue(mockResult);
      mockReq.user.role = ["power"];
      mockReq.body = { regeneratedId: "regen-123", _id: "lesson-123" };

      await controller.retryLessonPlan(mockReq, mockRes);

      expect(mockManager.retryLessonPlan).toHaveBeenCalledWith("regen-123", "lesson-123");
      expect(mockRes.status).toHaveBeenCalledWith(200);
    });

    it("should return 403 for non-power/admin users", async () => {
      mockReq.user.role = ["teacher"];

      await controller.retryLessonPlan(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(403);
    });

    it("should handle retry errors", async () => {
      const mockResult = { success: false, message: "Retry failed" };
      mockManager.retryLessonPlan = jest.fn().mockResolvedValue(mockResult);
      mockReq.user.role = ["admin"];
      mockReq.body = { regeneratedId: "regen-123", _id: "lesson-123" };

      await controller.retryLessonPlan(mockReq, mockRes);

      expect(handleError).toHaveBeenCalledWith(mockResult, mockRes);
    });
  });
});
