const RegionController = require("../../../controllers/region.controller");
const RegionManager = require("../../../managers/region.manager");

// Mock dependencies
jest.mock("../../../managers/region.manager");

describe("RegionController", () => {
  let controller;
  let mockReq;
  let mockRes;
  let mockManager;

  beforeEach(() => {
    jest.clearAllMocks();

    controller = new RegionController();
    mockManager = new RegionManager();
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

  describe("getStates", () => {
    it("should successfully retrieve all states", async () => {
      const mockStates = ["State1", "State2", "State3"];
      mockManager.getStates.mockResolvedValue(mockStates);

      await controller.getStates(mockReq, mockRes);

      expect(mockManager.getStates).toHaveBeenCalled();
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        data: mockStates,
      });
    });

    it("should return empty array when no states exist", async () => {
      mockManager.getStates.mockResolvedValue([]);

      await controller.getStates(mockReq, mockRes);

      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        data: [],
      });
    });
  });

  describe("getZones", () => {
    it("should successfully retrieve zones for a state", async () => {
      const mockZones = ["Zone1", "Zone2"];
      mockReq.query.state = "State1";
      mockManager.getZones.mockResolvedValue(mockZones);

      await controller.getZones(mockReq, mockRes);

      expect(mockManager.getZones).toHaveBeenCalledWith("State1");
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        data: mockZones,
      });
    });

    it("should return 400 when state parameter is missing", async () => {
      mockReq.query = {};

      await controller.getZones(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: "State parameter is required",
      });
    });

    it("should return empty array when state has no zones", async () => {
      mockReq.query.state = "NonexistentState";
      mockManager.getZones.mockResolvedValue([]);

      await controller.getZones(mockReq, mockRes);

      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        data: [],
      });
    });
  });
});
