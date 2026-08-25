const Role = require("../models/role.model");
const BaseDao = require("./base.dao");

/** @extends {BaseDao<typeof Role>} */
class RoleDao extends BaseDao {
  constructor() {
    super(Role);
  }

  getAll(page, limit, filters, sort) {
    return super.getAll(page, limit, filters, sort, { isDeleted: false });
  }

  getById(id) {
    return this.Model.findOne({ _id: id, isDeleted: false }).lean();
  }
}

module.exports = RoleDao;
