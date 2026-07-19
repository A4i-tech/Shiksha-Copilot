const mongoose = require("mongoose");
const builtinRoles = require("../config/builtin_roles.json");

const ROLE_MAP = {
  standard: "7368696b7368615f74636872",
  power: "7368696b7368615f70777221",
  manager: "7368696b7368615f6d677221",
  admin: "7368696b7368615f61646d6e",
};
const TOUCHED_COLLECTIONS = ["users", "adminusers", "roles", "teachertrainingbatches", "auditlogs", "lessonplantemplates"];

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
  return {
    _id: document._id,
    identity: identity(document),
    roles: roleIds(document.role).map((role) => assignment(role, document.school)),
    profiles: {
      teacher: {
        preferredLanguage: document.preferredLanguage,
        facilities: document.facilities,
        classes: document.classes,
        isProfileCompleted: document.isProfileCompleted,
      },
    },
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

function adminDocument(document, districts) {
  const roles = roleIds(document.role);
  const assignments = [];
  for (const role of roles) {
    if (role !== ROLE_MAP.manager) assignments.push(assignment(role));
    else {
      if (!document.districts.length) throw new Error(`Manager ${document._id} has no districts`);
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

async function seedBuiltinRoles(db) {
  for (const role of builtinRoles) {
    const { _id, ...data } = role;
    const update = { $set: data, $setOnInsert: { _id: new mongoose.Types.ObjectId(_id) } };
    if (role.isSuperUser) update.$unset = { permissions: "" };
    await db.collection("roles").updateOne({ _id: new mongoose.Types.ObjectId(_id) }, update, { upsert: true });
  }
}

async function unifyUsers() {
  const db = mongoose.connection.db;
  const collections = await db.listCollections({ name: "adminusers" }, { nameOnly: true }).toArray();
  if (!collections.length) return;
  const backupSuffix = new Date().toISOString().replace(/[-:.]/g, "").replace("T", "_").replace("Z", "");
  for (const name of TOUCHED_COLLECTIONS) {
    const backupName = `${name}_unify_users_backup_${backupSuffix}`;
    await db.collection(name).aggregate([{ $match: {} }, { $out: backupName }]).toArray();
  }
  await seedBuiltinRoles(db);

  const users = db.collection("users");
  const admins = db.collection("adminusers");
  const existingUsers = await users.find({}).toArray();
  const adminUsers = await admins.find({}).toArray();
  const schools = new Set((await db.collection("schools").distinct("_id")).map(String));
  const districts = new Set(await db.collection("regions").distinct("zones.districts.name"));
  const byPhone = new Map();
  for (const document of existingUsers) {
    const converted = teacherDocument(document, schools);
    byPhone.set(converted.identity.phone, converted);
  }
  const adminIdMap = new Map();

  for (const document of adminUsers) {
    const converted = adminDocument(document, districts);
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
  }

  const unified = [...byPhone.values()];
  await users.deleteMany({});
  if (unified.length) await users.insertMany(unified);
  await rewriteReferences(db, adminIdMap);
  await users.createIndex({ "identity.phone": 1 }, { unique: true, name: "uniq_user_phone" });
  await admins.drop();
  console.log(`Unified ${existingUsers.length} users and ${adminUsers.length} admin users into ${unified.length} records`);
}

module.exports = unifyUsers;
