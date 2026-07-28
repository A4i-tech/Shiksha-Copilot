const RoleDao = require("../dao/role.dao");
const BaseManager = require("./base.manager");
const formatApiReponse = require("../helper/response");
const { ALL_PERMISSIONS, permissions } = require("../helper/permission.helper");
const { ROLE_SCOPE_TYPES } = require("../config/role.scope");
const User = require("../models/user.model");
const { assertCanGrant } = require("../helper/scope.helper");

class RoleManager extends BaseManager {
  constructor() {
    super(new RoleDao());
  }

  async create(req) {
    const exists = await this.dao.Model.exists({ name: req.body.name, isDeleted: false });
    if (exists) return formatApiReponse(false, "A role with this name already exists", null);
    if (req.body.permissions.some((permission) => !req.permissions.some((grant) => grant.permission === permission))) {
      return formatApiReponse(false, "Cannot grant permissions you do not hold", null);
    }
    return formatApiReponse(true, "Role created", await this.dao.create(req.body));
  }

  async update(req) {
    const role = await this.dao.getById(req.params.id);
    if (!role) return formatApiReponse(false, "Role not found", null);
    const actorIsSuperuser = req.user.roles.some((assignment) => assignment.role.isSuperUser);
    if (!actorIsSuperuser && req.user.roles.some((assignment) => String(assignment.role._id) === String(role._id))) {
      return formatApiReponse(false, "Roles assigned to your account cannot be edited", null);
    }
    const allowed = role.isSuperUser ? ["name", "description"] : ["name", "description", "permissions", "scopeType"];
    const update = Object.fromEntries(allowed.filter((k) => k in req.body).map((k) => [k, req.body[k]]));
    if (!Object.keys(update).length) return formatApiReponse(false, "No valid fields to update", null);
    if (update.permissions?.some((permission) => !req.permissions.some((grant) => grant.permission === permission))) {
      return formatApiReponse(false, "Cannot grant permissions you do not hold", null);
    }
    const accessChanged = update.permissions !== undefined || update.scopeType && update.scopeType !== role.scopeType;
    const assignedUsers = accessChanged ? await User.find({ "roles.role": role._id }).select("roles").lean() : [];
    if (update.scopeType && update.scopeType !== role.scopeType && assignedUsers.length) {
      return formatApiReponse(false, "Assigned role scope cannot be changed", null);
    }
    if (update.permissions) {
      const nextRole = { ...role, ...update };
      const dependencies = new Map(assignedUsers.flatMap((user) => user.roles)
        .filter((assignment) => String(assignment.role) === String(role._id))
        .map((assignment) => [String(assignment.dep), assignment.dep]));
      for (const dep of dependencies.values()) await assertCanGrant(req.permissions, nextRole, dep);
    }
    return formatApiReponse(true, "Role updated", await this.dao.Model.findByIdAndUpdate(role._id, { $set: update }, { new: true, runValidators: true }));
  }

  async delete(req) {
    const role = await this.dao.getById(req.params.id);
    if (!role) return formatApiReponse(false, "Role not found", null);
    if (role.isSystem) return formatApiReponse(false, "System roles cannot be deleted", null);
    if (await User.exists({ "roles.role": role._id })) return formatApiReponse(false, "Assigned roles cannot be deleted", null);
    await this.dao.delete(role._id);
    return formatApiReponse(true, "Role deleted", null);
  }

  async getAll(...args) {
    const result = await super.getAll(...args);
    if (result.success) {
      result.data.results = result.data.results.map((r) => (r.isSuperUser ? { ...r, permissions: ALL_PERMISSIONS } : r));
    }
    return result;
  }

  async getById(req) {
    const result = await super.getById(req);
    if (result.success && result.data.isSuperUser) result.data.permissions = ALL_PERMISSIONS;
    return result;
  }

  permissions() {
    return formatApiReponse(true, "", permissions);
  }

  scopeTypes() {
    return formatApiReponse(true, "", ROLE_SCOPE_TYPES);
  }
}

module.exports = RoleManager;
