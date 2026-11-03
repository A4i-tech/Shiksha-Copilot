// Temporary: deletes fixtures that the integration tests leaked on staging. Delete before merge.
const base = process.env.SHIKSHA_BASE_URL;
const dryRun = process.env.DRY_RUN !== "false";

const USER_NAME = "E2E Ephemeral Teacher";
const ROLE_PREFIX = "E2E Teacher Role ";
const ROLE_DESCRIPTION = "Ephemeral E2E test fixture - safe to delete";

async function call(path, method = "GET", token, body) {
  const res = await fetch(`${base}${path}`, {
    method,
    headers: { "content-type": "application/json", ...(token && { Authorization: token }) },
    body: body && JSON.stringify(body),
  });
  const json = await res.json();
  if (!json.success) throw new Error(`${method} ${path} failed: HTTP ${res.status} ${json.message ?? JSON.stringify(json.error)}`);
  return json.data;
}

async function main() {
  const login = await call("/api/auth/validate-otp", "POST", null, {
    phone: process.env.SHIKSHA_SU_PHONE,
    otp: process.env.SHIKSHA_SU_PIN,
  });
  const token = login.token;

  const users = (await call(`/api/users?filter[profileType]=teacher&search=${encodeURIComponent(USER_NAME)}&limit=500&includeDeleted=0`, "GET", token))
    .results.filter((user) => user.identity.name === USER_NAME);
  const allRoles = (await call("/api/roles?limit=500&includeDeleted=0", "GET", token)).results;
  const roles = allRoles.filter((role) => role.name.startsWith(ROLE_PREFIX) && role.description === ROLE_DESCRIPTION && !role.isSystem);

  console.log(`${dryRun ? "DRY RUN" : "DELETE"}: ${users.length} users named "${USER_NAME}", ${roles.length} roles named "${ROLE_PREFIX}*"`);
  users.forEach((user) => console.log(`user ${user._id} created ${user.createdAt}`));
  roles.forEach((role) => console.log(`role ${role._id} ${role.name}`));
  if (dryRun) return;

  // A role that a user still holds cannot be deleted, and a deleted user keeps its roles. Move each user to a spare role first.
  const spare = allRoles.find((role) => role.scopeType === "SCHOOL" && role.isSystem);
  if (!spare) throw new Error("No system role with SCHOOL scope found to move the users to");
  for (const user of users) {
    const dep = user.roles[0].dep?._id ?? user.roles[0].dep;
    await call(`/api/users/${user._id}`, "PUT", token, { roles: [{ roleId: spare._id, dep }] });
    await call(`/api/users/${user._id}`, "DELETE", token);
  }
  const failed = [];
  for (const role of roles) {
    await call(`/api/roles/${role._id}`, "DELETE", token).catch((error) => failed.push(error.message));
  }
  console.log(`deleted ${users.length} users and ${roles.length - failed.length} of ${roles.length} roles`);
  failed.forEach((message) => console.error(message));
  if (failed.length) process.exit(1);
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
