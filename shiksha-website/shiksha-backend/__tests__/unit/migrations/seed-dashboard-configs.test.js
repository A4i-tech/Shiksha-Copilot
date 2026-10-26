const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const seedDashboardConfigs = require("../../../migrations/seed-dashboard-configs");
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
  delete process.env.SUPERSET_BOARDS_JSON;
  jest.spyOn(console, "warn").mockImplementation(() => {});
});
afterEach(() => jest.restoreAllMocks());

const setBoards = (boards) => { process.env.SUPERSET_BOARDS_JSON = JSON.stringify(boards); };
const permissionsOf = async (name) => (await Role.findOne({ name }).lean()).permissions.sort();
const board = (overrides = {}) => ({ boardKey: "full", chartKeys: ["lesson_plans_by_subject", "avg_feedback_score"], desktopUuid: "d1", mobileUuid: "m1", ...overrides });

describe("seedDashboardConfigs", () => {
  it("does nothing when the env var is unset", async () => {
    await seedDashboardConfigs();
    expect(await DashboardConfig.countDocuments()).toBe(0);
    expect(await permissionsOf("HM")).toEqual([]);
  });

  it("skips and warns on invalid JSON", async () => {
    process.env.SUPERSET_BOARDS_JSON = "{oops";
    await seedDashboardConfigs();
    expect(await DashboardConfig.countDocuments()).toBe(0);
    expect(console.warn).toHaveBeenCalledWith(expect.stringContaining("not a valid JSON array"));
  });

  it("inserts the board and grants only open charts to field roles", async () => {
    setBoards([board()]);
    await seedDashboardConfigs();
    expect(await DashboardConfig.countDocuments()).toBe(1);
    expect(await permissionsOf("HM")).toEqual(["analytics.chart.lesson_plans_by_subject"]);
    expect(await permissionsOf("Admin")).toEqual([]);
  });

  it("skips boards without a desktop UUID, with an empty chart list, or with an unknown chart key", async () => {
    setBoards([board({ desktopUuid: undefined }), board({ boardKey: "y", chartKeys: [] }), board({ boardKey: "z", chartKeys: ["nope"] })]);
    await seedDashboardConfigs();
    expect(await DashboardConfig.countDocuments()).toBe(0);
    expect(console.warn).toHaveBeenCalledTimes(3);
  });

  it("does not re-grant after an admin removes a permission", async () => {
    setBoards([board()]);
    await seedDashboardConfigs();
    await Role.updateOne({ name: "HM" }, { $set: { permissions: [] } });
    await seedDashboardConfigs();
    expect(await permissionsOf("HM")).toEqual([]);
  });

  it("keeps the stored row and warns when the env UUID changes", async () => {
    setBoards([board()]);
    await seedDashboardConfigs();
    setBoards([board({ desktopUuid: "d2" })]);
    await seedDashboardConfigs();
    expect((await DashboardConfig.findOne({ boardKey: "full" })).desktopUuid).toBe("d1");
    expect(console.warn).toHaveBeenCalledWith(expect.stringContaining("differs from stored row"));
  });

  it("warns about a missing role and still seeds the board", async () => {
    await Role.deleteMany({ name: "HM" });
    setBoards([board()]);
    await seedDashboardConfigs();
    expect(await DashboardConfig.countDocuments()).toBe(1);
    expect(console.warn).toHaveBeenCalledWith(expect.stringContaining("role HM not found"));
  });

  it("writes no row when a grant fails, and grants on the next run", async () => {
    setBoards([board()]);
    jest.spyOn(Role, "updateMany").mockRejectedValueOnce(new Error("boom"));
    await expect(seedDashboardConfigs()).rejects.toThrow("boom");
    expect(await DashboardConfig.countDocuments()).toBe(0);
    await seedDashboardConfigs();
    expect(await DashboardConfig.countDocuments()).toBe(1);
    expect(await permissionsOf("HM")).toEqual(["analytics.chart.lesson_plans_by_subject"]);
  });
});
