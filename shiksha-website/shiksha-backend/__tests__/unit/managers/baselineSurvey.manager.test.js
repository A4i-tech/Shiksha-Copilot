const BaselineSurveyDao = require("../../../dao/baselineSurvey.dao");

jest.mock("../../../dao/baselineSurvey.dao");

// Create mock DAO before requiring the manager
const mockDao = {
  existsByUser: jest.fn(),
  findByUser: jest.fn(),
  createSurvey: jest.fn(),
};

BaselineSurveyDao.mockImplementation(() => mockDao);

// Import manager after mocking to ensure the instance gets the mocked DAO
const baselineSurveyManager = require("../../../managers/baselineSurvey.manager");

describe("BaselineSurveyManager", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("checkCompleted", () => {
    it("should return completed status when survey exists", async () => {
      mockDao.existsByUser.mockResolvedValue(true);

      const result = await baselineSurveyManager.checkCompleted("user-123");

      expect(mockDao.existsByUser).toHaveBeenCalledWith("user-123");
      expect(result.success).toBe(true);
      expect(result.data.completed).toBe(true);
    });

    it("should return not completed when survey does not exist", async () => {
      mockDao.existsByUser.mockResolvedValue(false);

      const result = await baselineSurveyManager.checkCompleted("user-123");

      expect(result.success).toBe(true);
      expect(result.data.completed).toBe(false);
    });

    it("should return error when userId is missing", async () => {
      const result = await baselineSurveyManager.checkCompleted(null);

      expect(result.success).toBe(false);
      expect(result.message).toBe("Missing userId");
      expect(mockDao.existsByUser).not.toHaveBeenCalled();
    });

    it("should handle errors gracefully", async () => {
      mockDao.existsByUser.mockRejectedValue(new Error("Database error"));

      const result = await baselineSurveyManager.checkCompleted("user-123");

      expect(result.success).toBe(false);
      expect(result.message).toBe("Server error");
    });
  });

  describe("submitSurvey", () => {
    const mockUserId = "user-123";
    const mockBody = {
      plans: ["Plan A", "Plan B"],
      devices: ["Device 1"],
      weeklyLessonPlans: "5",
      lessonPlanComponents: ["Component 1", "Component 2"],
      timePerLessonPlan: "30 minutes",
      resourcesUsed: ["Resource 1"],
      timeForAssessments: "15 minutes",
      otherNotes: "Some notes",
    };

    it("should submit survey successfully", async () => {
      mockDao.findByUser.mockResolvedValue(null);
      mockDao.createSurvey.mockResolvedValue({ _id: "survey-123" });

      const result = await baselineSurveyManager.submitSurvey(mockUserId, mockBody);

      expect(mockDao.findByUser).toHaveBeenCalledWith(mockUserId);
      expect(mockDao.createSurvey).toHaveBeenCalledWith(
        expect.objectContaining({
          userId: mockUserId,
          plans: mockBody.plans,
          devices: mockBody.devices,
          weeklyLessonPlans: mockBody.weeklyLessonPlans,
        }),
        null
      );
      expect(result.success).toBe(true);
      expect(result.message).toBe("Survey submitted");
    });

    it("should return error when userId is missing", async () => {
      const result = await baselineSurveyManager.submitSurvey(null, mockBody);

      expect(result.success).toBe(false);
      expect(result.message).toBe("Missing userId");
      expect(mockDao.findByUser).not.toHaveBeenCalled();
    });

    it("should return error when survey already submitted", async () => {
      mockDao.findByUser.mockResolvedValue({ _id: "existing-survey" });

      const result = await baselineSurveyManager.submitSurvey(mockUserId, mockBody);

      expect(mockDao.findByUser).toHaveBeenCalledWith(mockUserId);
      expect(result.success).toBe(false);
      expect(result.message).toBe("Already submitted");
      expect(mockDao.createSurvey).not.toHaveBeenCalled();
    });

    it("should handle otherLessonPlanComponent field correctly", async () => {
      mockDao.findByUser.mockResolvedValue(null);
      mockDao.createSurvey.mockResolvedValue({ _id: "survey-123" });

      const bodyWithOther = {
        ...mockBody,
        lessonPlanComponents: ["Component 1", "Others"],
        otherLessonPlanComponent: "Custom component",
      };

      await baselineSurveyManager.submitSurvey(mockUserId, bodyWithOther);

      expect(mockDao.createSurvey).toHaveBeenCalledWith(
        expect.objectContaining({
          lessonPlanComponents: ["Component 1", "Others: Custom component"],
        }),
        null
      );
    });

    it("should handle otherResourceUsed field correctly", async () => {
      mockDao.findByUser.mockResolvedValue(null);
      mockDao.createSurvey.mockResolvedValue({ _id: "survey-123" });

      const bodyWithOther = {
        ...mockBody,
        resourcesUsed: ["Resource 1", "Others"],
        otherResourceUsed: "Custom resource",
      };

      await baselineSurveyManager.submitSurvey(mockUserId, bodyWithOther);

      expect(mockDao.createSurvey).toHaveBeenCalledWith(
        expect.objectContaining({
          resourcesUsed: ["Resource 1", "Others: Custom resource"],
        }),
        null
      );
    });

    it("should handle otherTimePerLessonPlan correctly", async () => {
      mockDao.findByUser.mockResolvedValue(null);
      mockDao.createSurvey.mockResolvedValue({ _id: "survey-123" });

      const bodyWithOther = {
        ...mockBody,
        timePerLessonPlan: "Others",
        otherTimePerLessonPlan: "45 minutes",
      };

      await baselineSurveyManager.submitSurvey(mockUserId, bodyWithOther);

      expect(mockDao.createSurvey).toHaveBeenCalledWith(
        expect.objectContaining({
          timePerLessonPlan: "45 minutes",
        }),
        null
      );
    });

    it("should handle otherTimeForAssessments correctly", async () => {
      mockDao.findByUser.mockResolvedValue(null);
      mockDao.createSurvey.mockResolvedValue({ _id: "survey-123" });

      const bodyWithOther = {
        ...mockBody,
        timeForAssessments: "Others",
        otherTimeForAssessments: "20 minutes",
      };

      await baselineSurveyManager.submitSurvey(mockUserId, bodyWithOther);

      expect(mockDao.createSurvey).toHaveBeenCalledWith(
        expect.objectContaining({
          timeForAssessments: "20 minutes",
        }),
        null
      );
    });

    it("should normalize array fields when not provided", async () => {
      mockDao.findByUser.mockResolvedValue(null);
      mockDao.createSurvey.mockResolvedValue({ _id: "survey-123" });

      const minimalBody = {
        weeklyLessonPlans: "3",
      };

      await baselineSurveyManager.submitSurvey(mockUserId, minimalBody);

      expect(mockDao.createSurvey).toHaveBeenCalledWith(
        expect.objectContaining({
          plans: [],
          devices: [],
          lessonPlanComponents: [],
          resourcesUsed: [],
        }),
        null
      );
    });

    it("should handle duplicate key error (11000)", async () => {
      mockDao.findByUser.mockResolvedValue(null);
      const duplicateError = new Error("Duplicate");
      duplicateError.code = 11000;
      mockDao.createSurvey.mockRejectedValue(duplicateError);

      const result = await baselineSurveyManager.submitSurvey(mockUserId, mockBody);

      expect(result.success).toBe(false);
      expect(result.message).toBe("Already submitted");
    });

    it("should handle general errors", async () => {
      mockDao.findByUser.mockResolvedValue(null);
      mockDao.createSurvey.mockRejectedValue(new Error("Database error"));

      const result = await baselineSurveyManager.submitSurvey(mockUserId, mockBody);

      expect(result.success).toBe(false);
      expect(result.message).toBe("Server error");
    });

    it("should pass session parameter to createSurvey", async () => {
      mockDao.findByUser.mockResolvedValue(null);
      mockDao.createSurvey.mockResolvedValue({ _id: "survey-123" });

      const mockSession = { id: "session-123" };
      await baselineSurveyManager.submitSurvey(mockUserId, mockBody, mockSession);

      expect(mockDao.createSurvey).toHaveBeenCalledWith(expect.any(Object), mockSession);
    });
  });
});
