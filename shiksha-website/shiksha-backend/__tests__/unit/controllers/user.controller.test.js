const UserController = require("../../../controllers/user.controller");
const UserManager = require("../../../managers/user.manager");
const handleError = require("../../../helper/handleError");

// Mock dependencies
jest.mock("../../../managers/user.manager");
jest.mock("../../../helper/handleError");

describe("UserController", () => {
  let controller;
  let mockReq;
  let mockRes;
  let mockUserManager;

  beforeEach(() => {
    jest.clearAllMocks();

    controller = new UserController();
    mockUserManager = UserManager.mock.instances[UserManager.mock.instances.length - 1];

    mockReq = {
      params: {},
      body: {},
      query: {},
      user: {
        _id: "user-123",
        identity: { name: "Test User", phone: "9876543210" },
        roles: [{ role: { isDeleted: false, isSuperUser: false } }],
        profiles: { admin: { zones: ["zone1", "zone2"], districts: ["dist1", "dist2"] } },
      },
      permissions: [],
      file: null
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

    it("should have a userManager property", () => {
      expect(controller.manager).toBeDefined();
    });
  });

  describe("getByPhone", () => {
    it("should return 200 with user data when phone exists", async () => {
      const mockResult = { success: true, data: { phone: "1234567890", name: "Test" } };
      mockUserManager.getByPhone = jest.fn().mockResolvedValue(mockResult);
      mockReq.body = { phone: "1234567890" };

      await controller.getByPhone(mockReq, mockRes);

      expect(mockUserManager.getByPhone).toHaveBeenCalledWith(mockReq);
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(mockResult);
    });

    it("should handle error when user not found", async () => {
      const mockResult = { success: false, message: "User not found" };
      mockUserManager.getByPhone = jest.fn().mockResolvedValue(mockResult);
      mockReq.body = { phone: "9999999999" };

      await controller.getByPhone(mockReq, mockRes);

      expect(handleError).toHaveBeenCalledWith(mockResult, mockRes);
    });

    it("should propagate errors instead of responding directly", async () => {
      const error = new Error("Database error");
      mockUserManager.getByPhone = jest.fn().mockRejectedValue(error);

      await expect(controller.getByPhone(mockReq, mockRes)).rejects.toThrow("Database error");
      expect(mockRes.status).not.toHaveBeenCalled();
    });
  });

  describe("update", () => {
    it("should update user successfully", async () => {
      const mockResult = { success: true, message: "User updated", data: { phone: "1234567890" } };
      mockUserManager.update = jest.fn().mockResolvedValue(mockResult);
      mockReq.params = { id: "user-123" };
      mockReq.body = { name: "Updated Name", phone: "1234567890" };

      await controller.update(mockReq, mockRes);

      expect(mockUserManager.update).toHaveBeenCalledWith("user-123", mockReq.body, mockReq.user);
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(mockResult);
    });

    it("should handle update failure", async () => {
      const mockResult = { success: false, message: "Update failed" };
      mockUserManager.update = jest.fn().mockResolvedValue(mockResult);
      mockReq.params = { id: "user-123" };

      await controller.update(mockReq, mockRes);

      expect(handleError).toHaveBeenCalledWith(mockResult, mockRes);
    });
  });

  describe("updatePreferredLanguage", () => {
    it("should update preferred language successfully", async () => {
      const mockResult = { success: true, message: "Language updated" };
      mockUserManager.updatePreferredLanguage = jest.fn().mockResolvedValue(mockResult);
      mockReq.body = { preferredLanguage: "en" };

      await controller.updatePreferredLanguage(mockReq, mockRes);

      expect(mockUserManager.updatePreferredLanguage).toHaveBeenCalledWith("user-123", "en");
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(mockResult);
    });
  });

  describe("bulkUpload", () => {
    it("should return error when file not provided", async () => {
      mockReq.file = null;

      await controller.bulkUpload(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({ error: "File not provided" });
    });

    it("should initiate bulk upload successfully", async () => {
      const mockResult = { success: true };
      mockUserManager.bulkUpload = jest.fn().mockResolvedValue(mockResult);
      mockReq.file = { buffer: Buffer.from("test") };

      await controller.bulkUpload(mockReq, mockRes);

      expect(mockUserManager.bulkUpload).toHaveBeenCalledWith(
        mockReq.file.buffer,
        "user-123",
        "Test User",
        mockReq.permissions
      );
      expect(mockRes.status).toHaveBeenCalledWith(200);
    });
  });

  describe("setProfile", () => {
    it("should set profile successfully", async () => {
      const mockResult = { success: true, message: "Profile set", data: {} };
      mockUserManager.setProfile = jest.fn().mockResolvedValue(mockResult);
      mockReq.body = { classes: ["class1", "class2"] };

      await controller.setProfile(mockReq, mockRes);

      expect(mockUserManager.setProfile).toHaveBeenCalledWith("user-123", mockReq.body);
      expect(mockRes.status).toHaveBeenCalledWith(200);
    });
  });

  describe("getUserWithSchoolId", () => {
    it("should get user with school id successfully", async () => {
      const mockResult = { success: true, data: { _id: "user-123", school: "school-1" } };
      mockUserManager.getById = jest.fn().mockResolvedValue(mockResult);
      mockReq.params = { id: "user-123" };

      await controller.getUserWithSchoolId(mockReq, mockRes);

      expect(mockUserManager.getById).toHaveBeenCalledWith("user-123", mockReq.permissions, "user-123");
      expect(mockRes.status).toHaveBeenCalledWith(200);
    });
  });

  describe("getProfile", () => {
    it("should get user profile successfully", async () => {
      const mockResult = { success: true, data: { name: "Test", classes: [] } };
      mockUserManager.getProfileById = jest.fn().mockResolvedValue(mockResult);
      mockReq.params = { id: "user-123" };

      await controller.getProfile(mockReq, mockRes);

      expect(mockUserManager.getProfileById).toHaveBeenCalledWith("user-123", mockReq.permissions, "user-123");
      expect(mockRes.status).toHaveBeenCalledWith(200);
    });
  });

  describe("uploadProfileImage", () => {
    it("should return error when no file uploaded", async () => {
      mockReq.file = {};

      await controller.uploadProfileImage(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: "No file uploaded"
      });
    });

    it("should upload profile image successfully", async () => {
      const mockResult = { success: true, message: "Image uploaded", data: {} };
      mockUserManager.uploadProfileImage = jest.fn().mockResolvedValue(mockResult);
      mockReq.file = { path: "/uploads/image.jpg" };

      await controller.uploadProfileImage(mockReq, mockRes);

      expect(mockUserManager.uploadProfileImage).toHaveBeenCalledWith("user-123", "/uploads/image.jpg");
      expect(mockRes.status).toHaveBeenCalledWith(200);
    });

    it("should propagate errors instead of responding directly", async () => {
      mockUserManager.uploadProfileImage = jest.fn().mockRejectedValue(new Error("Upload failed"));
      mockReq.file = { path: "/uploads/image.jpg" };

      await expect(controller.uploadProfileImage(mockReq, mockRes)).rejects.toThrow("Upload failed");
      expect(mockRes.status).not.toHaveBeenCalled();
    });
  });

  describe("removeProfileImage", () => {
    it("should remove profile image successfully", async () => {
      const mockResult = { success: true, message: "Image removed" };
      mockUserManager.removeProfileImage = jest.fn().mockResolvedValue(mockResult);

      await controller.removeProfileImage(mockReq, mockRes);

      expect(mockUserManager.removeProfileImage).toHaveBeenCalledWith("user-123");
      expect(mockRes.status).toHaveBeenCalledWith(200);
    });
  });

  describe("activate", () => {
    it("should activate user successfully", async () => {
      const mockResult = { success: true, message: "User activated" };
      mockUserManager.activate = jest.fn().mockResolvedValue(mockResult);
      mockReq.params = { id: "user-123" };

      await controller.activate(mockReq, mockRes);

      expect(mockUserManager.activate).toHaveBeenCalledWith("user-123", mockReq.permissions, false);
      expect(mockRes.status).toHaveBeenCalledWith(200);
    });
  });

  describe("deactivate", () => {
    it("should deactivate user successfully", async () => {
      const mockResult = { success: true, message: "User deactivated" };
      mockUserManager.deactivate = jest.fn().mockResolvedValue(mockResult);
      mockReq.params = { id: "user-123" };

      await controller.deactivate(mockReq, mockRes);

      expect(mockUserManager.deactivate).toHaveBeenCalledWith("user-123", mockReq.permissions, false);
      expect(mockRes.status).toHaveBeenCalledWith(200);
    });
  });

  describe("export", () => {
    it("should export users successfully", async () => {
      const mockResult = { success: true, message: "Export initiated" };
      mockUserManager.export = jest.fn().mockResolvedValue(mockResult);
      controller.manager = mockUserManager;

      await controller.export(mockReq, mockRes);

      expect(mockUserManager.export).toHaveBeenCalledWith(mockReq);
      expect(mockRes.status).toHaveBeenCalledWith(200);
    });
  });

  describe("activityLog", () => {
    it("should log activity successfully", async () => {
      const mockResult = { success: true, message: "Activity logged" };
      mockUserManager.activityLog = jest.fn().mockResolvedValue(mockResult);
      mockReq.body = { action: "login", timestamp: new Date() };

      await controller.activityLog(mockReq, mockRes);

      expect(mockUserManager.activityLog).toHaveBeenCalledWith(mockReq);
      expect(mockRes.status).toHaveBeenCalledWith(200);
    });
  });

  describe("getAll", () => {
    it("should get all users with default pagination", async () => {
      const mockResult = { success: true, data: { results: [], total: 0 } };
      mockUserManager.getAll = jest.fn().mockResolvedValue(mockResult);
      mockReq.query = {};

      await controller.getAll(mockReq, mockRes);

      expect(mockUserManager.getAll).toHaveBeenCalled();
      expect(mockRes.status).toHaveBeenCalledWith(200);
    });

    it("should get all users with custom filters", async () => {
      const mockResult = { success: true, data: { results: [], total: 0 } };
      mockUserManager.getAll = jest.fn().mockResolvedValue(mockResult);
      mockReq.query = {
        page: "2",
        limit: "20",
        filter: { role: "teacher", zone: "zone1" },
        search: "test"
      };

      await controller.getAll(mockReq, mockRes);

      expect(mockUserManager.getAll).toHaveBeenCalledWith(
        expect.objectContaining({
          page: 2,
          limit: 20,
          filters: expect.objectContaining({
            $and: expect.arrayContaining([
              expect.objectContaining({ role: "teacher", zone: "zone1" }),
              expect.objectContaining({
                $or: expect.arrayContaining([
                  expect.objectContaining({ "identity.name": expect.any(Object) })
                ])
              })
            ])
          }),
          sort: {},
          status: {},
          permissions: mockReq.permissions,
          permission: "user.view"
        })
      );
      expect(mockRes.status).toHaveBeenCalledWith(200);
    });

    it("should apply manager zone/district filters", async () => {
      const mockResult = { success: true, data: { results: [], total: 0 } };
      mockUserManager.getAll = jest.fn().mockResolvedValue(mockResult);
      mockReq.query = {
        filter: {
          zone: ["zone1", "zone2"],
          district: ["dist1", "dist2"]
        }
      };

      await controller.getAll(mockReq, mockRes);

      expect(mockUserManager.getAll).toHaveBeenCalledWith(
        expect.objectContaining({
          page: 1,
          limit: 10,
          filters: expect.objectContaining({
            zone: ["zone1", "zone2"],
            district: ["dist1", "dist2"]
          }),
          sort: {},
          status: {},
          permissions: mockReq.permissions,
          permission: "user.view"
        })
      );
    });

    it("should handle search filter with regex", async () => {
      const mockResult = { success: true, data: { results: [], total: 0 } };
      mockUserManager.getAll = jest.fn().mockResolvedValue(mockResult);
      mockReq.query = { search: "john" };

      await controller.getAll(mockReq, mockRes);

      expect(mockUserManager.getAll).toHaveBeenCalledWith(
        expect.objectContaining({
          page: 1,
          limit: 10,
          filters: expect.objectContaining({
            $or: expect.arrayContaining([
              { "identity.name": expect.objectContaining({ $regex: expect.any(RegExp) }) }
            ])
          }),
          sort: {},
          status: {},
          permissions: mockReq.permissions,
          permission: "user.view"
        })
      );
    });

    it("should handle includeDeleted filter", async () => {
      const mockResult = { success: true, data: { results: [], total: 0 } };
      mockUserManager.getAll = jest.fn().mockResolvedValue(mockResult);
      mockReq.query = { includeDeleted: "2" };

      await controller.getAll(mockReq, mockRes);

      expect(mockUserManager.getAll).toHaveBeenCalledWith(
        expect.objectContaining({
          page: 1,
          limit: 10,
          filters: expect.any(Object),
          sort: {},
          status: { isDeleted: true },
          permissions: mockReq.permissions,
          permission: "user.view"
        })
      );
    });

    it("should propagate errors instead of responding directly", async () => {
      const error = new Error("Database error");
      mockUserManager.getAll = jest.fn().mockRejectedValue(error);

      await expect(controller.getAll(mockReq, mockRes)).rejects.toThrow("Database error");
      expect(mockRes.status).not.toHaveBeenCalled();
    });
  });
});
