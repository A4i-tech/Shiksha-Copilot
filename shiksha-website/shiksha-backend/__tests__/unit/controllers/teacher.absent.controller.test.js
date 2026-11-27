const teacherAbsentController = require("../../../controllers/teacher.absent.controller");
const TeacherAbsent = require("../../../models/teacher.absent.model");

const TeacherTrainingBatch = require("../../../models/teacher.training.batch.model");
const { teacherScopeFilter, canAccessBatch } = require("../../../helper/training.scope.helper");

jest.mock("../../../models/teacher.absent.model");
jest.mock("../../../models/teacher.training.batch.model");
jest.mock("../../../helper/training.scope.helper");

const GLOBAL = [{ permission: "training.view", scopeType: "GLOBAL", dep: null }];
const SCHOOL = [{ permission: "training.view", scopeType: "SCHOOL", dep: "aaaaaaaaaaaaaaaaaaaaaaaa" }];

describe("TeacherAbsentController", () => {
  let mockReq;
  let mockRes;

  beforeEach(() => {
    jest.resetAllMocks();

    mockReq = {
      params: {},
      permissions: GLOBAL,
      user: { _id: "user-1" },
    };
    TeacherTrainingBatch.findById = jest.fn().mockResolvedValue({ _id: "batch-123", assignedTeachers: [] });
    canAccessBatch.mockResolvedValue(true);
    teacherScopeFilter.mockResolvedValue({});

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

      expect(TeacherAbsent.find).toHaveBeenCalledWith({});
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

  describe("getAllAbsentTeachers scope", () => {
    it("should only return absentees of teachers in the caller's training.view scope", async () => {
      const mockFind = { sort: jest.fn().mockResolvedValue([]) };
      TeacherAbsent.find = jest.fn().mockReturnValue(mockFind);
      teacherScopeFilter.mockResolvedValue({ teacherId: { $in: ["teacher-1"] } });
      mockReq.permissions = SCHOOL;

      await teacherAbsentController.getAllAbsentTeachers(mockReq, mockRes);

      expect(teacherScopeFilter).toHaveBeenCalledWith(SCHOOL, "training.view");
      expect(TeacherAbsent.find).toHaveBeenCalledWith({ teacherId: { $in: ["teacher-1"] } });
    });
  });

  describe("getAbsentTeachersByBatch scope", () => {
    it("should return 404 and skip the scope check when the batch is missing", async () => {
      TeacherAbsent.find = jest.fn();
      TeacherTrainingBatch.findById.mockResolvedValue(null);
      mockReq.params = { batchId: "missing" };

      await teacherAbsentController.getAbsentTeachersByBatch(mockReq, mockRes);

      expect(canAccessBatch).not.toHaveBeenCalled();
      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({ message: "Batch not found. Pick a batch from your own schools." });
      expect(TeacherAbsent.find).not.toHaveBeenCalled();
    });

    it("should return the same 404 and skip the query when the batch is outside the caller's scope", async () => {
      TeacherAbsent.find = jest.fn();
      canAccessBatch.mockResolvedValue(false);
      mockReq.params = { batchId: "batch-123" };

      await teacherAbsentController.getAbsentTeachersByBatch(mockReq, mockRes);

      expect(canAccessBatch).toHaveBeenCalledWith(mockReq.permissions, "user-1", { _id: "batch-123", assignedTeachers: [] }, "training.view");
      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({ message: "Batch not found. Pick a batch from your own schools." });
      expect(TeacherAbsent.find).not.toHaveBeenCalled();
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
