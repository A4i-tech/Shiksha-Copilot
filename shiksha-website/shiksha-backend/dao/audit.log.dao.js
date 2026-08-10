const AuditLog = require("../models/audit.log.model");
const BaseDao = require("./base.dao.js");

/** @extends {BaseDao<typeof AuditLog>} */
class AuditLogDao extends BaseDao {
	constructor() {
		super(AuditLog);
	}
}

module.exports = AuditLogDao;
