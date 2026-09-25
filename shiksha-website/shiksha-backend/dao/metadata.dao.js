const Metadata = require("../models/metadata.model");
const BaseDao = require("./base.dao.js");

class MetadataDao extends BaseDao {
  constructor() {
    super(Metadata);
  }

  getByKey(key) {
    return this.Model.findOne({ key });
  }
}

module.exports = new MetadataDao();