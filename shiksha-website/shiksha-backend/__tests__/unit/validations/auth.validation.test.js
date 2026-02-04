const { validateGetOtp, validateOtp } = require("../../../validations/auth.validation");

describe("Auth Validations", () => {
  let mockReq;
  let mockRes;
  let mockNext;
  let consoleLogSpy;

  beforeEach(() => {
    jest.clearAllMocks();

    // Spy on console.log
    consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();

    mockReq = {
      body: {},
      query: {}
    };

    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };

    mockNext = jest.fn();
  });

  afterEach(() => {
    consoleLogSpy.mockRestore();
  });

  describe("validateGetOtp", () => {
    it("should pass validation with valid phone number", () => {
      mockReq.body = {
        phone: "1234567890"
      };

      validateGetOtp(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalled();
      expect(mockRes.status).not.toHaveBeenCalled();
      expect(consoleLogSpy).toHaveBeenCalledWith("[validateGetOtp] Validation Passed");
    });

    it("should pass validation with phone and rememberMe", () => {
      mockReq.body = {
        phone: "1234567890",
        rememberMe: true
      };

      validateGetOtp(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalled();
      expect(mockRes.status).not.toHaveBeenCalled();
    });

    it("should pass validation with phone and forgotPassword", () => {
      mockReq.body = {
        phone: "1234567890",
        forgotPassword: true
      };

      validateGetOtp(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalled();
    });

    it("should pass validation with all fields", () => {
      mockReq.body = {
        phone: "1234567890",
        rememberMe: true,
        forgotPassword: false
      };

      validateGetOtp(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalled();
    });

    it("should fail validation when phone is missing", () => {
      mockReq.body = {
        rememberMe: true
      };

      validateGetOtp(mockReq, mockRes, mockNext);

      expect(mockNext).not.toHaveBeenCalled();
      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        data: false,
        error: expect.arrayContaining([
          expect.stringContaining('"phone" is required')
        ])
      });
    });

    it("should fail validation when phone is empty string", () => {
      mockReq.body = {
        phone: ""
      };

      validateGetOtp(mockReq, mockRes, mockNext);

      expect(mockNext).not.toHaveBeenCalled();
      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        data: false,
        error: expect.arrayContaining([
          expect.stringContaining('"phone" is not allowed to be empty')
        ])
      });
    });

    it("should fail validation when phone is not a string", () => {
      mockReq.body = {
        phone: 1234567890
      };

      validateGetOtp(mockReq, mockRes, mockNext);

      expect(mockNext).not.toHaveBeenCalled();
      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        data: false,
        error: expect.arrayContaining([
          expect.stringContaining('"phone" must be a string')
        ])
      });
    });

    it("should fail validation when rememberMe is not a boolean", () => {
      mockReq.body = {
        phone: "1234567890",
        rememberMe: "yes"
      };

      validateGetOtp(mockReq, mockRes, mockNext);

      expect(mockNext).not.toHaveBeenCalled();
      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        data: false,
        error: expect.arrayContaining([
          expect.stringContaining('"rememberMe" must be a boolean')
        ])
      });
    });

    it("should fail validation when forgotPassword is not a boolean", () => {
      mockReq.body = {
        phone: "1234567890",
        forgotPassword: "no"
      };

      validateGetOtp(mockReq, mockRes, mockNext);

      expect(mockNext).not.toHaveBeenCalled();
      expect(mockRes.status).toHaveBeenCalledWith(400);
    });

    it("should fail validation with multiple errors", () => {
      mockReq.body = {
        rememberMe: "not-boolean"
      };

      validateGetOtp(mockReq, mockRes, mockNext);

      expect(mockNext).not.toHaveBeenCalled();
      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        data: false,
        error: expect.arrayContaining([
          expect.stringContaining('"phone" is required'),
          expect.stringContaining('"rememberMe" must be a boolean')
        ])
      });
    });

    it("should log incoming request details", () => {
      mockReq.query = { test: "value" };
      mockReq.body = { phone: "1234567890" };

      validateGetOtp(mockReq, mockRes, mockNext);

      expect(consoleLogSpy).toHaveBeenCalledWith("\n[validateGetOtp] Incoming Request:");
      expect(consoleLogSpy).toHaveBeenCalledWith("Query Params (URL):", mockReq.query);
      expect(consoleLogSpy).toHaveBeenCalledWith("Body (Payload):", mockReq.body);
    });

    it("should log validation failure", () => {
      mockReq.body = {};

      validateGetOtp(mockReq, mockRes, mockNext);

      expect(consoleLogSpy).toHaveBeenCalledWith(
        "[validateGetOtp] Validation Failed:",
        expect.any(Array)
      );
    });
  });

  describe("validateOtp", () => {
    it("should pass validation with valid phone and otp", () => {
      mockReq.body = {
        phone: "1234567890",
        otp: "123456"
      };

      validateOtp(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalled();
      expect(mockRes.status).not.toHaveBeenCalled();
    });

    it("should pass validation with phone only", () => {
      mockReq.body = {
        phone: "1234567890"
      };

      validateOtp(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalled();
    });

    it("should pass validation with phone and rememberMe", () => {
      mockReq.body = {
        phone: "1234567890",
        rememberMe: true
      };

      validateOtp(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalled();
    });

    it("should pass validation with all fields", () => {
      mockReq.body = {
        phone: "1234567890",
        otp: "654321",
        rememberMe: false
      };

      validateOtp(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalled();
    });

    it("should fail validation when phone is missing", () => {
      mockReq.body = {
        otp: "123456"
      };

      validateOtp(mockReq, mockRes, mockNext);

      expect(mockNext).not.toHaveBeenCalled();
      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        data: false,
        error: expect.arrayContaining([
          expect.stringContaining('"phone" is required')
        ])
      });
    });

    it("should fail validation when phone is empty", () => {
      mockReq.body = {
        phone: ""
      };

      validateOtp(mockReq, mockRes, mockNext);

      expect(mockNext).not.toHaveBeenCalled();
      expect(mockRes.status).toHaveBeenCalledWith(400);
    });

    it("should fail validation when phone is not a string", () => {
      mockReq.body = {
        phone: 1234567890,
        otp: "123456"
      };

      validateOtp(mockReq, mockRes, mockNext);

      expect(mockNext).not.toHaveBeenCalled();
      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        data: false,
        error: expect.arrayContaining([
          expect.stringContaining('"phone" must be a string')
        ])
      });
    });

    it("should fail validation when otp is not a string", () => {
      mockReq.body = {
        phone: "1234567890",
        otp: 123456
      };

      validateOtp(mockReq, mockRes, mockNext);

      expect(mockNext).not.toHaveBeenCalled();
      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        data: false,
        error: expect.arrayContaining([
          expect.stringContaining('"otp" must be a string')
        ])
      });
    });

    it("should fail validation when rememberMe is not a boolean", () => {
      mockReq.body = {
        phone: "1234567890",
        rememberMe: "yes"
      };

      validateOtp(mockReq, mockRes, mockNext);

      expect(mockNext).not.toHaveBeenCalled();
      expect(mockRes.status).toHaveBeenCalledWith(400);
    });

    it("should fail validation with multiple errors", () => {
      mockReq.body = {
        otp: 123456,
        rememberMe: "not-boolean"
      };

      validateOtp(mockReq, mockRes, mockNext);

      expect(mockNext).not.toHaveBeenCalled();
      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        data: false,
        error: expect.arrayContaining([
          expect.stringContaining('"phone" is required'),
          expect.stringContaining('"otp" must be a string'),
          expect.stringContaining('"rememberMe" must be a boolean')
        ])
      });
    });

    it("should log incoming request details", () => {
      mockReq.body = { phone: "1234567890", otp: "123456" };

      validateOtp(mockReq, mockRes, mockNext);

      expect(consoleLogSpy).toHaveBeenCalledWith("\n[validateOtp] Incoming Request:");
      expect(consoleLogSpy).toHaveBeenCalledWith("Body (Payload):", mockReq.body);
    });

    it("should log validation failure", () => {
      mockReq.body = {};

      validateOtp(mockReq, mockRes, mockNext);

      expect(consoleLogSpy).toHaveBeenCalledWith(
        "[validateOtp] Validation Failed:",
        expect.any(Array)
      );
    });
  });
});
