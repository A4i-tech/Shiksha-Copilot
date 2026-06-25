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
      flnResourceController.manager.uploadFLNFile = jest.fn().mockResolvedValue(mockResult);

      await flnResourceController.uploadFLNFile(mockReq, mockRes);

      expect(flnResourceController.manager.uploadFLNFile).toHaveBeenCalledWith(mockReq);
      expect(mockRes.json).toHaveBeenCalledWith(mockResult.data);
    });

    it("should handle upload failure", async () => {
      const mockResult = { success: false, message: "Upload failed" };
      flnResourceController.manager.uploadFLNFile = jest.fn().mockResolvedValue(mockResult);

      await flnResourceController.uploadFLNFile(mockReq, mockRes);

      expect(handleError).toHaveBeenCalledWith(mockResult, mockRes);
    });
  });

  describe("getGrades", () => {
    it("should get grades successfully", async () => {
      const mockResult = { success: true, data: ["Grade 1", "Grade 2", "Grade 3"] };
      flnResourceController.manager.getGrades = jest.fn().mockResolvedValue(mockResult);

      await flnResourceController.getGrades(mockReq, mockRes);

      expect(flnResourceController.manager.getGrades).toHaveBeenCalled();
      expect(mockRes.json).toHaveBeenCalledWith(mockResult.data);
    });

    it("should handle get grades failure", async () => {
      const mockResult = { success: false, message: "Failed to get grades" };
      flnResourceController.manager.getGrades = jest.fn().mockResolvedValue(mockResult);

      await flnResourceController.getGrades(mockReq, mockRes);

      expect(handleError).toHaveBeenCalledWith(mockResult, mockRes);
    });
  });

  describe("getDaysByGrade", () => {
    it("should get days by grade successfully", async () => {
      const mockResult = { success: true, data: ["Day 1", "Day 2", "Day 3"] };
      flnResourceController.manager.getDaysByGrade = jest.fn().mockResolvedValue(mockResult);
      mockReq.query = { grade: "Grade 1" };

      await flnResourceController.getDaysByGrade(mockReq, mockRes);

      expect(flnResourceController.manager.getDaysByGrade).toHaveBeenCalledWith("Grade 1");
      expect(mockRes.json).toHaveBeenCalledWith(mockResult.data);
    });

    it("should return 400 when grade is missing", async () => {
      mockReq.query = {};

      await flnResourceController.getDaysByGrade(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({ error: "grade required" });
      expect(flnResourceController.manager.getDaysByGrade).not.toHaveBeenCalled();
    });

    it("should handle get days failure", async () => {
      const mockResult = { success: false, message: "Failed to get days" };
      flnResourceController.manager.getDaysByGrade = jest.fn().mockResolvedValue(mockResult);
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
      flnResourceController.manager.getLesson = jest.fn().mockResolvedValue(mockResult);
      mockReq.query = { grade: "Grade 1", day: "Day 1" };

      await flnResourceController.getLesson(mockReq, mockRes);

      expect(flnResourceController.manager.getLesson).toHaveBeenCalledWith("Grade 1", "Day 1");
      expect(mockRes.json).toHaveBeenCalledWith(mockResult.data);
    });

    it("should return 400 when grade is missing", async () => {
      mockReq.query = { day: "Day 1" };

      await flnResourceController.getLesson(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({ error: "grade and day required" });
      expect(flnResourceController.manager.getLesson).not.toHaveBeenCalled();
    });

    it("should return 400 when day is missing", async () => {
      mockReq.query = { grade: "Grade 1" };

      await flnResourceController.getLesson(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({ error: "grade and day required" });
      expect(flnResourceController.manager.getLesson).not.toHaveBeenCalled();
    });

    it("should handle get lesson failure", async () => {
      const mockResult = { success: false, message: "Failed to get lesson" };
      flnResourceController.manager.getLesson = jest.fn().mockResolvedValue(mockResult);
      mockReq.query = { grade: "Grade 1", day: "Day 1" };

      await flnResourceController.getLesson(mockReq, mockRes);

      expect(handleError).toHaveBeenCalledWith(mockResult, mockRes);
    });
  });

  describe("exportLessonsExcel", () => {
    it("should export lessons to Excel successfully", async () => {
      const mockResult = { success: true };
      flnResourceController.manager.exportLessonsExcel = jest.fn().mockResolvedValue(mockResult);
      mockReq.query = { grade: "Grade 1" };

      await flnResourceController.exportLessonsExcel(mockReq, mockRes);

      expect(flnResourceController.manager.exportLessonsExcel).toHaveBeenCalledWith("Grade 1", mockRes);
    });

    it("should return 400 when grade is missing", async () => {
      mockReq.query = {};

      await flnResourceController.exportLessonsExcel(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({ error: "grade required" });
      expect(flnResourceController.manager.exportLessonsExcel).not.toHaveBeenCalled();
    });

    it("should handle export failure", async () => {
      const mockResult = { success: false, message: "Export failed" };
      flnResourceController.manager.exportLessonsExcel = jest.fn().mockResolvedValue(mockResult);
      mockReq.query = { grade: "Grade 1" };

      await flnResourceController.exportLessonsExcel(mockReq, mockRes);

      expect(handleError).toHaveBeenCalledWith(mockResult, mockRes);
    });
  });
});
