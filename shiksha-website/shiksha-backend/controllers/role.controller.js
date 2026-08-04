const RoleManager = require("../managers/role.manager");
const BaseController = require("./base.controller");

class RoleController extends BaseController {
  constructor() {
    super(new RoleManager());
  }

  permissions(req, res) {
    return res.status(200).json(this.manager.permissions());
  }

  scopeTypes(req, res) {
    return res.status(200).json(this.manager.scopeTypes());
  }

  async users(req, res) {
    const result = await this.manager.getUsers(req);
    return res.status(result.success ? 200 : 404).json(result);
  }
}

module.exports = RoleController;
