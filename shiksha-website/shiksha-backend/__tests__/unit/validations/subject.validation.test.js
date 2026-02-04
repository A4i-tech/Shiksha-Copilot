const {
  validateSubjectCreate,
  validateSubjectGetById,
  validateSubjectUpdate,
} = require("../../../validations/subject.validation");

describe("Subject Validation", () => {
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

  describe("validateSubjectCreate", () => {
    it("should pass validation with valid subject data", () => {
      mockReq.body = {
        subject: "Mathematics",
      };

      validateSubjectCreate(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalled();
      expect(mockRes.status).not.toHaveBeenCalled();
    });

    it("should fail when subject is missing", () => {
      mockReq.body = {};

      validateSubjectCreate(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        data: false,
        error: expect.arrayContaining([expect.stringContaining("subject")]),
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it("should fail when subject is not a string", () => {
      mockReq.body = {
        subject: 123,
      };

      validateSubjectCreate(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockNext).not.toHaveBeenCalled();
    });
  });

  describe("validateSubjectGetById", () => {
    it("should pass validation with valid id", () => {
      mockReq.params = {
        id: "507f1f77bcf86cd799439011",
      };

      validateSubjectGetById(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalled();
      expect(mockRes.status).not.toHaveBeenCalled();
    });

    it("should fail when id is missing", () => {
      mockReq.params = {};

      validateSubjectGetById(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        data: false,
        error: expect.any(Array),
      });
      expect(mockNext).not.toHaveBeenCalled();
    });
  });

  describe("validateSubjectUpdate", () => {
    it("should pass validation with valid update data", () => {
      mockReq.params = {
        id: "507f1f77bcf86cd799439011",
      };
      mockReq.body = {
        subject: "Mathematics Updated",
      };

      validateSubjectUpdate(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalled();
      expect(mockRes.status).not.toHaveBeenCalled();
    });

    it("should fail when id is missing", () => {
      mockReq.params = {};
      mockReq.body = {
        subject: "Mathematics",
      };

      validateSubjectUpdate(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        data: false,
        error: "ID parameter is required",
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it("should fail when subject is missing", () => {
      mockReq.params = {
        id: "507f1f77bcf86cd799439011",
      };
      mockReq.body = {};

      validateSubjectUpdate(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        data: false,
        error: expect.arrayContaining([expect.stringContaining("subject")]),
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it("should fail when subject is not a string", () => {
      mockReq.params = {
        id: "507f1f77bcf86cd799439011",
      };
      mockReq.body = {
        subject: 123,
      };

      validateSubjectUpdate(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockNext).not.toHaveBeenCalled();
    });
  });
});
