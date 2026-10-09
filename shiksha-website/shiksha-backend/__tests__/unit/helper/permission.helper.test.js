const { schoolDependency } = require("../../../helper/permission.helper");

const school = (dep) => ({ role: { scopeType: "SCHOOL" }, dep });

describe("schoolDependency", () => {
  it("returns the school id for exactly one SCHOOL assignment", () => {
    expect(schoolDependency([school("s1"), school("s1")])).toBe("s1");
  });

  it.each([[[]], [[school("s1"), school("s2")]]])("throws a 403 AppError for %j", (assignments) => {
    expect(() => schoolDependency(assignments)).toThrow(expect.objectContaining({ name: "AppError", statusCode: 403 }));
  });
});
