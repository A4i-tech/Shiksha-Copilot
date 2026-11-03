const crypto = require("crypto");
const verifyWebhookSignature = require("../../../middlewares/webhook.signature");

const SECRET = "test-secret";
const body = Buffer.from(JSON.stringify({ instance_id: "i-1", status: "completed" }));
const now = () => Math.floor(Date.now() / 1000);
const sign = (ts, buf = body, secret = SECRET) =>
  crypto.createHmac("sha256", secret).update(`${ts}.${buf}`).digest("hex");

const VECTOR_TS = "1700000000";
const VECTOR_BODY = '{"instance_id":"abc","status":"completed"}';
// python: hmac.new(b"test-secret", b"1700000000." + VECTOR_BODY, sha256).hexdigest()
const VECTOR_SIG = "8f7eb16bff536d5c813ae1371c028b205e8612fdfe6bb57e28dacf4a8f61e4fa";

function run(headers, rawBody = body) {
  const res = { status: jest.fn().mockReturnThis(), json: jest.fn().mockReturnThis() };
  const next = jest.fn();
  verifyWebhookSignature({ headers, rawBody }, res, next);
  return { res, next };
}

describe("verifyWebhookSignature", () => {
  const original = process.env.WEBHOOK_SECRET;
  beforeEach(() => {
    process.env.WEBHOOK_SECRET = SECRET;
  });
  afterEach(() => jest.restoreAllMocks());
  afterAll(() => {
    if (original === undefined) delete process.env.WEBHOOK_SECRET;
    else process.env.WEBHOOK_SECRET = original;
  });

  it("returns 500 when the secret is unset", () => {
    delete process.env.WEBHOOK_SECRET;
    const ts = now();
    const { res, next } = run({ "x-webhook-timestamp": String(ts), "x-webhook-signature": sign(ts) });
    expect(res.status).toHaveBeenCalledWith(500);
    expect(next).not.toHaveBeenCalled();
  });

  it("returns 401 when headers are missing", () => {
    const { res, next } = run({});
    expect(res.status).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });

  it("returns 401 when rawBody is undefined", () => {
    const ts = now();
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn().mockReturnThis() };
    const next = jest.fn();
    verifyWebhookSignature(
      { headers: { "x-webhook-timestamp": String(ts), "x-webhook-signature": sign(ts) } },
      res,
      next
    );
    expect(res.status).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });

  it("returns 401 for a wrong signature", () => {
    const ts = now();
    const { res, next } = run({ "x-webhook-timestamp": String(ts), "x-webhook-signature": sign(ts, body, "other") });
    expect(res.status).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });

  it("returns 401 for a signature of the wrong length", () => {
    const ts = now();
    const { res, next } = run({ "x-webhook-timestamp": String(ts), "x-webhook-signature": "abcd" });
    expect(res.status).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });

  it("returns 401 for a stale timestamp", () => {
    const ts = now() - 301;
    const { res, next } = run({ "x-webhook-timestamp": String(ts), "x-webhook-signature": sign(ts) });
    expect(res.status).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });

  it("returns 401 for a timestamp too far in the future", () => {
    const ts = now() + 120;
    const { res, next } = run({ "x-webhook-timestamp": String(ts), "x-webhook-signature": sign(ts) });
    expect(res.status).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });

  it("accepts the fixed cross-language vector", () => {
    jest.spyOn(Date, "now").mockReturnValue(1700000000000);
    const { res, next } = run(
      { "x-webhook-timestamp": VECTOR_TS, "x-webhook-signature": VECTOR_SIG },
      Buffer.from(VECTOR_BODY)
    );
    expect(next).toHaveBeenCalledTimes(1);
    expect(res.status).not.toHaveBeenCalled();
  });
});
