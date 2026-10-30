const { validateBoardSave } = require("../../../validations/dashboard.validation");

const body = (overrides = {}) => ({ boardKey: "full", chartKeys: ["lesson_plans_by_subject"], desktopUuid: "3f2b8c1e-4d5a-4b6c-8d7e-9f0a1b2c3d4e", mobileUuid: null, ...overrides });

function run(payload) {
  const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
  const next = jest.fn();
  validateBoardSave({ body: payload }, res, next);
  return { res, next };
}

describe("validateBoardSave", () => {
  it("accepts a valid body with a null or UUID mobileUuid", () => {
    expect(run(body()).next).toHaveBeenCalled();
    expect(run(body({ mobileUuid: "7a1d2c3b-4e5f-4a6b-9c8d-0e1f2a3b4c5d" })).next).toHaveBeenCalled();
  });

  it("accepts a body where mobileUuid is omitted", () => {
    const payload = body();
    delete payload.mobileUuid;
    expect(run(payload).next).toHaveBeenCalled();
  });

  it.each([
    ["desktopUuid", { desktopUuid: "not-a-uuid" }],
    ["mobileUuid", { mobileUuid: "nope" }],
    ["chartKeys", { chartKeys: ["no_such_chart"] }],
    ["chartKeys", { chartKeys: [] }],
  ])("rejects a bad %s with HTTP 400 that names the field", (field, overrides) => {
    const { res, next } = run(body(overrides));
    expect(next).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(400);
    expect(JSON.stringify(res.json.mock.calls[0][0].error)).toContain(field);
  });
});
