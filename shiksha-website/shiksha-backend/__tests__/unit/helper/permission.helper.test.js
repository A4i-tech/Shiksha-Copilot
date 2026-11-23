const { getRolePermissions, schoolDependency } = require("../../../helper/permission.helper");

const CONTENT = ['content.view', 'lesson-plan.generate', 'lesson-resource.generate', 'presentation.generate.arbitrary', 'presentation.generate.lesson-plan'];
const names = (assignments) => getRolePermissions(assignments).map((grant) => grant.permission);

describe('content generation permissions (BUG-140)', () => {
  it('keeps them for Superuser', () => {
    expect(names([{ role: { isSuperUser: true } }])).toEqual(expect.arrayContaining(CONTENT));
  });
  it('keeps them for a GLOBAL-scope role', () => {
    expect(names([{ role: { scopeType: 'GLOBAL', permissions: CONTENT }, dep: null }])).toEqual(CONTENT);
  });
});

const school = (dep) => ({ role: { scopeType: "SCHOOL" }, dep });

describe("schoolDependency", () => {
  it("returns the school id for exactly one SCHOOL assignment", () => {
    expect(schoolDependency([school("s1"), school("s1")])).toBe("s1");
  });

  it.each([[[]], [[school("s1"), school("s2")]]])("throws a 409 AppError for %j", (assignments) => {
    expect(() => schoolDependency(assignments)).toThrow(expect.objectContaining({ name: "AppError", statusCode: 409 }));
  });
});

describe("content.curate permission", () => {
  it("keeps it for a GLOBAL-scope role", () => {
    expect(names([{ role: { scopeType: "GLOBAL", permissions: ["content.curate"] }, dep: null }])).toEqual(["content.curate"]);
  });

  it("keeps both content permissions for an UNBOUND-scope role", () => {
    expect(names([{ role: { scopeType: "UNBOUND", permissions: ["content.curate", "content.view"] }, dep: null }])).toEqual(["content.curate", "content.view"]);
  });

  it("keeps both content permissions for a DISTRICT-scope role", () => {
    expect(names([{ role: { scopeType: "DISTRICT", permissions: ["content.curate", "content.view"] }, dep: { district: "d1" } }])).toEqual(["content.curate", "content.view"]);
  });

  it("keeps it for Superuser", () => {
    expect(names([{ role: { isSuperUser: true } }])).toContain("content.curate");
  });
});
