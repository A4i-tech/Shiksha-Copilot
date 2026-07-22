const {
  validateSubmitSurvey,
  validateRemindLater,
} = require("../../../validations/baselineSurvey.validation");

describe("Baseline Survey Validation", () => {
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

  const validSurveyData = {
    plans: ["Lesson Plan template of Shiksha Sopan"],
    plansOther: "",
    devices: ["Mobile"],
    devicesOther: "",
    weeklyLessonPlans: "3-5 plans",
    lessonPlanComponents: ["Learning objectives", "Assessment questions"],
    otherLessonPlanComponent: "",
    lessonPlanComponentsOther: "",
    timePerLessonPlan: "30-60 mins",
    otherTimePerLessonPlan: "",
    timePerLessonPlanOther: "",
    resourcesUsed: ["Textbooks"],
    otherResourceUsed: "",
    resourcesUsedOther: "",
    timeForAssessments: "10-20 mins",
    otherTimeForAssessments: "",
    timeForAssessmentsOther: "",
    questionBalance: ["Bloom's taxonomy"],
    otherQuestionBalance: "",
    questionBalanceOther: "",
    otherNotes: "Test comment",
  };

  describe("validateSubmitSurvey", () => {
    it("should pass validation with valid survey data", () => {
      mockReq.body = { ...validSurveyData };

      validateSubmitSurvey(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalled();
      expect(mockRes.status).not.toHaveBeenCalled();
    });

    it("should fail when plans is missing", () => {
      const { plans, ...dataWithoutPlans } = validSurveyData;
      mockReq.body = dataWithoutPlans;

      validateSubmitSurvey(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockNext).not.toHaveBeenCalled();
    });

    it("should fail when plans array is empty", () => {
      mockReq.body = {
        ...validSurveyData,
        plans: [],
      };

      validateSubmitSurvey(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockNext).not.toHaveBeenCalled();
    });

    it("should fail when weeklyLessonPlans is missing", () => {
      const { weeklyLessonPlans, ...dataWithoutPlans } = validSurveyData;
      mockReq.body = dataWithoutPlans;

      validateSubmitSurvey(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockNext).not.toHaveBeenCalled();
    });
  });

  describe("validateRemindLater", () => {
    it("should pass validation with empty body", () => {
      mockReq.body = {};

      validateRemindLater(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalled();
      expect(mockRes.status).not.toHaveBeenCalled();
    });
  });
});
