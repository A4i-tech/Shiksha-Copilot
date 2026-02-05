const {
  validateScheduleCreate,
  validateScheduleUpdate,
} = require("../../../validations/schedule.validation");

describe("Schedule Validation", () => {
  let mockReq;
  let mockRes;
  let mockNext;

  beforeEach(() => {
    mockReq = {
      body: {},
    };
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
    mockNext = jest.fn();
  });

  const validScheduleData = {
    teacherId: "teacher123",
    subject: "Mathematics",
    scheduleType: "weekly",
    class: 10,
    board: "CBSE",
    medium: "English",
    lessonId: "lesson123",
    scheduleDateTime: [
      {
        date: new Date("2026-01-25"),
        fromTime: "09:00",
        toTime: "10:00",
      },
    ],
  };

  describe("validateScheduleCreate", () => {
    it("should pass validation with valid schedule data", () => {
      mockReq.body = { ...validScheduleData };

      validateScheduleCreate(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalled();
      expect(mockRes.status).not.toHaveBeenCalled();
    });

    it("should pass with optional fields", () => {
      mockReq.body = {
        ...validScheduleData,
        section: "A",
        topic: "Algebra",
        schoolId: "school123",
        subTopic: "Linear Equations",
        otherClass: "",
      };

      validateScheduleCreate(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalled();
      expect(mockRes.status).not.toHaveBeenCalled();
    });

    it("should fail when teacherId is missing", () => {
      const { teacherId, ...dataWithoutTeacherId } = validScheduleData;
      mockReq.body = dataWithoutTeacherId;

      validateScheduleCreate(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        data: false,
        error: expect.arrayContaining([expect.stringContaining("teacherId")]),
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it("should fail when subject is missing", () => {
      const { subject, ...dataWithoutSubject } = validScheduleData;
      mockReq.body = dataWithoutSubject;

      validateScheduleCreate(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockNext).not.toHaveBeenCalled();
    });

    it("should fail when scheduleType is missing", () => {
      const { scheduleType, ...dataWithoutType } = validScheduleData;
      mockReq.body = dataWithoutType;

      validateScheduleCreate(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockNext).not.toHaveBeenCalled();
    });

    it("should fail when class is missing", () => {
      const { class: className, ...dataWithoutClass } = validScheduleData;
      mockReq.body = dataWithoutClass;

      validateScheduleCreate(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockNext).not.toHaveBeenCalled();
    });

    it("should fail when board is missing", () => {
      const { board, ...dataWithoutBoard } = validScheduleData;
      mockReq.body = dataWithoutBoard;

      validateScheduleCreate(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockNext).not.toHaveBeenCalled();
    });

    it("should fail when medium is missing", () => {
      const { medium, ...dataWithoutMedium } = validScheduleData;
      mockReq.body = dataWithoutMedium;

      validateScheduleCreate(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockNext).not.toHaveBeenCalled();
    });

    it("should fail when lessonId is missing", () => {
      const { lessonId, ...dataWithoutLessonId } = validScheduleData;
      mockReq.body = dataWithoutLessonId;

      validateScheduleCreate(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockNext).not.toHaveBeenCalled();
    });

    it("should fail when scheduleDateTime is missing", () => {
      const { scheduleDateTime, ...dataWithoutScheduleDateTime } =
        validScheduleData;
      mockReq.body = dataWithoutScheduleDateTime;

      validateScheduleCreate(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockNext).not.toHaveBeenCalled();
    });

    it("should fail when scheduleDateTime is not an array", () => {
      mockReq.body = {
        ...validScheduleData,
        scheduleDateTime: "not an array",
      };

      validateScheduleCreate(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockNext).not.toHaveBeenCalled();
    });
  });

  describe("validateScheduleUpdate", () => {
    it("should pass validation with valid update data", () => {
      mockReq.body = {
        ...validScheduleData,
        _id: "507f1f77bcf86cd799439011",
      };

      validateScheduleUpdate(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalled();
      expect(mockRes.status).not.toHaveBeenCalled();
    });

    it("should fail when _id is missing", () => {
      mockReq.body = { ...validScheduleData };

      validateScheduleUpdate(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        data: false,
        error: expect.arrayContaining([expect.stringContaining("_id")]),
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it("should fail when required fields are missing", () => {
      mockReq.body = {
        _id: "507f1f77bcf86cd799439011",
      };

      validateScheduleUpdate(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockNext).not.toHaveBeenCalled();
    });
  });
});
