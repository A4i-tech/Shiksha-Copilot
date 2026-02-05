const SubjectDao = require("../../../dao/subject.dao");
const Subject = require("../../../models/subject.model");

jest.mock("../../../models/subject.model");

describe("SubjectDao", () => {
  let subjectDao;

  beforeEach(() => {
    subjectDao = new SubjectDao();
    jest.clearAllMocks();
  });

  describe("update", () => {
    it("should update subject successfully", async () => {
      const updates = {
        subject: "Updated Subject Name",
      };

      const mockUpdatedSubject = {
        _id: "subject1",
        subject: "Updated Subject Name",
      };

      Subject.findOneAndUpdate = jest
        .fn()
        .mockResolvedValue(mockUpdatedSubject);

      const result = await subjectDao.update("subject1", updates);

      expect(Subject.findOneAndUpdate).toHaveBeenCalledWith(
        { _id: "subject1", isDeleted: false },
        { $set: { subject: "Updated Subject Name" } },
        { new: true, useFindAndModify: false, session: null }
      );
      expect(result).toEqual(mockUpdatedSubject);
    });

    it("should return null when subject not found", async () => {
      const updates = { subject: "Updated Subject" };

      Subject.findOneAndUpdate = jest.fn().mockResolvedValue(null);

      const result = await subjectDao.update("nonexistent", updates);

      expect(result).toBeNull();
    });

    it("should support session parameter", async () => {
      const updates = { subject: "Updated Subject" };
      const mockSession = { id: "session1" };
      const mockUpdatedSubject = {
        _id: "subject1",
        subject: "Updated Subject",
      };

      Subject.findOneAndUpdate = jest
        .fn()
        .mockResolvedValue(mockUpdatedSubject);

      const result = await subjectDao.update("subject1", updates, mockSession);

      expect(Subject.findOneAndUpdate).toHaveBeenCalledWith(
        { _id: "subject1", isDeleted: false },
        { $set: { subject: "Updated Subject" } },
        { new: true, useFindAndModify: false, session: mockSession }
      );
      expect(result).toEqual(mockUpdatedSubject);
    });

    it("should throw error on database failure", async () => {
      const updates = { subject: "Updated Subject" };

      Subject.findOneAndUpdate = jest
        .fn()
        .mockRejectedValue(new Error("Update failed"));

      await expect(subjectDao.update("subject1", updates)).rejects.toThrow(
        "Update failed"
      );
    });
  });
});
