const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const School = require("../../../models/school.model");
const User = require("../../../models/user.model");
const AuditLog = require("../../../models/audit.log.model");
const TeacherAbsent = require("../../../models/teacher.absent.model");
const ClassModel = require("../../../models/school.class.model");
const { scopedTeacherIds, teacherScopeFilter, isTeacherInScope, canAccessBatch } = require("../../../helper/training.scope.helper");
const ClassManager = require("../../../managers/school.class.manager");
const AuditLogManager = require("../../../managers/audit.log.manager");

const id = () => new mongoose.Types.ObjectId();
const grant = (permission, scopeType, dep = null) => ({ permission, scopeType, dep });
const ids = (docs, key = "_id") => docs.map((doc) => String(doc[key])).sort();
const sorted = (list) => list.map(String).sort();

// Models use the default connection, so connect it here.
let server;
const [schoolA, schoolB] = [id(), id()];
const [teacherA1, teacherA2, teacherB, adminA, regionUser] = [id(), id(), id(), id(), id()];
const [classA, classB] = [id(), id()];
const REGION_A = { state: "S1", zone: "Z1", district: "D1", block: "B1" };
const REGION_B = { state: "S2", zone: "Z2", district: "D2", block: "B2" };

const school = (_id, schoolId, region) => ({ _id, name: `School ${schoolId}`, schoolId, ...region });
const user = (_id, dep, profiles) => ({ _id, roles: [{ role: id(), dep }], profiles });

beforeAll(async () => {
  server = await MongoMemoryServer.create();
  await mongoose.connect(server.getUri());
  await School.collection.insertMany([school(schoolA, 1, REGION_A), school(schoolB, 2, REGION_B)]);
  await User.collection.insertMany([
    user(teacherA1, schoolA, { teacher: {} }),
    user(teacherA2, schoolA, { teacher: {} }),
    user(teacherB, schoolB, { teacher: {} }),
    user(adminA, schoolA, {}),
    user(regionUser, { state: "S1" }, {}),
  ]);
  await TeacherAbsent.collection.insertMany([teacherA1, teacherA2, teacherB].map((teacherId) => ({ teacherId })));
  await ClassModel.collection.insertMany([{ _id: classA, schoolId: schoolA }, { _id: classB, schoolId: schoolB }]);
  await AuditLog.collection.insertMany([
    { userId: teacherA1, eventType: "Schools Import", status: "success" },
    { userId: adminA, eventType: "Schools Export", status: "success" },
    { userId: teacherB, eventType: "Schools Import", status: "success" },
    { userId: regionUser, eventType: "Schools Import", status: "success" },
  ]);
});

afterAll(async () => {
  await mongoose.disconnect();
  await server.stop();
});

describe("training scope filters against real Mongo", () => {
  const schoolAGrant = [grant("training.view", "SCHOOL", String(schoolA))];

  it("scopedTeacherIds returns only teachers of school A", async () => {
    expect(sorted(await scopedTeacherIds(schoolAGrant, "training.view"))).toEqual(sorted([teacherA1, teacherA2]));
  });

  it("scopedTeacherIds follows a STATE grant to the schools in that state", async () => {
    const stateGrant = [grant("training.view", "STATE", { state: "S2" })];
    expect(sorted(await scopedTeacherIds(stateGrant, "training.view"))).toEqual(sorted([teacherB]));
  });

  it("teacherScopeFilter matches only absentees of school A teachers", async () => {
    const found = await TeacherAbsent.find(await teacherScopeFilter(schoolAGrant, "training.view")).lean();
    expect(ids(found, "teacherId")).toEqual(sorted([teacherA1, teacherA2]));
  });

  it("teacherScopeFilter returns {} for GLOBAL", async () => {
    expect(await teacherScopeFilter([grant("training.view", "GLOBAL")], "training.view")).toEqual({});
  });

  it("isTeacherInScope is true for an A teacher and false for a B teacher", async () => {
    expect(await isTeacherInScope(schoolAGrant, "training.view", teacherA1)).toBe(true);
    expect(await isTeacherInScope(schoolAGrant, "training.view", teacherB)).toBe(false);
  });

  it("canAccessBatch follows the real teacher scope", async () => {
    const own = { assignedTeachers: [teacherA1, teacherA2], createdBy: "x" };
    const mixed = { assignedTeachers: [teacherA1, teacherB], createdBy: "x" };
    expect(await canAccessBatch(schoolAGrant, "me", own, "training.view")).toBe(true);
    expect(await canAccessBatch(schoolAGrant, "me", mixed, "training.view")).toBe(false);
  });
});

describe("class manager scope against real Mongo", () => {
  const manager = new ClassManager();
  const schoolAGrant = [grant("school.read", "SCHOOL", String(schoolA))];

  it("assertCanRead allows a class of school A and blocks school B", async () => {
    await expect(manager.assertCanRead(schoolAGrant, schoolA)).resolves.toBeUndefined();
    await expect(manager.assertCanRead(schoolAGrant, schoolB)).rejects.toMatchObject({ statusCode: 403 });
  });

  it("classScope returns only classes of school A", async () => {
    const found = await ClassModel.find(await manager.classScope(schoolAGrant)).lean();
    expect(ids(found)).toEqual([String(classA)]);
  });

  it("GLOBAL reads both schools", async () => {
    const global = [grant("school.read", "GLOBAL")];
    await expect(manager.assertCanRead(global, schoolA)).resolves.toBeUndefined();
    await expect(manager.assertCanRead(global, schoolB)).resolves.toBeUndefined();
    expect(ids(await ClassModel.find(await manager.classScope(global)).lean())).toEqual(ids([{ _id: classA }, { _id: classB }]));
  });

  it("a school.list STATE grant reads the schools in that state", async () => {
    const stateGrant = [grant("school.list", "STATE", { state: "S2" })];
    await expect(manager.assertCanRead(stateGrant, schoolB)).resolves.toBeUndefined();
    await expect(manager.assertCanRead(stateGrant, schoolA)).rejects.toMatchObject({ statusCode: 403 });
  });

  it("assertCanWrite allows school A and blocks school B for a school A content.manage grant", async () => {
    const write = [grant("content.manage", "SCHOOL", String(schoolA))];
    await expect(manager.assertCanWrite(write, schoolA)).resolves.toBeUndefined();
    await expect(manager.assertCanWrite(write, schoolB)).rejects.toMatchObject({ statusCode: 403 });
  });
});

describe("audit log scope against real Mongo", () => {
  const manager = new AuditLogManager();
  const rows = async (grants) => ids(await AuditLog.find(await manager.scopeFilter(grants)).lean(), "userId");

  it("SCHOOL A returns only audit rows of users of school A", async () => {
    expect(await rows([grant("audit.view", "SCHOOL", String(schoolA))])).toEqual(sorted([teacherA1, adminA]));
  });

  it("STATE S1 also returns audit rows of users with a region-level role", async () => {
    expect(await rows([grant("audit.view", "STATE", { state: "S1" })])).toEqual(sorted([teacherA1, adminA, regionUser]));
  });

  it("GLOBAL returns every audit row", async () => {
    expect(await manager.scopeFilter([grant("audit.view", "GLOBAL")])).toEqual({});
    expect(await rows([grant("audit.view", "GLOBAL")])).toHaveLength(4);
  });
});
