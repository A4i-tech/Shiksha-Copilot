const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const grantStateAdminCharts = require("../../../migrations/state-admin-chart-grants");
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
beforeEach(() => Role.deleteMany({}));

describe("grantStateAdminCharts", () => {
  it("grants the open charts to State Admin once and leaves other roles alone", async () => {
    await Role.create({ name: "State Admin", scopeType: "GLOBAL", permissions: ["analytics.view"] });
    await Role.create({ name: "Teacher", scopeType: "SCHOOL" });
    await grantStateAdminCharts();
    await grantStateAdminCharts();
    const stateAdmin = (await Role.findOne({ name: "State Admin" }).lean()).permissions;
    expect(stateAdmin).toContain("analytics.view");
    expect(stateAdmin).toContain("analytics.chart.lesson_plans_by_subject");
    expect(stateAdmin).not.toContain("analytics.chart.module_adoption");
    expect(new Set(stateAdmin).size).toBe(stateAdmin.length);
    expect((await Role.findOne({ name: "Teacher" }).lean()).permissions).toEqual([]);
  });
});
