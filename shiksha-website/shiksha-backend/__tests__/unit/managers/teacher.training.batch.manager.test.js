const TeacherTrainingBatchManager = require("../../../managers/teacher.training.batch.manager");
const TeacherTrainingBatch = require("../../../models/teacher.training.batch.model");
const UserManager = require("../../../managers/user.manager");
const { scopedTeacherIds } = require("../../../helper/training.scope.helper");

jest.mock("../../../dao/teacher.training.batch.dao");
jest.mock("../../../models/teacher.training.batch.model");
jest.mock("../../../managers/user.manager");
jest.mock("../../../helper/training.scope.helper");

describe("TeacherTrainingBatchManager.getBatches", () => {
  let manager;
  let findQuery;

  beforeEach(() => {
    jest.clearAllMocks();
    manager = new TeacherTrainingBatchManager();
    findQuery = {
      select: jest.fn().mockReturnThis(),
      populate: jest.fn().mockResolvedValue([]),
    };
    TeacherTrainingBatch.find.mockReturnValue(findQuery);
    UserManager.prototype.getAll.mockResolvedValue({ success: true, data: { results: [], totalItems: 0 } });
  });

  it("allows a global grant to view all batches", async () => {
    await manager.getBatches({ _id: "user-123" }, [{ permission: "training.view", scopeType: "GLOBAL", dep: null }]);
    expect(TeacherTrainingBatch.find).toHaveBeenCalledWith({});
    expect(findQuery.select).toHaveBeenCalledWith("batchName scheduleDate trainingType assignedTeachers isSubmitted createdBy");
    expect(findQuery.populate).toHaveBeenCalledWith({ path: "createdBy", select: "identity.name -_id" });
  });

  it("returns only batch summary data", async () => {
    findQuery.populate.mockResolvedValue([{
      _id: "batch-123",
      batchName: "Batch",
      scheduleDate: "2026-08-12",
      trainingType: "online",
      isSubmitted: true,
      createdBy: { identity: { name: "Manager" } },
      assignedTeachers: ["teacher-1", "teacher-2"],
      attendance: ["teacher-1"],
    }]);

    await expect(manager.getBatches({ _id: "user-123" }, [{ permission: "training.view", scopeType: "GLOBAL", dep: null }]))
      .resolves.toMatchObject({ data: [{
        _id: "batch-123",
        batchName: "Batch",
      }] });
  });

  it("filters available teachers before pagination", async () => {
    TeacherTrainingBatch.distinct
      .mockResolvedValueOnce(["teacher-1"])
      .mockResolvedValueOnce(["teacher-2"]);

    await manager.getAvailableTeachers(2, 50, "Jane", [{ permission: "training.edit" }]);

    expect(UserManager.prototype.getAll).toHaveBeenCalledWith(expect.objectContaining({
      page: 2,
      limit: 50,
      permission: "training.edit",
      filters: {
        $and: [
          { profileType: "teacher", _id: { $nin: ["teacher-1", "teacher-2"] } },
          { $or: expect.any(Array) },
        ],
      },
    }));
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
    findQuery.populate.mockRejectedValue(new Error("Database error"));
    await expect(manager.getBatches({ _id: "user-123" }, [{ permission: "training.view", scopeType: "GLOBAL", dep: null }]))
      .rejects.toThrow("Database error");
  });
});
