const mongoose = require("mongoose");
const builtinRoles = require("../config/builtin_roles.json");

const ROLE_MAP = {
  standard: "7368696b7368615f74636872",
  teacher: "7368696b7368615f74636872",
  power: "7368696b7368615f70777221",
  manager: "7368696b7368615f6d677221",
  admin: "7368696b7368615f61646d6e",
};

const TOUCHED_COLLECTIONS = ["users", "adminusers", "roles", "teachertrainingbatches", "auditlogs", "lessonplantemplates"];

function normalizePhone(phone) {
  const digits = String(phone || "").replace(/\D/g, "");
  return digits.length === 12 && digits.startsWith("91") ? digits.slice(2) : digits;
}

function mapRoles(roles) {
  return [...new Set((Array.isArray(roles) ? roles : [roles]).map((role) => {
    const roleId = mongoose.Types.ObjectId.isValid(role) ? role : ROLE_MAP[String(role).toLowerCase()];
    if (!roleId) throw new Error(`Unknown legacy role: ${role}`);
    return new mongoose.Types.ObjectId(roleId);
  }))];
}

function teacherDocument(document) {
  const roles = mapRoles(document.role || document.roles);
  return {
    _id: document._id,
    identity: {
      name: document.name,
      phone: document.phone,
      normalizedPhone: normalizePhone(document.phone),
      email: document.email,
      address: document.address,
    },
    roles,
    profiles: {
      teacher: {
        state: document.state,
        zone: document.zone,
        district: document.district,
        block: document.block,
        school: document.school,
        preferredLanguage: document.preferredLanguage || "en",
        facilities: document.facilities || [],
        classes: document.classes || [],
        isProfileCompleted: Boolean(document.isProfileCompleted),
      },
    },
    profileImage: document.profileImage || "",
    profileImageExpiresIn: document.profileImageExpiresIn,
    isDeleted: Boolean(document.isDeleted),
    otp: document.otp,
    loginAttempts: document.loginAttempts || [],
    recovery: document.recovery,
    rememberMeToken: Boolean(document.rememberMeToken),
    isLoginAllowed: document.isLoginAllowed !== false,
    createdAt: document.createdAt,
    updatedAt: document.updatedAt,
  };
}

function adminDocument(document) {
  return {
    _id: document._id,
    identity: {
      name: document.name,
      phone: document.phone,
      normalizedPhone: normalizePhone(document.phone),
      email: document.email,
      address: document.address,
    },
    roles: mapRoles(document.role),
    profiles: {
      admin: {
        state: document.state,
        zones: document.zones || [],
        districts: document.districts || [],
      },
    },
    profileImage: "",
    isDeleted: Boolean(document.isDeleted),
    otp: document.otp,
    loginAttempts: document.loginAttempts || [],
    recovery: document.recovery,
    rememberMeToken: Boolean(document.rememberMeToken),
    isLoginAllowed: document.isLoginAllowed !== false,
    createdAt: document.createdAt,
    updatedAt: document.updatedAt,
  };
}

async function rewriteReferences(db, idMap) {
  const references = [
    ["teachertrainingbatches", "createdBy"],
    ["auditlogs", "userId"],
    ["lessonplantemplates", "approvedBy"],
  ];
  for (const [collectionName, field] of references) {
    const collection = db.collection(collectionName);
    for (const [oldId, newId] of idMap) {
      await collection.updateMany({ [field]: new mongoose.Types.ObjectId(oldId) }, { $set: { [field]: new mongoose.Types.ObjectId(newId) } });
    }
  }
}

async function seedBuiltinRoles(db) {
  for (const role of builtinRoles) {
    const { _id, ...data } = role;
    const update = { $set: data, $setOnInsert: { _id: new mongoose.Types.ObjectId(_id) } };
    if (role.isSuperUser) update.$unset = { permissions: "" };
    await db.collection("roles").updateOne(
      { _id: new mongoose.Types.ObjectId(_id) },
      update,
      { upsert: true }
    );
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
  const byPhone = new Map();

  for (const document of existingUsers) {
    const converted = document.identity ? { ...document, roles: mapRoles(document.roles) } : teacherDocument(document);
    byPhone.set(converted.identity.normalizedPhone, converted);
  }

  const adminIdMap = new Map();
  for (const document of adminUsers) {
    const converted = adminDocument(document);
    const existing = byPhone.get(converted.identity.normalizedPhone);
    if (existing) {
      existing.roles = [...new Map([...existing.roles, ...converted.roles].map((role) => [String(role), role])).values()];
      existing.profiles.admin = converted.profiles.admin;
      existing.identity.email ||= converted.identity.email;
      existing.identity.address ||= converted.identity.address;
      adminIdMap.set(String(document._id), String(existing._id));
    } else {
      byPhone.set(converted.identity.normalizedPhone, converted);
      adminIdMap.set(String(document._id), String(document._id));
    }
  }

  const unified = [...byPhone.values()];
  // Remove phone-colliding leftovers before the unique index is applied.
  await users.deleteMany({ _id: { $nin: unified.map((user) => user._id) } });
  for (const user of unified) await users.replaceOne({ _id: user._id }, user, { upsert: true });
  await rewriteReferences(db, adminIdMap);
  await users.createIndex({ "identity.normalizedPhone": 1 }, { unique: true, name: "uniq_user_normalized_phone" });
  await admins.drop();
  console.log(`Unified ${existingUsers.length} users and ${adminUsers.length} admin users into ${unified.length} records`);
}

module.exports = unifyUsers;
