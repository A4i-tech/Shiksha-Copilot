const ChapterController = require("../../../controllers/chapter.controller");
const ChapterManager = require("../../../managers/chapter.manager");

// Mock dependencies
jest.mock("../../../managers/chapter.manager");

describe("ChapterController", () => {
  let controller;
  let mockReq;
  let mockRes;
  let mockManager;

  beforeEach(() => {
    jest.clearAllMocks();

    controller = new ChapterController();
    mockManager = new ChapterManager();
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
    it("should create an instance of ChapterController", () => {
      expect(controller).toBeInstanceOf(ChapterController);
    });

    it("should have a manager property", () => {
      expect(controller.manager).toBeDefined();
    });
  });
});
