const {
  validateBoardCreate,
  validateBoardUpdate,
} = require("../../../validations/board.validation");

describe("Board Validation", () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      body: {},
      params: {},
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
  });

  describe("validateBoardCreate", () => {
    it("should pass validation with valid board data", () => {
      req.body = {
        boardName: "Karnataka Board",
        state: "Karnataka",
        abbreviation: "KSEEB",
      };

      validateBoardCreate(req, res, next);

      expect(next).toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
    });

    it("should fail when boardName is missing", () => {
      req.body = {
        state: "Karnataka",
        abbreviation: "KSEEB",
      };

      validateBoardCreate(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        data: false,
        error: expect.arrayContaining([
          expect.stringContaining("boardName"),
        ]),
      });
      expect(next).not.toHaveBeenCalled();
    });

    it("should fail when state is missing", () => {
      req.body = {
        boardName: "Karnataka Board",
        abbreviation: "KSEEB",
      };

      validateBoardCreate(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        data: false,
        error: expect.arrayContaining([expect.stringContaining("state")]),
      });
      expect(next).not.toHaveBeenCalled();
    });

    it("should fail when abbreviation is missing", () => {
      req.body = {
        boardName: "Karnataka Board",
        state: "Karnataka",
      };

      validateBoardCreate(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        data: false,
        error: expect.arrayContaining([
          expect.stringContaining("abbreviation"),
        ]),
      });
      expect(next).not.toHaveBeenCalled();
    });

    it("should fail with multiple missing required fields", () => {
      req.body = {};

      validateBoardCreate(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        data: false,
        error: expect.arrayContaining([
          expect.stringContaining("boardName"),
          expect.stringContaining("state"),
          expect.stringContaining("abbreviation"),
        ]),
      });
      expect(next).not.toHaveBeenCalled();
    });

    it("should fail when boardName is not a string", () => {
      req.body = {
        boardName: 123,
        state: "Karnataka",
        abbreviation: "KSEEB",
      };

      validateBoardCreate(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(next).not.toHaveBeenCalled();
    });

    it("should fail when state is not a string", () => {
      req.body = {
        boardName: "Karnataka Board",
        state: 123,
        abbreviation: "KSEEB",
      };

      validateBoardCreate(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(next).not.toHaveBeenCalled();
    });
  });

  describe("validateBoardUpdate", () => {
    it("should pass validation with valid update data", () => {
      req.body = {
        id: "507f1f77bcf86cd799439011",
        boardName: "Updated Board Name",
        state: "Karnataka",
        abbreviation: "KSEEB",
      };

      validateBoardUpdate(req, res, next);

      expect(next).toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
    });

    it("should fail when id is missing", () => {
      req.body = {
        boardName: "Karnataka Board",
        state: "Karnataka",
        abbreviation: "KSEEB",
      };

      validateBoardUpdate(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        data: false,
        error: expect.arrayContaining([expect.stringContaining("id")]),
      });
      expect(next).not.toHaveBeenCalled();
    });

    it("should fail when boardName is missing", () => {
      req.body = {
        id: "507f1f77bcf86cd799439011",
        state: "Karnataka",
        abbreviation: "KSEEB",
      };

      validateBoardUpdate(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        data: false,
        error: expect.arrayContaining([
          expect.stringContaining("boardName"),
        ]),
      });
      expect(next).not.toHaveBeenCalled();
    });

    it("should fail when state is missing", () => {
      req.body = {
        id: "507f1f77bcf86cd799439011",
        boardName: "Karnataka Board",
        abbreviation: "KSEEB",
      };

      validateBoardUpdate(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        data: false,
        error: expect.arrayContaining([expect.stringContaining("state")]),
      });
      expect(next).not.toHaveBeenCalled();
    });

    it("should fail when abbreviation is missing", () => {
      req.body = {
        id: "507f1f77bcf86cd799439011",
        boardName: "Karnataka Board",
        state: "Karnataka",
      };

      validateBoardUpdate(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        data: false,
        error: expect.arrayContaining([
          expect.stringContaining("abbreviation"),
        ]),
      });
      expect(next).not.toHaveBeenCalled();
    });

    it("should fail with multiple missing fields", () => {
      req.body = {};

      validateBoardUpdate(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        data: false,
        error: expect.arrayContaining([
          expect.stringContaining("id"),
          expect.stringContaining("boardName"),
          expect.stringContaining("state"),
          expect.stringContaining("abbreviation"),
        ]),
      });
      expect(next).not.toHaveBeenCalled();
    });

    it("should fail when id is not a string", () => {
      req.body = {
        id: 123,
        boardName: "Karnataka Board",
        state: "Karnataka",
        abbreviation: "KSEEB",
      };

      validateBoardUpdate(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(next).not.toHaveBeenCalled();
    });
  });
});
