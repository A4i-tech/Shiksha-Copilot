const RoleDao = require("../dao/role.dao");
const BaseManager = require("./base.manager");
const formatApiReponse = require("../helper/response");
const { ALL_PERMISSIONS, permissions } = require("../helper/permission.helper");

class RoleManager extends BaseManager {
  constructor() {
    super(new RoleDao());
  }

  async create(req) {
    return formatApiReponse(true, "Role created", await this.dao.create(req.body));
  }

  async update(req) {
    const role = await this.dao.getById(req.params.id);
    if (role.isSuperUser && "permissions" in req.body) return formatApiReponse(false, "Superuser permissions cannot be changed", null);
    return formatApiReponse(true, "Role updated", await this.dao.Model.findByIdAndUpdate(role._id, { $set: req.body }, { new: true, runValidators: true }));
  }

  async delete(req) {
    const role = await this.dao.getById(req.params.id);
    if (role.isSystem) return formatApiReponse(false, "System roles cannot be deleted", null);
    await this.dao.delete(role._id);
    return formatApiReponse(true, "Role deleted", null);
  }

  async getAll(...args) {
    const result = await super.getAll(...args);
    if (result.success) result.data.results = result.data.results.map((role) => role.isSuperUser ? { ...role, permissions: ALL_PERMISSIONS } : role);
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
}

module.exports = RoleManager;
