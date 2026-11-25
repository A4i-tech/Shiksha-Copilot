const UserManager = require("../../../managers/user.manager");
const UserDao = require("../../../dao/user.dao");
const Role = require("../../../models/role.model");
const AuditLog = require("../../../models/audit.log.model");
const ExcelJS = require("exceljs");
const User = require("../../../models/user.model");
const exportExcel = require("../../../helper/excel.export.helper");
const AppError = require("../../../helper/app.error");

jest.mock("../../../dao/user.dao");
jest.mock("../../../models/role.model");
jest.mock("../../../models/user.model");
jest.mock("../../../helper/excel.export.helper", () => jest.fn().mockResolvedValue("https://errors/log.xlsx"));
jest.mock("../../../models/audit.log.model");

const actor = { _id: "actor", identity: { name: "Admin" }, roles: [{ role: { isSuperUser: true } }] };
const scopedActor = { ...actor, roles: [{ role: { scopeType: "SCHOOL", permissions: [] }, dep: "other" }] };
const teacher = (id) => ({ _id: id, profiles: { teacher: {} }, roles: [{ _id: `a${id}`, role: { _id: "std" }, dep: `school${id}` }] });

describe("UserManager.bulkChangeRole", () => {
  let manager;
  let dao;

  beforeEach(() => {
    dao = { getById: jest.fn() };
    UserDao.mockImplementation(() => dao);
    manager = new UserManager();
    manager.update = jest.fn().mockResolvedValue({ success: true });
    Role.countDocuments.mockResolvedValue(1);
    AuditLog.create.mockResolvedValue({ _id: "audit" });
  });

  it("swaps the school role and audits the affected ids", async () => {
    dao.getById.mockResolvedValue(teacher("u1"));
    const result = await manager.bulkChangeRole([{ userId: "u1", roleId: "pwr" }], actor);
    expect(manager.update).toHaveBeenCalledWith("u1", { roles: [{ _id: "au1", roleId: "pwr", dep: "schoolu1" }] }, actor);
    expect(result).toMatchObject({ updated: 1, failed: [] });
    expect(AuditLog.create).toHaveBeenCalledWith(expect.objectContaining({ status: "success", metadata: expect.objectContaining({ affectedIds: ["u1"] }) }));
  });

  it("reports non-teachers and per-user errors without stopping the batch", async () => {
    dao.getById
      .mockResolvedValueOnce({ _id: "s1", profiles: { admin: {} }, roles: [] })
      .mockResolvedValueOnce(teacher("u2"))
      .mockResolvedValueOnce(teacher("u3"));
    manager.update.mockRejectedValueOnce(new AppError("User is not below your scope", 403)).mockResolvedValueOnce({ success: true });
    const result = await manager.bulkChangeRole([
      { userId: "s1", roleId: "pwr", row: 2 },
      { userId: "u2", roleId: "pwr", row: 3 },
      { userId: "u3", roleId: "pwr", row: 4 },
    ], actor);
    expect(result.updated).toBe(1);
    expect(result.failed.map((failure) => failure.row)).toEqual([2, 3]);
    expect(result.failed[1].message).toBe("User is not below your scope");
  });

  it("rejects a role that is not an active school role before touching any user", async () => {
    Role.countDocuments.mockResolvedValue(0);
    await expect(manager.bulkChangeRole([{ userId: "u1", roleId: "admin" }], actor)).rejects.toMatchObject({ statusCode: 400 });
    expect(Role.countDocuments).toHaveBeenCalledWith({ _id: { $in: ["admin"] }, scopeType: "SCHOOL", isDeleted: false });
    expect(dao.getById).not.toHaveBeenCalled();
  });

  it("records an unexpected error as a failed row and still writes the audit", async () => {
    dao.getById.mockResolvedValue(teacher("u1"));
    manager.update.mockRejectedValue(new Error("db down"));
    const result = await manager.bulkChangeRole([{ userId: "u1", roleId: "pwr" }], actor);
    expect(result.failed).toEqual([expect.objectContaining({ userId: "u1", message: expect.not.stringContaining("db down") })]);
    expect(AuditLog.create).toHaveBeenCalledWith(expect.objectContaining({ status: "failure" }));
  });

  it("gives an out-of-scope user and a missing user the same message", async () => {
    dao.getById.mockResolvedValueOnce(teacher("u1")).mockResolvedValueOnce(null);
    const result = await manager.bulkChangeRole([{ userId: "u1", roleId: "pwr", row: 2 }, { userId: "gone", roleId: "pwr", row: 3 }], scopedActor);
    expect(manager.update).not.toHaveBeenCalled();
    expect(result.failed.map((failure) => failure.message)).toEqual([expect.stringContaining("No user in your scope"), expect.stringContaining("No user in your scope")]);
    expect(result.failed[0].message).toBe(result.failed[1].message);
  });

  it("does not count a user who already has the role as updated", async () => {
    dao.getById.mockResolvedValue(teacher("u1"));
    const result = await manager.bulkChangeRole([{ userId: "u1", roleId: "std", row: 2 }], actor);
    expect(manager.update).not.toHaveBeenCalled();
    expect(result).toMatchObject({ updated: 0, failed: [expect.objectContaining({ row: 2 })] });
  });

  it("accepts exactly 500 users", async () => {
    dao.getById.mockResolvedValue(teacher("u1"));
    const pairs = Array.from({ length: 500 }, (_, i) => ({ userId: `u${i}`, roleId: "pwr" }));
    await expect(manager.bulkChangeRole(pairs, actor)).resolves.toMatchObject({ updated: 500 });
  });

  it("rejects more than 500 users before any work", async () => {
    const pairs = Array.from({ length: 501 }, (_, i) => ({ userId: `u${i}`, roleId: "pwr" }));
    await expect(manager.bulkChangeRole(pairs, actor)).rejects.toMatchObject({ statusCode: 400 });
    expect(dao.getById).not.toHaveBeenCalled();
  });
});

describe("UserManager.bulkChangeRoleImport", () => {
  let manager;

  const sheet = async (name, rows) => {
    const workbook = new ExcelJS.Workbook();
    workbook.addWorksheet(name).addRows(rows);
    return Buffer.from(await workbook.xlsx.writeBuffer());
  };

  beforeEach(() => {
    UserDao.mockImplementation(() => ({}));
    manager = new UserManager();
    manager.bulkChangeRole = jest.fn().mockResolvedValue({ updated: 1, failed: [], auditId: "audit" });
    Role.find.mockReturnValue({ select: jest.fn().mockResolvedValue([{ _id: "pwr", name: "Power Teacher" }]) });
    User.find.mockReturnValue({ select: () => ({ lean: jest.fn().mockResolvedValue([{ _id: "u1", identity: { phone: "9876543210" } }]) }) });
    AuditLog.create.mockResolvedValue({ _id: "audit" });
    AuditLog.findByIdAndUpdate.mockResolvedValue({});
  });

  it("rejects a wrong sheet name", async () => {
    const file = await sheet("teacher", [["phone", "role"]]);
    await expect(manager.bulkChangeRoleImport(file, actor)).rejects.toMatchObject({ statusCode: 400 });
  });

  it("keeps a valid row after an invalid row with the same phone", async () => {
    const file = await sheet("teacher-role", [["phone", "role"], ["9876543210", "Principal"], ["9876543210", "Power Teacher"]]);
    await manager.bulkChangeRoleImport(file, actor);
    expect(manager.bulkChangeRole).toHaveBeenCalledWith([{ row: 3, userId: "u1", roleId: "pwr" }], actor);
  });

  it("skips blank rows and names a missing phone or role in the error log", async () => {
    const file = await sheet("teacher-role", [["phone", "role"], [null, null], ["9876543210", null], [null, "Power Teacher"]]);
    await manager.bulkChangeRoleImport(file, actor);
    const [{ worksheets: [{ rows }] }] = exportExcel.mock.calls.at(-1);
    expect(rows).toEqual([
      { row: 3, message: "Role is missing. Enter a school role name such as Power Teacher." },
      { row: 4, message: "Phone is missing. Enter the teacher's phone number." },
    ]);
  });

  it("logs an error file and returns success false when every row is invalid", async () => {
    manager.bulkChangeRole.mockResolvedValue({ updated: 0, failed: [], auditId: "audit" });
    const file = await sheet("teacher-role", [["phone", "role"], ["9000000000", "Power Teacher"]]);
    const result = await manager.bulkChangeRoleImport(file, actor);
    expect(manager.bulkChangeRole).toHaveBeenCalledWith([], actor);
    expect(result).toMatchObject({ success: false, message: "Role change completed: 0 updated, 1 failed.", errorUrl: "https://errors/log.xlsx" });
  });

  it("applies valid rows and logs unknown role, unknown phone and duplicate rows", async () => {
    const file = await sheet("teacher-role", [
      ["phone", "role"],
      ["9876543210", "power teacher"],
      ["9876543210", "Power Teacher"],
      ["9000000000", "Power Teacher"],
      ["9876543210", "Principal"],
    ]);
    const result = await manager.bulkChangeRoleImport(file, actor);
    expect(manager.bulkChangeRole).toHaveBeenCalledWith([{ row: 2, userId: "u1", roleId: "pwr" }], actor);
    expect(result).toMatchObject({ success: true, errorUrl: "https://errors/log.xlsx", message: "Role change completed: 1 updated, 3 failed." });
    expect(AuditLog.findByIdAndUpdate).toHaveBeenCalledWith("audit", { logUrl: "https://errors/log.xlsx" });
  });

  it("accepts a phone typed with +91 and spaces", async () => {
    const file = await sheet("teacher-role", [["phone", "role"], ["+91 98765 43210", "Power Teacher"]]);
    await manager.bulkChangeRoleImport(file, actor);
    expect(manager.bulkChangeRole).toHaveBeenCalledWith([{ row: 2, userId: "u1", roleId: "pwr" }], actor);
  });

  it("rejects a file with more than 500 rows before any lookup", async () => {
    const rows = Array.from({ length: 501 }, (_, i) => [`98765${String(i).padStart(5, "0")}`, "Power Teacher"]);
    const file = await sheet("teacher-role", [["phone", "role"], ...rows]);
    User.find.mockClear();
    await expect(manager.bulkChangeRoleImport(file, actor)).rejects.toMatchObject({ statusCode: 400 });
    expect(User.find).not.toHaveBeenCalled();
  });
});
