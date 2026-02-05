const teacherAbsentController = require("../../../controllers/teacher.absent.controller");
const TeacherAbsent = require("../../../models/teacher.absent.model");

jest.mock("../../../models/teacher.absent.model");

describe("TeacherAbsentController", () => {
  let mockReq;
  let mockRes;

  beforeEach(() => {
    jest.clearAllMocks();

    mockReq = {
      params: {},
    };

    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
  });

  describe("getAllAbsentTeachers", () => {
    it("should get all absent teachers successfully", async () => {
      const mockAbsentTeachers = [
        {
          teacherId: "teacher-1",
          batchId: "batch-1",
          teacherName: "Teacher 1",
        },
        {
          teacherId: "teacher-2",
          batchId: "batch-2",
          teacherName: "Teacher 2",
        },
      ];

      const mockFind = {
        sort: jest.fn().mockResolvedValue(mockAbsentTeachers),
      };

      TeacherAbsent.find = jest.fn().mockReturnValue(mockFind);

      await teacherAbsentController.getAllAbsentTeachers(mockReq, mockRes);

      expect(TeacherAbsent.find).toHaveBeenCalledWith();
      expect(mockFind.sort).toHaveBeenCalledWith({ createdAt: -1 });
      expect(mockRes.json).toHaveBeenCalledWith(mockAbsentTeachers);
    });

    it("should handle errors", async () => {
      const mockFind = {
        sort: jest.fn().mockRejectedValue(new Error("Database error")),
      };

      TeacherAbsent.find = jest.fn().mockReturnValue(mockFind);

      await teacherAbsentController.getAllAbsentTeachers(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: "Error fetching absent teachers",
        error: "Database error",
      });
    });
  });

  describe("getAbsentTeachersByBatch", () => {
    it("should get absent teachers by batch ID successfully", async () => {
      const mockAbsentTeachers = [
        {
          teacherId: "teacher-1",
          batchId: "batch-123",
          teacherName: "Teacher 1",
        },
        {
          teacherId: "teacher-2",
          batchId: "batch-123",
          teacherName: "Teacher 2",
        },
      ];

      const mockFind = {
        sort: jest.fn().mockResolvedValue(mockAbsentTeachers),
      };

      TeacherAbsent.find = jest.fn().mockReturnValue(mockFind);
      mockReq.params = { batchId: "batch-123" };

      await teacherAbsentController.getAbsentTeachersByBatch(mockReq, mockRes);

      expect(TeacherAbsent.find).toHaveBeenCalledWith({ batchId: "batch-123" });
      expect(mockFind.sort).toHaveBeenCalledWith({ createdAt: -1 });
      expect(mockRes.json).toHaveBeenCalledWith(mockAbsentTeachers);
    });

    it("should handle errors", async () => {
      const mockFind = {
        sort: jest.fn().mockRejectedValue(new Error("Database error")),
      };

      TeacherAbsent.find = jest.fn().mockReturnValue(mockFind);
      mockReq.params = { batchId: "batch-123" };

      await teacherAbsentController.getAbsentTeachersByBatch(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: "Error fetching absent teachers for batch",
        error: "Database error",
      });
    });

    it("should query with correct batch ID", async () => {
      const mockFind = {
        sort: jest.fn().mockResolvedValue([]),
      };

      TeacherAbsent.find = jest.fn().mockReturnValue(mockFind);
      mockReq.params = { batchId: "different-batch-456" };

      await teacherAbsentController.getAbsentTeachersByBatch(mockReq, mockRes);

      expect(TeacherAbsent.find).toHaveBeenCalledWith({ batchId: "different-batch-456" });
    });
  });
});
