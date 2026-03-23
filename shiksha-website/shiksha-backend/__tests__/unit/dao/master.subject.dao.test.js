const MasterSubjectDao = require("../../../dao/master.subject.dao");
const MasterSubject = require("../../../models/master.subject.model");

jest.mock("../../../models/master.subject.model");

describe("MasterSubjectDao", () => {
  let masterSubjectDao;

  beforeEach(() => {
    masterSubjectDao = new MasterSubjectDao();
    jest.clearAllMocks();
  });

  describe("getByNameAndBoard", () => {
    it("should return subject when found", async () => {
      const mockSubject = {
        _id: "subject1",
        subjectName: "Mathematics",
        boards: "CBSE",
      };

      MasterSubject.findOne = jest.fn().mockResolvedValue(mockSubject);

      const result = await masterSubjectDao.getByNameAndBoard(
        "Mathematics",
        "CBSE"
      );

      expect(MasterSubject.findOne).toHaveBeenCalledWith({
        subjectName: "Mathematics",
        boards: "CBSE",
      });
      expect(result).toEqual(mockSubject);
    });

    it("should return null when subject not found", async () => {
      MasterSubject.findOne = jest.fn().mockResolvedValue(null);

      const result = await masterSubjectDao.getByNameAndBoard(
        "NonExistent",
        "CBSE"
      );

      expect(result).toBeNull();
    });

    it("should throw error on database failure", async () => {
      MasterSubject.findOne = jest
        .fn()
        .mockRejectedValue(new Error("DB Error"));

      await expect(
        masterSubjectDao.getByNameAndBoard("Mathematics", "CBSE")
      ).rejects.toThrow("DB Error");
    });
  });

  describe("update", () => {
    it("should update subject successfully", async () => {
      const updates = {
        subject: "Updated Mathematics",
        topics: ["Algebra", "Geometry"],
        boards: ["CBSE", "ICSE"],
        medium: ["English", "Hindi"],
      };

      const mockUpdatedSubject = {
        _id: "subject1",
        ...updates,
      };

      MasterSubject.findOneAndUpdate = jest
        .fn()
        .mockResolvedValue(mockUpdatedSubject);

      const result = await masterSubjectDao.update("subject1", updates);

      expect(MasterSubject.findOneAndUpdate).toHaveBeenCalledWith(
        { _id: "subject1", isDeleted: false },
        {
          $set: {
            subject: updates.subject,
            topics: updates.topics,
            boards: updates.boards,
            medium: updates.medium,
          },
        },
        { new: true, useFindAndModify: false, session: null }
      );
      expect(result).toEqual(mockUpdatedSubject);
    });

    it("should return null when subject not found", async () => {
      const updates = {
        subject: "Updated",
        topics: [],
        boards: [],
        medium: [],
      };

      MasterSubject.findOneAndUpdate = jest.fn().mockResolvedValue(null);

      const result = await masterSubjectDao.update("nonexistent", updates);

      expect(result).toBeNull();
    });

    it("should support session parameter", async () => {
      const updates = {
        subject: "Updated",
        topics: [],
        boards: [],
        medium: [],
      };
      const mockSession = { id: "session1" };
      const mockUpdatedSubject = {
        _id: "subject1",
        ...updates,
      };

      MasterSubject.findOneAndUpdate = jest
        .fn()
        .mockResolvedValue(mockUpdatedSubject);

      const result = await masterSubjectDao.update(
        "subject1",
        updates,
        mockSession
      );

      expect(MasterSubject.findOneAndUpdate).toHaveBeenCalledWith(
        { _id: "subject1", isDeleted: false },
        {
          $set: {
            subject: updates.subject,
            topics: updates.topics,
            boards: updates.boards,
            medium: updates.medium,
          },
        },
        { new: true, useFindAndModify: false, session: mockSession }
      );
      expect(result).toEqual(mockUpdatedSubject);
    });

    it("should throw error on database failure", async () => {
      const updates = {
        subject: "Updated",
        topics: [],
        boards: [],
        medium: [],
      };

      MasterSubject.findOneAndUpdate = jest
        .fn()
        .mockRejectedValue(new Error("Update failed"));

      await expect(
        masterSubjectDao.update("subject1", updates)
      ).rejects.toThrow("Update failed");
    });
  });
});
