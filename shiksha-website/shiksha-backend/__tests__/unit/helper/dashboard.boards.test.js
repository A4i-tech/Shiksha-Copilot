const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const { saveBoard } = require("../../../helper/dashboard.boards");
const DashboardConfig = require("../../../models/dashboard.config.model");
const Role = require("../../../models/role.model");

let server;

beforeAll(async () => {
  server = await MongoMemoryServer.create();
  await mongoose.connect(server.getUri());
});
afterAll(async () => {
  await mongoose.disconnect();
  await server.stop();
});
beforeEach(async () => {
  await Promise.all([DashboardConfig.deleteMany({}), Role.deleteMany({})]);
  await Role.create({ name: "HM", scopeType: "BLOCK" });
  await Role.create({ name: "Admin", scopeType: "GLOBAL" });
  jest.spyOn(console, "warn").mockImplementation(() => {});
});
afterEach(() => jest.restoreAllMocks());

const permissionsOf = async (name) => (await Role.findOne({ name }).lean()).permissions.sort();
const board = (overrides = {}) => ({ boardKey: "full", chartKeys: ["lesson_plans_by_subject", "avg_feedback_score"], desktopUuid: "d1", mobileUuid: "m1", ...overrides });

describe("saveBoard", () => {
  it("inserts the board and grants only open charts to field roles", async () => {
    expect(await saveBoard(board())).toEqual({ boardKey: "full", inserted: true });
    expect(await DashboardConfig.countDocuments()).toBe(1);
    expect(await permissionsOf("HM")).toEqual(["analytics.chart.lesson_plans_by_subject"]);
    expect(await permissionsOf("Admin")).toEqual([]);
  });

  it("updates ids and chart keys of an existing row and does not grant again", async () => {
    await saveBoard(board());
    await Role.updateOne({ name: "HM" }, { $set: { permissions: [] } });
    expect(await saveBoard(board({ chartKeys: ["lesson_plans_by_subject"], desktopUuid: "d2", mobileUuid: null }))).toEqual({ boardKey: "full", inserted: false });
    const row = await DashboardConfig.findOne({ boardKey: "full" }).lean();
    expect(row).toMatchObject({ chartKeys: ["lesson_plans_by_subject"], desktopUuid: "d2", mobileUuid: null });
    expect(await permissionsOf("HM")).toEqual([]);
  });

  it("writes no row when a grant fails, and grants on the next call", async () => {
    jest.spyOn(Role, "updateMany").mockRejectedValueOnce(new Error("boom"));
    await expect(saveBoard(board())).rejects.toThrow("boom");
    expect(await DashboardConfig.countDocuments()).toBe(0);
    await saveBoard(board());
    expect(await DashboardConfig.countDocuments()).toBe(1);
    expect(await permissionsOf("HM")).toEqual(["analytics.chart.lesson_plans_by_subject"]);
  });

  it("warns about a missing role and still inserts the board", async () => {
    await Role.deleteMany({ name: "HM" });
    await saveBoard(board());
    expect(await DashboardConfig.countDocuments()).toBe(1);
    expect(console.warn).toHaveBeenCalledWith(expect.stringContaining("role HM not found"));
  });
});
