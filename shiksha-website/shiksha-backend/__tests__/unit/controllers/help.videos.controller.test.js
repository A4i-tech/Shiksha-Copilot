const HelpVideosController = require("../../../controllers/help.videos.controller");
const HelpVideosManager = require("../../../managers/help.vidoes.manager");
const HelpVideos = require("../../../models/help.videos.model");

jest.mock("../../../managers/help.vidoes.manager");
jest.mock("../../../models/help.videos.model");

describe("HelpVideosController", () => {
  let controller;
  let mockReq;
  let mockRes;

  beforeEach(() => {
    jest.clearAllMocks();

    controller = new HelpVideosController();

    mockReq = {
      query: {},
      body: {},
    };

    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
  });

  describe("getAllHelpVideos", () => {
    it("should get all help videos successfully", async () => {
      const mockVideos = [
        { _id: "video-1", title: "Video 1", state: "active" },
        { _id: "video-2", title: "Video 2", state: "active" },
      ];

      const mockFind = {
        sort: jest.fn().mockResolvedValue(mockVideos),
      };

      HelpVideos.find = jest.fn().mockReturnValue(mockFind);

      await controller.getAllHelpVideos(mockReq, mockRes);

      expect(HelpVideos.find).toHaveBeenCalledWith({});
      expect(mockFind.sort).toHaveBeenCalledWith({ createdAt: -1 });
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        data: mockVideos,
      });
    });

    it("should filter videos by state", async () => {
      const mockVideos = [{ _id: "video-1", title: "Video 1", state: "Karnataka" }];

      const mockFind = {
        sort: jest.fn().mockResolvedValue(mockVideos),
      };

      HelpVideos.find = jest.fn().mockReturnValue(mockFind);
      mockReq.query = { state: "Karnataka" };

      await controller.getAllHelpVideos(mockReq, mockRes);

      expect(HelpVideos.find).toHaveBeenCalledWith({ state: "Karnataka" });
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        data: mockVideos,
      });
    });

    it("should handle errors", async () => {
      const mockFind = {
        sort: jest.fn().mockRejectedValue(new Error("Database error")),
      };

      HelpVideos.find = jest.fn().mockReturnValue(mockFind);

      await controller.getAllHelpVideos(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: "Error fetching help videos",
        error: "Database error",
      });
    });
  });

  describe("bulkUploadHelpVideos", () => {
    it("should bulk upload help videos successfully", async () => {
      const mockVideos = [
        { title: "Video 1", url: "http://example.com/1" },
        { title: "Video 2", url: "http://example.com/2" },
      ];

      const mockInsertedVideos = [
        { _id: "video-1", title: "Video 1", url: "http://example.com/1" },
        { _id: "video-2", title: "Video 2", url: "http://example.com/2" },
      ];

      HelpVideos.insertMany = jest.fn().mockResolvedValue(mockInsertedVideos);
      mockReq.body = mockVideos;

      await controller.bulkUploadHelpVideos(mockReq, mockRes);

      expect(HelpVideos.insertMany).toHaveBeenCalledWith(mockVideos);
      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: "Help videos uploaded successfully",
        data: mockInsertedVideos,
      });
    });

    it("should return 400 when body is not an array", async () => {
      mockReq.body = { title: "Single Video" };

      await controller.bulkUploadHelpVideos(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: "Request body must be a non-empty array of videos",
      });
      expect(HelpVideos.insertMany).not.toHaveBeenCalled();
    });

    it("should return 400 when array is empty", async () => {
      mockReq.body = [];

      await controller.bulkUploadHelpVideos(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: "Request body must be a non-empty array of videos",
      });
      expect(HelpVideos.insertMany).not.toHaveBeenCalled();
    });

    it("should handle errors", async () => {
      const mockVideos = [{ title: "Video 1" }];
      HelpVideos.insertMany = jest.fn().mockRejectedValue(new Error("Database error"));
      mockReq.body = mockVideos;

      await controller.bulkUploadHelpVideos(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: "Error bulk uploading help videos",
        error: "Database error",
      });
    });
  });
});
