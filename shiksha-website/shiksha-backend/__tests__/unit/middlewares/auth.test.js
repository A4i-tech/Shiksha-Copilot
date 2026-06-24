const jwt = require("jsonwebtoken");
const { isAuthenticated, isAdmin, isAdminOrManager } = require("../../../middlewares/auth");
const User = require("../../../models/user.model");
const AdminUser = require("../../../models/admin.user.model");

// Mock dependencies
jest.mock("jsonwebtoken");
jest.mock("../../../models/user.model");
jest.mock("../../../models/admin.user.model");

// Store original env
const originalEnv = process.env;

describe("Auth Middleware", () => {
  let mockReq;
  let mockRes;
  let mockNext;

  beforeEach(() => {
    jest.clearAllMocks();

    // Set JWT_SECRET for tests
    process.env.JWT_SECRET = "test-secret";

    mockReq = {
      headers: {},
      route: { path: "/api/test" },
      user: null,
      isAdmin: false
    };

    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };

    mockNext = jest.fn();
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  describe("isAuthenticated", () => {
    it("should return 401 when no authorization header", () => {
      isAuthenticated(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: "Access Denied"
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it("should return 401 when token verification fails", () => {
      mockReq.headers.authorization = "invalid-token";

      jwt.verify.mockImplementation((token, secret, callback) => {
        callback(new Error("Invalid token"), null);
      });

      isAuthenticated(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: "Session Expired! Please login again."
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it("should return 401 when user is deleted (from token)", async () => {
      mockReq.headers.authorization = "valid-token";

      jwt.verify.mockImplementation((token, secret, callback) => {
        callback(null, { _id: "user-123", isAdmin: false, isDeleted: true });
      });

      isAuthenticated(mockReq, mockRes, mockNext);

      // Wait for async operations
      await new Promise(resolve => setTimeout(resolve, 10));

      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: "Your account is inactive! Please activate your account to continue."
      });
    });

    it("should authenticate regular user successfully", async () => {
      mockReq.headers.authorization = "valid-token";

      const mockUser = {
        _id: "user-123",
        name: "Test User",
        isDeleted: false,
        isLoginAllowed: true,
        isProfileCompleted: true
      };

      const mockUserQuery = {
        populate: jest.fn().mockReturnThis(),
        select: jest.fn().mockResolvedValue(mockUser)
      };

      User.findById = jest.fn().mockReturnValue(mockUserQuery);

      jwt.verify.mockImplementation((token, secret, callback) => {
        callback(null, { _id: "user-123", isAdmin: false, isDeleted: false });
      });

      isAuthenticated(mockReq, mockRes, mockNext);

      // Wait for async operations
      await new Promise(resolve => setTimeout(resolve, 50));

      expect(User.findById).toHaveBeenCalledWith("user-123");
      expect(mockReq.user).toEqual(mockUser);
      expect(mockReq.isAdmin).toBe(false);
      expect(mockNext).toHaveBeenCalled();
    });

    it("should authenticate admin user successfully", async () => {
      mockReq.headers.authorization = "valid-token";

      const mockAdminUser = {
        _id: "admin-123",
        name: "Admin User",
        isDeleted: false,
        isLoginAllowed: true
      };

      const mockAdminQuery = {
        select: jest.fn().mockResolvedValue(mockAdminUser)
      };

      AdminUser.findById = jest.fn().mockReturnValue(mockAdminQuery);

      jwt.verify.mockImplementation((token, secret, callback) => {
        callback(null, { _id: "admin-123", isAdmin: true, isDeleted: false });
      });

      isAuthenticated(mockReq, mockRes, mockNext);

      // Wait for async operations
      await new Promise(resolve => setTimeout(resolve, 50));

      expect(AdminUser.findById).toHaveBeenCalledWith("admin-123");
      expect(mockReq.user).toEqual(mockAdminUser);
      expect(mockReq.isAdmin).toBe(true);
      expect(mockNext).toHaveBeenCalled();
    });

    it("should authenticate combined teacher and admin token with teacher as default user", async () => {
      mockReq.headers.authorization = "valid-token";

      const mockUser = { _id: "teacher-123", isDeleted: false, isLoginAllowed: true, isProfileCompleted: true, role: ["power"] };
      const mockAdminUser = { _id: "admin-123", isDeleted: false, isLoginAllowed: true, role: ["admin"] };

      User.findById = jest.fn().mockReturnValue({
        populate: jest.fn().mockReturnThis(),
        select: jest.fn().mockResolvedValue(mockUser)
      });
      AdminUser.findById = jest.fn().mockReturnValue({
        select: jest.fn().mockResolvedValue(mockAdminUser)
      });

      jwt.verify.mockImplementation((token, secret, callback) => {
        callback(null, {
          _id: "teacher-123",
          userId: "teacher-123",
          adminUserId: "admin-123",
          isAdmin: true,
          isDeleted: false
        });
      });

      isAuthenticated(mockReq, mockRes, mockNext);

      await new Promise(resolve => setTimeout(resolve, 50));

      expect(mockReq.user).toEqual(mockUser);
      expect(mockReq.teacherUser).toEqual(mockUser);
      expect(mockReq.adminUser).toEqual(mockAdminUser);
      expect(mockNext).toHaveBeenCalled();
    });

    it("should return 401 when user not found in database", async () => {
      mockReq.headers.authorization = "valid-token";

      const mockUserQuery = {
        populate: jest.fn().mockReturnThis(),
        select: jest.fn().mockResolvedValue(null)
      };

      User.findById = jest.fn().mockReturnValue(mockUserQuery);

      jwt.verify.mockImplementation((token, secret, callback) => {
        callback(null, { _id: "user-123", isAdmin: false, isDeleted: false });
      });

      isAuthenticated(mockReq, mockRes, mockNext);

      // Wait for async operations
      await new Promise(resolve => setTimeout(resolve, 50));

      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: "Account doesn't exist!"
      });
    });

    it("should return 401 when user is deleted in database", async () => {
      mockReq.headers.authorization = "valid-token";

      const mockUser = {
        _id: "user-123",
        isDeleted: true,
        isLoginAllowed: true
      };

      const mockUserQuery = {
        populate: jest.fn().mockReturnThis(),
        select: jest.fn().mockResolvedValue(mockUser)
      };

      User.findById = jest.fn().mockReturnValue(mockUserQuery);

      jwt.verify.mockImplementation((token, secret, callback) => {
        callback(null, { _id: "user-123", isAdmin: false, isDeleted: false });
      });

      isAuthenticated(mockReq, mockRes, mockNext);

      // Wait for async operations
      await new Promise(resolve => setTimeout(resolve, 50));

      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: "Your account is inactive!"
      });
    });

    it("should return 401 when login not allowed due to school change", async () => {
      mockReq.headers.authorization = "valid-token";

      const mockUser = {
        _id: "user-123",
        isDeleted: false,
        isLoginAllowed: false,
        isProfileCompleted: true
      };

      const mockUserQuery = {
        populate: jest.fn().mockReturnThis(),
        select: jest.fn().mockResolvedValue(mockUser)
      };

      User.findById = jest.fn().mockReturnValue(mockUserQuery);

      jwt.verify.mockImplementation((token, secret, callback) => {
        callback(null, { _id: "user-123", isAdmin: false, isDeleted: false });
      });

      isAuthenticated(mockReq, mockRes, mockNext);

      // Wait for async operations
      await new Promise(resolve => setTimeout(resolve, 50));

      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: "Account details updated by admin! Please login to continue"
      });
    });

    it("should return 401 with school change message when profile incomplete", async () => {
      mockReq.headers.authorization = "valid-token";

      const mockUser = {
        _id: "user-123",
        isDeleted: false,
        isLoginAllowed: false,
        isProfileCompleted: false
      };

      const mockUserQuery = {
        populate: jest.fn().mockReturnThis(),
        select: jest.fn().mockResolvedValue(mockUser)
      };

      User.findById = jest.fn().mockReturnValue(mockUserQuery);

      jwt.verify.mockImplementation((token, secret, callback) => {
        callback(null, { _id: "user-123", isAdmin: false, isDeleted: false });
      });

      isAuthenticated(mockReq, mockRes, mockNext);

      // Wait for async operations
      await new Promise(resolve => setTimeout(resolve, 50));

      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: "You have been assigned to a different school. Please login to continue"
      });
    });

    it("should allow set-profile route even when login not allowed", async () => {
      mockReq.headers.authorization = "valid-token";
      mockReq.route.path = "/set-profile";

      const mockUser = {
        _id: "user-123",
        isDeleted: false,
        isLoginAllowed: false,
        isProfileCompleted: false
      };

      const mockUserQuery = {
        populate: jest.fn().mockReturnThis(),
        select: jest.fn().mockResolvedValue(mockUser)
      };

      User.findById = jest.fn().mockReturnValue(mockUserQuery);

      jwt.verify.mockImplementation((token, secret, callback) => {
        callback(null, { _id: "user-123", isAdmin: false, isDeleted: false });
      });

      isAuthenticated(mockReq, mockRes, mockNext);

      // Wait for async operations
      await new Promise(resolve => setTimeout(resolve, 50));

      expect(mockNext).toHaveBeenCalled();
      expect(mockRes.status).not.toHaveBeenCalled();
    });

    it("should handle exceptions gracefully", () => {
      mockReq.headers.authorization = "valid-token";

      jwt.verify.mockImplementation(() => {
        throw new Error("Unexpected error");
      });

      isAuthenticated(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: "Something went wrong"
      });
    });
  });

  describe("isAdmin", () => {
    it("should allow access when user is admin", () => {
      mockReq.user = { role: ["admin"], isLoginAllowed: true };

      isAdmin(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalled();
      expect(mockRes.status).not.toHaveBeenCalled();
    });

    it("should deny access when user is not admin", () => {
      mockReq.user = { role: ["power"], isLoginAllowed: true };

      isAdmin(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: "Access Denied!"
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

  });

  describe("isAdminOrManager", () => {
    it("should switch to admin principal when available", () => {
      mockReq.user = { _id: "teacher-123", role: ["power"] };
      mockReq.adminUser = { _id: "admin-123", role: ["admin"], isLoginAllowed: true };

      isAdminOrManager(mockReq, mockRes, mockNext);

      expect(mockReq.user).toEqual(mockReq.adminUser);
      expect(mockNext).toHaveBeenCalled();
      expect(mockRes.status).not.toHaveBeenCalled();
    });

    it("should allow access when user is manager", () => {
      mockReq.user = { role: ["manager"], isLoginAllowed: true };

      isAdminOrManager(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalled();
      expect(mockRes.status).not.toHaveBeenCalled();
    });

    it("should deny access when user is neither admin nor manager", () => {
      mockReq.user = { role: ["teacher"], isLoginAllowed: true };

      isAdminOrManager(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: "Access Denied!"
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it("should deny access when user is not set", () => {
      mockReq.user = null;

      isAdminOrManager(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockNext).not.toHaveBeenCalled();
    });
  });
});
