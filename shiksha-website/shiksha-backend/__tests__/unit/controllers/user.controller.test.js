const UserController = require("../../../controllers/user.controller");
const UserManager = require("../../../managers/user.manager");

// Mock dependencies
jest.mock("../../../managers/user.manager");

describe("UserController", () => {
  let controller;
  let mockReq;
  let mockRes;
  let mockManager;

  beforeEach(() => {
    jest.clearAllMocks();

    controller = new UserController();
    mockManager = new UserManager();
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
    it("should create an instance of UserController", () => {
      expect(controller).toBeInstanceOf(UserController);
    });

    it("should have a manager property", () => {
      expect(controller.manager).toBeDefined();
    });
  });
});
