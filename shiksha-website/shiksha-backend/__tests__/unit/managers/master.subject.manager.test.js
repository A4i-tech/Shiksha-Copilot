const MasterSubjectManager = require("../../../managers/master.subject.manager");
const MasterSubjectDao = require("../../../dao/master.subject.dao");
const SchoolDao = require("../../../dao/school.dao");
const BoardDao = require("../../../dao/board.dao");

jest.mock("../../../dao/master.subject.dao");
jest.mock("../../../dao/school.dao");
jest.mock("../../../dao/board.dao");

describe("MasterSubjectManager", () => {
  let masterSubjectManager;
  let mockMasterSubjectDao;
  let mockSchoolDao;
  let mockBoardDao;

  beforeEach(() => {
    mockMasterSubjectDao = {
      getByNameAndBoard: jest.fn(),
      filter: jest.fn(),
      update: jest.fn(),
      create: jest.fn(),
      getById: jest.fn(),
      getAll: jest.fn(),
      delete: jest.fn(),
    };

    mockSchoolDao = {
      getById: jest.fn(),
    };

    mockBoardDao = {
      getByAbbreviation: jest.fn(),
    };

    MasterSubjectDao.mockImplementation(() => mockMasterSubjectDao);
    SchoolDao.mockImplementation(() => mockSchoolDao);
    BoardDao.mockImplementation(() => mockBoardDao);

    masterSubjectManager = new MasterSubjectManager();
    jest.clearAllMocks();
  });

  describe("getByName", () => {
    const user = { roles: [{ role: { scopeType: "SCHOOL" }, dep: "school1" }] };

    it("should return subject successfully", async () => {
      const mockSchool = { _id: "school1", board: "CBSE" };
      const mockBoard = { _id: "board1", abbreviation: "CBSE" };
      const mockSubject = { _id: "subject1", subjectName: "Mathematics" };

      mockSchoolDao.getById.mockResolvedValue(mockSchool);
      mockBoardDao.getByAbbreviation.mockResolvedValue(mockBoard);
      mockMasterSubjectDao.getByNameAndBoard.mockResolvedValue(mockSubject);

      const result = await masterSubjectManager.getByName("Mathematics", user);

      expect(mockSchoolDao.getById).toHaveBeenCalledWith("school1");
      expect(mockBoardDao.getByAbbreviation).toHaveBeenCalledWith("CBSE");
      expect(mockMasterSubjectDao.getByNameAndBoard).toHaveBeenCalledWith(
        "Mathematics",
        mockBoard
      );
      expect(result).toEqual({
        success: true,
        message: "",
        data: mockSubject,
      });
    });

    it("should return error when school not found", async () => {
      mockSchoolDao.getById.mockResolvedValue(null);

      const result = await masterSubjectManager.getByName("Mathematics", user);

      expect(result).toEqual({
        success: false,
        message: "Invalid school for teacher",
        data: null,
      });
    });

    it("should return error when board not found", async () => {
      const mockSchool = { _id: "school1", board: "INVALID" };

      mockSchoolDao.getById.mockResolvedValue(mockSchool);
      mockBoardDao.getByAbbreviation.mockResolvedValue(null);

      const result = await masterSubjectManager.getByName("Mathematics", user);

      expect(result).toEqual({
        success: false,
        message: "Invalid board for school",
        data: null,
      });
    });

    it("should return error when subject not found", async () => {
      const mockSchool = { _id: "school1", board: "CBSE" };
      const mockBoard = { _id: "board1", abbreviation: "CBSE" };

      mockSchoolDao.getById.mockResolvedValue(mockSchool);
      mockBoardDao.getByAbbreviation.mockResolvedValue(mockBoard);
      mockMasterSubjectDao.getByNameAndBoard.mockResolvedValue(null);

      const result = await masterSubjectManager.getByName("NonExistent", user);

      expect(result).toEqual({
        success: false,
        message: "Subject not found",
        data: null,
      });
    });

    it("should return error on exception", async () => {
      const error = new Error("Database error");

      mockSchoolDao.getById.mockRejectedValue(error);

      const result = await masterSubjectManager.getByName("Mathematics", user);

      expect(result.success).toBe(false);
      expect(result.message).toBe("Database error");
    });
  });

  describe("getByBoard", () => {
    it("should return subjects for board", async () => {
      const mockSubjects = [
        { _id: "subject1", subjectName: "Mathematics" },
        { _id: "subject2", subjectName: "Science" },
      ];

      mockMasterSubjectDao.filter.mockResolvedValue(mockSubjects);

      const result = await masterSubjectManager.getByBoard("CBSE");

      expect(mockMasterSubjectDao.filter).toHaveBeenCalledWith({
        boards: "CBSE",
      });
      expect(result).toEqual({
        success: true,
        message: "",
        data: mockSubjects,
      });
    });

    it("should return error on exception", async () => {
      const error = new Error("Database error");

      mockMasterSubjectDao.filter.mockRejectedValue(error);

      const result = await masterSubjectManager.getByBoard("CBSE");

      expect(result.success).toBe(false);
      expect(result.message).toBe("Database error");
    });
  });

  describe("updateSubject", () => {
    it("should update subject successfully", async () => {
      const updates = {
        subject: "Updated Mathematics",
        topics: ["Algebra"],
      };
      const mockUpdatedSubject = {
        _id: "subject1",
        ...updates,
      };

      mockMasterSubjectDao.update.mockResolvedValue(mockUpdatedSubject);

      const result = await masterSubjectManager.updateSubject(
        "subject1",
        updates
      );

      expect(mockMasterSubjectDao.update).toHaveBeenCalledWith(
        "subject1",
        updates
      );
      expect(result).toEqual({
        success: true,
        message: "",
        data: mockUpdatedSubject,
      });
    });

    it("should return not found when subject doesn't exist", async () => {
      const updates = { subject: "Updated" };

      mockMasterSubjectDao.update.mockResolvedValue(null);

      const result = await masterSubjectManager.updateSubject(
        "nonexistent",
        updates
      );

      expect(result).toEqual({
        success: false,
        message: "Subject not found",
        data: null,
      });
    });

    it("should return error on exception", async () => {
      const updates = { subject: "Updated" };
      const error = new Error("Database error");

      mockMasterSubjectDao.update.mockRejectedValue(error);

      const result = await masterSubjectManager.updateSubject(
        "subject1",
        updates
      );

      expect(result.success).toBe(false);
      expect(result.message).toBe("Database error");
    });
  });
});
