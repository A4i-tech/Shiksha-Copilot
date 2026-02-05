const {
  validateFacility,
} = require("../../../validations/facility.validation");

describe("Facility Validation", () => {
  let mockReq;
  let mockRes;
  let mockNext;

  beforeEach(() => {
    mockReq = {
      body: {},
      originalUrl: "",
    };
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
    mockNext = jest.fn();
  });

  describe("validateFacility for create", () => {
    beforeEach(() => {
      mockReq.originalUrl = "/api/facility/create";
    });

    it("should pass validation with valid create data", () => {
      mockReq.body = {
        subject: "Mathematics",
        type: "Lab",
        facilities: ["Computer Lab", "Smart Board"],
      };

      validateFacility(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalled();
      expect(mockRes.status).not.toHaveBeenCalled();
    });

    it("should fail when subject is missing", () => {
      mockReq.body = {
        type: "Lab",
        facilities: ["Computer Lab"],
      };

      validateFacility(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        data: false,
        error: expect.arrayContaining([expect.stringContaining("subject")]),
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it("should fail when type is missing", () => {
      mockReq.body = {
        subject: "Mathematics",
        facilities: ["Computer Lab"],
      };

      validateFacility(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        data: false,
        error: expect.arrayContaining([expect.stringContaining("type")]),
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it("should fail when facilities is missing", () => {
      mockReq.body = {
        subject: "Mathematics",
        type: "Lab",
      };

      validateFacility(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        data: false,
        error: expect.arrayContaining([expect.stringContaining("facilities")]),
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it("should fail when facilities is not an array", () => {
      mockReq.body = {
        subject: "Mathematics",
        type: "Lab",
        facilities: "Computer Lab",
      };

      validateFacility(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockNext).not.toHaveBeenCalled();
    });
  });

  describe("validateFacility for update", () => {
    beforeEach(() => {
      mockReq.originalUrl = "/api/facility/update";
    });

    it("should pass validation with valid update data", () => {
      mockReq.body = {
        _id: "507f1f77bcf86cd799439011",
        subject: "Mathematics",
        type: "Lab",
        facilities: ["Computer Lab", "Smart Board"],
      };

      validateFacility(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalled();
      expect(mockRes.status).not.toHaveBeenCalled();
    });

    it("should fail when _id is missing", () => {
      mockReq.body = {
        subject: "Mathematics",
        type: "Lab",
        facilities: ["Computer Lab"],
      };

      validateFacility(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        data: false,
        error: expect.arrayContaining([expect.stringContaining("_id")]),
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it("should fail when subject is missing", () => {
      mockReq.body = {
        _id: "507f1f77bcf86cd799439011",
        type: "Lab",
        facilities: ["Computer Lab"],
      };

      validateFacility(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockNext).not.toHaveBeenCalled();
    });

    it("should fail when type is missing", () => {
      mockReq.body = {
        _id: "507f1f77bcf86cd799439011",
        subject: "Mathematics",
        facilities: ["Computer Lab"],
      };

      validateFacility(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockNext).not.toHaveBeenCalled();
    });

    it("should fail when facilities is missing", () => {
      mockReq.body = {
        _id: "507f1f77bcf86cd799439011",
        subject: "Mathematics",
        type: "Lab",
      };

      validateFacility(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockNext).not.toHaveBeenCalled();
    });
  });
});
