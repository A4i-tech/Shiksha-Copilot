// Shared login helpers for the staging E2E suite (see
// .github/workflows/main.yaml's staging-e2e job). Tests run against the
// real deployed staging backend - no direct DB access, no invented
// secrets. Both accounts have a static PIN set (otp + rememberMeToken:true
// in the DB), so login skips SMS-OTP entirely (AuthManager.getOtp returns
// otpTriggered:false when rememberMeToken is set).
//
// Two accounts:
//   superUser (8888899999) - admin/manager roles, no school. Auth tests only.
//   teacher   (9999911111) - power+standard roles, school assigned. Used for
//                            schedule and lesson-plan-generation flows that
//                            require req.user.school._id and power role.

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

const teacherPhone = process.env.SHIKSHA_TEACHER_PHONE;
const teacherPin = process.env.SHIKSHA_TEACHER_PIN;
if (!teacherPhone || !teacherPin) {
  throw new Error(
    "SHIKSHA_TEACHER_PHONE / SHIKSHA_TEACHER_PIN are not set. Schedule and " +
      "lesson-plan tests require a pre-seeded teacher account (power role + school) " +
      "on staging - see .github/workflows/main.yaml."
  );
}

async function loginAs(phone, pin) {
  const otpRes = await request(baseURL)
    .post("/api/auth/get-otp")
    .send({ phone });
  if (!otpRes.body.success) {
    throw new Error(`get-otp failed for ${phone}: ${JSON.stringify(otpRes.body)}`);
  }

  const verifyRes = await request(baseURL)
    .post("/api/auth/validate-otp")
    .send({ phone, otp: pin });
  if (!verifyRes.body.success) {
    throw new Error(`validate-otp failed for ${phone}: ${JSON.stringify(verifyRes.body)}`);
  }

  return { token: verifyRes.body.data.token, user: verifyRes.body.data.user };
}

let cachedSuperUser = null;
async function loginAsSuperUser() {
  if (cachedSuperUser) return cachedSuperUser;
  cachedSuperUser = await loginAs(superUserPhone, superUserPin);
  return cachedSuperUser;
}

let cachedTeacher = null;
async function loginAsTeacher() {
  if (cachedTeacher) return cachedTeacher;
  cachedTeacher = await loginAs(teacherPhone, teacherPin);
  return cachedTeacher;
}

module.exports = {
  baseURL,
  superUserPhone,
  superUserPin,
  teacherPhone,
  teacherPin,
  loginAsSuperUser,
  loginAsTeacher,
};
