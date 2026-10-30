const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const { saveBoard, chartsMismatch, undelegatable, FIELD_ROLES } = require("../../../helper/dashboard.boards");
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
  await Role.insertMany(FIELD_ROLES.map((name) => ({ name, scopeType: "BLOCK" })));
  await Role.create({ name: "Admin", scopeType: "GLOBAL" });
});
afterEach(() => jest.restoreAllMocks());

const permissionsOf = async (name) => (await Role.findOne({ name }).lean()).permissions.sort();
const board = (overrides = {}) => ({ boardKey: "full", chartKeys: ["lesson_plans_by_subject", "avg_feedback_score"], desktopUuid: "d1", mobileUuid: "m1", ...overrides });

describe("saveBoard", () => {
  it("inserts the board and grants only open charts to field roles", async () => {
    expect(await saveBoard(board())).toEqual({ boardKey: "full", inserted: true, skippedRoles: [] });
    expect(await DashboardConfig.countDocuments()).toBe(1);
    expect(await permissionsOf("HM")).toEqual(["analytics.chart.lesson_plans_by_subject"]);
    expect(await permissionsOf("Admin")).toEqual([]);
  });

  it("updates an existing row and grants the new chart keys", async () => {
    await saveBoard(board());
    expect(await saveBoard(board({ chartKeys: ["lesson_plans_by_subject", "content_type_mix"], desktopUuid: "d2", mobileUuid: null }))).toEqual({ boardKey: "full", inserted: false, skippedRoles: [] });
    const row = await DashboardConfig.findOne({ boardKey: "full" }).lean();
    expect(row).toMatchObject({ chartKeys: ["lesson_plans_by_subject", "content_type_mix"], desktopUuid: "d2", mobileUuid: null });
    expect(await permissionsOf("HM")).toEqual(["analytics.chart.content_type_mix", "analytics.chart.lesson_plans_by_subject"]);
  });

  it("writes no row when a grant fails, and grants on the next call", async () => {
    jest.spyOn(Role, "updateMany").mockRejectedValueOnce(new Error("boom"));
    await expect(saveBoard(board())).rejects.toThrow("boom");
    expect(await DashboardConfig.countDocuments()).toBe(0);
    await saveBoard(board());
    expect(await DashboardConfig.countDocuments()).toBe(1);
    expect(await permissionsOf("HM")).toEqual(["analytics.chart.lesson_plans_by_subject"]);
  });

  it("grants the roles that exist and reports the missing ones", async () => {
    await Role.deleteMany({ name: "HM" });
    expect(await saveBoard(board())).toEqual({ boardKey: "full", inserted: true, skippedRoles: ["HM"] });
    expect(await DashboardConfig.countDocuments()).toBe(1);
    expect(await permissionsOf("CRP")).toEqual(["analytics.chart.lesson_plans_by_subject"]);
  });
});

describe("saveBoard revoke", () => {
  const keys = ["lesson_plans_by_subject", "content_type_mix"];
  it("revokes a dropped chart from the field roles", async () => {
    await saveBoard(board({ chartKeys: keys }));
    await saveBoard(board({ chartKeys: ["lesson_plans_by_subject"] }));
    expect(await permissionsOf("HM")).toEqual(["analytics.chart.lesson_plans_by_subject"]);
  });
  it("keeps a dropped chart that another board still holds", async () => {
    await saveBoard(board({ boardKey: "other", chartKeys: keys }));
    await saveBoard(board({ chartKeys: keys }));
    await saveBoard(board({ chartKeys: ["lesson_plans_by_subject"] }));
    expect(await permissionsOf("HM")).toEqual(["analytics.chart.content_type_mix", "analytics.chart.lesson_plans_by_subject"]);
  });
});

describe("saveBoard revoke with a full board", () => {
  it("revokes a dropped chart even when a board with restricted charts still holds it", async () => {
    await saveBoard(board({ boardKey: "full", chartKeys: ["lesson_plans_by_subject", "content_type_mix", "avg_feedback_score"] }));
    await saveBoard(board({ boardKey: "field", chartKeys: ["lesson_plans_by_subject", "content_type_mix"] }));
    await saveBoard(board({ boardKey: "field", chartKeys: ["lesson_plans_by_subject"] }));
    expect(await permissionsOf("HM")).toEqual(["analytics.chart.lesson_plans_by_subject"]);
  });
});

describe("saveBoard roles", () => {
  it("grants only the listed roles", async () => {
    await saveBoard(board({ roles: ["CRP"] }));
    expect(await permissionsOf("CRP")).toEqual(["analytics.chart.lesson_plans_by_subject"]);
    expect(await permissionsOf("HM")).toEqual([]);
  });
});

describe("chartsMismatch", () => {
  const keys = ["lesson_plans_by_subject", "avg_feedback_score"];
  const names = ["Lesson/Period Plans by Subject", "Avg Feedback Score on Generated Content"];
  it("accepts a dashboard with exactly the board charts", () => {
    expect(chartsMismatch(names, keys)).toBeNull();
  });
  it("rejects an extra chart", () => {
    expect(chartsMismatch([...names, "Module Adoption — Which Teachers Use What"], keys)).toMatch("Extra: Module Adoption");
  });
  it("rejects a missing chart", () => {
    expect(chartsMismatch(names.slice(0, 1), keys)).toMatch("Missing: Avg Feedback Score");
  });
});

describe("undelegatable", () => {
  const keys = ["lesson_plans_by_subject", "avg_feedback_score"];
  it("lists open chart permissions the user does not hold", () => {
    expect(undelegatable(keys, [], false)).toEqual(["analytics.chart.lesson_plans_by_subject"]);
  });
  it("is empty when the user holds them or holds role.delegate", () => {
    expect(undelegatable(keys, ["analytics.chart.lesson_plans_by_subject"], false)).toEqual([]);
    expect(undelegatable(keys, [], true)).toEqual([]);
  });
});

describe("saveBoard validation", () => {
  it("rejects an empty chartKeys board and writes no row", async () => {
    await expect(saveBoard(board({ chartKeys: [] }))).rejects.toThrow();
    expect(await DashboardConfig.countDocuments()).toBe(0);
  });
});

describe("DashboardConfig", () => {
  it("rejects a row with no chart keys", async () => {
    await expect(DashboardConfig.create({ boardKey: "empty", chartKeys: [], desktopUuid: "d1" })).rejects.toThrow();
  });
});
