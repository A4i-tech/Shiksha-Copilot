const AuditLogController = require("../../../controllers/audit.log.controller");
const AuditLogManager = require("../../../managers/audit.log.manager");

jest.mock("../../../managers/audit.log.manager");

describe("AuditLogController", () => {
  let controller;
  let mockManager;

  beforeEach(() => {
    jest.clearAllMocks();

    controller = new AuditLogController();
    mockManager = AuditLogManager.mock.instances[0];
  });

  describe("constructor", () => {
    it("should create controller instance successfully", () => {
      expect(controller).toBeInstanceOf(AuditLogController);
      expect(controller.manager).toBeDefined();
    });

    it("should initialize with AuditLogManager", () => {
      expect(AuditLogManager).toHaveBeenCalled();
    });
  });

  describe("inheritance", () => {
    it("should extend BaseController", () => {
      const BaseController = require("../../../controllers/base.controller");
      expect(controller).toBeInstanceOf(BaseController);
    });

    it("should have manager instance", () => {
      expect(controller.manager).toBeDefined();
      expect(controller.manager).toBeInstanceOf(AuditLogManager);
    });
  });
});
