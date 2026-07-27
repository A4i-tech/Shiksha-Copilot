const MasterClassManager = require("../../../managers/master.class.manager");
const MasterClassDao = require("../../../dao/master.class.dao");

jest.mock("../../../dao/master.class.dao");

describe("MasterClassManager", () => {
  let masterClassManager;
  let mockMasterClassDao;

  beforeEach(() => {
    mockMasterClassDao = {
      update: jest.fn(),
      create: jest.fn(),
      getById: jest.fn(),
      getAll: jest.fn(),
      delete: jest.fn(),
    };

    MasterClassDao.mockImplementation(() => mockMasterClassDao);
    masterClassManager = new MasterClassManager();
    jest.clearAllMocks();
  });

  describe("updateClass", () => {
    it("should update class successfully", async () => {
      const mockUpdatedClass = {
        _id: "class1",
        className: "Class 10",
      };

      mockMasterClassDao.update.mockResolvedValue(mockUpdatedClass);

      const updates = { className: "Class 10" };
      const result = await masterClassManager.updateClass("class1", updates);

      expect(mockMasterClassDao.update).toHaveBeenCalledWith("class1", updates);
      expect(result).toEqual({
        success: true,
        message: "",
        data: mockUpdatedClass,
      });
    });

    it("should return not found when class doesn't exist", async () => {
      mockMasterClassDao.update.mockResolvedValue(null);

      const updates = { className: "Class 10" };
      const result = await masterClassManager.updateClass(
        "nonexistent",
        updates
      );

      expect(result).toEqual({
        success: false,
        message: "Class not found",
        data: null,
      });
    });

    it("should propagate errors instead of swallowing them", async () => {
      const error = new Error("Database error");
      mockMasterClassDao.update.mockRejectedValue(error);

      const updates = { className: "Class 10" };
      await expect(masterClassManager.updateClass("class1", updates)).rejects.toThrow("Database error");
    });
  });
});
