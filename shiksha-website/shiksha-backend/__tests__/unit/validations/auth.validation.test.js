const { validateOtp } = require("../../../validations/auth.validation");

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

  describe("validateOtp", () => {
    it("should pass validation with valid phone, user type, and otp", () => {
      mockReq.body = {
        phone: "1234567890",
        userType: "teacher",
        otp: "123456"
      };

      validateOtp(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalled();
      expect(mockRes.status).not.toHaveBeenCalled();
    });

    it("should fail validation with phone only", () => {
      mockReq.body = {
        phone: "1234567890"
      };

      validateOtp(mockReq, mockRes, mockNext);

      expect(mockNext).not.toHaveBeenCalled();
    });

    it("should fail validation with phone, user type, and rememberMe", () => {
      mockReq.body = {
        phone: "1234567890",
        userType: "teacher",
        rememberMe: true
      };

      validateOtp(mockReq, mockRes, mockNext);

      expect(mockNext).not.toHaveBeenCalled();
    });

    it("should pass validation with all fields", () => {
      mockReq.body = {
        phone: "1234567890",
        userType: "teacher",
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
        phone: "",
        userType: "teacher",
        otp: "0000"
      };

      validateOtp(mockReq, mockRes, mockNext);

      expect(mockNext).not.toHaveBeenCalled();
      expect(mockRes.status).toHaveBeenCalledWith(400);
    });

    it("should fail validation when phone is not a string", () => {
      mockReq.body = {
        phone: 1234567890,
        userType: "teacher",
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
        userType: "teacher",
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
        userType: "teacher",
        otp: "9999",
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
