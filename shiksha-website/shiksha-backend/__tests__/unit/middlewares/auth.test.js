const jwt = require("jsonwebtoken");
const User = require("../../../models/user.model");
const {
  isAuthenticated,
  requireAnyPermission,
  requirePermission,
  requireUnscopedPermission,
} = require("../../../middlewares/auth");

jest.mock("jsonwebtoken");
jest.mock("../../../models/user.model");

function mockUserQuery(user) {
  const query = {
    populate: jest.fn().mockReturnThis(),
    then: (resolve, reject) => Promise.resolve(user).then(resolve, reject),
  };
  User.findById.mockReturnValue(query);
  return query;
}

describe("permission authentication middleware", () => {
  beforeEach(() => jest.clearAllMocks());

  it("loads one user collection and resolves permissions", async () => {
    const user = {
      roles: [{ role: { permissions: ["presentation.generate.lesson_plan"], scopeType: "SCHOOL", isDeleted: false }, dep: "school-1" }],
      isDeleted: false,
      isLoginAllowed: true,
    };
    mockUserQuery(user);
    jwt.verify.mockImplementation((_token, _secret, callback) => callback(null, { _id: "user-1" }));
    const req = { headers: { authorization: "token" } };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn().mockReturnThis() };
    const next = jest.fn();

    isAuthenticated(req, res, next);
    await new Promise(setImmediate);

    expect(req.user).toBe(user);
    expect(req.permissions).toContainEqual({ permission: "presentation.generate.lesson_plan", scopeType: "SCHOOL", dep: "school-1" });
    expect(next).toHaveBeenCalled();
  });

  it("rejects deleted users", async () => {
    mockUserQuery({
      roles: [{ role: { permissions: ["presentation.generate.lesson_plan"], scopeType: "SCHOOL", isDeleted: false }, dep: "school-1" }],
      isDeleted: true,
      isLoginAllowed: true,
    });
    jwt.verify.mockImplementation((_token, _secret, callback) => callback(null, { _id: "user-1" }));
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn().mockReturnThis() };
    isAuthenticated({ headers: { authorization: "token" } }, res, jest.fn());
    await new Promise(setImmediate);
    expect(res.status).toHaveBeenCalledWith(401);
  });

  it("enforces one permission", () => {
    const next = jest.fn();
    requirePermission("teacher.edit")({ permissions: [{ permission: "teacher.edit" }] }, { status: jest.fn().mockReturnThis(), json: jest.fn().mockReturnThis() }, next);
    expect(next).toHaveBeenCalled();
  });

  it("enforces any permission", () => {
    const next = jest.fn();
    requireAnyPermission("teacher.edit", "staff.edit")({ permissions: [{ permission: "staff.edit" }] }, { status: jest.fn().mockReturnThis(), json: jest.fn().mockReturnThis() }, next);
    expect(next).toHaveBeenCalled();
  });

  it("does not treat an organisational grant as an unscoped grant", () => {
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn().mockReturnThis() };
    requireUnscopedPermission("role.manage")({ permissions: [{ permission: "role.manage", scopeType: "DISTRICT" }] }, res, jest.fn());
    expect(res.status).toHaveBeenCalledWith(403);
  });
});
