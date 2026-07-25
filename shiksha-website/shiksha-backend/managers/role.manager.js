const RoleDao = require("../dao/role.dao");
const BaseManager = require("./base.manager");
const formatApiReponse = require("../helper/response");
const { ALL_PERMISSIONS, permissions } = require("../helper/permission.helper");
const { ROLE_SCOPE_TYPES } = require("../config/role.scope");
const User = require("../models/user.model");

class RoleManager extends BaseManager {
  constructor() {
    super(new RoleDao());
  }

  async create(req) {
    const exists = await this.dao.Model.exists({ name: req.body.name, isDeleted: false });
    if (exists) return formatApiReponse(false, "A role with this name already exists", null);
    return formatApiReponse(true, "Role created", await this.dao.create(req.body));
  }

  async update(req) {
    const role = await this.dao.getById(req.params.id);
    if (!role) return formatApiReponse(false, "Role not found", null);
    if (req.body.scopeType && req.body.scopeType !== role.scopeType && await User.exists({ "roles.role": role._id })) {
      return formatApiReponse(false, "Assigned role scope cannot be changed", null);
    }
    const allowed = role.isSuperUser ? ["name", "description"] : ["name", "description", "permissions", "scopeType"];
    const update = Object.fromEntries(allowed.filter((k) => k in req.body).map((k) => [k, req.body[k]]));
    if (!Object.keys(update).length) return formatApiReponse(false, "No valid fields to update", null);
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
