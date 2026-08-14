const LessonPlanTemplateManager = require("../../../managers/lesson.plan.template.manager");
const LessonPlanTemplateDao = require("../../../dao/lesson.plan.template.dao");
const BaseManager = require("../../../managers/base.manager");

jest.mock("../../../dao/lesson.plan.template.dao");

describe("LessonPlanTemplateManager", () => {
  let manager;
  let mockDao;

  beforeEach(() => {
    jest.clearAllMocks();

    LessonPlanTemplateDao.mockImplementation(() => ({
      filter: jest.fn(),
      create: jest.fn(),
      findById: jest.fn(),
      update: jest.fn(),
    }));

    manager = new LessonPlanTemplateManager();
    mockDao = manager.dao;
  });

  describe("constructor", () => {
    it("should create manager instance successfully", () => {
      expect(manager).toBeInstanceOf(LessonPlanTemplateManager);
      expect(manager).toBeInstanceOf(BaseManager);
    });

    it("should initialize with LessonPlanTemplateDao", () => {
      expect(manager.dao).toBeDefined();
      expect(LessonPlanTemplateDao).toHaveBeenCalled();
    });
  });

  describe("findAllTemplates", () => {
    it("should find templates successfully", async () => {
      const mockTemplates = [
        { _id: "template-1", name: "Template 1", classes: 5 },
        { _id: "template-2", name: "Template 2", classes: 6 },
      ];
      mockDao.filter = jest.fn().mockResolvedValue(mockTemplates);

      const filter = { classes: 5 };
      const result = await manager.findAllTemplates(filter);

      expect(mockDao.filter).toHaveBeenCalledWith(filter);
      expect(result.success).toBe(true);
      expect(result.data).toEqual(mockTemplates);
    });

    it("should return error when templates not found", async () => {
      mockDao.filter = jest.fn().mockResolvedValue(null);

      const result = await manager.findAllTemplates({});

      expect(result.success).toBe(false);
      expect(result.message).toBe("Templates not found");
      expect(result.data).toBeNull();
    });

    it("should propagate errors instead of swallowing them", async () => {
      const error = new Error("Database error");
      mockDao.filter = jest.fn().mockRejectedValue(error);

      await expect(manager.findAllTemplates({})).rejects.toThrow("Database error");
    });

    it("should find templates with empty filter", async () => {
      const mockTemplates = [{ _id: "template-1" }];
      mockDao.filter = jest.fn().mockResolvedValue(mockTemplates);

      const result = await manager.findAllTemplates({});

      expect(mockDao.filter).toHaveBeenCalledWith({});
      expect(result.success).toBe(true);
      expect(result.data).toEqual(mockTemplates);
    });

    it("should find templates with multiple filter criteria", async () => {
      const mockTemplates = [{ _id: "template-1", classes: 5, subject: "Math" }];
      mockDao.filter = jest.fn().mockResolvedValue(mockTemplates);

      const filter = { classes: 5, subject: "Math" };
      const result = await manager.findAllTemplates(filter);

      expect(mockDao.filter).toHaveBeenCalledWith(filter);
      expect(result.success).toBe(true);
    });
  });
});
