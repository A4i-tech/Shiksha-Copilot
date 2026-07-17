const BaselineSurveyDao = require("../../../dao/baselineSurvey.dao");
const BaselineSurveyReminderDao = require("../../../dao/baselineSurveyReminder.dao");
process.env.BASELINE_SURVEY = "true";

jest.mock("../../../dao/baselineSurvey.dao");
jest.mock("../../../dao/baselineSurveyReminder.dao");
jest.mock("../../../config/loggers", () => ({ error: jest.fn(), info: jest.fn(), warn: jest.fn() }));

// Create mock DAOs before requiring the manager
const mockDao = {
  existsByUser: jest.fn(),
  findByUser: jest.fn(),
  createSurvey: jest.fn(),
};

const mockReminderDao = {
  getCount: jest.fn(),
  increment: jest.fn(),
};

BaselineSurveyDao.mockImplementation(() => mockDao);
BaselineSurveyReminderDao.mockImplementation(() => mockReminderDao);

// Import manager after mocking to ensure the instance gets the mocked DAOs
const baselineSurveyManager = require("../../../managers/baselineSurvey.manager");

describe("BaselineSurveyManager", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("checkCompleted", () => {
    it("should return completed status when survey exists", async () => {
      mockDao.existsByUser.mockResolvedValue(true);
      mockReminderDao.getCount.mockResolvedValue(0);

      const result = await baselineSurveyManager.checkCompleted("user-123");

      expect(mockDao.existsByUser).toHaveBeenCalledWith("user-123", expect.any(Number));
      expect(result.success).toBe(true);
      expect(result.data.completed).toBe(true);
    });

    it("should return not completed when survey does not exist", async () => {
      mockDao.existsByUser.mockResolvedValue(false);
      mockReminderDao.getCount.mockResolvedValue(0);

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

    it("should include maxReminders in the response data", async () => {
      mockDao.existsByUser.mockResolvedValue(false);
      mockReminderDao.getCount.mockResolvedValue(1);

      const result = await baselineSurveyManager.checkCompleted("user-123");

      expect(result.success).toBe(true);
      expect(result.data.maxReminders).toBeDefined();
      expect(typeof result.data.maxReminders).toBe("number");
    });

    it("should set isMandatory=true when remindLaterCount >= maxReminders", async () => {
      mockDao.existsByUser.mockResolvedValue(false);
      mockReminderDao.getCount.mockResolvedValue(3);

      const result = await baselineSurveyManager.checkCompleted("user-123");

      expect(result.data.isMandatory).toBe(true);
    });
  });

  describe("getRemindLaterCount", () => {
    it("should return count from the reminder DAO", async () => {
      mockReminderDao.getCount.mockResolvedValue(2);

      const count = await baselineSurveyManager.getRemindLaterCount("user-123", 2026);

      expect(mockReminderDao.getCount).toHaveBeenCalledWith("user-123", 2026);
      expect(count).toBe(2);
    });

    it("should let DB errors propagate (not swallow)", async () => {
      mockReminderDao.getCount.mockRejectedValue(new Error("DB connection lost"));

      await expect(
        baselineSurveyManager.getRemindLaterCount("user-123", 2026)
      ).rejects.toThrow("DB connection lost");
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

      expect(mockDao.findByUser).toHaveBeenCalledWith(mockUserId, expect.any(Number));
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

    it("should return ALREADY_SUBMITTED code when survey already submitted", async () => {
      mockDao.findByUser.mockResolvedValue({ _id: "existing-survey" });

      const result = await baselineSurveyManager.submitSurvey(mockUserId, mockBody);

      expect(mockDao.findByUser).toHaveBeenCalledWith(mockUserId, expect.any(Number));
      expect(result.success).toBe(false);
      expect(result.code).toBe("ALREADY_SUBMITTED");
      expect(result.message).toBe("Already submitted for this academic year");
      expect(mockDao.createSurvey).not.toHaveBeenCalled();
    });

    it("should handle otherLessonPlanComponent field correctly", async () => {
      mockDao.findByUser.mockResolvedValue(null);
      mockDao.createSurvey.mockResolvedValue({ _id: "survey-123" });

      const bodyWithOther = {
        ...mockBody,
        lessonPlanComponents: ["Component 1", "Other"],
        lessonPlanComponentsOther: "Custom component",
      };

      await baselineSurveyManager.submitSurvey(mockUserId, bodyWithOther);

      expect(mockDao.createSurvey).toHaveBeenCalledWith(
        expect.objectContaining({
          lessonPlanComponents: ["Component 1", "Other: Custom component"],
        }),
        null
      );
    });

    it("should handle otherResourceUsed field correctly", async () => {
      mockDao.findByUser.mockResolvedValue(null);
      mockDao.createSurvey.mockResolvedValue({ _id: "survey-123" });

      const bodyWithOther = {
        ...mockBody,
        resourcesUsed: ["Resource 1", "Other"],
        resourcesUsedOther: "Custom resource",
      };

      await baselineSurveyManager.submitSurvey(mockUserId, bodyWithOther);

      expect(mockDao.createSurvey).toHaveBeenCalledWith(
        expect.objectContaining({
          resourcesUsed: ["Resource 1", "Other: Custom resource"],
        }),
        null
      );
    });

    it("should handle otherTimePerLessonPlan correctly", async () => {
      mockDao.findByUser.mockResolvedValue(null);
      mockDao.createSurvey.mockResolvedValue({ _id: "survey-123" });

      const bodyWithOther = {
        ...mockBody,
        timePerLessonPlan: "Other",
        timePerLessonPlanOther: "45 minutes",
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
        timeForAssessments: "Other",
        timeForAssessmentsOther: "20 minutes",
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

    it("should return ALREADY_SUBMITTED code for duplicate key error (11000)", async () => {
      mockDao.findByUser.mockResolvedValue(null);
      const duplicateError = new Error("Duplicate");
      duplicateError.code = 11000;
      mockDao.createSurvey.mockRejectedValue(duplicateError);

      const result = await baselineSurveyManager.submitSurvey(mockUserId, mockBody);

      expect(result.success).toBe(false);
      expect(result.code).toBe("ALREADY_SUBMITTED");
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

  describe("incrementRemindLater", () => {
    beforeEach(() => {
      mockReminderDao.getCount.mockReset();
      mockReminderDao.increment.mockReset();
    });

    it("should return error when userId is missing", async () => {
      const result = await baselineSurveyManager.incrementRemindLater(null);
      expect(result.success).toBe(false);
      expect(result.message).toBe("Missing userId");
      expect(mockDao.existsByUser).not.toHaveBeenCalled();
    });

    it("should increment reminder count for a non-completed user", async () => {
      mockDao.existsByUser.mockResolvedValue(false);
      mockReminderDao.getCount.mockResolvedValue(0);
      mockReminderDao.increment.mockResolvedValue({ remindLaterCount: 1 });

      const result = await baselineSurveyManager.incrementRemindLater("user-123");

      expect(mockDao.existsByUser).toHaveBeenCalledWith("user-123", expect.any(Number));
      expect(mockReminderDao.increment).toHaveBeenCalledWith("user-123", expect.any(Number), null);
      expect(result.success).toBe(true);
      expect(result.data.remindLaterCount).toBe(1);
      expect(result.data.isMandatory).toBe(false);
    });

    it("should set isMandatory=true when reminder count reaches MAX_REMIND_LATER (3)", async () => {
      mockDao.existsByUser.mockResolvedValue(false);
      mockReminderDao.getCount.mockResolvedValue(2);
      mockReminderDao.increment.mockResolvedValue({ remindLaterCount: 3 });

      const result = await baselineSurveyManager.incrementRemindLater("user-123");

      expect(result.success).toBe(true);
      expect(result.data.remindLaterCount).toBe(3);
      expect(result.data.isMandatory).toBe(true);
    });

    it("should not increment reminder count if survey already completed", async () => {
      mockDao.existsByUser.mockResolvedValue(true);
      mockReminderDao.getCount.mockResolvedValue(2);

      const result = await baselineSurveyManager.incrementRemindLater("user-123");

      expect(mockReminderDao.increment).not.toHaveBeenCalled();
      expect(result.success).toBe(true);
      expect(result.message).toBe("Survey already completed");
      expect(result.data.completed).toBe(true);
      expect(result.data.remindLaterCount).toBe(2);
    });

    it("should not increment past MAX_REMIND_LATER (ceiling)", async () => {
      mockDao.existsByUser.mockResolvedValue(false);
      mockReminderDao.getCount.mockResolvedValue(3);

      const result = await baselineSurveyManager.incrementRemindLater("user-123");

      expect(mockReminderDao.increment).not.toHaveBeenCalled();
      expect(result.success).toBe(true);
      expect(result.message).toBe("Maximum reminders reached");
      expect(result.data.remindLaterCount).toBe(3);
      expect(result.data.isMandatory).toBe(true);
    });

    it("should pass session parameter to reminder DAO", async () => {
      mockDao.existsByUser.mockResolvedValue(false);
      mockReminderDao.getCount.mockResolvedValue(0);
      mockReminderDao.increment.mockResolvedValue({ remindLaterCount: 1 });

      const mockSession = { id: "session-123" };
      await baselineSurveyManager.incrementRemindLater("user-123", mockSession);

      expect(mockReminderDao.increment).toHaveBeenCalledWith("user-123", expect.any(Number), mockSession);
    });

    it("should handle database errors gracefully", async () => {
      mockDao.existsByUser.mockRejectedValue(new Error("DB failure"));

      const result = await baselineSurveyManager.incrementRemindLater("user-123");

      expect(result.success).toBe(false);
      expect(result.message).toBe("Server error");
    });
  });
});
