const handleError = require("../helper/handleError");
const MasterClassManager = require("../managers/master.class.manager.js");
const BaseController = require("./base.controller.js");

/** @extends {BaseController<MasterClassManager>} */
class MasterClassController extends BaseController {
  constructor() {
    super(new MasterClassManager());
  }

  async update(req, res) {
    const { id } = req.params;
    const result = await this.manager.updateClass(id, req.body);
    if (!result.success) {
      return handleError(result, res);
    }
    return res.status(200).json(result);
  }
}

module.exports = MasterClassController;