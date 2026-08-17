const request = require("supertest");
const { baseURL, superUserPhone, superUserPin, loginAsSuperUser } = require("./superuser.helper");

describe("Auth flow (E2E)", () => {
  let rootToken, suUserId;

  beforeAll(async () => {
    const su = await loginAsSuperUser();
    rootToken = su.token;
    suUserId = su.user._id;
  });

  afterAll(async () => {
    // Safety net: devtools/auth/reset clears loginAttempts unconditionally so a
    // mid-run abort between the wrong-PIN and correct-PIN calls below cannot leave
    // a dangling attempt that accumulates toward the account-lock threshold.
    await request(baseURL)
      .post("/api/devtools/auth/reset")
      .set("Authorization", rootToken)
      .send({ userId: suUserId, pin: superUserPin });
  });

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

    // A correct login resets loginAttempts (clearLoginAttempts in completeLogin).
    // afterAll also calls devtools/auth/reset as a safety net against mid-run aborts.
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
