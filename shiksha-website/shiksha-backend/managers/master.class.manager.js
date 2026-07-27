const BaseManager = require("./base.manager");
const MasterClassDao = require("../dao/master.class.dao");
const formatApiReponse = require("../helper/response");

/** @extends {BaseManager<MasterClassDao>} */
class MasterClassManager extends BaseManager {
  constructor() {
    super(new MasterClassDao());
  }

  async updateClass(id, updates) {
    const updatedClass = await this.dao.update(id, updates);
    if (!updatedClass) {
      return formatApiReponse(false, "Class not found", null);
    }
    return formatApiReponse(true, "", updatedClass);
  }
}

module.exports = MasterClassManager;