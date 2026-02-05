const {
  validateClassCreate,
  validateClassGetById,
  validateClassUpdate,
  validateGroupClassByBoard,
} = require("../../../validations/school.class.validation");

describe("School Class Validation", () => {
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

  const validClassData = {
    standard: 10,
    section: "A",
    subjects: [
      {
        subject: "Mathematics",
        topics: ["Algebra", "Geometry"],
      },
      {
        subject: "Science",
        topics: ["Physics", "Chemistry"],
      },
    ],
    girls_strength: 20,
    boys_strength: 25,
    total_strength: 45,
    school_id: "school123",
    medium: "English",
  };

  describe("validateClassCreate", () => {
    it("should pass validation with valid class data", () => {
      mockReq.body = { ...validClassData };

      validateClassCreate(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalled();
      expect(mockRes.status).not.toHaveBeenCalled();
    });

    it("should fail when standard is missing", () => {
      const { standard, ...dataWithoutStandard } = validClassData;
      mockReq.body = dataWithoutStandard;

      validateClassCreate(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        data: false,
        error: expect.arrayContaining([expect.stringContaining("standard")]),
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it("should fail when section is missing", () => {
      const { section, ...dataWithoutSection } = validClassData;
      mockReq.body = dataWithoutSection;

      validateClassCreate(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockNext).not.toHaveBeenCalled();
    });

    it("should fail when girls_strength is missing", () => {
      const { girls_strength, ...dataWithoutGirls } = validClassData;
      mockReq.body = dataWithoutGirls;

      validateClassCreate(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockNext).not.toHaveBeenCalled();
    });

    it("should fail when boys_strength is missing", () => {
      const { boys_strength, ...dataWithoutBoys } = validClassData;
      mockReq.body = dataWithoutBoys;

      validateClassCreate(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockNext).not.toHaveBeenCalled();
    });

    it("should fail when total_strength is missing", () => {
      const { total_strength, ...dataWithoutTotal } = validClassData;
      mockReq.body = dataWithoutTotal;

      validateClassCreate(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockNext).not.toHaveBeenCalled();
    });

    it("should fail when school_id is missing", () => {
      const { school_id, ...dataWithoutSchool } = validClassData;
      mockReq.body = dataWithoutSchool;

      validateClassCreate(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockNext).not.toHaveBeenCalled();
    });

    it("should fail when medium is missing", () => {
      const { medium, ...dataWithoutMedium } = validClassData;
      mockReq.body = dataWithoutMedium;

      validateClassCreate(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockNext).not.toHaveBeenCalled();
    });

    it("should fail when standard is not a number", () => {
      mockReq.body = {
        ...validClassData,
        standard: "ten",
      };

      validateClassCreate(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockNext).not.toHaveBeenCalled();
    });

    it("should fail when subjects array item is missing required subject field", () => {
      mockReq.body = {
        ...validClassData,
        subjects: [
          {
            topics: ["Algebra"],
          },
        ],
      };

      validateClassCreate(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockNext).not.toHaveBeenCalled();
    });
  });

  describe("validateClassGetById", () => {
    it("should pass validation with valid id", () => {
      mockReq.params = {
        id: "507f1f77bcf86cd799439011",
      };

      validateClassGetById(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalled();
      expect(mockRes.status).not.toHaveBeenCalled();
    });

    it("should fail when id is missing", () => {
      mockReq.params = {};

      validateClassGetById(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        data: false,
        error: expect.any(Array),
      });
      expect(mockNext).not.toHaveBeenCalled();
    });
  });

  describe("validateClassUpdate", () => {
    it("should pass validation with valid update data", () => {
      mockReq.params = {
        id: "507f1f77bcf86cd799439011",
      };
      mockReq.body = {
        standard: 11,
        section: "B",
      };

      validateClassUpdate(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalled();
      expect(mockRes.status).not.toHaveBeenCalled();
    });

    it("should fail when id is missing", () => {
      mockReq.params = {};
      mockReq.body = {
        standard: 11,
      };

      validateClassUpdate(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        data: false,
        error: "ID parameter is required",
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it("should pass with partial update data", () => {
      mockReq.params = {
        id: "507f1f77bcf86cd799439011",
      };
      mockReq.body = {
        section: "C",
      };

      validateClassUpdate(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalled();
      expect(mockRes.status).not.toHaveBeenCalled();
    });
  });

  describe("validateGroupClassByBoard", () => {
    it("should pass validation with valid schoolId", () => {
      mockReq.params = {
        schoolId: "school123",
      };

      validateGroupClassByBoard(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalled();
      expect(mockRes.status).not.toHaveBeenCalled();
    });

    it("should fail when schoolId is missing", () => {
      mockReq.params = {};

      validateGroupClassByBoard(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        data: false,
        error: "Disecode parameter is required",
      });
      expect(mockNext).not.toHaveBeenCalled();
    });
  });
});
