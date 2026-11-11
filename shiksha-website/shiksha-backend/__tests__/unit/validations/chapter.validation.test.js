const { validateAssign, validateRequestChanges } = require("../../../validations/chapter.validation");

const run = (middleware, body) => {
  const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
  const next = jest.fn();
  middleware({ body }, res, next);
  return { res, next };
};

describe("chapter assign and request-changes validation", () => {
  it("accepts a 24-hex curatorId", () => {
    expect(run(validateAssign, { curatorId: "507f1f77bcf86cd799439011" }).next).toHaveBeenCalled();
  });

  it.each([[{}], [{ curatorId: 123 }], [{ curatorId: "not-an-id" }], [{ curatorId: "507f1f77bcf86cd799439011", extra: 1 }]])(
    "answers 400 for the assign body %j",
    (body) => {
      const { res, next } = run(validateAssign, body);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(next).not.toHaveBeenCalled();
    }
  );

  it("accepts a comment up to 2000 characters", () => {
    expect(run(validateRequestChanges, { comment: "a".repeat(2000) }).next).toHaveBeenCalled();
  });

  it.each([[{}], [{ comment: "" }], [{ comment: "   " }], [{ comment: 5 }]])(
    "answers 400 with the next step for the request-changes body %j",
    (body) => {
      const { res, next } = run(validateRequestChanges, body);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json.mock.calls[0][0].error).toEqual(["Write a comment that tells the curator what to change, then send the chapter back."]);
      expect(next).not.toHaveBeenCalled();
    }
  );

  it("answers 400 that names the length limit for a longer comment", () => {
    const { res } = run(validateRequestChanges, { comment: "a".repeat(2001) });

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json.mock.calls[0][0].error[0]).toMatch(/2000 characters/);
  });
});
