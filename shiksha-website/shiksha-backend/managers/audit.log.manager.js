const AuditLogDao = require("../dao/audit.log.dao");
const BaseManager = require("./base.manager");

/** @extends {BaseManager<AuditLogDao>} */
class AuditLogManager extends BaseManager {
	constructor() {
		super(new AuditLogDao());
	}
}

module.exports = AuditLogManager;