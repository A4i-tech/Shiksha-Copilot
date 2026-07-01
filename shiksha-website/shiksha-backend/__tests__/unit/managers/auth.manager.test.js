const mockUserDao = {
  getByPhone: jest.fn(),
  update: jest.fn(),
  reserveLoginAttempt: jest.fn(),
  clearLoginAttempts: jest.fn(),
};
const mockAdminDao = {
  getByPhone: jest.fn(),
  update: jest.fn(),
  reserveLoginAttempt: jest.fn(),
  clearLoginAttempts: jest.fn(),
};
process.env.JWT_SECRET = "test-secret";

jest.mock("../../../dao/user.dao", () => jest.fn(() => mockUserDao));
jest.mock("../../../dao/admin.user.dao", () => jest.fn(() => mockAdminDao));
jest.mock("../../../models/user.action.logs.model", () => ({ create: jest.fn() }));
jest.mock("../../../helper/profile.helper", () => ({ refreshProfileImageIfExpired: jest.fn() }));
jest.mock("jsonwebtoken", () => ({ sign: jest.fn(() => "signed-token") }));
jest.mock("crypto-js", () => ({
  AES: {
    decrypt: jest.fn(() => ({ toString: jest.fn(() => "1234") })),
    encrypt: jest.fn(() => ({ toString: jest.fn(() => "encrypted-pin") })),
  },
  enc: { Utf8: "utf8" },
}));

const jwt = require("jsonwebtoken");
const AuthManager = require("../../../managers/auth.manager");

const doc = (data) => ({ ...data, toObject: jest.fn(() => ({ ...data })) });
const teacher = (overrides = {}) => doc({ _id: "teacher-1", name: "Teacher", phone: "9876543210", role: ["power"], otp: "encrypted-pin", isDeleted: false, ...overrides });
const admin = (overrides = {}) => doc({ _id: "admin-1", name: "Admin", phone: "9876543210", role: ["admin"], zones: ["Zone A"], districts: ["District A"], state: "State A", isDeleted: false, ...overrides });

describe("AuthManager dual-role login", () => {
  let manager;

  beforeEach(() => {
    jest.clearAllMocks();
    process.env.PIN_SECRET_KEY = "pin-secret";
    process.env.VARIFORM_SMS_TEMPLATE = "template";
    mockUserDao.update.mockResolvedValue({});
    mockAdminDao.update.mockResolvedValue({});
    mockUserDao.reserveLoginAttempt.mockResolvedValue({ loginAttempts: [new Date()] });
    mockAdminDao.reserveLoginAttempt.mockResolvedValue({ loginAttempts: [new Date()] });
    mockUserDao.clearLoginAttempts.mockResolvedValue({});
    mockAdminDao.clearLoginAttempts.mockResolvedValue({});
    manager = new AuthManager();
  });

  it("returns merged roles and both token ids when validating a duplicate-phone account", async () => {
    mockUserDao.getByPhone.mockResolvedValue(teacher());
    mockAdminDao.getByPhone.mockResolvedValue(admin());

    const result = await manager.validateOtp({ body: { phone: "9876543210", otp: "1234" }, useragent: {} });

    expect(result.success).toBe(true);
    expect(result.data.user).toEqual(expect.objectContaining({
      role: ["power", "admin"],
      userId: "teacher-1",
      adminUserId: "admin-1",
      zones: ["Zone A"],
      districts: ["District A"],
    }));
    expect(jwt.sign).toHaveBeenCalledWith(
      expect.objectContaining({ _id: "teacher-1", userId: "teacher-1", adminUserId: "admin-1", isAdmin: true }),
      expect.any(String),
      { expiresIn: "7d" }
    );
    expect(mockUserDao.clearLoginAttempts).toHaveBeenCalledWith("teacher-1");
    expect(mockAdminDao.clearLoginAttempts).toHaveBeenCalledWith("admin-1");
  });

  it("does not fall back to admin OTP for duplicate-phone teacher accounts", async () => {
    mockUserDao.getByPhone.mockResolvedValue(teacher({ otp: undefined }));
    mockAdminDao.getByPhone.mockResolvedValue(admin());

    const result = await manager.validateOtp({ body: { phone: "9876543210", otp: "1234" } });

    expect(result).toEqual(expect.objectContaining({ success: false, message: "PIN not found" }));
    expect(jwt.sign).not.toHaveBeenCalled();
  });

  it("keeps merged roles when refreshing the user from token", async () => {
    const result = await manager.getUserFromToken({
      teacherUser: teacher({ loginAttempts: [new Date()] }),
      adminUser: admin({ loginAttempts: [new Date()] }),
    });

    expect(result.data).toEqual(expect.objectContaining({
      role: ["power", "admin"],
      userId: "teacher-1",
      adminUserId: "admin-1",
    }));
    expect(result.data.loginAttempts).toBeUndefined();
  });

  it("returns invalid PIN for the first two failed attempts", async () => {
    mockUserDao.getByPhone.mockResolvedValue(teacher({ loginAttempts: [new Date()] }));
    mockAdminDao.getByPhone.mockResolvedValue(false);
    mockUserDao.reserveLoginAttempt.mockResolvedValue({ loginAttempts: [new Date(), new Date()] });

    const result = await manager.validateOtp({ body: { phone: "9876543210", otp: "9999" } });

    expect(result).toEqual({ success: false, message: "Invalid PIN", data: null });
  });

  it("locks immediately on the third failed attempt", async () => {
    mockUserDao.getByPhone.mockResolvedValue(teacher({ loginAttempts: [new Date(), new Date()] }));
    mockAdminDao.getByPhone.mockResolvedValue(false);
    mockUserDao.reserveLoginAttempt.mockResolvedValue({ loginAttempts: [new Date(), new Date(), new Date()] });

    const result = await manager.validateOtp({ body: { phone: "9876543210", otp: "9999" } });

    expect(result).toEqual(expect.objectContaining({
      success: false,
      code: "LOGIN_LOCKED",
      data: { retryAfterSeconds: 300 },
    }));
  });

  it("rejects attempts during the lock without reserving another attempt", async () => {
    const attempts = [new Date(), new Date(), new Date(Date.now() - 60_000)];
    mockUserDao.getByPhone.mockResolvedValue(teacher({ loginAttempts: attempts }));
    mockAdminDao.getByPhone.mockResolvedValue(false);

    const result = await manager.validateOtp({ body: { phone: "9876543210", otp: "1234" } });

    expect(result.code).toBe("LOGIN_LOCKED");
    expect(result.data.retryAfterSeconds).toBeGreaterThanOrEqual(239);
    expect(result.data.retryAfterSeconds).toBeLessThanOrEqual(240);
    expect(mockUserDao.reserveLoginAttempt).not.toHaveBeenCalled();
    expect(jwt.sign).not.toHaveBeenCalled();
  });

  it("clears an expired lock before recording a new failed attempt", async () => {
    const expired = new Date(Date.now() - 5 * 60_000 - 1);
    mockUserDao.getByPhone.mockResolvedValue(teacher({ loginAttempts: [expired, expired, expired] }));
    mockAdminDao.getByPhone.mockResolvedValue(false);
    mockUserDao.reserveLoginAttempt.mockResolvedValue({ loginAttempts: [new Date()] });

    const result = await manager.validateOtp({ body: { phone: "9876543210", otp: "9999" } });

    expect(mockUserDao.clearLoginAttempts).toHaveBeenCalledWith("teacher-1");
    expect(result.message).toBe("Invalid PIN");
  });

});
