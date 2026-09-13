const permissions = require("../config/permissions.json");
const { ROLE_SCOPE_TYPES } = require("../config/role.scope");
if (process.env.SHIKSHA_DEVTOOLS === "true") permissions.push(...require("../config/devtools.permissions.json"));
permissions.forEach((permission) => permission.scopes = permission.scopes.includes("*") ? ROLE_SCOPE_TYPES : permission.scopes);

const ALL_PERMISSIONS = Object.freeze(permissions.map((permission) => permission.name));
const isPermissionAllowed = (name, scopeType) => permissions.find((permission) => permission.name === name).scopes.includes(scopeType);

function getRolePermissions(assignments) {
  const active = assignments.filter((assignment) => !assignment.role.isDeleted);
  if (active.some((assignment) => assignment.role.isSuperUser)) {
    return ALL_PERMISSIONS.filter((permission) => isPermissionAllowed(permission, "GLOBAL")).map((permission) => ({ permission, scopeType: "GLOBAL", dep: null }));
  }
  const grants = active.flatMap((assignment) => assignment.role.permissions.filter((permission) => isPermissionAllowed(permission, assignment.role.scopeType)).map((permission) => ({
    permission,
    scopeType: assignment.role.scopeType,
    dep: assignment.dep == null ? null : assignment.role.scopeType === "SCHOOL" ? String(assignment.dep) : assignment.dep,
  })));
  return [...new Map(grants.map((grant) => [`${grant.permission}:${grant.scopeType}:${JSON.stringify(grant.dep)}`, grant])).values()];
}

function getPermission(grants, permission) {
  const matches = grants.filter((grant) => grant.permission === permission);
  return matches.length ? matches : null;
}

function hasPermission(grants, permissions) {
  return [].concat(permissions).some((permission) => getPermission(grants, permission));
}

function hasGlobalPermission(grants, permission) {
  return getPermission(grants, permission)?.some((grant) => grant.scopeType === "GLOBAL") === true;
}

function schoolDependency(assignments) {
  const schools = [...new Set(assignments.filter((assignment) => assignment.role.scopeType === "SCHOOL").map((assignment) => String(assignment.dep)))];
  if (schools.length !== 1) throw new Error("A teacher must have exactly one school dependency");
  return schools[0];
}

module.exports = { ALL_PERMISSIONS, permissions, isPermissionAllowed, getRolePermissions, getPermission, hasPermission, hasGlobalPermission, schoolDependency };
