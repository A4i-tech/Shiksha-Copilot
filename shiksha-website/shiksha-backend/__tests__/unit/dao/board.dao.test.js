const BoardDao = require("../../../dao/board.dao");
const Board = require("../../../models/board.model");

jest.mock("../../../models/board.model");

describe("BoardDao", () => {
  let boardDao;

  beforeEach(() => {
    boardDao = new BoardDao();
    jest.clearAllMocks();
  });

  describe("getByName", () => {
    it("should return board when found", async () => {
      const mockBoard = {
        _id: "board1",
        boardName: "CBSE",
        isDeleted: false,
      };

      Board.findOne = jest.fn().mockResolvedValue(mockBoard);

      const result = await boardDao.getByName("CBSE");

      expect(Board.findOne).toHaveBeenCalledWith({
        boardName: "CBSE",
        isDeleted: false,
      });
      expect(result).toEqual(mockBoard);
    });

    it("should return false when board not found", async () => {
      Board.findOne = jest.fn().mockResolvedValue(null);

      const result = await boardDao.getByName("NonExistent");

      expect(result).toBe(false);
    });

    it("should throw error on database failure", async () => {
      Board.findOne = jest.fn().mockRejectedValue(new Error("DB Error"));

      await expect(boardDao.getByName("CBSE")).rejects.toThrow("DB Error");
    });
  });

  describe("getByAbbreviation", () => {
    it("should return board when found by abbreviation", async () => {
      const mockBoard = {
        _id: "board1",
        abbreviation: "CBSE",
        isDeleted: false,
      };

      Board.findOne = jest.fn().mockResolvedValue(mockBoard);

      const result = await boardDao.getByAbbreviation("CBSE");

      expect(Board.findOne).toHaveBeenCalledWith({
        abbreviation: "CBSE",
        isDeleted: false,
      });
      expect(result).toEqual(mockBoard);
    });

    it("should return false when board not found", async () => {
      Board.findOne = jest.fn().mockResolvedValue(null);

      const result = await boardDao.getByAbbreviation("NonExistent");

      expect(result).toBe(false);
    });
  });

  describe("update", () => {
    it("should update board successfully", async () => {
      const updateData = {
        id: "board1",
        boardName: "Updated CBSE",
        state: "National",
      };

      const mockUpdatedBoard = {
        _id: "board1",
        boardName: "Updated CBSE",
        state: "National",
      };

      Board.findOneAndUpdate = jest.fn().mockResolvedValue(mockUpdatedBoard);

      const result = await boardDao.update(updateData);

      expect(Board.findOneAndUpdate).toHaveBeenCalledWith(
        { _id: "board1", isDeleted: false },
        { $set: { boardName: "Updated CBSE", state: "National" } },
        { new: true, useFindAndModify: false, session: null }
      );
      expect(result).toEqual(mockUpdatedBoard);
    });

    it("should return null when board not found", async () => {
      const updateData = {
        id: "nonexistent",
        boardName: "New Name",
        state: "State",
      };

      Board.findOneAndUpdate = jest.fn().mockResolvedValue(null);

      const result = await boardDao.update(updateData);

      expect(result).toBeNull();
    });

    it("should throw error on database failure", async () => {
      const updateData = {
        id: "board1",
        boardName: "Updated",
        state: "State",
      };

      Board.findOneAndUpdate = jest
        .fn()
        .mockRejectedValue(new Error("Update failed"));

      await expect(boardDao.update(updateData)).rejects.toThrow(
        "Update failed"
      );
    });
  });
});
