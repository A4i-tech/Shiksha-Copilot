const mongoose = require("mongoose");
const Region = require("../../../models/region.model");
const School = require("../../../models/school.model");
const { assertCanGrant, scopeFilter, isResourceAllowed, intersectFilters } = require("../../../helper/scope.helper");

jest.mock("../../../models/region.model");
jest.mock("../../../models/school.model");

const schoolId = new mongoose.Types.ObjectId();

describe("scope helper", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    Region.exists.mockResolvedValue(true);
    School.exists.mockResolvedValue(true);
    School.findById.mockReturnValue({ lean: jest.fn().mockResolvedValue({ _id: schoolId, district: "Mysuru" }) });
  });

  it("validates a dependency against its discriminator", async () => {
    const grants = [{ permission: "role.assign", scopeType: "GLOBAL" }];
    await expect(assertCanGrant(grants, { scopeType: "DISTRICT" }, "Mysuru")).resolves.toBe("Mysuru");
    await expect(assertCanGrant(grants, { scopeType: "SCHOOL" }, String(schoolId))).resolves.toEqual(schoolId);
  });

  it("uses the dependency in server filters", () => {
    const grant = { scopeType: "DISTRICT", dep: "Mysuru" };
    const serverFilter = scopeFilter([grant], "", "_id");
    expect(intersectFilters({ district: "Kodagu" }, serverFilter)).toEqual({ $and: [{ district: "Kodagu" }, { $or: [{ district: "Mysuru" }] }] });
  });

  it("checks school assignments against the actual school", async () => {
    const grants = [{ permission: "role.assign", scopeType: "DISTRICT", dep: "Mysuru" }];
    await expect(assertCanGrant(grants, { scopeType: "SCHOOL" }, String(schoolId))).resolves.toEqual(schoolId);
  });

  it("matches an ObjectId school dependency", () => {
    const grants = [{ permission: "teacher.view", scopeType: "SCHOOL", dep: schoolId }];
    expect(isResourceAllowed(grants, "teacher.view", { _id: schoolId })).toBe(true);
  });
});
