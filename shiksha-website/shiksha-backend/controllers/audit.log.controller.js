const AuditLogManager = require("../managers/audit.log.manager.js");
const BaseController = require("./base.controller.js");
const { intersectFilters } = require("../helper/scope.helper");

/** @extends {BaseController<AuditLogManager>} */
class AuditLogController extends BaseController {
    constructor() {
        super(new AuditLogManager());
    }

    async getAll(req, res) {
        req.query.filter = intersectFilters(req.query.filter, await this.manager.scopeFilter(req.permissions));
        return super.getAll(req, res);
    }
}

module.exports = AuditLogController;
