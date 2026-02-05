const ClassManager = require("../../../managers/school.class.manager");
const ClassDao = require("../../../dao/school.class.dao");

jest.mock("../../../dao/school.class.dao");

describe("ClassManager", () => {
  let classManager;
  let mockClassDao;

  beforeEach(() => {
    mockClassDao = {
      getGroupClassesByBoard: jest.fn(),
      update: jest.fn(),
      create: jest.fn(),
      getById: jest.fn(),
      getAll: jest.fn(),
      delete: jest.fn(),
    };

    ClassDao.mockImplementation(() => mockClassDao);
    classManager = new ClassManager();
    jest.clearAllMocks();
  });

  describe("getGroupClassesByBoard", () => {
    it("should return grouped classes successfully", async () => {
      const mockClasses = [
        { _id: "class1", className: "Class 10" },
        { _id: "class2", className: "Class 9" },
      ];

      mockClassDao.getGroupClassesByBoard.mockResolvedValue(mockClasses);

      const result = await classManager.getGroupClassesByBoard("school1");

      expect(mockClassDao.getGroupClassesByBoard).toHaveBeenCalledWith(
        "school1"
      );
      expect(result).toEqual({
        success: true,
        message: "",
        data: mockClasses,
      });
    });

    it("should return error on exception", async () => {
      const error = new Error("Database error");

      mockClassDao.getGroupClassesByBoard.mockRejectedValue(error);

      const result = await classManager.getGroupClassesByBoard("school1");

      expect(result.success).toBe(false);
      expect(result.message).toBe("Database error");
    });
  });

  describe("updateClass", () => {
    it("should update class successfully", async () => {
      const updates = { className: "Class 10A" };
      const mockUpdatedClass = {
        _id: "class1",
        className: "Class 10A",
      };

      mockClassDao.update.mockResolvedValue(mockUpdatedClass);

      const result = await classManager.updateClass("class1", updates);

      expect(mockClassDao.update).toHaveBeenCalledWith("class1", updates);
      expect(result).toEqual({
        success: true,
        message: "",
        data: mockUpdatedClass,
      });
    });

    it("should return not found when class doesn't exist", async () => {
      const updates = { className: "Class 10A" };

      mockClassDao.update.mockResolvedValue(null);

      const result = await classManager.updateClass("nonexistent", updates);

      expect(result).toEqual({
        success: false,
        message: "Class not found",
        data: null,
      });
    });

    it("should return error on exception", async () => {
      const updates = { className: "Class 10A" };
      const error = new Error("Database error");

      mockClassDao.update.mockRejectedValue(error);

      const result = await classManager.updateClass("class1", updates);

      expect(result.success).toBe(false);
      expect(result.message).toBe("Database error");
    });
  });
});
