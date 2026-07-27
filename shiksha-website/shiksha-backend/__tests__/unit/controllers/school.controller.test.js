const SchoolController = require("../../../controllers/school.controller");
const SchoolManager = require("../../../managers/school.manager");
const handleError = require("../../../helper/handleError");

// Mock dependencies
jest.mock("../../../managers/school.manager");
jest.mock("../../../helper/handleError");
jest.mock("../../../config/db", () => ({
  getConnection: jest.fn().mockResolvedValue({
    startSession: jest.fn().mockResolvedValue({
      startTransaction: jest.fn(),
      endSession: jest.fn(),
      abortTransaction: jest.fn(),
    }),
  }),
}));

describe("SchoolController", () => {
  let controller;
  let mockReq;
  let mockRes;
  let mockManager;

  beforeEach(() => {
    jest.clearAllMocks();

    controller = new SchoolController();
    mockManager = new SchoolManager();
    controller.manager = mockManager;

    mockReq = {
      params: {},
      body: {},
      query: {},
      user: { _id: "user-1", name: "Test User" },
      permissions: [],
      file: null,
    };

    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };

    handleError.mockImplementation((result, res) => {
      res.status(400).json(result);
    });
  });

  describe("Instance creation", () => {
    it("should create an instance of SchoolController", () => {
      expect(controller).toBeInstanceOf(SchoolController);
    });

    it("should have a schoolManager property", () => {
      expect(controller.manager).toBeDefined();
    });
  });

  describe("update", () => {
    it("should successfully update a school", async () => {
      const mockResult = {
        success: true,
        data: { _id: "1", name: "Updated School" },
      };
      mockReq.params.id = "1";
      mockReq.body = { name: "Updated School" };
      mockManager.update.mockResolvedValue(mockResult);

      await controller.update(mockReq, mockRes);

      expect(mockManager.update).toHaveBeenCalledWith("1", {
        name: "Updated School",
      }, mockReq.permissions);
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(mockResult);
    });

    it("should handle update failure", async () => {
      const mockResult = { success: false, message: "Update failed" };
      mockReq.params.id = "1";
      mockReq.body = { name: "Updated School" };
      mockManager.update.mockResolvedValue(mockResult);

      await controller.update(mockReq, mockRes);

      expect(handleError).toHaveBeenCalledWith(mockResult, mockRes);
    });

    it("should propagate errors instead of responding directly", async () => {
      const error = new Error("Database error");
      mockReq.params.id = "1";
      mockReq.body = { name: "Updated School" };
      mockManager.update.mockRejectedValue(error);

      await expect(controller.update(mockReq, mockRes)).rejects.toThrow("Database error");
      expect(mockRes.status).not.toHaveBeenCalled();
    });
  });
});
