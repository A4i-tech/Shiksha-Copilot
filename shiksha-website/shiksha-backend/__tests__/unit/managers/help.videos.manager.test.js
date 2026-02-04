const HelpVideosManager = require("../../../managers/help.vidoes.manager");
const HelpVideosDao = require("../../../dao/help.videos.dao");
const BaseManager = require("../../../managers/base.manager");

jest.mock("../../../dao/help.videos.dao");

describe("HelpVideosManager", () => {
  let manager;
  let mockDao;

  beforeEach(() => {
    jest.clearAllMocks();

    HelpVideosDao.mockImplementation(() => ({
      create: jest.fn(),
      findById: jest.fn(),
      find: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    }));

    manager = new HelpVideosManager();
    mockDao = HelpVideosDao.mock.instances[0];
  });

  describe("constructor", () => {
    it("should create manager instance successfully", () => {
      expect(manager).toBeInstanceOf(HelpVideosManager);
      expect(manager).toBeInstanceOf(BaseManager);
    });

    it("should initialize with HelpVideosDao", () => {
      expect(HelpVideosDao).toHaveBeenCalled();
    });
  });

  describe("inheritance from BaseManager", () => {
    it("should have dao instance from BaseManager", () => {
      expect(manager.dao).toBeDefined();
    });

    it("should inherit BaseManager methods", () => {
      expect(typeof manager.create).toBe("function");
      expect(typeof manager.getById).toBe("function");
      expect(typeof manager.getAll).toBe("function");
    });
  });
});
