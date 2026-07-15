const permissions = require("../config/permissions.json");

const ALL_PERMISSIONS = Object.freeze(permissions.map((permission) => permission.name));

function getRolePermissions(roles) {
  const activeRoles = roles.filter((role) => !role.isDeleted);
  if (activeRoles.some((role) => role.isSuperUser)) return ALL_PERMISSIONS;
  return [...new Set(activeRoles.flatMap((role) => role.permissions))];
}

module.exports = {
  ALL_PERMISSIONS,
  permissions,
  getRolePermissions,
};
