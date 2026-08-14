const TeacherTrainingBatchManager = require("../../../managers/teacher.training.batch.manager");
const TeacherTrainingBatch = require("../../../models/teacher.training.batch.model");
const { scopedTeacherIds } = require("../../../helper/training.scope.helper");

jest.mock("../../../dao/teacher.training.batch.dao");
jest.mock("../../../models/teacher.training.batch.model");
jest.mock("../../../helper/training.scope.helper");

describe("TeacherTrainingBatchManager.getBatches", () => {
  let manager;

  beforeEach(() => {
    jest.clearAllMocks();
    manager = new TeacherTrainingBatchManager();
    TeacherTrainingBatch.find.mockReturnValue({ populate: jest.fn().mockResolvedValue([]) });
  });

  it("allows a global grant to view all batches", async () => {
    await manager.getBatches({ _id: "user-123" }, [{ permission: "training.view", scopeType: "GLOBAL", dep: null }]);
    expect(TeacherTrainingBatch.find).toHaveBeenCalledWith({});
  });

  it("queries batches assigned to teachers inside a non-global scope", async () => {
    scopedTeacherIds.mockResolvedValue(["teacher-123"]);
    await manager.getBatches({ _id: "user-123" }, [{ permission: "training.view", scopeType: "DISTRICT", dep: {} }]);
    expect(TeacherTrainingBatch.find).toHaveBeenCalledWith({ $or: [
      { assignedTeachers: { $in: ["teacher-123"] } },
      { createdBy: "user-123", assignedTeachers: { $size: 0 } },
    ] });
  });

  it("returns the database error", async () => {
    TeacherTrainingBatch.find.mockReturnValue({ populate: jest.fn().mockRejectedValue(new Error("Database error")) });
    await expect(manager.getBatches({ _id: "user-123" }, [{ permission: "training.view", scopeType: "GLOBAL", dep: null }]))
      .rejects.toThrow("Database error");
  });
});
