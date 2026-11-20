const School = require("../../../models/school.model");
const User = require("../../../models/user.model");
const { canAccessBatch, teacherScopeFilter } = require("../../../helper/training.scope.helper");

jest.mock("../../../models/school.model", () => ({ distinct: jest.fn() }));
jest.mock("../../../models/user.model", () => ({ distinct: jest.fn() }));

const GLOBAL = [{ permission: "training.view", scopeType: "GLOBAL", dep: null }];
const SCHOOL = [{ permission: "training.view", scopeType: "SCHOOL", dep: "aaaaaaaaaaaaaaaaaaaaaaaa" }];

describe("training scope helper", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    School.distinct.mockResolvedValue(["s1"]);
    User.distinct.mockResolvedValue(["t2"]);
  });

  it("lets a GLOBAL holder access a batch created by someone else", async () => {
    const batch = { assignedTeachers: [], createdBy: "other" };
    expect(await canAccessBatch(GLOBAL, "me", batch, "training.view")).toBe(true);
  });

  it("lets a GLOBAL holder access a batch with teachers outside any school", async () => {
    const batch = { assignedTeachers: ["t9"], createdBy: "other" };
    expect(await canAccessBatch(GLOBAL, "me", batch, "training.view")).toBe(true);
  });

  it("blocks a scoped holder from a batch with an out-of-scope teacher", async () => {
    const batch = { assignedTeachers: ["t9"], createdBy: "other" };
    expect(await canAccessBatch(SCHOOL, "me", batch, "training.view")).toBe(false);
  });

  it("lets a scoped holder access a batch whose teachers are all in scope", async () => {
    const batch = { assignedTeachers: ["t2"], createdBy: "other" };
    expect(await canAccessBatch(SCHOOL, "me", batch, "training.view")).toBe(true);
  });

  it("lets only the creator access a batch with no teachers", async () => {
    const batch = { assignedTeachers: [], createdBy: "me" };
    expect(await canAccessBatch(SCHOOL, "me", batch, "training.view")).toBe(true);
    expect(await canAccessBatch(SCHOOL, "someone-else", batch, "training.view")).toBe(false);
  });

  it("does not limit teachers for a GLOBAL grant", async () => {
    expect(await teacherScopeFilter(GLOBAL, "training.view")).toEqual({});
  });

  it("limits teachers to the scoped schools", async () => {
    expect(await teacherScopeFilter(SCHOOL, "training.view")).toEqual({ teacherId: { $in: ["t2"] } });
  });
});
