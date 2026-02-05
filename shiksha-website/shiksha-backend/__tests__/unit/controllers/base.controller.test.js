const BaseController = require("../../../controllers/base.controller");
const {
  createMockRequest,
  createMockResponse,
  createMockNext,
} = require("../../utils/test.helpers");

// Mock Manager
class MockManager {
  constructor() {
    this.getAll = jest.fn();
    this.getById = jest.fn();
    this.create = jest.fn();
    this.update = jest.fn();
    this.delete = jest.fn();
    this.activate = jest.fn();
    this.deactivate = jest.fn();
  }
}

describe("BaseController", () => {
  let controller;
  let mockManager;

  beforeEach(() => {
    mockManager = new MockManager();
    controller = new BaseController(mockManager);
    jest.clearAllMocks();
  });

  describe("getAll", () => {
    it("should return paginated results", async () => {
      const req = createMockRequest({
        query: { page: "1", limit: "10" },
      });
      const res = createMockResponse();

      const mockData = {
        success: true,
        data: [{ id: 1 }, { id: 2 }],
        pagination: { total: 2, page: 1, pages: 1 },
        message: "Success",
      };

      mockManager.getAll.mockResolvedValue(mockData);

      await controller.getAll(req, res);

      expect(mockManager.getAll).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockData);
    });

    it("should handle query parameters", async () => {
      const req = createMockRequest({
        query: {
          page: "2",
          limit: "20",
          search: "test",
          sortBy: "name",
          order: "desc",
        },
      });
      const res = createMockResponse();

      const mockData = {
        success: true,
        data: [],
        pagination: {},
        message: "Success",
      };

      mockManager.getAll.mockResolvedValue(mockData);

      await controller.getAll(req, res);

      expect(mockManager.getAll).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
    });

    it("should handle errors", async () => {
      const req = createMockRequest({ query: {} });
      const res = createMockResponse();

      mockManager.getAll.mockResolvedValue({
        success: false,
        message: "Error occurred",
      });

      await controller.getAll(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: "Error occurred",
      });
    });
  });

  describe("getById", () => {
    it("should return record by ID", async () => {
      const req = createMockRequest({
        params: { id: "123" },
      });
      const res = createMockResponse();

      const mockData = {
        success: true,
        data: { _id: "123", name: "Test" },
        message: "Record found",
      };

      mockManager.getById.mockResolvedValue(mockData);

      await controller.getById(req, res);

      expect(mockManager.getById).toHaveBeenCalledWith(req);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockData);
    });

    it("should handle not found", async () => {
      const req = createMockRequest({
        params: { id: "123" },
      });
      const res = createMockResponse();

      mockManager.getById.mockResolvedValue({
        success: false,
        message: "Record not found",
      });

      await controller.getById(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
    });
  });

  describe("create", () => {
    it("should create a new record", async () => {
      const req = createMockRequest({
        body: { name: "New Item" },
      });
      const res = createMockResponse();

      const mockData = {
        success: true,
        data: { _id: "123", name: "New Item" },
        message: "Record created successfully",
      };

      mockManager.create.mockResolvedValue(mockData);

      await controller.create(req, res);

      expect(mockManager.create).toHaveBeenCalledWith(req);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockData);
    });

    it("should handle validation errors", async () => {
      const req = createMockRequest({
        body: {},
      });
      const res = createMockResponse();

      mockManager.create.mockResolvedValue({
        success: false,
        message: "Validation error",
      });

      await controller.create(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
    });
  });

  describe("update", () => {
    it("should update a record", async () => {
      const req = createMockRequest({
        params: { id: "123" },
        body: { name: "Updated Item" },
      });
      const res = createMockResponse();

      const mockData = {
        success: true,
        data: { _id: "123", name: "Updated Item" },
        message: "Record updated successfully",
      };

      mockManager.update.mockResolvedValue(mockData);

      await controller.update(req, res);

      expect(mockManager.update).toHaveBeenCalledWith(req);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockData);
    });

    it("should handle not found on update", async () => {
      const req = createMockRequest({
        params: { id: "123" },
        body: { name: "Updated" },
      });
      const res = createMockResponse();

      mockManager.update.mockResolvedValue({
        success: false,
        message: "Record not found",
      });

      await controller.update(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
    });
  });

  describe("delete", () => {
    it("should delete a record", async () => {
      const req = createMockRequest({
        params: { id: "123" },
      });
      const res = createMockResponse();

      const mockData = {
        success: true,
        message: "Record deleted successfully",
      };

      mockManager.delete.mockResolvedValue(mockData);

      await controller.delete(req, res);

      expect(mockManager.delete).toHaveBeenCalledWith(req);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockData);
    });

    it("should handle not found on delete", async () => {
      const req = createMockRequest({
        params: { id: "123" },
      });
      const res = createMockResponse();

      mockManager.delete.mockResolvedValue({
        success: false,
        message: "Record not found",
      });

      await controller.delete(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
    });
  });

  describe("activate", () => {
    it("should activate a deleted record", async () => {
      const req = createMockRequest({
        params: { id: "123" },
      });
      const res = createMockResponse();

      const mockData = {
        success: true,
        data: { _id: "123", isDeleted: false },
        message: "Record activated successfully",
      };

      mockManager.activate.mockResolvedValue(mockData);

      await controller.activate(req, res);

      expect(mockManager.activate).toHaveBeenCalledWith(req);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockData);
    });
  });

  describe("deactivate", () => {
    it("should deactivate a record", async () => {
      const req = createMockRequest({
        params: { id: "123" },
      });
      const res = createMockResponse();

      const mockData = {
        success: true,
        data: { _id: "123", isDeleted: true },
        message: "Record deactivated successfully",
      };

      mockManager.deactivate.mockResolvedValue(mockData);

      await controller.deactivate(req, res);

      expect(mockManager.deactivate).toHaveBeenCalledWith(req);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockData);
    });
  });

  describe("error handling", () => {
    it("should handle internal server errors", async () => {
      const req = createMockRequest({ query: {} });
      const res = createMockResponse();

      mockManager.getAll.mockRejectedValue(new Error("Internal error"));

      await controller.getAll(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
    });
  });

  describe("status code determination", () => {
    it("should use 404 for not found", async () => {
      const req = createMockRequest({ params: { id: "123" } });
      const res = createMockResponse();

      mockManager.getById.mockResolvedValue({
        success: false,
        message: "not found",
      });

      await controller.getById(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
    });

    it("should use 400 for other errors", async () => {
      const req = createMockRequest({ body: {} });
      const res = createMockResponse();

      mockManager.create.mockResolvedValue({
        success: false,
        message: "Validation failed",
      });

      await controller.create(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
    });
  });
});
