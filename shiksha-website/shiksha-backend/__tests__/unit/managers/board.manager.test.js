const BoardManager = require("../../../managers/board.manager");
const BoardDao = require("../../../dao/board.dao");

jest.mock("../../../dao/board.dao");

describe("BoardManager", () => {
  let boardManager;
  let mockBoardDao;

  beforeEach(() => {
    mockBoardDao = {
      getByName: jest.fn(),
      update: jest.fn(),
      create: jest.fn(),
      getById: jest.fn(),
      getAll: jest.fn(),
      delete: jest.fn(),
    };

    BoardDao.mockImplementation(() => mockBoardDao);
    boardManager = new BoardManager();
    jest.clearAllMocks();
  });

  describe("getByName", () => {
    it("should return success when board found", async () => {
      const mockBoard = {
        _id: "board1",
        boardName: "CBSE",
      };

      mockBoardDao.getByName.mockResolvedValue(mockBoard);

      const req = { body: { name: "CBSE" } };
      const result = await boardManager.getByName(req);

      expect(mockBoardDao.getByName).toHaveBeenCalledWith("CBSE");
      expect(result).toEqual({
        success: true,
        message: "",
        data: mockBoard,
      });
    });

    it("should return failure when board not found", async () => {
      mockBoardDao.getByName.mockResolvedValue(null);

      const req = { body: { name: "NonExistent" } };
      const result = await boardManager.getByName(req);

      expect(result).toEqual({
        success: false,
        message: "",
        data: null,
      });
    });

    it("should propagate errors instead of swallowing them", async () => {
      const error = new Error("Database error");
      mockBoardDao.getByName.mockRejectedValue(error);

      const req = { body: { name: "CBSE" } };

      await expect(boardManager.getByName(req)).rejects.toThrow("Database error");
    });
  });

  describe("update", () => {
    it("should update board successfully", async () => {
      const mockUpdatedBoard = {
        _id: "board1",
        boardName: "Updated CBSE",
      };

      mockBoardDao.update.mockResolvedValue(mockUpdatedBoard);

      const req = {
        body: {
          id: "board1",
          boardName: "Updated CBSE",
        },
      };
      const result = await boardManager.update(req);

      expect(mockBoardDao.update).toHaveBeenCalledWith(req.body);
      expect(result).toEqual({
        success: true,
        message: "",
        data: mockUpdatedBoard,
      });
    });

    it("should return failure when board not found", async () => {
      mockBoardDao.update.mockResolvedValue(null);

      const req = {
        body: {
          id: "nonexistent",
          boardName: "Updated",
        },
      };
      const result = await boardManager.update(req);

      expect(result).toEqual({
        success: false,
        message: "",
        data: null,
      });
    });

    it("should propagate errors instead of swallowing them", async () => {
      const error = new Error("Update failed");
      mockBoardDao.update.mockRejectedValue(error);

      const req = {
        body: {
          id: "board1",
          boardName: "Updated",
        },
      };

      await expect(boardManager.update(req)).rejects.toThrow("Update failed");
    });
  });
});
