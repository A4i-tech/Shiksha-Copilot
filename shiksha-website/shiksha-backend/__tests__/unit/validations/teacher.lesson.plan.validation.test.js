const {
  validateTeacherLessonPlan,
} = require("../../../validations/teacher.lesson.plan.validation");

describe("Teacher Lesson Plan Validation", () => {
  let mockReq;
  let mockRes;
  let mockNext;

  beforeEach(() => {
    mockReq = {
      query: {},
      body: {},
    };
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
    mockNext = jest.fn();
  });

  describe("validateTeacherLessonPlan", () => {
    const validFilterData = {
      type: "teacher",
      teacherId: "teacher123",
      class: 10,
      subject: "Mathematics",
    };

    it("should pass validation with valid filter data", () => {
      mockReq.query = { filter: { ...validFilterData } };

      validateTeacherLessonPlan(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalled();
      expect(mockRes.status).not.toHaveBeenCalled();
    });

    it("should pass with minimal filter data", () => {
      mockReq.query = {
        filter: {
          type: "teacher",
        },
      };

      validateTeacherLessonPlan(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalled();
      expect(mockRes.status).not.toHaveBeenCalled();
    });

    it("should pass with additional filter fields", () => {
      mockReq.query = {
        filter: {
          type: "teacher",
          teacherId: "teacher123",
          class: 10,
          subject: "Mathematics",
          board: "CBSE",
          medium: "English",
          section: "A",
        },
      };

      validateTeacherLessonPlan(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalled();
      expect(mockRes.status).not.toHaveBeenCalled();
    });

    it("should pass when filter is missing", () => {
      mockReq.query = {};

      validateTeacherLessonPlan(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalled();
      expect(mockRes.status).not.toHaveBeenCalled();
    });

    it("should fail when type is missing in filter", () => {
      mockReq.query = {
        filter: {
          teacherId: "teacher123",
        },
      };

      validateTeacherLessonPlan(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        data: false,
        message: "Filter 'type' is required",
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it("should fail when filter has content but no type", () => {
      mockReq.query = {
        filter: {
          class: 10,
          subject: "Mathematics",
        },
      };

      validateTeacherLessonPlan(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockNext).not.toHaveBeenCalled();
    });
  });
});
