const { validateRoleCreate } = require("../../../validations/role.validation");
const { userSchema } = require("../../../validations/user.validation");

describe("role assignment API contracts", () => {
  it("requires a role scope type", () => {
    const req = { body: { name: "Custom", permissions: [] } };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn().mockReturnThis() };
    validateRoleCreate(req, res, jest.fn());
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it("accepts the API assignment shape", () => {
    const value = {
      identity: { name: "Teacher", phone: "9876543210" },
      roles: [{ roleId: "7368696b7368615f74636872", dep: "school-1" }],
      profiles: { teacher: {} },
    };
    expect(userSchema.validate(value).error).toBeUndefined();
  });

  it("rejects a stored role field at the API boundary", () => {
    const value = {
      identity: { name: "Teacher", phone: "9876543210" },
      roles: [{ role: "7368696b7368615f74636872", dep: "school-1" }],
      profiles: { teacher: {} },
    };
    expect(userSchema.validate(value).error).toBeDefined();
  });
});
