const LessonPlanTemplateController = require("../../../controllers/lesson.plan.template.controller");
const LessonPlanTemplateManager = require("../../../managers/lesson.plan.template.manager");
const handleError = require("../../../helper/handleError");

jest.mock("../../../managers/lesson.plan.template.manager");
jest.mock("../../../helper/handleError");

describe("LessonPlanTemplateController", () => {
  let controller;
  let mockReq;
  let mockRes;
  let mockManager;

  beforeEach(() => {
    jest.clearAllMocks();

    // Setup mock manager methods before controller instantiation
    LessonPlanTemplateManager.mockImplementation(() => ({
      findAllTemplates: jest.fn(),
    }));

    controller = new LessonPlanTemplateController();
    mockManager = controller.lessonPlanTemplateManager;

    mockReq = {
      query: {},
      body: {},
    };

    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
  });

  describe("findTemplates", () => {
    it("should find templates successfully with filters", async () => {
      const mockResult = {
        success: true,
        data: [
          { _id: "template-1", name: "Template 1", classes: 5 },
          { _id: "template-2", name: "Template 2", classes: 5 },
        ],
      };
      mockManager.findAllTemplates = jest.fn().mockResolvedValue(mockResult);
      mockReq.query = { filter: { classes: "5" } };

      await controller.findTemplates(mockReq, mockRes);

      expect(mockManager.findAllTemplates).toHaveBeenCalledWith({ classes: 5 });
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(mockResult);
    });

    it("should find templates with empty filters", async () => {
      const mockResult = {
        success: true,
        data: [],
      };
      mockManager.findAllTemplates = jest.fn().mockResolvedValue(mockResult);
      mockReq.query = {};

      await controller.findTemplates(mockReq, mockRes);

      expect(mockManager.findAllTemplates).toHaveBeenCalledWith({ classes: NaN });
      expect(mockRes.status).toHaveBeenCalledWith(200);
    });

    it("should handle find templates failure", async () => {
      const mockResult = {
        success: false,
        message: "Failed to find templates",
      };
      mockManager.findAllTemplates = jest.fn().mockResolvedValue(mockResult);
      mockReq.query = { filter: { classes: "5" } };

      await controller.findTemplates(mockReq, mockRes);

      expect(handleError).toHaveBeenCalledWith(mockResult, mockRes);
    });

    it("should handle exceptions", async () => {
      mockManager.findAllTemplates = jest.fn().mockRejectedValue(new Error("Database error"));
      mockReq.query = { filter: { classes: "5" } };

      await controller.findTemplates(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith(expect.any(Error));
    });

    it("should parse classes filter as integer", async () => {
      const mockResult = { success: true, data: [] };
      mockManager.findAllTemplates = jest.fn().mockResolvedValue(mockResult);
      mockReq.query = { filter: { classes: "10" } };

      await controller.findTemplates(mockReq, mockRes);

      expect(mockManager.findAllTemplates).toHaveBeenCalledWith({ classes: 10 });
    });
  });
});
