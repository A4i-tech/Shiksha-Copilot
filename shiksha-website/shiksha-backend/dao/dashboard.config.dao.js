const DashboardConfig = require("../models/dashboard.config.model");
const BaseDao = require("./base.dao");

class DashboardConfigDao extends BaseDao {
  constructor() {
    super(DashboardConfig);
  }

  findAllBoards() {
    return this.Model.find({}).lean();
  }
}

module.exports = DashboardConfigDao;
