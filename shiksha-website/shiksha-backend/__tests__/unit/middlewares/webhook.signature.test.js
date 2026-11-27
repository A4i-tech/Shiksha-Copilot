const crypto = require("crypto");
const verifyWebhookSignature = require("../../../middlewares/webhook.signature");

describe("verifyWebhookSignature", () => {
  const body = Buffer.from('{"instance_id":"i-1","status":"failed"}');
  const sign = (stamp) => crypto.createHmac("sha256", "s3cret").update(`${stamp}.`).update(body).digest("hex");
  const run = (headers) => {
    const req = { rawBody: body, get: (name) => headers[name] };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    const next = jest.fn();
    verifyWebhookSignature(req, res, next);
    return { res, next };
  };

  beforeEach(() => {
    process.env.WEBHOOK_SECRET = "s3cret";
  });

  it("accepts a valid signature", () => {
    const stamp = String(Math.floor(Date.now() / 1000));
    expect(run({ "X-Webhook-Timestamp": stamp, "X-Webhook-Signature": sign(stamp) }).next).toHaveBeenCalled();
  });

  it("rejects a wrong signature", () => {
    const stamp = String(Math.floor(Date.now() / 1000));
    const { res, next } = run({ "X-Webhook-Timestamp": stamp, "X-Webhook-Signature": "0".repeat(64) });
    expect(res.status).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });

  it("rejects a missing signature", () => {
    const { res } = run({});
    expect(res.status).toHaveBeenCalledWith(401);
  });

  it("rejects an old timestamp even with a matching signature", () => {
    const stamp = String(Math.floor(Date.now() / 1000) - 3600);
    const { res } = run({ "X-Webhook-Timestamp": stamp, "X-Webhook-Signature": sign(stamp) });
    expect(res.status).toHaveBeenCalledWith(401);
  });
});
