const builtinRoles = require("../../../config/builtin_roles.json");
const { isPermissionAllowed } = require("../../../helper/permission.helper");
const { CONTENT_CURATOR_ROLE_ID } = require("../../../constants/content-status");

describe("Content Curator builtin role", () => {
  const curator = builtinRoles.find((role) => role.name === "Content Curator");

  it("uses the fixed role id and the GLOBAL scope", () => {
    expect(curator).toMatchObject({ _id: "7368696b7368615f63637572", scopeType: "GLOBAL", isSystem: true });
    expect(curator._id).toBe(CONTENT_CURATOR_ROLE_ID);
  });

  it("holds only content.curate and content.view, so no unscoped generate or edit route is open to it", () => {
    expect(curator.permissions).toEqual(["content.curate", "content.view"]);
  });

  it("holds only permissions the GLOBAL scope allows", () => {
    expect(curator.permissions.filter((permission) => !isPermissionAllowed(permission, "GLOBAL"))).toEqual([]);
  });

  it("holds no admin content permission, so it cannot reach the admin routes or approve", () => {
    expect(curator.permissions).not.toContain("admin.ingest");
    expect(curator.permissions).not.toContain("content.manage");
  });

  it("is the only builtin role with that id", () => {
    expect(builtinRoles.filter((role) => role._id === curator._id)).toHaveLength(1);
  });
});
