const AuditLogController = require("../../../controllers/audit.log.controller");
const ClassController = require("../../../controllers/school.class.controller");

jest.mock("../../../models/school.model", () => ({ distinct: jest.fn().mockResolvedValue(["s1"]) }));
jest.mock("../../../models/user.model", () => ({ distinct: jest.fn().mockResolvedValue(["u1"]) }));

const SCHOOL_ID = "aaaaaaaaaaaaaaaaaaaaaaaa";
const grants = (permission) => [{ permission, scopeType: "SCHOOL", dep: SCHOOL_ID }];

describe.each([
  ["audit log", AuditLogController, "audit.view", { userId: { $in: ["u1"] } }],
  ["class", ClassController, "school.read", { schoolId: { $in: ["s1"] } }],
])("%s list scope", (_name, Controller, permission, clause) => {
  it("passes the scope clause of a SCHOOL grant to the manager", async () => {
    const controller = new Controller();
    controller.manager.getAll = jest.fn().mockResolvedValue({ success: true, data: [] });
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    await controller.getAll({ query: {}, permissions: grants(permission), user: { _id: "u1" } }, res);
    expect(controller.manager.getAll.mock.calls[0][2]).toEqual(clause);
  });
});
