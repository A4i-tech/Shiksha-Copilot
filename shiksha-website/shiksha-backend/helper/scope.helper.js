const mongoose = require("mongoose");
const Region = require("../models/region.model");
const School = require("../models/school.model");
const { getPermission } = require("./permission.helper");

const NO_ACCESS = { _id: { $exists: false } };

function isDependencyAllowed(grants, permission, scopeType, dep) {
  const scopes = getPermission(grants, permission);
  if (!scopes) return false;
  if (scopeType === "UNBOUND") return scopes.some((scope) => scope.scopeType === "GLOBAL" || scope.scopeType === "UNBOUND");
  return scopes.some((scope) => scope.scopeType === "GLOBAL" || scope.scopeType === scopeType && String(scope.dep) === String(dep));
}

async function assertCanGrant(grants, role, dep) {
  if (role.scopeType === "GLOBAL" || role.scopeType === "UNBOUND") {
    if (dep) throw new Error(`${role.scopeType} scope does not accept a dependency`);
  } else if (!dep) {
    throw new Error(`${role.scopeType} scope requires a dependency`);
  }
  if (role.scopeType === "SCHOOL") {
    const school = await School.findById(dep).lean();
    if (!school) throw new Error("SCHOOL scope dependency does not exist");
    if (!isResourceAllowed(grants, "role.assign", school)) throw new Error("Role assignment is outside your scope");
    if (role.permissions.some((permission) => !isResourceAllowed(grants, permission, school))) throw new Error("Cannot grant permissions you do not hold at this scope");
    return school._id;
  }
  const paths = { STATE: "state", ZONE: "zones.name", DISTRICT: "zones.districts.name", BLOCK: "zones.districts.blocks.name" };
  if (paths[role.scopeType] && !await Region.exists({ [paths[role.scopeType]]: dep })) throw new Error(`${role.scopeType} scope dependency does not exist`);
  if (!isDependencyAllowed(grants, "role.assign", role.scopeType, dep)) throw new Error("Role assignment is outside your scope");
  if (role.permissions.some((permission) => !isDependencyAllowed(grants, permission, role.scopeType, dep))) throw new Error("Cannot grant permissions you do not hold at this scope");
  return dep;
}

function scopeFilter(scopes, path) {
  if (scopes.some((scope) => scope.scopeType === "GLOBAL")) return {};
  const conditions = scopes.filter((scope) => scope.scopeType !== "UNBOUND").map((scope) => {
    const name = scope.scopeType === "SCHOOL" ? "_id" : scope.scopeType.toLowerCase();
    const value = scope.scopeType === "SCHOOL" ? new mongoose.Types.ObjectId(scope.dep) : scope.dep;
    return { [path ? `${path}.${name}` : name]: value };
  });
  return conditions.length ? { $or: conditions } : NO_ACCESS;
}

function permissionScopeFilter(grants, permission, path) {
  return scopeFilter(getPermission(grants, permission), path);
}

function isResourceAllowed(grants, permission, resource) {
  const scopes = getPermission(grants, permission);
  if (!scopes) return false;
  return scopes.some((scope) => {
    if (scope.scopeType === "GLOBAL") return true;
    if (scope.scopeType === "UNBOUND") return false;
    const field = scope.scopeType.toLowerCase();
    const value = field === "school" ? resource._id : resource[field];
    return String(value) === String(scope.dep);
  });
}

function intersectFilters(filter, scope) {
  if (!Object.keys(scope).length) return filter;
  return Object.keys(filter).length ? { $and: [filter, scope] } : scope;
}

module.exports = { isDependencyAllowed, assertCanGrant, scopeFilter, permissionScopeFilter, isResourceAllowed, intersectFilters };
