const UserManager = require("../../../managers/user.manager");
const UserDao = require("../../../dao/user.dao");
const School = require("../../../models/school.model");

jest.mock("../../../dao/user.dao");
jest.mock("../../../dao/school.dao");
jest.mock("../../../dao/school.class.dao");
jest.mock("../../../models/school.model");

describe("UserManager profile access", () => {
  const user = {
    _id: "user-1",
    profiles: { teacher: {} },
    roles: [{ role: { scopeType: "SCHOOL" }, dep: "school-1" }],
  };
  const grants = [{ permission: "profile.view", scopeType: "SCHOOL", dep: "school-1" }];
  let manager;

  beforeEach(() => {
    jest.clearAllMocks();
    UserDao.mockImplementation(() => ({ getById: jest.fn().mockResolvedValue(user) }));
    School.findById.mockReturnValue({ lean: jest.fn().mockResolvedValue({ _id: "school-1" }) });
    manager = new UserManager();
  });

  it("allows profile.view for the authenticated user", async () => {
    await expect(manager.getById("user-1", grants, "user-1")).resolves.toMatchObject({ success: true });
  });

  it("does not use profile.view to read another teacher", async () => {
    await expect(manager.getById("user-1", grants, "user-2")).resolves.toMatchObject({ success: false });
  });
});
