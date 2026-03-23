const BoardController = require("../../../controllers/board.controller");
const BoardManager = require("../../../managers/board.manager");
const handleError = require("../../../helper/handleError");

jest.mock("../../../managers/board.manager");
jest.mock("../../../helper/handleError");

describe("BoardController", () => {
  let boardController;
  let mockBoardManager;
  let req, res;

  beforeEach(() => {
    mockBoardManager = {
      getByName: jest.fn(),
      update: jest.fn(),
      create: jest.fn(),
      getById: jest.fn(),
      getAll: jest.fn(),
      delete: jest.fn(),
    };

    BoardManager.mockImplementation(() => mockBoardManager);
    boardController = new BoardController();

    req = {
      params: {},
      body: {},
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };

    handleError.mockImplementation((result, res) => {
      res.status(404).json({ message: result.message });
    });

    jest.clearAllMocks();
  });

  describe("getByName", () => {
    it("should return board successfully", async () => {
      const mockResult = {
        success: true,
        data: { _id: "board1", boardName: "CBSE" },
      };

      mockBoardManager.getByName.mockResolvedValue(mockResult);

      req.body = { name: "CBSE" };

      await boardController.getByName(req, res);

      expect(mockBoardManager.getByName).toHaveBeenCalledWith(req);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockResult);
    });

    it("should handle error when board not found", async () => {
      const mockResult = {
        success: false,
        message: "Board not found",
      };

      mockBoardManager.getByName.mockResolvedValue(mockResult);

      req.body = { name: "NonExistent" };

      await boardController.getByName(req, res);

      expect(handleError).toHaveBeenCalledWith(mockResult, res);
    });

    it("should return 400 on exception", async () => {
      const error = new Error("Database error");
      mockBoardManager.getByName.mockRejectedValue(error);

      req.body = { name: "CBSE" };

      await boardController.getByName(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(error);
    });
  });

  describe("update", () => {
    it("should update board successfully", async () => {
      const mockResult = {
        success: true,
        data: { _id: "board1", boardName: "Updated CBSE" },
      };

      mockBoardManager.update.mockResolvedValue(mockResult);

      req.body = { id: "board1", boardName: "Updated CBSE" };

      await boardController.update(req, res);

      expect(mockBoardManager.update).toHaveBeenCalledWith(req);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockResult);
    });

    it("should handle error when board not found", async () => {
      const mockResult = {
        success: false,
        message: "Board not found",
      };

      mockBoardManager.update.mockResolvedValue(mockResult);

      req.body = { id: "nonexistent", boardName: "Updated" };

      await boardController.update(req, res);

      expect(handleError).toHaveBeenCalledWith(mockResult, res);
    });

    it("should return 400 on exception", async () => {
      const error = new Error("Database error");
      mockBoardManager.update.mockRejectedValue(error);

      req.body = { id: "board1", boardName: "Updated" };

      await boardController.update(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(error);
    });
  });
});
