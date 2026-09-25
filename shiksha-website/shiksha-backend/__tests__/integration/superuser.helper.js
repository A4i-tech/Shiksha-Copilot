const request = require("supertest");

const baseURL = process.env.SHIKSHA_BASE_URL;
if (!baseURL) {
  throw new Error(
    "SHIKSHA_BASE_URL is not set. These are E2E tests - they run against a " +
      "live staging deployment (see .github/workflows/main.yaml's staging-e2e job)."
  );
}

const superUserPhone = process.env.SHIKSHA_SU_PHONE;
const superUserPin = process.env.SHIKSHA_SU_PIN;
if (!superUserPhone || !superUserPin) {
  throw new Error(
    "SHIKSHA_SU_PHONE / SHIKSHA_SU_PIN are not set. These tests log in as a " +
      "pre-seeded super-user account on staging - see .github/workflows/main.yaml."
  );
}

let cachedSuperUser = null;
async function loginAsSuperUser() {
  if (cachedSuperUser) return cachedSuperUser;

  // Static-PIN accounts skip the SMS-OTP step — validate-otp works directly.
  // Calling get-otp first would trigger the SMS path if otp is missing, and
  // hitting it within PIN_RESEND_COOLDOWN_SECONDS returns 429 PIN_COOLDOWN.
  const verifyRes = await request(baseURL)
    .post("/api/auth/validate-otp")
    .send({ phone: superUserPhone, otp: superUserPin });
  if (!verifyRes.body.success) {
    throw new Error(`validate-otp failed for ${superUserPhone}: ${JSON.stringify(verifyRes.body)}`);
  }

  cachedSuperUser = { token: verifyRes.body.data.token, user: verifyRes.body.data.user };
  return cachedSuperUser;
}

/**
 * Creates a disposable teacher user with a SCHOOL-scoped role carrying the
 * given permissions, then returns a JWT via /api/devtools/sessions (no OTP).
 * Call cleanupEphemeralTeacher() in afterAll.
 */
async function createEphemeralTeacher(rootToken, permissions) {
  const schoolsRes = await request(baseURL)
    .get("/api/school/list?limit=1&includeDeleted=0")
    .set("Authorization", rootToken);
  if (!schoolsRes.body.success) {
    throw new Error(`school/list failed: ${JSON.stringify(schoolsRes.body)}`);
  }
  const school = schoolsRes.body.data.results[0];
  if (!school) throw new Error("No school found in staging - cannot create ephemeral teacher");

  const suffix = Date.now();

  const roleRes = await request(baseURL)
    .post("/api/roles")
    .set("Authorization", rootToken)
    .send({
      name: `E2E Teacher Role ${suffix}`,
      description: "Ephemeral E2E test fixture - safe to delete",
      permissions,
      scopeType: "SCHOOL",
    });
  if (!roleRes.body.success) {
    throw new Error(`createRole failed: ${JSON.stringify(roleRes.body)}`);
  }
  const role = roleRes.body.data;

  const phone = `6${String(suffix).slice(-9)}`;
  const userRes = await request(baseURL)
    .post("/api/users")
    .set("Authorization", rootToken)
    .send({
      identity: { name: "E2E Ephemeral Teacher", phone, email: "", address: "" },
      roles: [{ roleId: role._id, dep: school._id }],
      profiles: { teacher: { facilities: [], classes: [{ class: 6, medium: "English" }], isProfileCompleted: true } },
    });
  if (!userRes.body.success) {
    throw new Error(`createUser failed: ${JSON.stringify(userRes.body)}`);
  }
  const user = userRes.body.data;

  const sessionRes = await request(baseURL)
    .post("/api/devtools/sessions")
    .set("Authorization", rootToken)
    .send({ userId: user._id });
  if (!sessionRes.body.success) {
    throw new Error(`devtools/sessions failed: ${JSON.stringify(sessionRes.body)}`);
  }

  return { token: sessionRes.body.data.token, userId: user._id, roleId: role._id };
}

async function cleanupEphemeralTeacher(rootToken, { userId, roleId, content = [], activities = [] }) {
  await request(baseURL)
    .delete("/api/devtools/fixtures")
    .set("Authorization", rootToken)
    .send({ users: [userId], roles: [roleId], content, activities, schools: [], classes: [], auditLogs: [], batches: [] });
}

module.exports = {
  baseURL,
  superUserPhone,
  superUserPin,
  loginAsSuperUser,
  createEphemeralTeacher,
  cleanupEphemeralTeacher,
};
