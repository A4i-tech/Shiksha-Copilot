const {
  validateUserCreate,
  validateUserUpdate,
} = require("../../../validations/user.validation");

describe("User Validation", () => {
  let mockReq;
  let mockRes;
  let mockNext;

  beforeEach(() => {
    mockReq = {
      body: {},
      params: {},
    };
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
    mockNext = jest.fn();
  });

  const validUserData = {
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "9876543210",
    role: "teacher",
    password: "SecurePassword123",
    zone: "Zone A",
    state: "State A",
    district: "District A",
    block: "Block A",
    school: "School A",
  };

  describe("validateUserCreate", () => {
    it("should pass validation with valid user data", () => {
      mockReq.body = { ...validUserData };

      validateUserCreate(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalled();
      expect(mockRes.status).not.toHaveBeenCalled();
    });

    it("should pass with different valid roles", () => {
      const roles = ["teacher", "admin", "student", "parent"];

      roles.forEach((role) => {
        mockReq.body = {
          ...validUserData,
          role,
        };

        validateUserCreate(mockReq, mockRes, mockNext);

        expect(mockNext).toHaveBeenCalled();
        expect(mockRes.status).not.toHaveBeenCalled();
      });
    });

    it("should pass with valid phone numbers starting with 6, 7, 8, 9", () => {
      const phoneNumbers = [
        "6123456789",
        "7123456789",
        "8123456789",
        "9123456789",
      ];

      phoneNumbers.forEach((phone) => {
        mockReq.body = {
          ...validUserData,
          phone,
        };

        validateUserCreate(mockReq, mockRes, mockNext);

        expect(mockNext).toHaveBeenCalled();
        expect(mockRes.status).not.toHaveBeenCalled();
      });
    });

    it("should fail when name is missing", () => {
      const { name, ...dataWithoutName } = validUserData;
      mockReq.body = dataWithoutName;

      validateUserCreate(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        data: false,
        error: expect.arrayContaining([expect.stringContaining("name")]),
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it("should pass with optional email", () => {
      const { email, ...dataWithoutEmail } = validUserData;
      mockReq.body = dataWithoutEmail;

      validateUserCreate(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalled();
      expect(mockRes.status).not.toHaveBeenCalled();
    });

    it("should fail when phone is missing", () => {
      const { phone, ...dataWithoutPhone } = validUserData;
      mockReq.body = dataWithoutPhone;

      validateUserCreate(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockNext).not.toHaveBeenCalled();
    });

    it("should fail when role is missing", () => {
      const { role, ...dataWithoutRole } = validUserData;
      mockReq.body = dataWithoutRole;

      validateUserCreate(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockNext).not.toHaveBeenCalled();
    });

    it("should pass with optional password", () => {
      const { password, ...dataWithoutPassword } = validUserData;
      mockReq.body = dataWithoutPassword;

      validateUserCreate(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalled();
      expect(mockRes.status).not.toHaveBeenCalled();
    });
  });

  describe("validateUserUpdate", () => {
    it("should pass validation with valid update data", () => {
      mockReq.params = {};
      mockReq.body = {
        name: "John Doe Updated",
      };

      validateUserUpdate(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalled();
      expect(mockRes.status).not.toHaveBeenCalled();
    });

    it("should pass with partial update data", () => {
      mockReq.params = {};
      mockReq.body = {
        phone: "9876543210",
      };

      validateUserUpdate(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalled();
      expect(mockRes.status).not.toHaveBeenCalled();
    });

    it("should fail when no data is provided", () => {
      mockReq.params = {};
      mockReq.body = {};

      validateUserUpdate(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockNext).not.toHaveBeenCalled();
    });
  });
});
