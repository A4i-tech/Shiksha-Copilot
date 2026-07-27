const mongoose = require("mongoose");
const builtinRoles = require("../config/builtin_roles.json");

const ROLE_MAP = {
  standard: "7368696b7368615f74636872",
  power: "7368696b7368615f70777221",
  manager: "7368696b7368615f6d677221",
  admin: "7368696b7368615f61646d6e",
};
const TOUCHED_COLLECTIONS = ["users", "adminusers", "roles", "teachertrainingbatches", "auditlogs", "lessonplantemplates"];
const MIGRATION_ID = "unify-users";

function identity(document) {
  return {
    name: document.name,
    phone: document.phone,
    email: document.email,
    address: document.address,
  };
}

function roleIds(roles) {
  return [...new Set(roles.map((role) => {
    const id = ROLE_MAP[String(role).toLowerCase()];
    if (!id) throw new Error(`Unknown legacy role: ${role}`);
    return id;
  }))];
}

function assignment(role, dep) {
  const value = { _id: new mongoose.Types.ObjectId(), role: new mongoose.Types.ObjectId(role) };
  if (dep) value.dep = dep;
  return value;
}

function teacherDocument(document, schools) {
  if (!document.school) throw new Error(`Teacher ${document._id} has no school`);
  if (!schools.has(String(document.school))) throw new Error(`Teacher ${document._id} school ${document.school} does not exist`);
  if (!Array.isArray(document.classes)) throw new Error(`Teacher ${document._id} has no classes array`);
  if (!Array.isArray(document.facilities)) throw new Error(`Teacher ${document._id} has no facilities array`);
  return {
    _id: document._id,
    identity: identity(document),
    roles: roleIds(document.role).map((role) => assignment(role, document.school)),
    profiles: {
      teacher: {
        facilities: document.facilities,
        classes: document.classes,
        isProfileCompleted: document.isProfileCompleted,
      },
    },
    preferredLanguage: document.preferredLanguage ?? "en",
    profileImage: document.profileImage,
    profileImageExpiresIn: document.profileImageExpiresIn,
    isDeleted: document.isDeleted,
    otp: document.otp,
    loginAttempts: document.loginAttempts,
    recovery: document.recovery,
    rememberMeToken: document.rememberMeToken,
    isLoginAllowed: document.isLoginAllowed,
    createdAt: document.createdAt,
    updatedAt: document.updatedAt,
  };
}

function mergeTeachers(existing, duplicate) {
  const sameName = existing.identity.name === duplicate.identity.name;
  const sameSchool = String(existing.roles[0].dep) === String(duplicate.roles[0].dep);
  const existingProfile = existing.profiles.teacher.isProfileCompleted || existing.profiles.teacher.classes.length || existing.profiles.teacher.facilities.length;
  const duplicateProfile = duplicate.profiles.teacher.isProfileCompleted || duplicate.profiles.teacher.classes.length || duplicate.profiles.teacher.facilities.length;
  if (!sameName || !sameSchool || existing.isDeleted !== duplicate.isDeleted || (existingProfile && duplicateProfile)) {
    throw new Error(`Ambiguous duplicate teacher phone: ${existing.identity.phone}`);
  }
  const source = duplicateProfile ? duplicate : existing;
  const roles = new Map([...existing.roles, ...duplicate.roles].map((value) => [`${value.role}:${value.dep}`, value]));
  return { ...source, _id: existing._id, roles: [...roles.values()], createdAt: existing.createdAt };
}

function adminDocument(document, districts) {
  const roles = roleIds(document.role);
  const assignments = [];
  for (const role of roles) {
    if (role !== ROLE_MAP.manager) assignments.push(assignment(role));
    else {
      if (!Array.isArray(document.districts) || !document.districts.length) throw new Error(`Manager ${document._id} has no districts`);
      for (const district of document.districts) {
        if (!districts.has(district)) throw new Error(`Manager ${document._id} district ${district} does not exist`);
        assignments.push(assignment(role, district));
      }
    }
  }
  return {
    _id: document._id,
    identity: identity(document),
    roles: assignments,
    profiles: { admin: { state: document.state } },
    preferredLanguage: document.preferredLanguage ?? "en",
    profileImage: "",
    isDeleted: document.isDeleted,
    otp: document.otp,
    loginAttempts: document.loginAttempts,
    recovery: document.recovery,
    rememberMeToken: document.rememberMeToken,
    isLoginAllowed: document.isLoginAllowed,
    createdAt: document.createdAt,
    updatedAt: document.updatedAt,
  };
}

async function rewriteReferences(db, idMap) {
  const references = [["teachertrainingbatches", "createdBy"], ["auditlogs", "userId"], ["lessonplantemplates", "approvedBy"]];
  for (const [collectionName, field] of references) {
    for (const [oldId, newId] of idMap) {
      await db.collection(collectionName).updateMany({ [field]: new mongoose.Types.ObjectId(oldId) }, { $set: { [field]: new mongoose.Types.ObjectId(newId) } });
    }
  }
}

async function rewriteTeacherReferences(db, idMap) {
  for (const [oldId, newId] of idMap) {
    const oldValue = new mongoose.Types.ObjectId(oldId), newValue = new mongoose.Types.ObjectId(newId);
    await db.collection("teachertrainingbatches").updateMany(
      { $or: [{ assignedTeachers: oldValue }, { attendance: oldValue }] },
      [{ $set: {
        assignedTeachers: { $setUnion: [{ $map: { input: "$assignedTeachers", as: "id", in: { $cond: [{ $eq: ["$$id", oldValue] }, newValue, "$$id"] } } }, []] },
        attendance: { $setUnion: [{ $map: { input: "$attendance", as: "id", in: { $cond: [{ $eq: ["$$id", oldValue] }, newValue, "$$id"] } } }, []] },
      } }]
    );
  }
}

async function seedBuiltinRoles(db) {
  for (const role of builtinRoles) {
    const { _id, ...data } = role;
    const update = { $set: data, $setOnInsert: { _id: new mongoose.Types.ObjectId(_id) } };
    if (role.isSuperUser) update.$unset = { permissions: "" };
    await db.collection("roles").updateOne({ _id: new mongoose.Types.ObjectId(_id) }, update, { upsert: true });
  }
}

function buildMigration(existingUsers, adminUsers, schools, districts) {
  const issues = [];
  const byPhone = new Map();
  const teacherIdMap = new Map();
  for (const document of existingUsers) {
    try {
      const converted = teacherDocument(document, schools);
      const existing = byPhone.get(converted.identity.phone);
      if (!existing) byPhone.set(converted.identity.phone, converted);
      else {
        byPhone.set(converted.identity.phone, mergeTeachers(existing, converted));
        teacherIdMap.set(String(converted._id), String(existing._id));
      }
    } catch (error) {
      issues.push(error.message);
    }
  }

  const adminIdMap = new Map();
  const adminPhones = new Set();
  for (const document of adminUsers) {
    try {
      if (document.isDeleted && document.role.every((role) => String(role).toLowerCase() === "manager") && (!Array.isArray(document.districts) || !document.districts.length)) continue;
      const converted = adminDocument(document, districts);
      if (adminPhones.has(converted.identity.phone)) throw new Error(`Duplicate admin phone: ${converted.identity.phone}`);
      adminPhones.add(converted.identity.phone);
      const existing = byPhone.get(converted.identity.phone);
      if (existing) {
        existing.roles.push(...converted.roles);
        existing.profiles.admin = converted.profiles.admin;
        existing.identity.email ||= converted.identity.email;
        existing.identity.address ||= converted.identity.address;
        adminIdMap.set(String(document._id), String(existing._id));
      } else {
        byPhone.set(converted.identity.phone, converted);
        adminIdMap.set(String(document._id), String(document._id));
      }
    } catch (error) {
      issues.push(error.message);
    }
  }

  return { issues, unified: [...byPhone.values()], teacherIdMap, adminIdMap, idMap: new Map([...teacherIdMap, ...adminIdMap]) };
}

async function validateReferences(db, migration) {
  const issues = [];
  const userIds = new Set(migration.unified.map((user) => String(user._id)));
  const validate = (collection, document, field, id) => {
    const target = migration.idMap.get(String(id)) || String(id);
    if (!userIds.has(target)) issues.push(`${collection} ${document._id} field ${field} references missing user ${id}`);
  };
  for (const [collection, field] of [["teachertrainingbatches", "createdBy"], ["auditlogs", "userId"], ["lessonplantemplates", "approvedBy"]]) {
    for await (const document of db.collection(collection).find({ [field]: { $type: "objectId" } }, { projection: { [field]: 1 } })) {
      validate(collection, document, field, document[field]);
    }
  }
  for await (const batch of db.collection("teachertrainingbatches").find({}, { projection: { assignedTeachers: 1, attendance: 1 } })) {
    for (const field of ["assignedTeachers", "attendance"]) {
      for (const id of batch[field] || []) validate("teachertrainingbatches", batch, field, id);
    }
  }
  return issues;
}

async function restoreBackups(db, backupSuffix) {
  const users = db.collection("users");
  const indexes = await users.indexes();
  if (indexes.some((index) => index.name === "uniq_user_phone")) await users.dropIndex("uniq_user_phone");
  for (const name of TOUCHED_COLLECTIONS) {
    await db.collection(name).deleteMany({});
    await db.collection(`${name}_unify_users_backup_${backupSuffix}`).aggregate([
      { $match: {} },
      { $merge: { into: name, whenMatched: "replace", whenNotMatched: "insert" } },
    ]).toArray();
  }
}

async function unifyUsers() {
  const db = mongoose.connection.db;
  const states = db.collection("migrationstates");
  const interrupted = await states.findOne({ _id: MIGRATION_ID, status: "running" });
  if (interrupted) {
    await restoreBackups(db, interrupted.backupSuffix);
    await states.deleteOne({ _id: MIGRATION_ID });
  }

  const collections = await db.listCollections({ name: "adminusers" }, { nameOnly: true }).toArray();
  if (!collections.length || !await db.collection("adminusers").countDocuments()) return;
  const users = db.collection("users");
  const admins = db.collection("adminusers");
  const existingUsers = await users.find({}).sort({ createdAt: 1, _id: 1 }).toArray();
  const adminUsers = await admins.find({}).toArray();
  const schools = new Set((await db.collection("schools").distinct("_id")).map(String));
  const districts = new Set(await db.collection("regions").distinct("zones.districts.name"));
  const migration = buildMigration(existingUsers, adminUsers, schools, districts);
  migration.issues.push(...await validateReferences(db, migration));
  if (migration.issues.length) throw new Error(`User migration preflight failed:\n${migration.issues.join("\n")}`);

  const backupSuffix = new Date().toISOString().replace(/[-:.]/g, "").replace("T", "_").replace("Z", "");
  for (const name of TOUCHED_COLLECTIONS) {
    const backupName = `${name}_unify_users_backup_${backupSuffix}`;
    await db.collection(name).aggregate([{ $match: {} }, { $out: backupName }]).toArray();
  }
  await states.replaceOne({ _id: MIGRATION_ID }, { _id: MIGRATION_ID, status: "running", backupSuffix }, { upsert: true });

  try {
    await seedBuiltinRoles(db);
    await users.deleteMany({});
    if (migration.unified.length) await users.insertMany(migration.unified);
    await rewriteReferences(db, migration.idMap);
    await rewriteTeacherReferences(db, migration.teacherIdMap);
    await users.createIndex({ "identity.phone": 1 }, { unique: true, name: "uniq_user_phone" });
    await admins.drop();
    await states.updateOne({ _id: MIGRATION_ID }, { $set: { status: "completed" } });
  } catch (error) {
    await restoreBackups(db, backupSuffix);
    await states.deleteOne({ _id: MIGRATION_ID });
    throw error;
  }
  console.log(`Unified ${existingUsers.length} users and ${adminUsers.length} admin users into ${migration.unified.length} records`);
}

module.exports = unifyUsers;
module.exports.buildMigration = buildMigration;
module.exports.teacherDocument = teacherDocument;
module.exports.adminDocument = adminDocument;
module.exports.mergeTeachers = mergeTeachers;
