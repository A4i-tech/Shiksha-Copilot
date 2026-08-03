// Shared login helper for the staging E2E suite (see
// .github/workflows/main.yaml's staging-e2e job). These tests run
// against the real deployed staging backend - no direct DB access, no
// invented secrets. Auth goes through a pre-seeded super-user account
// (phone/PIN supplied by CI as SHIKSHA_SU_PHONE/SHIKSHA_SU_PIN) that
// already has a static PIN set, so login skips the SMS-OTP path
// entirely (see AuthManager.getOtp: an account with `otp` +
// `rememberMeToken` already set goes straight to "Verify your Pin!").
//
// Fresh throwaway teacher accounts can't be created and logged into in
// this design - creating one via POST /user/create leaves it without a
// PIN, and the only way to set one is the real SMS-OTP flow, which an
// automated test can't observe. Every flow that needs an authenticated
// user reuses this same super-user account.

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

let cachedLogin = null;

async function loginAsSuperUser() {
  if (cachedLogin) return cachedLogin;

  const otpRes = await request(baseURL)
    .post("/api/auth/get-otp")
    .send({ phone: superUserPhone });
  if (!otpRes.body.success) {
    throw new Error(`get-otp failed for the super-user: ${JSON.stringify(otpRes.body)}`);
  }

  const verifyRes = await request(baseURL)
    .post("/api/auth/validate-otp")
    .send({ phone: superUserPhone, otp: superUserPin });
  if (!verifyRes.body.success) {
    throw new Error(`validate-otp failed for the super-user: ${JSON.stringify(verifyRes.body)}`);
  }

  cachedLogin = { token: verifyRes.body.data.token, user: verifyRes.body.data.user };
  return cachedLogin;
}

module.exports = { baseURL, superUserPhone, superUserPin, loginAsSuperUser };
