const MasterResourceController = require("../../../controllers/master.resource.controller");
const MasterResourceManager = require("../../../managers/master.resource.manager");
const handleError = require("../../../helper/handleError");

jest.mock("../../../managers/master.resource.manager");
jest.mock("../../../helper/handleError");

describe("MasterResourceController", () => {
  let controller;
  let mockReq;
  let mockRes;
  let mockManager;

  beforeEach(() => {
    jest.clearAllMocks();

    // Setup mock manager methods before controller instantiation
    MasterResourceManager.mockImplementation(() => ({
      updateMasterResource: jest.fn(),
      regenerateResourcePlan: jest.fn(),
      comboScript: jest.fn(),
      getSubtopicResourceList: jest.fn(),
      generateResourcePlan: jest.fn(),
      uploadMasterResources: jest.fn(),
      uploadOldMasterResources: jest.fn(),
    }));

    controller = new MasterResourceController();
    mockManager = controller.manager;

    mockReq = {
      user: { _id: "user-123", role: "teacher" },
      permissions: ["lesson-resource.generate"],
      params: {},
      query: {},
      body: {},
    };

    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
      send: jest.fn().mockReturnThis(),
    };
  });

  describe("update", () => {
    it("should update master resource successfully", async () => {
      const mockResult = {
        success: true,
        data: { resourceId: "resource-123", updated: true },
      };
      mockManager.updateMasterResource = jest.fn().mockResolvedValue(mockResult);
      mockReq.params = { id: "resource-123" };
      mockReq.body = { title: "Updated Resource" };

      await controller.update(mockReq, mockRes);

      expect(mockManager.updateMasterResource).toHaveBeenCalledWith("resource-123", mockReq.body);
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(mockResult.data);
    });

    it("should return 404 when resource not found", async () => {
      const mockResult = { success: false, message: "Resource not found" };
      mockManager.updateMasterResource = jest.fn().mockResolvedValue(mockResult);
      mockReq.params = { id: "invalid-id" };

      await controller.update(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({ message: "Resource not found" });
    });

    it("should handle exceptions", async () => {
      mockManager.updateMasterResource = jest.fn().mockRejectedValue(new Error("Database error"));
      mockReq.params = { id: "resource-123" };

      await controller.update(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith(expect.any(Error));
    });
  });

  describe("regenerate", () => {
    it("should regenerate resource for power user", async () => {
      const mockResult = {
        success: true,
        data: { resourceId: "resource-123", regenerated: true },
      };
      mockManager.regenerateResourcePlan = jest.fn().mockResolvedValue(mockResult);
      mockReq.permissions = ["lesson-resource.generate"];
      mockReq.body = {
        resourceId: "resource-123",
        reason: "Outdated content",
        userId: "user-123",
      };

      await controller.regenerate(mockReq, mockRes);

      expect(mockManager.regenerateResourcePlan).toHaveBeenCalledWith({
        resourceId: "resource-123",
        reason: "Outdated content",
        userId: "user-123",
      });
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(mockResult.data);
    });

    it("should regenerate resource for admin user", async () => {
      const mockResult = { success: true, data: { regenerated: true } };
      mockManager.regenerateResourcePlan = jest.fn().mockResolvedValue(mockResult);
      mockReq.permissions = ["content.activity.view"];
      mockReq.body = {
        resourceId: "resource-123",
        reason: "Test",
        userId: "user-123",
      };

      await controller.regenerate(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(200);
    });

    it("should regenerate resource for manager user", async () => {
      const mockResult = { success: true, data: { regenerated: true } };
      mockManager.regenerateResourcePlan = jest.fn().mockResolvedValue(mockResult);
      mockReq.permissions = ["content.activity.view"];
      mockReq.body = {
        resourceId: "resource-123",
        reason: "Test",
        userId: "user-123",
      };

      await controller.regenerate(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(200);
    });

    it("should return 404 when regeneration fails", async () => {
      const mockResult = { success: false, message: "Regeneration failed" };
      mockManager.regenerateResourcePlan = jest.fn().mockResolvedValue(mockResult);
      mockReq.permissions = ["content.activity.view"];
      mockReq.body = {
        resourceId: "resource-123",
        reason: "Test",
        userId: "user-123",
      };

      await controller.regenerate(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({ message: "Regeneration failed" });
    });

    it("should handle exceptions", async () => {
      mockManager.regenerateResourcePlan = jest.fn().mockRejectedValue(new Error("Error"));
      mockReq.permissions = ["content.activity.view"];
      mockReq.body = {
        resourceId: "resource-123",
        reason: "Test",
        userId: "user-123",
      };

      await controller.regenerate(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
    });
  });

  describe("comboScript", () => {
    it("should execute combo script with default values", async () => {
      const mockResult = { success: true, data: { processed: 100 } };
      mockManager.comboScript = jest.fn().mockResolvedValue(mockResult);

      await controller.comboScript(mockReq, mockRes);

      expect(mockManager.comboScript).toHaveBeenCalledWith("CBSE", "English");
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(mockResult.data);
    });

    it("should execute combo script with custom values", async () => {
      const mockResult = { success: true, data: { processed: 50 } };
      mockManager.comboScript = jest.fn().mockResolvedValue(mockResult);
      mockReq.body = { board: "ICSE", medium: "Hindi" };

      await controller.comboScript(mockReq, mockRes);

      expect(mockManager.comboScript).toHaveBeenCalledWith("ICSE", "Hindi");
      expect(mockRes.status).toHaveBeenCalledWith(200);
    });

    it("should handle combo script failure", async () => {
      const mockResult = { success: false, message: "Script failed" };
      mockManager.comboScript = jest.fn().mockResolvedValue(mockResult);

      await controller.comboScript(mockReq, mockRes);

      expect(handleError).toHaveBeenCalledWith(mockResult, mockRes);
    });
  });

  describe("getSubtopicResourceList", () => {
    it("should get subtopic resource list successfully", async () => {
      const mockResult = {
        data: { resources: ["resource-1", "resource-2"] },
      };
      mockManager.getSubtopicResourceList = jest.fn().mockResolvedValue(mockResult);
      mockReq.body = { chapterId: "chapter-123", templateIds: ["t1", "t2"] };

      await controller.getSubtopicResourceList(mockReq, mockRes);

      expect(mockManager.getSubtopicResourceList).toHaveBeenCalledWith("chapter-123", ["t1", "t2"]);
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(mockResult);
    });

    it("should handle failure", async () => {
      mockManager.getSubtopicResourceList = jest.fn().mockResolvedValue(null);

      await controller.getSubtopicResourceList(mockReq, mockRes);

      expect(handleError).toHaveBeenCalled();
    });

    it("should handle exceptions", async () => {
      mockManager.getSubtopicResourceList = jest.fn().mockRejectedValue(new Error("Error"));
      mockReq.body = { chapterId: "chapter-123", templateIds: [] };

      await controller.getSubtopicResourceList(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
    });
  });

  describe("generateResourcePlan", () => {
    it("should generate resource plan successfully", async () => {
      const mockResult = {
        success: true,
        data: { resourcePlanId: "rp-123", generated: true },
      };
      mockManager.generateResourcePlan = jest.fn().mockResolvedValue(mockResult);
      mockReq.params = { resourceId: "resource-123" };
      mockReq.query = { filters: { board: "CBSE" } };

      await controller.generateResourcePlan(mockReq, mockRes);

      expect(mockManager.generateResourcePlan).toHaveBeenCalledWith(
        "user-123",
        "resource-123",
        { board: "CBSE" }
      );
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(mockResult);
    });

    it("should handle generation failure", async () => {
      const mockResult = { success: false, message: "Generation failed" };
      mockManager.generateResourcePlan = jest.fn().mockResolvedValue(mockResult);
      mockReq.params = { resourceId: "resource-123" };

      await controller.generateResourcePlan(mockReq, mockRes);

      expect(handleError).toHaveBeenCalledWith(mockResult, mockRes);
    });

    it("should handle empty filters", async () => {
      const mockResult = { success: true, data: { generated: true } };
      mockManager.generateResourcePlan = jest.fn().mockResolvedValue(mockResult);
      mockReq.params = { resourceId: "resource-123" };
      mockReq.query = {};

      await controller.generateResourcePlan(mockReq, mockRes);

      expect(mockManager.generateResourcePlan).toHaveBeenCalledWith("user-123", "resource-123", {});
    });
  });

  describe("uploadMasterResource", () => {
    it("should upload master resource successfully", async () => {
      const mockResult = { success: true, data: { uploaded: true } };
      mockManager.uploadMasterResources = jest.fn().mockResolvedValue(mockResult);

      await controller.uploadMasterResource(mockReq, mockRes);

      expect(mockManager.uploadMasterResources).toHaveBeenCalledWith(mockReq);
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(mockResult);
    });

    it("should handle upload failure", async () => {
      const mockResult = { success: false, message: "Upload failed" };
      mockManager.uploadMasterResources = jest.fn().mockResolvedValue(mockResult);

      await controller.uploadMasterResource(mockReq, mockRes);

      expect(handleError).toHaveBeenCalledWith(mockResult, mockRes);
    });

    it("should handle exceptions", async () => {
      mockManager.uploadMasterResources = jest.fn().mockRejectedValue(new Error("Error"));

      await controller.uploadMasterResource(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
    });
  });

  describe("uploadOldMasterResource", () => {
    it("should upload old master resource successfully", async () => {
      const mockResult = { success: true, data: { uploaded: true } };
      mockManager.uploadOldMasterResources = jest.fn().mockResolvedValue(mockResult);

      await controller.uploadOldMasterResource(mockReq, mockRes);

      expect(mockManager.uploadOldMasterResources).toHaveBeenCalledWith(mockReq);
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(mockResult);
    });

    it("should handle upload failure", async () => {
      const mockResult = { success: false, message: "Upload failed" };
      mockManager.uploadOldMasterResources = jest.fn().mockResolvedValue(mockResult);

      await controller.uploadOldMasterResource(mockReq, mockRes);

      expect(handleError).toHaveBeenCalledWith(mockResult, mockRes);
    });

    it("should handle exceptions", async () => {
      mockManager.uploadOldMasterResources = jest.fn().mockRejectedValue(new Error("Error"));

      await controller.uploadOldMasterResource(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
    });
  });
});
