const AuditLogDao = require("../dao/audit.log.dao");
const BaseManager = require("./base.manager");
const School = require("../models/school.model");
const User = require("../models/user.model");
const { permissionScopeFilter } = require("../helper/scope.helper");

/** @extends {BaseManager<AuditLogDao>} */
class AuditLogManager extends BaseManager {
	constructor() {
		super(new AuditLogDao());
	}

	// Logs of users with any role in the audit.view scope; the second clause covers region-level roles.
	async scopeFilter(grants) {
		const schools = permissionScopeFilter(grants, "audit.view");
		if (!Object.keys(schools).length) return {};
		const schoolIds = await School.distinct("_id", schools);
		const userIds = await User.distinct("_id", { $or: [{ "roles.dep": { $in: schoolIds } }, permissionScopeFilter(grants, "audit.view", "roles.dep")] });
		return { userId: { $in: userIds } };
	}
}

module.exports = AuditLogManager;
