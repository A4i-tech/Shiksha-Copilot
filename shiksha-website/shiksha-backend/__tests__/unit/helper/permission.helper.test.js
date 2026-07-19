const { ALL_PERMISSIONS, getRolePermissions, getPermission, hasPermission, schoolDependency } = require("../../../helper/permission.helper");

describe("permission helper", () => {
  it("keeps the same permission at separate scopes", () => {
    const role = { permissions: ["teacher.view"], scopeType: "SCHOOL", isDeleted: false };
    const grants = getRolePermissions([
      { role, dep: "school-1" },
      { role, dep: "school-2" },
      { role, dep: "school-1" },
    ]);

    expect(grants).toEqual([
      { permission: "teacher.view", scopeType: "SCHOOL", dep: "school-1" },
      { permission: "teacher.view", scopeType: "SCHOOL", dep: "school-2" },
    ]);
    expect(getPermission(grants, "teacher.view")).toHaveLength(2);
    expect(hasPermission(grants, ["staff.view", "teacher.view"])).toBe(true);
  });

  it("gives superusers every permission globally", () => {
    const grants = getRolePermissions([{ role: { scopeType: "GLOBAL", isSuperUser: true, isDeleted: false } }]);

    expect(grants).toHaveLength(ALL_PERMISSIONS.length);
    expect(grants.every((grant) => grant.scopeType === "GLOBAL" && grant.dep === null)).toBe(true);
  });

  it("requires one distinct school dependency for teachers", () => {
    const schoolRole = { scopeType: "SCHOOL" };
    expect(schoolDependency([{ role: schoolRole, dep: "school-1" }, { role: schoolRole, dep: "school-1" }])).toBe("school-1");
    expect(() => schoolDependency([{ role: schoolRole, dep: "school-1" }, { role: schoolRole, dep: "school-2" }])).toThrow("exactly one school dependency");
  });
});
