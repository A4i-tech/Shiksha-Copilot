const AuditLogManager = require("../../../managers/audit.log.manager");
const School = require("../../../models/school.model");
const User = require("../../../models/user.model");

jest.mock("../../../models/school.model", () => ({ distinct: jest.fn() }));
jest.mock("../../../models/user.model", () => ({ distinct: jest.fn() }));

const SCHOOL_A = "aaaaaaaaaaaaaaaaaaaaaaaa";

describe("AuditLogManager.scopeFilter", () => {
  it("does not limit logs for a GLOBAL audit.view grant", async () => {
    const filter = await new AuditLogManager().scopeFilter([{ permission: "audit.view", scopeType: "GLOBAL", dep: null }]);
    expect(filter).toEqual({});
  });

  it("limits logs to users with a role inside the grant's scope", async () => {
    School.distinct.mockResolvedValue([SCHOOL_A]);
    User.distinct.mockResolvedValue(["u1"]);
    const filter = await new AuditLogManager().scopeFilter([{ permission: "audit.view", scopeType: "SCHOOL", dep: SCHOOL_A }]);
    expect(filter).toEqual({ userId: { $in: ["u1"] } });
  });
});
