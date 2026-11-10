const {
  validateTeacherLessonPlan,
  validateWebhook,
  validateRegenerate,
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

  describe("validateWebhook and validateRegenerate", () => {
    const run = (validator, body) => {
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      const next = jest.fn();
      validator({ body }, res, next);
      return { res, next };
    };

    it("rejects a completed webhook without output sections", () => {
      const { res, next } = run(validateWebhook, { instance_id: "i", status: "COMPLETED", output: {} });
      expect(res.status).toHaveBeenCalledWith(400);
      expect(next).not.toHaveBeenCalled();
    });

    it("accepts a completed webhook with sections and a failed webhook with text output", () => {
      expect(run(validateWebhook, { instance_id: "i", status: "completed", output: { sections: [] } }).next).toHaveBeenCalled();
      expect(run(validateWebhook, { instance_id: "i", status: "failed", output: "boom" }).next).toHaveBeenCalled();
    });

    it("rejects regenFeedback with an item that has no feedback string", () => {
      const { res } = run(validateRegenerate, { regenFeedback: [{ type: "Engage" }] });
      expect(res.status).toHaveBeenCalledWith(400);
    });

    it("accepts regenFeedback with empty feedback strings", () => {
      expect(run(validateRegenerate, { regenFeedback: [{ type: "Engage", feedback: "" }] }).next).toHaveBeenCalled();
    });
  });
});
