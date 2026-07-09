const permissions = require("../config/permissions.json");

const ALL_PERMISSIONS = Object.freeze(permissions.map((permission) => permission.name));

function getRolePermissions(roles) {
  if (roles.some((role) => role.isSuperUser)) return ALL_PERMISSIONS;
  return [...new Set(roles.flatMap((role) => role.permissions))];
}

module.exports = {
  ALL_PERMISSIONS,
  permissions,
  getRolePermissions,
};
