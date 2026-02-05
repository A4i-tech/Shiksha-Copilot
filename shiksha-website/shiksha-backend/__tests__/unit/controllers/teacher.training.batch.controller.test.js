const TeacherTrainingBatch = require("../../../models/teacher.training.batch.model");
const User = require("../../../models/user.model");
const TeacherAbsent = require("../../../models/teacher.absent.model");

jest.mock("../../../models/teacher.training.batch.model");
jest.mock("../../../models/user.model");
jest.mock("../../../models/teacher.absent.model");
jest.mock("../../../managers/teacher.training.batch.manager");
jest.mock("../../../services/azure.blob.service");

describe("TeacherTrainingBatchController", () => {
  let teacherTrainingBatchController;
  let mockReq;
  let mockRes;

  beforeEach(() => {
    jest.clearAllMocks();

    // Require the controller
    teacherTrainingBatchController = require("../../../controllers/teacher.training.batch.controller");

    mockReq = {
      user: { _id: "user-123", role: ["admin"] },
      params: {},
      query: {},
      body: {},
      files: null,
    };

    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
      end: jest.fn(),
      setHeader: jest.fn(),
    };
  });

  describe("createBatch", () => {
    it("should return 400 when PDF file is missing", async () => {
      mockReq.files = {};
      mockReq.body = {
        batchName: "New Batch",
        description: "Test",
        scheduleDate: "2024-01-01",
        trainingType: "Type A",
      };

      await teacherTrainingBatchController.createBatch(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: "A permission letter PDF file is required and must be of type application/pdf.",
      });
    });

    it("should return 400 when required fields are missing", async () => {
      mockReq.files = {
        pdfFile: [{ path: "/uploads/test.pdf" }],
      };
      mockReq.body = {
        batchName: "New Batch",
      };

      await teacherTrainingBatchController.createBatch(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: "Missing required batch fields.",
      });
    });
  });

  describe("getTeacherTrainingStats", () => {
    it("should get training stats successfully", async () => {
      const mockTeachers = [{ _id: "teacher-1" }, { _id: "teacher-2" }];
      User.find = jest.fn().mockReturnValue({
        select: jest.fn().mockResolvedValue(mockTeachers),
      });

      const mockBatches = [
        {
          attendance: ["teacher-1"],
        },
      ];
      TeacherTrainingBatch.find = jest.fn().mockReturnValue({
        select: jest.fn().mockResolvedValue(mockBatches),
      });

      await teacherTrainingBatchController.getTeacherTrainingStats(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          totalTeachers: 2,
          trainedTeachers: 1,
          untrainedTeachers: 1,
        })
      );
    });
  });

  describe("deleteBatch", () => {
    it("should return 400 when trying to delete submitted batch", async () => {
      const mockBatch = {
        _id: "batch-123",
        createdBy: { toString: () => "user-123" },
        isSubmitted: true,
      };

      TeacherTrainingBatch.findById = jest.fn().mockResolvedValue(mockBatch);
      mockReq.params = { batchId: "batch-123" };

      await teacherTrainingBatchController.deleteBatch(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(TeacherTrainingBatch.findByIdAndDelete).not.toHaveBeenCalled();
    });

    it("should return 404 when batch not found", async () => {
      TeacherTrainingBatch.findById = jest.fn().mockResolvedValue(null);
      mockReq.params = { batchId: "invalid-id" };

      await teacherTrainingBatchController.deleteBatch(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(404);
    });
  });
});
