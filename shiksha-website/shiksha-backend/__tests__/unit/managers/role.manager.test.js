const RoleManager = require("../../../managers/role.manager");
const RoleDao = require("../../../dao/role.dao");
const User = require("../../../models/user.model");

jest.mock("../../../dao/role.dao");
jest.mock("../../../models/user.model");

describe("RoleManager assignment contracts", () => {
  let manager;
  let dao;

  beforeEach(() => {
    jest.clearAllMocks();
    dao = { getById: jest.fn(), delete: jest.fn(), Model: { findByIdAndUpdate: jest.fn() } };
    RoleDao.mockImplementation(() => dao);
    manager = new RoleManager();
  });

  it("rejects a scope change while the role is assigned", async () => {
    dao.getById.mockResolvedValue({ _id: "role-1", scopeType: "DISTRICT" });
    User.exists.mockResolvedValue(true);
    await expect(manager.update({ params: { id: "role-1" }, body: { scopeType: "SCHOOL" } })).resolves.toMatchObject({ success: false, message: "Assigned role scope cannot be changed" });
  });

  it("rejects deletion while the role is assigned", async () => {
    dao.getById.mockResolvedValue({ _id: "role-1", isSystem: false });
    User.exists.mockResolvedValue(true);
    await expect(manager.delete({ params: { id: "role-1" } })).resolves.toMatchObject({ success: false, message: "Assigned roles cannot be deleted" });
    expect(dao.delete).not.toHaveBeenCalled();
  });

  it("rejects deletion of a system role", async () => {
    dao.getById.mockResolvedValue({ _id: "role-1", isSystem: true });
    await expect(manager.delete({ params: { id: "role-1" } })).resolves.toMatchObject({ success: false, message: "System roles cannot be deleted" });
    expect(dao.delete).not.toHaveBeenCalled();
  });
});
