jest.mock("../../../models/school.model");
jest.mock("../../../models/region.model");

const School = require("../../../models/school.model");
const Region = require("../../../models/region.model");
const AppError = require("../../../helper/app.error");
const { assertCanAssign, assertCanGrant } = require("../../../helper/scope.helper");

const fail = async (promise) => {
  const error = await promise.catch((e) => e);
  expect(error).toBeInstanceOf(AppError);
  return [error.statusCode ?? error.status, error.message];
};
const globalGrant = (permission) => ({ permission, scopeType: "GLOBAL", dep: null });

describe("assertCanAssign", () => {
  beforeEach(() => jest.clearAllMocks());

  it("rejects a dependency on GLOBAL scope with 400", async () => {
    expect(await fail(assertCanAssign([], { scopeType: "GLOBAL" }, { state: "K" }, "role.assign"))).toEqual([400, expect.stringContaining("has no school or region scope")]);
  });

  it("rejects SCHOOL scope without dependency with 400", async () => {
    expect(await fail(assertCanAssign([], { scopeType: "SCHOOL" }, undefined, "role.assign"))).toEqual([400, expect.stringContaining("needs a school or region")]);
  });

  it("rejects a SCHOOL dependency missing in the database with 400", async () => {
    School.findById.mockReturnValue({ lean: jest.fn().mockResolvedValue(null) });
    expect(await fail(assertCanAssign([], { scopeType: "SCHOOL" }, "507f1f77bcf86cd799439011", "role.assign"))).toEqual([400, expect.stringContaining("selected school does not exist")]);
  });

  it("rejects a role outside the caller scope with 403", async () => {
    const grants = [{ permission: "role.assign", scopeType: "STATE", dep: { state: "K" } }];
    expect(await fail(assertCanAssign(grants, { scopeType: "GLOBAL" }, undefined, "role.assign"))).toEqual([403, expect.stringContaining("only assign roles inside your own scope")]);
  });
});

describe("assertCanGrant", () => {
  it("rejects a permission the caller does not hold with 403", async () => {
    Region.exists.mockResolvedValue(true);
    const role = { scopeType: "STATE", permissions: ["user.delete"] };
    expect(await fail(assertCanGrant([globalGrant("role.assign")], role, { state: "K" }))).toEqual([403, expect.stringContaining("cannot grant permissions you do not hold")]);
  });
});
