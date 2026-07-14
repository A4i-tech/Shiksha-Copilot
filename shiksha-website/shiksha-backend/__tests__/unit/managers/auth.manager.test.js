const mockUserDao = {
  getByPhone: jest.fn(),
  update: jest.fn(),
  reserveLoginAttempt: jest.fn(),
  clearLoginAttempts: jest.fn(),
  setRecovery: jest.fn(),
  reserveRecoveryAttempt: jest.fn(),
  clearRecovery: jest.fn(),
};
const mockAdminDao = {
  getByPhone: jest.fn(),
  update: jest.fn(),
  reserveLoginAttempt: jest.fn(),
  clearLoginAttempts: jest.fn(),
  setRecovery: jest.fn(),
  reserveRecoveryAttempt: jest.fn(),
  clearRecovery: jest.fn(),
};
process.env.JWT_SECRET = "test-secret";

jest.mock("../../../dao/user.dao", () => jest.fn(() => mockUserDao));
jest.mock("../../../dao/admin.user.dao", () => jest.fn(() => mockAdminDao));
jest.mock("../../../models/user.action.logs.model", () => ({ create: jest.fn() }));
jest.mock("../../../helper/profile.helper", () => ({ refreshProfileImageIfExpired: jest.fn() }));
jest.mock("../../../helper/auth.helper", () => ({
  captchaEnabled: true,
  validateCaptcha: jest.fn(),
  getOtp: jest.fn(() => "1234"),
  sendOtp: jest.fn(),
}));
jest.mock("jsonwebtoken", () => ({ sign: jest.fn(() => "signed-token") }));
jest.mock("crypto-js", () => ({
  AES: {
    decrypt: jest.fn(() => ({ toString: jest.fn(() => "1234") })),
    encrypt: jest.fn(() => ({ toString: jest.fn(() => "encrypted-pin") })),
  },
  enc: { Utf8: "utf8" },
}));

const jwt = require("jsonwebtoken");
const authHelper = require("../../../helper/auth.helper");
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
    process.env.PIN_WRONG_DELAY_SECONDS = "0";
    mockUserDao.update.mockResolvedValue({});
    mockAdminDao.update.mockResolvedValue({});
    mockUserDao.reserveLoginAttempt.mockResolvedValue({ loginAttempts: [new Date()] });
    mockAdminDao.reserveLoginAttempt.mockResolvedValue({ loginAttempts: [new Date()] });
    mockUserDao.clearLoginAttempts.mockResolvedValue({});
    mockAdminDao.clearLoginAttempts.mockResolvedValue({});
    mockUserDao.reserveRecoveryAttempt.mockResolvedValue({ recovery: { attempts: 1 } });
    mockAdminDao.reserveRecoveryAttempt.mockResolvedValue({ recovery: { attempts: 1 } });
    mockUserDao.clearRecovery.mockResolvedValue({});
    mockAdminDao.clearRecovery.mockResolvedValue({});
    authHelper.captchaEnabled = true;
    authHelper.validateCaptcha.mockResolvedValue(true);
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

  it("temporarily locks after the third failed attempt", async () => {
    mockUserDao.getByPhone.mockResolvedValue(teacher({ loginAttempts: [new Date(), new Date()] }));
    mockAdminDao.getByPhone.mockResolvedValue(false);
    mockUserDao.reserveLoginAttempt.mockResolvedValue({ loginAttempts: [new Date(), new Date(), new Date()] });

    const result = await manager.validateOtp({ body: { phone: "9876543210", otp: "9999" } });

    expect(result.code).toBe("LOGIN_LOCKED");
  });

  it("rejects the fourth attempt without a valid CAPTCHA", async () => {
    const attempts = Array(3).fill(new Date(Date.now() - 5 * 60 * 1000 - 1));
    mockUserDao.getByPhone.mockResolvedValue(teacher({ loginAttempts: attempts }));
    mockAdminDao.getByPhone.mockResolvedValue(false);
    authHelper.validateCaptcha.mockResolvedValue(false);

    const result = await manager.validateOtp({ body: { phone: "9876543210", otp: "1234" } });

    expect(result.code).toBe("CAPTCHA_REQUIRED");
    expect(mockUserDao.reserveLoginAttempt).not.toHaveBeenCalled();
    expect(jwt.sign).not.toHaveBeenCalled();
  });

  it("locks indefinitely on the sixth failed attempt", async () => {
    const attempts = Array(5).fill(new Date());
    mockUserDao.getByPhone.mockResolvedValue(teacher({ loginAttempts: attempts }));
    mockAdminDao.getByPhone.mockResolvedValue(false);
    mockUserDao.reserveLoginAttempt.mockResolvedValue({ loginAttempts: [...attempts, new Date()] });

    const result = await manager.validateOtp({
      body: { phone: "9876543210", otp: "9999", captchaToken: "valid" },
    });

    expect(result.code).toBe("LOGIN_LOCKED");
  });

  it("rejects a correct PIN after permanent lock", async () => {
    mockUserDao.getByPhone.mockResolvedValue(teacher({ loginAttempts: Array(6).fill(new Date()) }));
    mockAdminDao.getByPhone.mockResolvedValue(false);

    const result = await manager.validateOtp({ body: { phone: "9876543210", otp: "1234" } });

    expect(result.code).toBe("LOGIN_LOCKED");
    expect(mockUserDao.reserveLoginAttempt).not.toHaveBeenCalled();
    expect(jwt.sign).not.toHaveBeenCalled();
  });

  it("skips CAPTCHA when it is not configured", async () => {
    authHelper.captchaEnabled = false;
    mockUserDao.getByPhone.mockResolvedValue(teacher({ loginAttempts: Array(3).fill(new Date(Date.now() - 5 * 60 * 1000 - 1)) }));
    mockAdminDao.getByPhone.mockResolvedValue(false);
    mockUserDao.reserveLoginAttempt.mockResolvedValue({ loginAttempts: Array(4).fill(new Date()) });

    const result = await manager.validateOtp({ body: { phone: "9876543210", otp: "9999" } });

    expect(result.message).toBe("Invalid PIN");
    expect(authHelper.validateCaptcha).not.toHaveBeenCalled();
  });

  it("promotes a pending PIN to permanent only after successful entry", async () => {
    const recovery = { otp: "encrypted-pin", expiresAt: new Date(Date.now() + 60_000), attempts: 0, sentAt: new Date() };
    mockUserDao.getByPhone.mockResolvedValue(teacher({ loginAttempts: Array(6).fill(new Date()), otp: "old-pin", recovery }));
    mockAdminDao.getByPhone.mockResolvedValue(false);

    const result = await manager.validateOtp({
      body: { phone: "9876543210", otp: "1234", recovery: true }, useragent: {},
    });

    expect(result.success).toBe(true);
    expect(result.data.pin).toBeUndefined();
    expect(mockUserDao.reserveRecoveryAttempt).toHaveBeenCalledWith("teacher-1");
    expect(mockUserDao.update).toHaveBeenCalledWith("teacher-1", { otp: "encrypted-pin" });
    expect(mockUserDao.clearLoginAttempts).toHaveBeenCalledWith("teacher-1");
    expect(mockUserDao.clearRecovery).toHaveBeenCalledWith("teacher-1");
  });

  it("rejects recovery validation when the atomic attempt limit is exhausted", async () => {
    mockUserDao.getByPhone.mockResolvedValue(teacher({
      recovery: { otp: "encrypted-pin", expiresAt: new Date(Date.now() + 60_000), attempts: 3 },
    }));
    mockAdminDao.getByPhone.mockResolvedValue(false);
    mockUserDao.reserveRecoveryAttempt.mockResolvedValue(null);

    const result = await manager.validateOtp({ body: { phone: "9876543210", otp: "1234", recovery: true } });

    expect(result.code).toBe("RECOVERY_LOCKED");
  });

  it("sends a pending PIN on forgot without overwriting the permanent PIN", async () => {
    mockUserDao.getByPhone.mockResolvedValue(teacher({ otp: "existing-encrypted" }));
    mockAdminDao.getByPhone.mockResolvedValue(false);

    const result = await manager.getOtp({ body: { phone: "9876543210", forgotPassword: true } });

    expect(result.data.recoveryTriggered).toBe(true);
    expect(mockUserDao.setRecovery).toHaveBeenCalledWith("teacher-1", expect.objectContaining({ attempts: 0 }));
    expect(mockUserDao.update).not.toHaveBeenCalledWith("teacher-1", expect.objectContaining({ otp: expect.anything() }));
  });

  it("sends first-time PIN as pending too", async () => {
    mockUserDao.getByPhone.mockResolvedValue(teacher({ otp: undefined, rememberMeToken: false }));
    mockAdminDao.getByPhone.mockResolvedValue(false);

    const result = await manager.getOtp({ body: { phone: "9876543210" } });

    expect(result.data.recoveryTriggered).toBe(true);
    expect(mockUserDao.setRecovery).toHaveBeenCalled();
    expect(mockUserDao.update).not.toHaveBeenCalledWith("teacher-1", expect.objectContaining({ otp: expect.anything() }));
  });

  it("enforces resend cooldown for forgot PIN", async () => {
    const recovery = { otp: "encrypted-pin", expiresAt: new Date(Date.now() + 60_000), sentAt: new Date() };
    mockUserDao.getByPhone.mockResolvedValue(teacher({ recovery }));
    mockAdminDao.getByPhone.mockResolvedValue(false);

    const result = await manager.getOtp({ body: { phone: "9876543210", forgotPassword: true } });

    expect(result.code).toBe("PIN_COOLDOWN");
    expect(authHelper.sendOtp).not.toHaveBeenCalled();
  });

});
