const baselineSurveyController = require("../../../controllers/baselineSurvey.controller");
const baselineSurveyManager = require("../../../managers/baselineSurvey.manager");

jest.mock("../../../managers/baselineSurvey.manager");

describe("BaselineSurveyController", () => {
  let mockReq;
  let mockRes;

  beforeEach(() => {
    jest.clearAllMocks();

    mockReq = {
      user: { _id: "user-123" },
      body: {},
    };

    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
  });

  describe("checkIfCompleted", () => {
    it("should check if survey is completed successfully", async () => {
      const mockResult = {
        success: true,
        data: { completed: true },
      };
      baselineSurveyManager.checkCompleted = jest.fn().mockResolvedValue(mockResult);

      await baselineSurveyController.checkIfCompleted(mockReq, mockRes);

      expect(baselineSurveyManager.checkCompleted).toHaveBeenCalledWith("user-123");
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(mockResult);
    });

    it("should return 401 when user is not authenticated", async () => {
      mockReq.user = null;

      await baselineSurveyController.checkIfCompleted(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
          message: "Unauthorized",
        })
      );
      expect(baselineSurveyManager.checkCompleted).not.toHaveBeenCalled();
    });

    it("should return 401 when user._id is missing", async () => {
      mockReq.user = {};

      await baselineSurveyController.checkIfCompleted(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(401);
    });

    it("should return 400 when check fails", async () => {
      const mockResult = {
        success: false,
        message: "Check failed",
      };
      baselineSurveyManager.checkCompleted = jest.fn().mockResolvedValue(mockResult);

      await baselineSurveyController.checkIfCompleted(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith(mockResult);
    });

    it("should handle exceptions", async () => {
      baselineSurveyManager.checkCompleted = jest.fn().mockRejectedValue(new Error("Database error"));

      await baselineSurveyController.checkIfCompleted(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
          message: "Server error",
        })
      );
    });
  });

  describe("submitSurvey", () => {
    it("should submit survey successfully", async () => {
      const mockResult = {
        success: true,
        data: { surveyId: "survey-123" },
      };
      baselineSurveyManager.submitSurvey = jest.fn().mockResolvedValue(mockResult);
      mockReq.body = { answers: { q1: "answer1", q2: "answer2" } };

      await baselineSurveyController.submitSurvey(mockReq, mockRes);

      expect(baselineSurveyManager.submitSurvey).toHaveBeenCalledWith("user-123", mockReq.body);
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(mockResult);
    });

    it("should return 401 when user is not authenticated", async () => {
      mockReq.user = null;
      mockReq.body = { answers: {} };

      await baselineSurveyController.submitSurvey(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
          message: "Unauthorized",
        })
      );
      expect(baselineSurveyManager.submitSurvey).not.toHaveBeenCalled();
    });

    it("should return 409 when survey already submitted", async () => {
      const mockResult = {
        success: false,
        message: "Already submitted",
      };
      baselineSurveyManager.submitSurvey = jest.fn().mockResolvedValue(mockResult);
      mockReq.body = { answers: {} };

      await baselineSurveyController.submitSurvey(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(409);
      expect(mockRes.json).toHaveBeenCalledWith(mockResult);
    });

    it("should return 400 when submission fails", async () => {
      const mockResult = {
        success: false,
        message: "Submission failed",
      };
      baselineSurveyManager.submitSurvey = jest.fn().mockResolvedValue(mockResult);
      mockReq.body = { answers: {} };

      await baselineSurveyController.submitSurvey(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith(mockResult);
    });

    it("should handle duplicate key error (11000)", async () => {
      const duplicateError = new Error("Duplicate");
      duplicateError.code = 11000;
      baselineSurveyManager.submitSurvey = jest.fn().mockRejectedValue(duplicateError);
      mockReq.body = { answers: {} };

      await baselineSurveyController.submitSurvey(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(409);
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
          message: "Already submitted",
        })
      );
    });

    it("should handle general exceptions", async () => {
      baselineSurveyManager.submitSurvey = jest.fn().mockRejectedValue(new Error("Server error"));
      mockReq.body = { answers: {} };

      await baselineSurveyController.submitSurvey(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
          message: "Server error",
        })
      );
    });
  });
});
