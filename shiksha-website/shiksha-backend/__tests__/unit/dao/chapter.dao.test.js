const ChapterDao = require("../../../dao/chapter.dao");
const Chapter = require("../../../models/chapter.model");

// Mock the model
jest.mock("../../../models/chapter.model");

describe("ChapterDao", () => {
  let dao;

  beforeEach(() => {
    jest.clearAllMocks();
    dao = new ChapterDao();
  });

  describe("Instance creation", () => {
    it("should create an instance of ChapterDao", () => {
      expect(dao).toBeInstanceOf(ChapterDao);
    });

    it("should have the Model property set to Chapter", () => {
      expect(dao.Model).toBe(Chapter);
    });
  });
});
