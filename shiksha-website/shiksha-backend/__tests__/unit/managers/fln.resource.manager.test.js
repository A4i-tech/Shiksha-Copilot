const FLNResourceManager = require("../../../managers/fln.resource.manager");
const FLNResourceDao = require("../../../dao/fln.resource.dao");
const fs = require("fs");

jest.mock("../../../dao/fln.resource.dao");
jest.mock("fs");
jest.mock("exceljs");

describe("FLNResourceManager", () => {
  let manager;
  let mockDao;
  let mockModel;

  beforeEach(() => {
    jest.clearAllMocks();

    mockModel = {
      deleteMany: jest.fn(),
      create: jest.fn(),
      distinct: jest.fn(),
      findOne: jest.fn(),
    };

    mockDao = {
      Model: mockModel,
    };

    FLNResourceDao.mockImplementation(() => mockDao);

    manager = new FLNResourceManager();
  });

  describe("constructor", () => {
    it("should create manager instance successfully", () => {
      expect(manager).toBeInstanceOf(FLNResourceManager);
      expect(manager.flnResourceDao).toBeDefined();
    });

    it("should initialize with FLNResourceDao", () => {
      expect(FLNResourceDao).toHaveBeenCalled();
    });
  });

  describe("uploadFLNFile", () => {
    it("should return error when no file uploaded", async () => {
      const mockReq = { file: null };

      const result = await manager.uploadFLNFile(mockReq);

      expect(result.success).toBe(false);
      expect(result.message).toBe("No file uploaded");
    });

    it("should return error when file contains multiple grades", async () => {
      const mockReq = {
        file: {
          path: "/uploads/test.json",
          originalname: "test.json",
        },
      };

      const mockJsonData = {
        lesson_plan_by_grade: {
          "Grade 1": [],
          "Grade 2": [],
        },
      };

      fs.readFileSync.mockReturnValue(JSON.stringify(mockJsonData));

      const result = await manager.uploadFLNFile(mockReq);

      expect(result.success).toBe(false);
      expect(result.message).toBe("File must contain exactly one grade");
    });

    it("should upload file successfully", async () => {
      const mockReq = {
        file: {
          path: "/uploads/test.json",
          originalname: "test.json",
        },
      };

      const mockJsonData = {
        lesson_plan_by_grade: {
          "Grade 1": [{ day: 1, lesson: "Test Lesson" }],
        },
      };

      fs.readFileSync.mockReturnValue(JSON.stringify(mockJsonData));
      mockModel.deleteMany.mockResolvedValue({});
      mockModel.create.mockResolvedValue({
        _id: "resource-123",
        grade: "Grade 1",
      });
      fs.unlinkSync.mockReturnValue(undefined);

      const result = await manager.uploadFLNFile(mockReq);

      expect(result.success).toBe(true);
      expect(result.message).toBe("File uploaded");
      expect(result.data.grade).toBe("Grade 1");
      expect(mockModel.deleteMany).toHaveBeenCalledWith({ grade: "Grade 1" });
      expect(fs.unlinkSync).toHaveBeenCalledWith("/uploads/test.json");
    });

    it("should handle JSON parse errors", async () => {
      const mockReq = {
        file: {
          path: "/uploads/test.json",
          originalname: "test.json",
        },
      };

      fs.readFileSync.mockReturnValue("invalid json");

      const result = await manager.uploadFLNFile(mockReq);

      expect(result.success).toBe(false);
    });
  });

  describe("getGrades", () => {
    it("should get grades successfully", async () => {
      const mockGrades = ["Grade 1", "Grade 2", "Grade 3"];
      mockModel.distinct.mockResolvedValue(mockGrades);

      const result = await manager.getGrades();

      expect(result.success).toBe(true);
      expect(result.data).toEqual(mockGrades);
      expect(mockModel.distinct).toHaveBeenCalledWith("grade");
    });

    it("should handle errors", async () => {
      mockModel.distinct.mockRejectedValue(new Error("Database error"));

      const result = await manager.getGrades();

      expect(result.success).toBe(false);
      expect(result.message).toBe("Database error");
    });
  });

  describe("getDaysByGrade", () => {
    it("should get days by grade successfully", async () => {
      const mockResource = {
        data: {
          lesson_plan_by_grade: {
            "Grade 1": [
              { day: 1 },
              { day: 2 },
              { day: 3 },
              { day: 1 }, // Duplicate
            ],
          },
        },
      };

      mockModel.findOne.mockReturnValue({
        sort: jest.fn().mockResolvedValue(mockResource),
      });

      const result = await manager.getDaysByGrade("Grade 1");

      expect(result.success).toBe(true);
      expect(result.data).toEqual([1, 2, 3]);
    });

    it("should return error when no data found", async () => {
      mockModel.findOne.mockReturnValue({
        sort: jest.fn().mockResolvedValue(null),
      });

      const result = await manager.getDaysByGrade("Grade 1");

      expect(result.success).toBe(false);
      expect(result.message).toContain("No data found");
    });
  });

  describe("getLesson", () => {
    it("should get lesson by grade and day successfully", async () => {
      const mockLesson = {
        day: 1,
        lesson: "Test Lesson",
        grade: "Grade 1",
      };

      const mockResource = {
        data: {
          lesson_plan_by_grade: {
            "Grade 1": [mockLesson],
          },
        },
      };

      mockModel.findOne.mockReturnValue({
        sort: jest.fn().mockResolvedValue(mockResource),
      });

      const result = await manager.getLesson("Grade 1", "1");

      expect(result.success).toBe(true);
      expect(result.data).toEqual(mockLesson);
    });

    it("should return error when lesson not found", async () => {
      const mockResource = {
        data: {
          lesson_plan_by_grade: {
            "Grade 1": [{ day: 2 }],
          },
        },
      };

      mockModel.findOne.mockReturnValue({
        sort: jest.fn().mockResolvedValue(mockResource),
      });

      const result = await manager.getLesson("Grade 1", "1");

      expect(result.success).toBe(false);
      expect(result.message).toContain("Lesson not found");
    });
  });

  describe("exportLessonsExcel", () => {
    let mockWorkbook;
    let mockWorksheet;

    beforeEach(() => {
      const ExcelJS = require("exceljs");

      mockWorksheet = {
        addRow: jest.fn(),
        getRow: jest.fn().mockReturnValue({
          font: {},
          fill: {},
        }),
        getColumn: jest.fn().mockReturnValue({
          width: 0,
        }),
        columns: [],
      };

      mockWorkbook = {
        addWorksheet: jest.fn().mockReturnValue(mockWorksheet),
        xlsx: {
          write: jest.fn().mockImplementation((stream) => {
            // Simulate successful write without actually calling stream methods
            return Promise.resolve();
          }),
        },
      };

      ExcelJS.Workbook = jest.fn().mockImplementation(() => mockWorkbook);
    });

    it("should return error when no data found", async () => {
      mockModel.findOne.mockReturnValue({
        sort: jest.fn().mockResolvedValue(null),
      });

      const mockRes = {
        setHeader: jest.fn(),
        end: jest.fn(),
      };

      const result = await manager.exportLessonsExcel("Grade 1", mockRes);

      expect(result.success).toBe(false);
      expect(result.message).toContain("No data found");
    });

    it("should export Excel successfully", async () => {
      const mockLessons = [
        {
          day: 1,
          grade: "Grade 1",
          learning_outcome: "Test LO",
          concept: "Test Concept",
        },
      ];

      const mockResource = {
        data: {
          lesson_plan_by_grade: {
            "Grade 1": mockLessons,
          },
        },
      };

      mockModel.findOne.mockReturnValue({
        sort: jest.fn().mockResolvedValue(mockResource),
      });

      const mockRes = {
        setHeader: jest.fn(),
        end: jest.fn(),
      };

      const result = await manager.exportLessonsExcel("Grade 1", mockRes);

      expect(result).toBeNull();
      expect(mockRes.setHeader).toHaveBeenCalledWith(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      );
    });
  });
});
