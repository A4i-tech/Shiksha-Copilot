const UserDao = require("../../../dao/user.dao");
const User = require("../../../models/user.model");

// Mock the model
jest.mock("../../../models/user.model");

describe("UserDao", () => {
  let dao;

  beforeEach(() => {
    jest.clearAllMocks();
    dao = new UserDao();
  });

  describe("Instance creation", () => {
    it("should create an instance of UserDao", () => {
      expect(dao).toBeInstanceOf(UserDao);
    });

    it("should have the Model property set to User", () => {
      expect(dao.Model).toBe(User);
    });
  });

  describe("getByPhone", () => {
    it("should successfully retrieve a user by phone", async () => {
      const mockUser = { _id: "1", phone: "1234567890", name: "Test User" };
      const mockPopulate = jest.fn().mockResolvedValue(mockUser);
      User.findOne.mockReturnValue({ populate: mockPopulate });

      const result = await dao.getByPhone("1234567890");

      expect(User.findOne).toHaveBeenCalledWith({ phone: "1234567890" });
      expect(mockPopulate).toHaveBeenCalledWith("school", "_id name");
      expect(result).toEqual(mockUser);
    });

    it("should return false when user is not found", async () => {
      const mockPopulate = jest.fn().mockResolvedValue(null);
      User.findOne.mockReturnValue({ populate: mockPopulate });

      const result = await dao.getByPhone("9999999999");

      expect(result).toBe(false);
    });
  });
});
