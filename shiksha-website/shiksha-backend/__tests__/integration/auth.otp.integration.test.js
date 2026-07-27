require("./setup");

process.env.JWT_SECRET = process.env.JWT_SECRET || "test-jwt-secret";
process.env.PIN_SECRET_KEY = process.env.PIN_SECRET_KEY || "test-pin-secret";

const request = require("supertest");
const mongoose = require("mongoose");
const CryptoJS = require("crypto-js");
const User = require("../../models/user.model");
require("../../models/school.model"); // registers the "School" schema that User.populate("school") needs

// This is a real E2E test: SHIKSHA_BASE_URL must point at a live app.js
// instance (started by CI - see .github/workflows/ci-backend.yaml). This
// test seeds/reads data through its own Mongo connection (setup.js) while
// driving the flow entirely over real HTTP against that instance.
//
// No VARIFORM_* env vars are set on the live instance, so
// authHelper.sendOtp's real code path hits the "not configured" branch
// and short-circuits without a network call (see helper/auth.helper.js).
// Nothing to mock: request -> controller -> manager -> dao -> Mongo ->
// response is all real.

const baseURL = process.env.SHIKSHA_BASE_URL;
if (!baseURL) {
  throw new Error(
    "SHIKSHA_BASE_URL is not set. These are E2E tests - they need a live " +
      "backend instance (see .github/workflows/ci-backend.yaml)."
  );
}

describe("Auth OTP flow (integration)", () => {
  const phone = "9999999990";

  const seedUser = () =>
    User.create({
      name: "Test Teacher",
      state: "Karnataka",
      zone: "Zone1",
      district: "District1",
      block: "Block1",
      phone,
      role: ["standard"],
      school: new mongoose.Types.ObjectId(),
    });

  it("issues a PIN, persists it encrypted, and logs in with it", async () => {
    await seedUser();

    const otpRes = await request(baseURL).post("/api/auth/get-otp").send({ phone });

    expect(otpRes.status).toBe(200);
    expect(otpRes.body.success).toBe(true);
    expect(otpRes.body.data.otpTriggered).toBe(true);

    const stored = await User.findOne({ phone }).select("+recovery");
    expect(stored.recovery).toBeTruthy();
    expect(stored.recovery.otp).not.toMatch(/^\d{4}$/);

    const plainOtp = CryptoJS.AES.decrypt(
      stored.recovery.otp,
      process.env.PIN_SECRET_KEY
    ).toString(CryptoJS.enc.Utf8);
    expect(plainOtp).toMatch(/^\d{4}$/);

    const verifyRes = await request(baseURL)
      .post("/api/auth/validate-otp")
      .send({ phone, otp: plainOtp, recovery: true });

    expect(verifyRes.status).toBe(200);
    expect(verifyRes.body.success).toBe(true);
    expect(verifyRes.body.data.token).toBeDefined();
    expect(verifyRes.body.data.user.phone).toBe(phone);
    expect(verifyRes.body.data.user.otp).toBeUndefined();
  });

  it("rejects validate-otp with the wrong PIN", async () => {
    await seedUser();
    await request(baseURL).post("/api/auth/get-otp").send({ phone });

    const res = await request(baseURL)
      .post("/api/auth/validate-otp")
      .send({ phone, otp: "0000", recovery: true });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe("Invalid PIN");
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
