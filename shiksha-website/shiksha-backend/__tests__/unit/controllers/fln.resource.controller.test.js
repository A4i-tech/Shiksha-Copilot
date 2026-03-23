const flnResourceController = require("../../../controllers/fln.resource.controller");
const FLNResourceManager = require("../../../managers/fln.resource.manager");
const handleError = require("../../../helper/handleError");

jest.mock("../../../managers/fln.resource.manager");
jest.mock("../../../helper/handleError");

describe("FLNResourceController", () => {
  let mockReq;
  let mockRes;

  beforeEach(() => {
    jest.clearAllMocks();

    mockReq = {
      query: {},
      body: {},
    };

    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
  });

  describe("uploadFLNFile", () => {
    it("should upload FLN file successfully", async () => {
      const mockResult = { success: true, data: { uploaded: true } };
      flnResourceController.flnResourceManager.uploadFLNFile = jest.fn().mockResolvedValue(mockResult);

      await flnResourceController.uploadFLNFile(mockReq, mockRes);

      expect(flnResourceController.flnResourceManager.uploadFLNFile).toHaveBeenCalledWith(mockReq);
      expect(mockRes.json).toHaveBeenCalledWith(mockResult.data);
    });

    it("should handle upload failure", async () => {
      const mockResult = { success: false, message: "Upload failed" };
      flnResourceController.flnResourceManager.uploadFLNFile = jest.fn().mockResolvedValue(mockResult);

      await flnResourceController.uploadFLNFile(mockReq, mockRes);

      expect(handleError).toHaveBeenCalledWith(mockResult, mockRes);
    });
  });

  describe("getGrades", () => {
    it("should get grades successfully", async () => {
      const mockResult = { success: true, data: ["Grade 1", "Grade 2", "Grade 3"] };
      flnResourceController.flnResourceManager.getGrades = jest.fn().mockResolvedValue(mockResult);

      await flnResourceController.getGrades(mockReq, mockRes);

      expect(flnResourceController.flnResourceManager.getGrades).toHaveBeenCalled();
      expect(mockRes.json).toHaveBeenCalledWith(mockResult.data);
    });

    it("should handle get grades failure", async () => {
      const mockResult = { success: false, message: "Failed to get grades" };
      flnResourceController.flnResourceManager.getGrades = jest.fn().mockResolvedValue(mockResult);

      await flnResourceController.getGrades(mockReq, mockRes);

      expect(handleError).toHaveBeenCalledWith(mockResult, mockRes);
    });
  });

  describe("getDaysByGrade", () => {
    it("should get days by grade successfully", async () => {
      const mockResult = { success: true, data: ["Day 1", "Day 2", "Day 3"] };
      flnResourceController.flnResourceManager.getDaysByGrade = jest.fn().mockResolvedValue(mockResult);
      mockReq.query = { grade: "Grade 1" };

      await flnResourceController.getDaysByGrade(mockReq, mockRes);

      expect(flnResourceController.flnResourceManager.getDaysByGrade).toHaveBeenCalledWith("Grade 1");
      expect(mockRes.json).toHaveBeenCalledWith(mockResult.data);
    });

    it("should return 400 when grade is missing", async () => {
      mockReq.query = {};

      await flnResourceController.getDaysByGrade(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({ error: "grade required" });
      expect(flnResourceController.flnResourceManager.getDaysByGrade).not.toHaveBeenCalled();
    });

    it("should handle get days failure", async () => {
      const mockResult = { success: false, message: "Failed to get days" };
      flnResourceController.flnResourceManager.getDaysByGrade = jest.fn().mockResolvedValue(mockResult);
      mockReq.query = { grade: "Grade 1" };

      await flnResourceController.getDaysByGrade(mockReq, mockRes);

      expect(handleError).toHaveBeenCalledWith(mockResult, mockRes);
    });
  });

  describe("getLesson", () => {
    it("should get lesson successfully", async () => {
      const mockResult = {
        success: true,
        data: { lessonId: "lesson-123", title: "Lesson 1" },
      };
      flnResourceController.flnResourceManager.getLesson = jest.fn().mockResolvedValue(mockResult);
      mockReq.query = { grade: "Grade 1", day: "Day 1" };

      await flnResourceController.getLesson(mockReq, mockRes);

      expect(flnResourceController.flnResourceManager.getLesson).toHaveBeenCalledWith("Grade 1", "Day 1");
      expect(mockRes.json).toHaveBeenCalledWith(mockResult.data);
    });

    it("should return 400 when grade is missing", async () => {
      mockReq.query = { day: "Day 1" };

      await flnResourceController.getLesson(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({ error: "grade and day required" });
      expect(flnResourceController.flnResourceManager.getLesson).not.toHaveBeenCalled();
    });

    it("should return 400 when day is missing", async () => {
      mockReq.query = { grade: "Grade 1" };

      await flnResourceController.getLesson(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({ error: "grade and day required" });
      expect(flnResourceController.flnResourceManager.getLesson).not.toHaveBeenCalled();
    });

    it("should handle get lesson failure", async () => {
      const mockResult = { success: false, message: "Failed to get lesson" };
      flnResourceController.flnResourceManager.getLesson = jest.fn().mockResolvedValue(mockResult);
      mockReq.query = { grade: "Grade 1", day: "Day 1" };

      await flnResourceController.getLesson(mockReq, mockRes);

      expect(handleError).toHaveBeenCalledWith(mockResult, mockRes);
    });
  });

  describe("exportLessonsExcel", () => {
    it("should export lessons to Excel successfully", async () => {
      const mockResult = { success: true };
      flnResourceController.flnResourceManager.exportLessonsExcel = jest.fn().mockResolvedValue(mockResult);
      mockReq.query = { grade: "Grade 1" };

      await flnResourceController.exportLessonsExcel(mockReq, mockRes);

      expect(flnResourceController.flnResourceManager.exportLessonsExcel).toHaveBeenCalledWith("Grade 1", mockRes);
    });

    it("should return 400 when grade is missing", async () => {
      mockReq.query = {};

      await flnResourceController.exportLessonsExcel(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({ error: "grade required" });
      expect(flnResourceController.flnResourceManager.exportLessonsExcel).not.toHaveBeenCalled();
    });

    it("should handle export failure", async () => {
      const mockResult = { success: false, message: "Export failed" };
      flnResourceController.flnResourceManager.exportLessonsExcel = jest.fn().mockResolvedValue(mockResult);
      mockReq.query = { grade: "Grade 1" };

      await flnResourceController.exportLessonsExcel(mockReq, mockRes);

      expect(handleError).toHaveBeenCalledWith(mockResult, mockRes);
    });
  });
});
