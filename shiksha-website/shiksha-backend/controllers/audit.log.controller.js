const AuditLogManager = require("../managers/audit.log.manager.js");
const BaseController = require("./base.controller.js");

/** @extends {BaseController<AuditLogManager>} */
class AuditLogController extends BaseController {
    constructor() {
        super(new AuditLogManager());
    }

}

module.exports = AuditLogController;
