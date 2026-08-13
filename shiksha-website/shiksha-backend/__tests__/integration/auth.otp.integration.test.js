const request = require("supertest");
const { baseURL, superUserPhone, superUserPin } = require("./superuser.helper");

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

    // A correct login resets loginAttempts (clearLoginAttempts in completeLogin),
    // so the wrong attempt above does not accumulate across runs. The CI job
    // carries a concurrency group so overlapping runs cannot race here.
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
