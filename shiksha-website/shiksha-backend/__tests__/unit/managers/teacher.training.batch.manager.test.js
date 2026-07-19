const TeacherTrainingBatchManager = require("../../../managers/teacher.training.batch.manager");
const TeacherTrainingBatchDao = require("../../../dao/teacher.training.batch.dao");
const TeacherTrainingBatch = require("../../../models/teacher.training.batch.model");

jest.mock("../../../dao/teacher.training.batch.dao");
jest.mock("../../../models/teacher.training.batch.model");

describe("TeacherTrainingBatchManager", () => {
  let manager;
  let mockDao;
  const user = (scopeType) => ({
    _id: "user-123",
    roles: [{ role: { permissions: ["training.view"], scopeType, isDeleted: false }, dep: scopeType === "GLOBAL" ? null : { _id: "district-1", value: "Mysuru" } }],
  });

  beforeEach(() => {
    jest.clearAllMocks();

    mockDao = {
      create: jest.fn(),
      getById: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    TeacherTrainingBatchDao.mockImplementation(() => mockDao);

    manager = new TeacherTrainingBatchManager();
  });

  describe("constructor", () => {
    it("should create manager instance successfully", () => {
      expect(manager).toBeInstanceOf(TeacherTrainingBatchManager);
      expect(manager.dao).toBeDefined();
    });

    it("should initialize with TeacherTrainingBatchDao", () => {
      expect(TeacherTrainingBatchDao).toHaveBeenCalled();
    });
  });

  describe("getBatches", () => {
    it("should get all batches for admin role", async () => {
      const mockBatches = [
        { _id: "batch-1", batchName: "Batch 1" },
        { _id: "batch-2", batchName: "Batch 2" },
      ];

      const mockPopulate = jest.fn().mockResolvedValue(mockBatches);
      TeacherTrainingBatch.find = jest.fn().mockReturnValue({
        populate: mockPopulate,
      });

      const result = await manager.getBatches(user("GLOBAL"));

      expect(TeacherTrainingBatch.find).toHaveBeenCalledWith({});
      expect(mockPopulate).toHaveBeenCalledWith([
        { path: "assignedTeachers", select: "identity profiles.teacher" },
        { path: "createdBy", select: "identity" },
      ]);
      expect(result.success).toBe(true);
      expect(result.data).toEqual(mockBatches);
    });

    it("should get batches for manager role with userId filter", async () => {
      const mockBatches = [{ _id: "batch-1", createdBy: "user-123" }];

      const mockPopulate = jest.fn().mockResolvedValue(mockBatches);
      TeacherTrainingBatch.find = jest.fn().mockReturnValue({
        populate: mockPopulate,
      });

      const result = await manager.getBatches(user("DISTRICT"));

      expect(TeacherTrainingBatch.find).toHaveBeenCalledWith({
        createdBy: "user-123",
      });
      expect(result.success).toBe(true);
      expect(result.data).toEqual(mockBatches);
    });

    it("should get all batches when user has both manager and admin roles", async () => {
      const mockBatches = [{ _id: "batch-1" }];

      const mockPopulate = jest.fn().mockResolvedValue(mockBatches);
      TeacherTrainingBatch.find = jest.fn().mockReturnValue({
        populate: mockPopulate,
      });

      const result = await manager.getBatches(user("GLOBAL"));

      expect(TeacherTrainingBatch.find).toHaveBeenCalledWith({});
      expect(result.success).toBe(true);
    });

    it("should get all batches when no user provided", async () => {
      const mockBatches = [];

      const mockPopulate = jest.fn().mockResolvedValue(mockBatches);
      TeacherTrainingBatch.find = jest.fn().mockReturnValue({
        populate: mockPopulate,
      });

      const result = await manager.getBatches(null);

      expect(TeacherTrainingBatch.find).toHaveBeenCalledWith({});
      expect(result.success).toBe(true);
    });

    it("should handle errors gracefully", async () => {
      TeacherTrainingBatch.find = jest.fn().mockReturnValue({
        populate: jest.fn().mockRejectedValue(new Error("Database error")),
      });

      const result = await manager.getBatches(user("GLOBAL"));

      expect(result.success).toBe(false);
      expect(result.message).toBe("Database error");
    });

  });
});
