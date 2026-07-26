const validateRequest = require("../../../validations/common.validation");
const { validateRequestForUpdates } = validateRequest;
const Joi = require("joi");

describe("Common Validation", () => {
  let mockReq;
  let mockRes;
  let mockNext;

  beforeEach(() => {
    mockReq = {
      body: {},
      params: {},
      originalUrl: "",
    };
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
    mockNext = jest.fn();
  });

  describe("validateRequest", () => {
    it("should not require an id for regular validation", () => {
      const schema = Joi.object({
        name: Joi.string().required(),
        age: Joi.number().required(),
      });

      mockReq.body = {
        name: "Test User",
        age: 25,
      };
      mockReq.originalUrl = "/api/users/update";

      const middleware = validateRequest(schema);
      middleware(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalled();
      expect(mockRes.status).not.toHaveBeenCalled();
    });

    it("should fail validation with missing required field", () => {
      const schema = Joi.object({
        name: Joi.string().required(),
        age: Joi.number().required(),
      });

      mockReq.body = {
        name: "Test User",
      };

      const middleware = validateRequest(schema);
      middleware(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        data: false,
        error: expect.arrayContaining([expect.stringContaining("age")]),
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it("should fail validation with missing body", () => {
      const middleware = validateRequest(Joi.object());
      mockReq.body = undefined;

      middleware(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockNext).not.toHaveBeenCalled();
    });

    it("should fail validation with multiple errors", () => {
      const schema = Joi.object({
        name: Joi.string().required(),
        age: Joi.number().required(),
        email: Joi.string().email().required(),
      });

      mockReq.body = {};

      const middleware = validateRequest(schema);
      middleware(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        data: false,
        error: expect.any(Array),
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it("should require id parameter for update validation", () => {
      const schema = Joi.object({
        name: Joi.string().required(),
      });

      mockReq.body = {
        name: "Test User",
      };
      mockReq.params = {};

      const middleware = validateRequestForUpdates(schema);
      middleware(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        data: false,
        error: "ID parameter is required",
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it("should pass update validation with id", () => {
      const schema = Joi.object({
        name: Joi.string().required(),
      });

      mockReq.body = {
        name: "Test User",
      };
      mockReq.params = { id: "123" };

      const middleware = validateRequestForUpdates(schema);
      middleware(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalled();
      expect(mockRes.status).not.toHaveBeenCalled();
    });

    it("should handle validation with invalid data types", () => {
      const schema = Joi.object({
        age: Joi.number().required(),
      });

      mockReq.body = {
        age: "not a number",
      };

      const middleware = validateRequest(schema);
      middleware(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockNext).not.toHaveBeenCalled();
    });
  });
});
