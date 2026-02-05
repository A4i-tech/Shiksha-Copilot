const RegionManager = require("../../../managers/region.manager");
const RegionDao = require("../../../dao/region.dao");

// Mock the DAO
jest.mock("../../../dao/region.dao");

describe("RegionManager", () => {
  let manager;
  let mockRegionDao;

  beforeEach(() => {
    jest.clearAllMocks();
    mockRegionDao = new RegionDao();
    manager = new RegionManager();
    manager.dao = mockRegionDao;
  });

  describe("Instance creation", () => {
    it("should create an instance of RegionManager", () => {
      expect(manager).toBeInstanceOf(RegionManager);
    });

    it("should have a dao property", () => {
      expect(manager.dao).toBeDefined();
    });
  });

  describe("getStates", () => {
    it("should successfully retrieve unique states", async () => {
      const mockRegions = [
        { _id: "1", state: "State1" },
        { _id: "2", state: "State2" },
        { _id: "3", state: "State1" },
      ];
      mockRegionDao.getAll.mockResolvedValue(mockRegions);

      const result = await manager.getStates();

      expect(mockRegionDao.getAll).toHaveBeenCalled();
      expect(result).toEqual(["State1", "State2"]);
    });

    it("should return empty array when no regions exist", async () => {
      mockRegionDao.getAll.mockResolvedValue([]);

      const result = await manager.getStates();

      expect(result).toEqual([]);
    });
  });

  describe("getZones", () => {
    it("should successfully retrieve zones for a state", async () => {
      const mockRegions = [
        { _id: "1", state: "State1", zones: ["Zone1", "Zone2"] },
        { _id: "2", state: "State2", zones: ["Zone3"] },
      ];
      mockRegionDao.getAll.mockResolvedValue(mockRegions);

      const result = await manager.getZones("State1");

      expect(result).toEqual(["Zone1", "Zone2"]);
    });

    it("should return empty array when state is not found", async () => {
      mockRegionDao.getAll.mockResolvedValue([]);

      const result = await manager.getZones("NonexistentState");

      expect(result).toEqual([]);
    });
  });
});
