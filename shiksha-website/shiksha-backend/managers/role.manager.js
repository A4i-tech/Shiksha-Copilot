const RoleDao = require("../dao/role.dao");
const BaseManager = require("./base.manager");
const formatApiReponse = require("../helper/response");
const { ALL_PERMISSIONS, permissions, getPermission } = require("../helper/permission.helper");
const { ROLE_SCOPE_TYPES, REGION_SCOPE_FIELDS } = require("../config/role.scope");
const User = require("../models/user.model");
const School = require("../models/school.model");
const { assertCanGrant, assignmentDependencyFilter, scopeFilter } = require("../helper/scope.helper");

/** @extends {BaseManager<RoleDao>} */
class RoleManager extends BaseManager {
  constructor() {
    super(new RoleDao());
  }

  async create(req) {
    const exists = await this.dao.Model.exists({ name: req.body.name, isDeleted: false });
    if (exists) return formatApiReponse(false, "A role with this name already exists", null);
    if (!getPermission(req.permissions, "role.delegate") && req.body.permissions.some((permission) => !req.permissions.some((grant) => grant.permission === permission))) {
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
    const delegate = Boolean(getPermission(req.permissions, "role.delegate"));
    if (!delegate && update.permissions?.some((permission) => !req.permissions.some((grant) => grant.permission === permission))) {
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
        .map((assignment) => [JSON.stringify(assignment.dep), assignment.dep]));
      if (!actorIsSuperuser && !delegate) {
        for (const dep of dependencies.values()) await assertCanGrant(req.permissions, nextRole, dep);
      }
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

  async getUsers(req) {
    const role = await this.dao.getById(req.params.id);
    if (!role) return formatApiReponse(false, "Role not found", null);
    const scopes = getPermission(req.permissions, "role.view");
    let filter = { "roles.role": role._id };
    if (!scopes.some((scope) => scope.scopeType === "GLOBAL")) {
      let assignments;
      if (role.scopeType === "SCHOOL") {
        const schoolIds = await School.distinct("_id", scopeFilter(scopes));
        assignments = schoolIds.length ? [{ role: role._id, dep: { $in: schoolIds } }] : [];
      } else {
        const targetFields = REGION_SCOPE_FIELDS[role.scopeType];
        assignments = scopes.filter((scope) => {
          if (scope.scopeType === role.scopeType) return true;
          const fields = REGION_SCOPE_FIELDS[scope.scopeType];
          return fields && targetFields && fields.every((field) => targetFields.includes(field));
        }).map((scope) => ({ role: role._id, ...assignmentDependencyFilter(scope.scopeType, scope.dep) }));
      }
      filter = assignments.length
        ? { $or: assignments.map((assignment) => ({ roles: { $elemMatch: assignment } })) }
        : { _id: { $exists: false } };
    }
    const page = Number(req.query.page || 1);
    const limit = Number(req.query.limit || 10);
    const [results, totalItems] = await Promise.all([
      User.find(filter).select("identity profileImage").sort({ "identity.name": 1 }).skip((page - 1) * limit).limit(limit).lean(),
      User.countDocuments(filter),
    ]);
    return formatApiReponse(true, "", { results, totalItems, page, limit });
  }

  permissions() {
    return formatApiReponse(true, "", permissions);
  }

  scopeTypes() {
    return formatApiReponse(true, "", ROLE_SCOPE_TYPES);
  }
}

module.exports = RoleManager;
