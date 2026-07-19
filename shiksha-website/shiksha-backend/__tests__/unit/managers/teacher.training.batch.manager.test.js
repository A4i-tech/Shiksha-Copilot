const TeacherTrainingBatchManager = require("../../../managers/teacher.training.batch.manager");
const TeacherTrainingBatch = require("../../../models/teacher.training.batch.model");

jest.mock("../../../dao/teacher.training.batch.dao");
jest.mock("../../../models/teacher.training.batch.model");

const user = (scopeType) => ({
  _id: "user-123",
  roles: [{ role: { permissions: ["training.view"], scopeType, isDeleted: false }, dep: scopeType === "GLOBAL" ? null : "Mysuru" }],
});

describe("TeacherTrainingBatchManager.getBatches", () => {
  let manager;

  beforeEach(() => {
    jest.clearAllMocks();
    manager = new TeacherTrainingBatchManager();
    TeacherTrainingBatch.find.mockReturnValue({ populate: jest.fn().mockResolvedValue([]) });
  });

  it("allows a global grant to view all batches", async () => {
    await manager.getBatches(user("GLOBAL"));
    expect(TeacherTrainingBatch.find).toHaveBeenCalledWith({});
  });

  it("limits a non-global grant to batches created by the user", async () => {
    await manager.getBatches(user("DISTRICT"));
    expect(TeacherTrainingBatch.find).toHaveBeenCalledWith({ createdBy: "user-123" });
  });

  it("returns the database error", async () => {
    TeacherTrainingBatch.find.mockReturnValue({ populate: jest.fn().mockRejectedValue(new Error("Database error")) });
    await expect(manager.getBatches(user("GLOBAL"))).resolves.toMatchObject({ success: false, message: "Database error" });
  });
});
