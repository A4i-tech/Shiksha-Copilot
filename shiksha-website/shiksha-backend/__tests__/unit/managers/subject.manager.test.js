const SubjectManager = require("../../../managers/subject.manager");
const SubjectDao = require("../../../dao/subject.dao");

jest.mock("../../../dao/subject.dao");

describe("SubjectManager", () => {
  let subjectManager;
  let mockSubjectDao;

  beforeEach(() => {
    mockSubjectDao = {
      update: jest.fn(),
      create: jest.fn(),
      getById: jest.fn(),
      getAll: jest.fn(),
      delete: jest.fn(),
    };

    SubjectDao.mockImplementation(() => mockSubjectDao);
    subjectManager = new SubjectManager();
    jest.clearAllMocks();
  });

  describe("updateSubject", () => {
    it("should update subject successfully", async () => {
      const mockUpdatedSubject = {
        _id: "subject1",
        subject: "Updated Mathematics",
      };

      mockSubjectDao.update.mockResolvedValue(mockUpdatedSubject);

      const updates = { subject: "Updated Mathematics" };
      const result = await subjectManager.updateSubject("subject1", updates);

      expect(mockSubjectDao.update).toHaveBeenCalledWith("subject1", updates);
      expect(result).toEqual({
        success: true,
        message: "",
        data: mockUpdatedSubject,
      });
    });

    it("should return not found when subject doesn't exist", async () => {
      mockSubjectDao.update.mockResolvedValue(null);

      const updates = { subject: "Updated Mathematics" };
      const result = await subjectManager.updateSubject("nonexistent", updates);

      expect(result).toEqual({
        success: false,
        message: "Subject not found",
        data: null,
      });
    });

    it("should return failure on error", async () => {
      const error = new Error("Database error");
      mockSubjectDao.update.mockRejectedValue(error);

      const updates = { subject: "Updated Mathematics" };
      const result = await subjectManager.updateSubject("subject1", updates);

      expect(result.success).toBe(false);
      expect(result.message).toBe("Database error");
    });
  });
});
