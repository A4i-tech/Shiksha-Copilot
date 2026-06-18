const RoleManager = require("../managers/role.manager");
const BaseController = require("./base.controller");

class RoleController extends BaseController {
  constructor() {
    super(new RoleManager());
  }

  async permissions(req, res) {
    const result = this.manager.permissions();
    return res.status(200).json(result);
  }
}

module.exports = RoleController;
