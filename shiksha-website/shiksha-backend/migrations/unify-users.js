const mongoose = require("mongoose");
const builtinRoles = require("../config/builtin_roles.json");

const ROLE_MAP = {
  standard: "7368696b7368615f74636872",
  power: "7368696b7368615f70777221",
  manager: "7368696b7368615f6d677221",
  admin: "7368696b7368615f61646d6e",
};
const TOUCHED_COLLECTIONS = ["users", "adminusers", "roles", "teachertrainingbatches", "auditlogs", "lessonplantemplates"];
const MIGRATION_ID = "unify-users-v1";
const LEASE_MS = 10 * 60 * 1000;
const LEGACY_DISTRICT_NAMES = { Gadwal: "Jogulamba Gadwal" };

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
    loginAttempts: document.loginAttempts ?? [],
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
        const dependencies = districts.get(LEGACY_DISTRICT_NAMES[district] || district);
        if (!dependencies) throw new Error(`Manager ${document._id} district ${district} does not exist`);
        if (dependencies.length !== 1) throw new Error(`Manager ${document._id} district ${district} is ambiguous`);
        assignments.push(assignment(role, dependencies[0]));
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
    loginAttempts: document.loginAttempts ?? [],
    recovery: document.recovery,
    rememberMeToken: document.rememberMeToken,
    isLoginAllowed: document.isLoginAllowed,
    createdAt: document.createdAt,
    updatedAt: document.updatedAt,
  };
}

async function rewriteReferences(db, idMap, userIds) {
  const references = [["teachertrainingbatches", "createdBy"], ["auditlogs", "userId"], ["lessonplantemplates", "approvedBy"]];
  for (const [collectionName, field] of references) {
    for (const [oldId, newId] of idMap) {
      await db.collection(collectionName).updateMany({ [field]: new mongoose.Types.ObjectId(oldId) }, { $set: { [field]: new mongoose.Types.ObjectId(newId) } });
    }
  }
  const cleared = await db.collection("auditlogs").updateMany({ userId: { $type: "objectId", $nin: userIds } }, { $set: { userId: null } });
  if (cleared.modifiedCount) console.log(`Cleared ${cleared.modifiedCount} orphaned audit log user references`);
}

async function rewriteTeacherReferences(db, idMap, userIds) {
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
  await db.collection("teachertrainingbatches").updateMany({}, [{ $set: {
    assignedTeachers: { $filter: { input: "$assignedTeachers", as: "id", cond: { $in: ["$$id", userIds] } } },
    attendance: { $filter: { input: "$attendance", as: "id", cond: { $in: ["$$id", userIds] } } },
  } }]);
}

async function seedBuiltinRoles(db) {
  for (const role of builtinRoles) {
    const { _id, ...data } = role;
    const id = new mongoose.Types.ObjectId(_id);
    await db.collection("roles").updateOne({ _id: id }, { $set: data }, { upsert: true });
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
  for (const [collection, field] of [["teachertrainingbatches", "createdBy"], ["lessonplantemplates", "approvedBy"]]) {
    for await (const document of db.collection(collection).find({ [field]: { $type: "objectId" } }, { projection: { [field]: 1 } })) {
      validate(collection, document, field, document[field]);
    }
  }
  return issues;
}

async function restoreBackups(db, backupSuffix, renewLease) {
  await renewLease();
  const users = db.collection("users");
  const indexes = await users.indexes();
  if (indexes.some((index) => index.name === "uniq_user_phone")) await users.dropIndex("uniq_user_phone");
  for (const name of TOUCHED_COLLECTIONS) {
    await renewLease();
    await db.collection(name).deleteMany({});
    await db.collection(`${name}_unify_users_backup_${backupSuffix}`).aggregate([
      { $match: {} },
      { $merge: { into: name, whenMatched: "replace", whenNotMatched: "insert" } },
    ]).toArray();
    await renewLease();
  }
}

async function acquireLease(states) {
  const owner = String(new mongoose.Types.ObjectId());
  const now = new Date();
  try {
    const previous = await states.findOneAndUpdate(
      {
        _id: MIGRATION_ID,
        $or: [
          { status: { $ne: "running" } },
          { heartbeatAt: { $lte: new Date(now.getTime() - LEASE_MS) } },
          { heartbeatAt: { $exists: false } },
        ],
      },
      { $set: { status: "running", owner, heartbeatAt: now } },
      { upsert: true, returnDocument: "before" }
    );
    return { owner, previous };
  } catch (error) {
    if (error.code === 11000) throw new Error("User migration is already running");
    throw error;
  }
}

async function unifyUsers() {
  const db = mongoose.connection.db;
  await seedBuiltinRoles(db);
  const states = db.collection("migrationstates");
  const state = await states.findOne({ _id: MIGRATION_ID });
  if (state?.status === "completed") return;
  const collections = await db.listCollections({ name: "adminusers" }, { nameOnly: true }).toArray();
  const hasAdmins = collections.length && await db.collection("adminusers").countDocuments();
  if (!hasAdmins && state?.status !== "running") {
    await states.updateOne({ _id: MIGRATION_ID }, { $set: { status: "completed", completedAt: new Date() } }, { upsert: true });
    return;
  }

  const { owner, previous } = await acquireLease(states);
  const renewLease = async () => {
    const result = await states.updateOne({ _id: MIGRATION_ID, status: "running", owner }, { $set: { heartbeatAt: new Date() } });
    if (!result.matchedCount) throw new Error("User migration lease lost");
  };

  try {
    if (previous?.status === "running" && previous.backupSuffix) {
      await restoreBackups(db, previous.backupSuffix, renewLease);
    }
    await states.updateOne({ _id: MIGRATION_ID, owner }, { $unset: { backupSuffix: "" } });

    const users = db.collection("users");
    const admins = db.collection("adminusers");
    const existingUsers = await users.find({}).sort({ createdAt: 1, _id: 1 }).toArray();
    const adminUsers = await admins.find({}).toArray();
    const schools = new Set((await db.collection("schools").distinct("_id")).map(String));
    const districtRows = await db.collection("regions").aggregate([
      { $unwind: "$zones" },
      { $unwind: "$zones.districts" },
      { $project: { _id: 0, name: "$zones.districts.name", dep: { state: "$state", zone: "$zones.name", district: "$zones.districts.name" } } },
    ]).toArray();
    const districts = new Map();
    for (const district of districtRows) {
      const dependencies = districts.get(district.name) || [];
      dependencies.push(district.dep);
      districts.set(district.name, dependencies);
    }
    const migration = buildMigration(existingUsers, adminUsers, schools, districts);
    migration.issues.push(...await validateReferences(db, migration));
    if (migration.issues.length) throw new Error(`User migration preflight failed:\n${migration.issues.join("\n")}`);
    await renewLease();

    const backupSuffix = new Date().toISOString().replace(/[-:.]/g, "").replace("T", "_").replace("Z", "");
    for (const name of TOUCHED_COLLECTIONS) {
      await renewLease();
      const backupName = `${name}_unify_users_backup_${backupSuffix}`;
      await db.collection(name).aggregate([{ $match: {} }, { $out: backupName }]).toArray();
      await renewLease();
    }
    const backupState = await states.updateOne({ _id: MIGRATION_ID, status: "running", owner }, { $set: { backupSuffix } });
    if (!backupState.matchedCount) throw new Error("User migration lease lost");

    await renewLease();
    await users.deleteMany({});
    if (migration.unified.length) await users.insertMany(migration.unified);
    await renewLease();
    await rewriteReferences(db, migration.idMap, migration.unified.map((user) => user._id));
    await rewriteTeacherReferences(db, migration.teacherIdMap, migration.unified.map((user) => user._id));
    await renewLease();
    await users.createIndex({ "identity.phone": 1 }, { unique: true, name: "uniq_user_phone" });
    await admins.drop();
    const result = await states.updateOne(
      { _id: MIGRATION_ID, status: "running", owner },
      { $set: { status: "completed", completedAt: new Date() }, $unset: { owner: "", heartbeatAt: "" } }
    );
    if (!result.matchedCount) throw new Error("User migration lease lost");
    console.log(`Unified ${existingUsers.length} users and ${adminUsers.length} admin users into ${migration.unified.length} records`);
  } catch (error) {
    const owned = await states.findOne({ _id: MIGRATION_ID, status: "running", owner });
    if (owned?.backupSuffix) await restoreBackups(db, owned.backupSuffix, renewLease);
    if (owned) await states.deleteOne({ _id: MIGRATION_ID, owner });
    throw error;
  }
}

module.exports = unifyUsers;
