const TeacherTrainingBatchManager = require("../../../managers/teacher.training.batch.manager");
const TeacherTrainingBatchDao = require("../../../dao/teacher.training.batch.dao");
const TeacherTrainingBatch = require("../../../models/teacher.training.batch.model");

jest.mock("../../../dao/teacher.training.batch.dao");
jest.mock("../../../models/teacher.training.batch.model");

describe("TeacherTrainingBatchManager", () => {
  let manager;
  let mockDao;

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

      const user = { _id: "user-123", role: ["admin"] };
      const result = await manager.getBatches(user);

      expect(TeacherTrainingBatch.find).toHaveBeenCalledWith({});
      expect(mockPopulate).toHaveBeenCalledWith(
        "assignedTeachers",
        "name zone district phone"
      );
      expect(result.success).toBe(true);
      expect(result.data).toEqual(mockBatches);
    });

    it("should get batches for manager role with userId filter", async () => {
      const mockBatches = [{ _id: "batch-1", createdBy: "user-123" }];

      const mockPopulate = jest.fn().mockResolvedValue(mockBatches);
      TeacherTrainingBatch.find = jest.fn().mockReturnValue({
        populate: mockPopulate,
      });

      const user = { _id: "user-123", role: ["manager"] };
      const result = await manager.getBatches(user);

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

      const user = { _id: "user-123", role: ["manager", "admin"] };
      const result = await manager.getBatches(user);

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

      const user = { _id: "user-123", role: ["admin"] };
      const result = await manager.getBatches(user);

      expect(result.success).toBe(false);
      expect(result.message).toBe("Database error");
    });

    it("should get all batches when user role is not manager", async () => {
      const mockBatches = [{ _id: "batch-1" }];

      const mockPopulate = jest.fn().mockResolvedValue(mockBatches);
      TeacherTrainingBatch.find = jest.fn().mockReturnValue({
        populate: mockPopulate,
      });

      const user = { _id: "user-123", role: ["teacher"] };
      const result = await manager.getBatches(user);

      expect(TeacherTrainingBatch.find).toHaveBeenCalledWith({});
      expect(result.success).toBe(true);
    });
  });
});
