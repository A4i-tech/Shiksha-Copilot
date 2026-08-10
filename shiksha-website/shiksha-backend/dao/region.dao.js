const Region = require("../models/region.model");
const BaseDao = require("./base.dao");

/** @extends {BaseDao<typeof Region>} */
class RegionDao extends BaseDao {
	constructor() {
		super(Region);
	}
}

module.exports = RegionDao;
