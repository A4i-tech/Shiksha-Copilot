const mongoose = require("mongoose");
const Region = require("../models/region.model");
const School = require("../models/school.model");
const { getPermission } = require("./permission.helper");
const { ORGANISATION_SCOPE_TYPES, REGION_SCOPE_FIELDS } = require("../config/role.scope");

const NO_ACCESS = { _id: { $exists: false } };

function dependencyMatches(scopeType, left, right) {
  if (scopeType === "SCHOOL") return String(left) === String(right);
  return REGION_SCOPE_FIELDS[scopeType].every((field) => left[field] === right[field]);
}

function assignmentDependencyFilter(scopeType, dep) {
  if (scopeType === "UNBOUND") return { dep: { $exists: false } };
  if (scopeType === "SCHOOL") return { dep: new mongoose.Types.ObjectId(dep) };
  return Object.fromEntries(REGION_SCOPE_FIELDS[scopeType].map((field) => [`dep.${field}`, dep[field]]));
}

function isDependencyAllowed(grants, permission, scopeType, dep) {
  const scopes = getPermission(grants, permission);
  if (!scopes) return false;
  if (scopeType === "UNBOUND") return scopes.some((scope) => scope.scopeType === "GLOBAL" || scope.scopeType === "UNBOUND");
  const targetIndex = ORGANISATION_SCOPE_TYPES.indexOf(scopeType);
  return scopes.some((scope) => {
    if (scope.scopeType === "GLOBAL") return true;
    const scopeIndex = ORGANISATION_SCOPE_TYPES.indexOf(scope.scopeType);
    return scopeIndex !== -1 && scopeIndex <= targetIndex
      && REGION_SCOPE_FIELDS[scope.scopeType].every((field) => scope.dep[field] === dep[field]);
  });
}

function hasAssignmentScope(grants, permission, role, dep) {
  const scopes = getPermission(grants, permission);
  if (!scopes) return false;
  if (role.scopeType === "UNBOUND") return scopes.some((scope) => scope.scopeType === "GLOBAL");
  const targetIndex = ORGANISATION_SCOPE_TYPES.indexOf(role.scopeType);
  return scopes.some((scope) => {
    const scopeIndex = ORGANISATION_SCOPE_TYPES.indexOf(scope.scopeType);
    if (scopeIndex === -1 || scopeIndex >= targetIndex) return false;
    if (scope.scopeType === "GLOBAL") return true;
    return REGION_SCOPE_FIELDS[scope.scopeType].every((field) => scope.dep[field] === dep[field]);
  });
}

async function assertCanAssign(grants, role, dep, permission) {
  if (role.scopeType === "GLOBAL" || role.scopeType === "UNBOUND") {
    if (dep) throw new Error(`${role.scopeType} scope does not accept a dependency`);
    if (!hasAssignmentScope(grants, permission, role, dep)) throw new Error("Role assignment must be below your scope");
    return dep;
  }
  if (!dep) throw new Error(`${role.scopeType} scope requires a dependency`);
  if (role.scopeType === "SCHOOL") {
    const school = await School.findById(dep).lean();
    if (!school) throw new Error("SCHOOL scope dependency does not exist");
    if (!hasAssignmentScope(grants, permission, role, school)) throw new Error("Role assignment must be below your scope");
    return school._id;
  }
  const fields = REGION_SCOPE_FIELDS[role.scopeType];
  if (fields && (typeof dep !== "object" || Object.keys(dep).length !== fields.length || fields.some((field) => !dep[field]))) {
    throw new Error(`${role.scopeType} scope dependency is invalid`);
  }
  const regionQuery = {
    STATE: { state: dep.state },
    ZONE: { state: dep.state, zones: { $elemMatch: { name: dep.zone } } },
    DISTRICT: { state: dep.state, zones: { $elemMatch: { name: dep.zone, districts: { $elemMatch: { name: dep.district } } } } },
    BLOCK: { state: dep.state, zones: { $elemMatch: { name: dep.zone, districts: { $elemMatch: { name: dep.district, blocks: { $elemMatch: { name: dep.block } } } } } } },
  };
  if (regionQuery[role.scopeType] && !await Region.exists(regionQuery[role.scopeType])) throw new Error(`${role.scopeType} scope dependency does not exist`);
  if (!hasAssignmentScope(grants, permission, role, dep)) throw new Error("Role assignment must be below your scope");
  return dep;
}

async function assertCanGrant(grants, role, dep) {
  const resolved = await assertCanAssign(grants, role, dep, "role.assign");
  if (role.scopeType === "SCHOOL") {
    const school = await School.findById(resolved).lean();
    if (role.permissions.some((permission) => !isResourceAllowed(grants, permission, school))) throw new Error("Cannot grant permissions you do not hold at this scope");
  } else if (role.permissions.some((permission) => !isDependencyAllowed(grants, permission, role.scopeType, resolved))) {
    throw new Error("Cannot grant permissions you do not hold at this scope");
  }
  return resolved;
}

function scopeFilter(scopes, path) {
  if (scopes.some((scope) => scope.scopeType === "GLOBAL")) return {};
  const conditions = scopes.filter((scope) => scope.scopeType !== "UNBOUND").map((scope) => {
    if (scope.scopeType === "SCHOOL") return { [path ? `${path}._id` : "_id"]: new mongoose.Types.ObjectId(scope.dep) };
    return Object.fromEntries(REGION_SCOPE_FIELDS[scope.scopeType].map((field) => [path ? `${path}.${field}` : field, scope.dep[field]]));
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
    if (scope.scopeType === "SCHOOL") return String(resource._id) === String(scope.dep);
    return REGION_SCOPE_FIELDS[scope.scopeType].every((field) => resource[field] === scope.dep[field]);
  });
}

function intersectFilters(filter, scope) {
  if (!Object.keys(scope).length) return filter;
  return Object.keys(filter).length ? { $and: [filter, scope] } : scope;
}

module.exports = { dependencyMatches, assignmentDependencyFilter, isDependencyAllowed, hasAssignmentScope, assertCanAssign, assertCanGrant, scopeFilter, permissionScopeFilter, isResourceAllowed, intersectFilters };
