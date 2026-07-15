process.env.PIN_SECRET_KEY = process.env.PIN_SECRET_KEY || "test-pin-secret";

const CryptoJS = require("crypto-js");
const AuthManager = require("../../../managers/auth.manager");
const UserDao = require("../../../dao/user.dao");
const authHelper = require("../../../helper/auth.helper");
const { refreshProfileImageIfExpired } = require("../../../helper/profile.helper");
const UserAction = require("../../../models/user.action.logs.model");

jest.mock("../../../dao/user.dao");
jest.mock("../../../helper/auth.helper", () => ({
  captchaEnabled: false,
  getOtp: jest.fn(() => "9999"),
  sendOtp: jest.fn().mockResolvedValue(undefined),
  validateCaptcha: jest.fn().mockResolvedValue(true),
}));
jest.mock("../../../helper/profile.helper", () => ({
  refreshProfileImageIfExpired: jest.fn().mockResolvedValue(undefined),
}));
jest.mock("../../../models/user.action.logs.model", () => ({
  create: jest.fn().mockResolvedValue({}),
}));

describe("AuthManager", () => {
  let manager;

  beforeEach(() => {
    jest.clearAllMocks();
    manager = new AuthManager();
    authHelper.captchaEnabled = false;
  });

  function encrypt(value) {
    return CryptoJS.AES.encrypt(value, process.env.PIN_SECRET_KEY).toString();
  }

  function baseUser(overrides = {}) {
    return {
      _id: "user-1",
      identity: { name: "Teacher", phone: "9876543210" },
      otp: encrypt("1234"),
      loginAttempts: [],
      isDeleted: false,
      roles: [{ permissions: ["dashboard.teacher.view"] }],
      generateAuthToken: jest.fn().mockReturnValue("jwt-token"),
      toObject() {
        const { generateAuthToken, toObject, roles, ...rest } = this;
        return { ...rest };
      },
      ...overrides,
    };
  }

  it("rejects validateOtp when account is missing", async () => {
    manager.userDao.getByPhone.mockResolvedValue(null);
    const result = await manager.validateOtp({ body: { phone: "9876543210", otp: "1234" } });
    expect(result.success).toBe(false);
    expect(result.message).toMatch(/does not exist/i);
  });

  it("locks account after max failed attempts", async () => {
    manager.userDao.getByPhone.mockResolvedValue(
      baseUser({ loginAttempts: Array.from({ length: 6 }, () => new Date()) })
    );
    const result = await manager.validateOtp({ body: { phone: "9876543210", otp: "1234" } });
    expect(result.success).toBe(false);
    expect(result.code).toBe("LOGIN_LOCKED");
  });

  it("completes login with valid pin and returns permissions", async () => {
    const user = baseUser();
    manager.userDao.getByPhone.mockResolvedValue(user);
    manager.userDao.reserveLoginAttempt.mockResolvedValue({ loginAttempts: [] });
    manager.userDao.update.mockResolvedValue(user);
    manager.userDao.clearLoginAttempts.mockResolvedValue(undefined);
    manager.userDao.clearRecovery.mockResolvedValue(undefined);

    const result = await manager.validateOtp({
      body: { phone: "9876543210", otp: "1234" },
      useragent: {},
    });

    expect(result.success).toBe(true);
    expect(result.data.token).toBe("jwt-token");
    expect(result.data.permissions).toContain("dashboard.teacher.view");
    expect(UserAction.create).toHaveBeenCalled();
    expect(refreshProfileImageIfExpired).toHaveBeenCalled();
  });

  it("requires captcha after three failed attempts when captcha is enabled", async () => {
    authHelper.captchaEnabled = true;
    authHelper.validateCaptcha.mockResolvedValue(false);
    manager.userDao.getByPhone.mockResolvedValue(
      baseUser({
        loginAttempts: [
          new Date(Date.now() - 10 * 60 * 1000),
          new Date(Date.now() - 9 * 60 * 1000),
          new Date(Date.now() - 8 * 60 * 1000),
        ],
      })
    );

    const result = await manager.validateOtp({
      body: { phone: "9876543210", otp: "1234", captchaToken: "bad" },
    });

    expect(result.success).toBe(false);
    expect(result.code).toBe("CAPTCHA_REQUIRED");
  });

  it("promotes the verified recovery pin and completes login", async () => {
    const user = baseUser({
      recovery: {
        otp: encrypt("9999"),
        expiresAt: new Date(Date.now() + 60_000),
        attempts: 0,
      },
    });
    manager.userDao.getByPhone.mockResolvedValue(user);
    manager.userDao.reserveRecoveryAttempt.mockResolvedValue({ recovery: { attempts: 1 } });
    manager.userDao.update.mockResolvedValue(user);
    manager.userDao.clearLoginAttempts.mockResolvedValue(undefined);
    manager.userDao.clearRecovery.mockResolvedValue(undefined);

    const result = await manager.validateOtp({
      body: { phone: "9876543210", otp: "9999", recovery: true },
      useragent: {},
    });

    expect(result.success).toBe(true);
    expect(result.data.token).toBe("jwt-token");
    expect(manager.userDao.update).toHaveBeenCalledWith(user._id, { otp: user.recovery.otp });
  });

  it("rejects expired recovery pin", async () => {
    manager.userDao.getByPhone.mockResolvedValue(
      baseUser({
        recovery: {
          otp: encrypt("9999"),
          expiresAt: new Date(Date.now() - 1000),
          attempts: 0,
        },
      })
    );

    const result = await manager.validateOtp({
      body: { phone: "9876543210", otp: "9999", recovery: true },
    });

    expect(result.success).toBe(false);
    expect(result.message).toMatch(/expired/i);
  });
});
