const SchoolDao = require("../../../dao/school.dao");
const School = require("../../../models/school.model");

jest.mock("../../../models/school.model");

describe("SchoolDao", () => {
  let schoolDao;

  beforeEach(() => {
    schoolDao = new SchoolDao();
    jest.clearAllMocks();
  });

  describe("getBySchoolId", () => {
    it("should return school when found by schoolId", async () => {
      const mockSchool = {
        _id: "school1",
        schoolId: "SCH001",
        name: "Test School",
      };

      School.findOne = jest.fn().mockResolvedValue(mockSchool);

      const result = await schoolDao.getBySchoolId("SCH001");

      expect(School.findOne).toHaveBeenCalledWith({ schoolId: "SCH001" });
      expect(result).toEqual(mockSchool);
    });

    it("should return null when school not found", async () => {
      School.findOne = jest.fn().mockResolvedValue(null);

      const result = await schoolDao.getBySchoolId("NONEXISTENT");

      expect(result).toBeNull();
    });

    it("should throw error on database failure", async () => {
      School.findOne = jest.fn().mockRejectedValue(new Error("DB Error"));

      await expect(schoolDao.getBySchoolId("SCH001")).rejects.toThrow(
        "DB Error"
      );
    });
  });

  describe("update", () => {
    it("should update school successfully", async () => {
      const updates = {
        name: "Updated School",
        address: "New Address",
      };

      const mockUpdatedSchool = {
        _id: "school1",
        name: "Updated School",
        address: "New Address",
      };

      School.findOneAndUpdate = jest.fn().mockResolvedValue(mockUpdatedSchool);

      const result = await schoolDao.update("school1", updates);

      expect(School.findOneAndUpdate).toHaveBeenCalledWith(
        { _id: "school1", isDeleted: false },
        { $set: updates },
        { new: true, useFindAndModify: false, session: null }
      );
      expect(result).toEqual(mockUpdatedSchool);
    });

    it("should return null when school not found", async () => {
      const updates = { name: "Updated School" };

      School.findOneAndUpdate = jest.fn().mockResolvedValue(null);

      const result = await schoolDao.update("nonexistent", updates);

      expect(result).toBeNull();
    });

    it("should support session parameter", async () => {
      const updates = { name: "Updated School" };
      const mockSession = { id: "session1" };
      const mockUpdatedSchool = {
        _id: "school1",
        name: "Updated School",
      };

      School.findOneAndUpdate = jest.fn().mockResolvedValue(mockUpdatedSchool);

      const result = await schoolDao.update("school1", updates, mockSession);

      expect(School.findOneAndUpdate).toHaveBeenCalledWith(
        { _id: "school1", isDeleted: false },
        { $set: updates },
        { new: true, useFindAndModify: false, session: mockSession }
      );
      expect(result).toEqual(mockUpdatedSchool);
    });

    it("should throw error on database failure", async () => {
      const updates = { name: "Updated School" };

      School.findOneAndUpdate = jest
        .fn()
        .mockRejectedValue(new Error("Update failed"));

      await expect(schoolDao.update("school1", updates)).rejects.toThrow(
        "Update failed"
      );
    });
  });
});
