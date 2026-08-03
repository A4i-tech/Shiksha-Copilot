const request = require("supertest");
const { baseURL, superUserPhone, superUserPin } = require("./superuser.helper");

// Real E2E test against the live staging deployment (see
// .github/workflows/main.yaml's staging-e2e job). Uses the pre-seeded
// super-user account rather than creating fresh users - the fresh-OTP-
// via-SMS path can't be driven from an automated test (no way to read a
// real SMS), so this only exercises the static-PIN login path. Nothing
// mocked: real HTTP, real staging secrets, real DB behind it.

describe("Auth flow (E2E)", () => {
  it("logs in with the super-user's known PIN", async () => {
    const otpRes = await request(baseURL)
      .post("/api/auth/get-otp")
      .send({ phone: superUserPhone });

    expect(otpRes.status).toBe(200);
    expect(otpRes.body.success).toBe(true);

    const verifyRes = await request(baseURL)
      .post("/api/auth/validate-otp")
      .send({ phone: superUserPhone, otp: superUserPin });

    expect(verifyRes.status).toBe(200);
    expect(verifyRes.body.success).toBe(true);
    expect(verifyRes.body.data.token).toBeDefined();
    expect(verifyRes.body.data.user.phone).toBe(superUserPhone);
  });

  it("rejects the wrong PIN, then still allows a correct login right after", async () => {
    const wrongRes = await request(baseURL)
      .post("/api/auth/validate-otp")
      .send({ phone: superUserPhone, otp: "0000" });

    expect(wrongRes.status).toBe(400);
    expect(wrongRes.body.success).toBe(false);
    expect(wrongRes.body.message).toBe("Invalid PIN");

    // A wrong attempt increments this real, persistent staging account's
    // loginAttempts counter. A correct login right after resets it
    // (completeLogin calls clearLoginAttempts), so pairing it like this
    // never accumulates failed attempts across CI runs.
    const verifyRes = await request(baseURL)
      .post("/api/auth/validate-otp")
      .send({ phone: superUserPhone, otp: superUserPin });

    expect(verifyRes.status).toBe(200);
    expect(verifyRes.body.success).toBe(true);
  });

  it("rejects get-otp for a phone with no account", async () => {
    const res = await request(baseURL)
      .post("/api/auth/get-otp")
      .send({ phone: "0000000000" });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe("Account does not exist!");
  });
});
