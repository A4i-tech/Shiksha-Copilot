const ChapterController = require("../../../controllers/chapter.controller");
const ChapterManager = require("../../../managers/chapter.manager");

// Mock dependencies
jest.mock("../../../managers/chapter.manager");

describe("ChapterController", () => {
  let controller;
  let mockReq;
  let mockRes;
  let mockManager;

  beforeEach(() => {
    jest.clearAllMocks();

    controller = new ChapterController();
    mockManager = new ChapterManager();
    controller.manager = mockManager;

    mockReq = {
      params: {},
      body: {},
      query: {},
      user: { id: "user-1", email: "test@example.com" },
    };

    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
  });

  describe("Instance creation", () => {
    it("should create an instance of ChapterController", () => {
      expect(controller).toBeInstanceOf(ChapterController);
    });

    it("should have a manager property", () => {
      expect(controller.manager).toBeDefined();
    });
  });

  describe("submit", () => {
    it("passes the acting user id, so the manager ties the write to the assigned curator", async () => {
      mockManager.submit.mockResolvedValue({ success: true });
      mockReq.params.id = "c1";
      mockReq.user._id = "u1";

      await controller.submit(mockReq, mockRes);

      expect(mockManager.submit).toHaveBeenCalledWith("c1", "u1");
    });
  });

  describe("curators", () => {
    it("answers 200 with the manager result", async () => {
      const result = { success: true, message: "", data: { results: [{ _id: "u1", name: "Asha" }] } };
      mockManager.curators.mockResolvedValue(result);

      await controller.curators(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(result);
    });
  });

  describe("exportCsv", () => {
    beforeEach(() => {
      mockRes.setHeader = jest.fn();
      mockRes.send = jest.fn();
    });

    it("passes the list filter, sort, and status, and sends the CSV buffer behind a UTF-8 BOM", async () => {
      mockManager.exportCsv.mockResolvedValue(Buffer.from('"Board"'));
      mockReq.query = { filter: { standard: "10" }, includeDeleted: "0" };

      await controller.exportCsv(mockReq, mockRes);

      expect(mockManager.exportCsv).toHaveBeenCalledWith({ standard: "10" }, { createdAt: -1 }, { isDeleted: { $ne: true } });
      const sent = mockRes.send.mock.calls[0][0];
      expect(sent.subarray(0, 3)).toEqual(Buffer.from([0xef, 0xbb, 0xbf]));
      expect(sent.subarray(3).toString()).toBe('"Board"');
    });
  });
});
