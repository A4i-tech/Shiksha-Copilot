const mongoose = require("mongoose");
const User = require("../../../models/user.model");
const jwt = require("jsonwebtoken");

jest.mock("jsonwebtoken");

describe("User Model", () => {
  describe("Schema validation", () => {
    it("should create a valid user", () => {
      const validUser = new User({
        name: "Test User",
        state: "Karnataka",
        email: "test@example.com",
        zone: "Zone A",
        district: "District A",
        block: "Block A",
        phone: "1234567890",
        role: ["standard"],
        school: new mongoose.Types.ObjectId(),
        preferredLanguage: "en",
      });

      const validationError = validUser.validateSync();
      expect(validationError).toBeUndefined();
    });

    it("should fail validation when required fields are missing", () => {
      const invalidUser = new User({
        name: "Test User",
      });

      const validationError = invalidUser.validateSync();
      expect(validationError).toBeDefined();
      expect(validationError.errors.state).toBeDefined();
      expect(validationError.errors.zone).toBeDefined();
      expect(validationError.errors.district).toBeDefined();
      expect(validationError.errors.block).toBeDefined();
      expect(validationError.errors.phone).toBeDefined();
      expect(validationError.errors.school).toBeDefined();
    });

    it("should use default values correctly", () => {
      const user = new User({
        name: "Test User",
        state: "Karnataka",
        zone: "Zone A",
        district: "District A",
        block: "Block A",
        phone: "1234567890",
        role: ["standard"],
        school: new mongoose.Types.ObjectId(),
      });

      expect(user.preferredLanguage).toBe("en");
      expect(user.isProfileCompleted).toBe(false);
      expect(user.isDeleted).toBe(false);
      expect(user.rememberMeToken).toBe(false);
      expect(user.isLoginAllowed).toBe(true);
      expect(user.profileImage).toBe("");
      expect(user.loginAttempts).toEqual([]);
      expect(User.schema.path("loginAttempts").options.select).toBe(false);
    });

    it("should validate role enum correctly", () => {
      const userWithInvalidRole = new User({
        name: "Test User",
        state: "Karnataka",
        zone: "Zone A",
        district: "District A",
        block: "Block A",
        phone: "1234567890",
        role: ["invalid_role"],
        school: new mongoose.Types.ObjectId(),
      });

      const validationError = userWithInvalidRole.validateSync();
      expect(validationError).toBeDefined();
    });

    it("should validate preferredLanguage enum correctly", () => {
      const userWithInvalidLanguage = new User({
        name: "Test User",
        state: "Karnataka",
        zone: "Zone A",
        district: "District A",
        block: "Block A",
        phone: "1234567890",
        role: ["standard"],
        school: new mongoose.Types.ObjectId(),
        preferredLanguage: "invalid_lang",
      });

      const validationError = userWithInvalidLanguage.validateSync();
      expect(validationError).toBeDefined();
    });
  });

  describe("generateAuthToken", () => {
    beforeEach(() => {
      jwt.sign.mockClear();
    });

    it("should generate a valid JWT token", () => {
      const mockToken = "mock.jwt.token";
      jwt.sign.mockReturnValue(mockToken);

      const user = new User({
        _id: new mongoose.Types.ObjectId(),
        name: "Test User",
        state: "Karnataka",
        zone: "Zone A",
        district: "District A",
        block: "Block A",
        phone: "1234567890",
        role: ["standard"],
        school: new mongoose.Types.ObjectId(),
        isDeleted: false,
      });

      const token = user.generateAuthToken();

      expect(jwt.sign).toHaveBeenCalledWith(
        { _id: user._id, isAdmin: false, isDeleted: false },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
      );
      expect(token).toBe(mockToken);
    });
  });

  describe("Class Schema", () => {
    it("should validate class schema correctly", () => {
      const user = new User({
        name: "Test User",
        state: "Karnataka",
        zone: "Zone A",
        district: "District A",
        block: "Block A",
        phone: "1234567890",
        role: ["standard"],
        school: new mongoose.Types.ObjectId(),
        classes: [
          {
            board: "CBSE",
            class: 10,
            medium: "English",
            subject: "Mathematics",
            name: "Class 10A",
            sem: 1,
          },
        ],
      });

      const validationError = user.validateSync();
      expect(validationError).toBeUndefined();
    });
  });
});
