const FacilityController = require("../../../controllers/facility.controller");
const FacilityManager = require("../../../managers/facility.manager");

// Mock dependencies
jest.mock("../../../managers/facility.manager");

describe("FacilityController", () => {
  let controller;
  let mockReq;
  let mockRes;
  let mockManager;

  beforeEach(() => {
    jest.clearAllMocks();

    controller = new FacilityController();
    mockManager = new FacilityManager();
    controller.manager = mockManager;

    mockReq = {
      params: {},
      body: {},
      query: {},
      user: { id: "user-1", email: "test@example.com" },
    };

    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
  });

  describe("Instance creation", () => {
    it("should create an instance of FacilityController", () => {
      expect(controller).toBeInstanceOf(FacilityController);
    });

    it("should have a manager property", () => {
      expect(controller.manager).toBeDefined();
    });
  });
});
