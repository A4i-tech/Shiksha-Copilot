const mockUserDao = { getByPhone: jest.fn(), update: jest.fn() };
const mockAdminDao = { getByPhone: jest.fn(), update: jest.fn() };
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
const teacher = () => doc({ _id: "teacher-1", name: "Teacher", phone: "9876543210", role: ["power"], otp: "encrypted-pin", isDeleted: false });
const admin = () => doc({ _id: "admin-1", name: "Admin", phone: "9876543210", role: ["admin"], zones: ["Zone A"], districts: ["District A"], state: "State A", isDeleted: false });

describe("AuthManager dual-role login", () => {
  let manager;

  beforeEach(() => {
    jest.clearAllMocks();
    process.env.PIN_SECRET_KEY = "pin-secret";
    process.env.VARIFORM_SMS_TEMPLATE = "template";
    mockUserDao.update.mockResolvedValue({});
    mockAdminDao.update.mockResolvedValue({});
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
  });

  it("keeps merged roles when refreshing the user from token", async () => {
    const result = await manager.getUserFromToken({ teacherUser: teacher(), adminUser: admin() });

    expect(result.data).toEqual(expect.objectContaining({
      role: ["power", "admin"],
      userId: "teacher-1",
      adminUserId: "admin-1",
    }));
  });
});
