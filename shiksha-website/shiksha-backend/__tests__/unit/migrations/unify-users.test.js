const mongoose = require("mongoose");
const unifyUsers = require("../../../migrations/unify-users");

describe("unify users migration", () => {
  it("moves a teacher school into each role assignment", () => {
    const school = new mongoose.Types.ObjectId();
    const teacher = unifyUsers.teacherDocument({
      _id: new mongoose.Types.ObjectId(),
      name: "Teacher",
      phone: "9876543210",
      role: ["standard", "power"],
      school,
    }, new Set([String(school)]));

    expect(teacher.roles).toHaveLength(2);
    expect(teacher.roles.every((assignment) => assignment.dep.equals(school))).toBe(true);
    expect(teacher.profiles.teacher).not.toHaveProperty("school");
  });

  it("creates one district assignment per manager district", () => {
    const manager = unifyUsers.adminDocument({
      _id: new mongoose.Types.ObjectId(),
      name: "Manager",
      phone: "9876543210",
      role: ["manager"],
      districts: ["Mysuru", "Kodagu"],
    }, new Set(["Mysuru", "Kodagu"]));

    expect(manager.roles.map((assignment) => assignment.dep)).toEqual(["Mysuru", "Kodagu"]);
  });

  it("fails on unknown legacy roles", () => {
    const school = new mongoose.Types.ObjectId();
    expect(() => unifyUsers.teacherDocument({
      _id: new mongoose.Types.ObjectId(),
      name: "Teacher",
      phone: "9876543210",
      role: ["unknown"],
      school,
    }, new Set([String(school)]))).toThrow("Unknown legacy role");
  });

  it("merges an empty same-school duplicate into the populated teacher", () => {
    const school = new mongoose.Types.ObjectId(), firstId = new mongoose.Types.ObjectId();
    const populated = { _id: firstId, identity: { name: "Teacher", phone: "9876543210" }, roles: [{ role: "role-1", dep: school }], profiles: { teacher: { isProfileCompleted: true, classes: [{}], facilities: [] } }, isDeleted: false };
    const empty = { _id: new mongoose.Types.ObjectId(), identity: populated.identity, roles: [{ role: "role-1", dep: school }], profiles: { teacher: { isProfileCompleted: false, classes: [], facilities: [] } }, isDeleted: false };
    const merged = unifyUsers.mergeTeachers(populated, empty);
    expect(merged._id).toEqual(firstId);
    expect(merged.profiles.teacher.classes).toHaveLength(1);
  });

  it("rejects duplicate phones across schools", () => {
    const teacher = (school) => ({ _id: new mongoose.Types.ObjectId(), identity: { name: "Teacher", phone: "9876543210" }, roles: [{ role: "role-1", dep: school }], profiles: { teacher: { isProfileCompleted: false, classes: [], facilities: [] } }, isDeleted: false });
    expect(() => unifyUsers.mergeTeachers(teacher("school-1"), teacher("school-2"))).toThrow("Ambiguous duplicate teacher phone");
  });
});
