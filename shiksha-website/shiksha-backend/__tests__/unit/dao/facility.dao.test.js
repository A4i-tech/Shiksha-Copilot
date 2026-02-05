const FacilityDao = require("../../../dao/facility.dao");
const Facility = require("../../../models/facility.model");

jest.mock("../../../models/facility.model");

describe("FacilityDao", () => {
  let facilityDao;

  beforeEach(() => {
    facilityDao = new FacilityDao();
    jest.clearAllMocks();
  });

  describe("getById", () => {
    it("should return facility when found", async () => {
      const mockFacility = {
        _id: "facility1",
        name: "Test Facility",
        isDeleted: false,
      };

      facilityDao.Model = {
        findOne: jest.fn().mockResolvedValue(mockFacility),
      };

      const result = await facilityDao.getById("facility1");

      expect(facilityDao.Model.findOne).toHaveBeenCalledWith({
        _id: "facility1",
        isDeleted: false,
      });
      expect(result).toEqual(mockFacility);
    });

    it("should return null when facility not found", async () => {
      facilityDao.Model = {
        findOne: jest.fn().mockResolvedValue(null),
      };

      const result = await facilityDao.getById("nonexistent");

      expect(result).toBeNull();
    });

    it("should throw error on database failure", async () => {
      facilityDao.Model = {
        findOne: jest.fn().mockRejectedValue(new Error("DB Error")),
      };

      await expect(facilityDao.getById("facility1")).rejects.toThrow(
        "DB Error"
      );
    });
  });

  describe("update", () => {
    it("should update facility successfully", async () => {
      const data = {
        _id: "facility1",
        name: "Updated Facility",
      };

      const mockUpdatedFacility = {
        _id: "facility1",
        name: "Updated Facility",
      };

      Facility.findOneAndUpdate = jest
        .fn()
        .mockResolvedValue(mockUpdatedFacility);

      const result = await facilityDao.update(data);

      expect(Facility.findOneAndUpdate).toHaveBeenCalledWith(
        { _id: "facility1", isDeleted: false },
        { $set: data },
        { new: true, useFindAndModify: false, session: null }
      );
      expect(result).toEqual(mockUpdatedFacility);
    });

    it("should return null when facility not found", async () => {
      const data = {
        _id: "nonexistent",
        name: "Updated",
      };

      Facility.findOneAndUpdate = jest.fn().mockResolvedValue(null);

      const result = await facilityDao.update(data);

      expect(result).toBeNull();
    });

    it("should support session parameter", async () => {
      const data = {
        _id: "facility1",
        name: "Updated Facility",
      };
      const mockSession = { id: "session1" };
      const mockUpdatedFacility = {
        _id: "facility1",
        name: "Updated Facility",
      };

      Facility.findOneAndUpdate = jest
        .fn()
        .mockResolvedValue(mockUpdatedFacility);

      const result = await facilityDao.update(data, mockSession);

      expect(Facility.findOneAndUpdate).toHaveBeenCalledWith(
        { _id: "facility1", isDeleted: false },
        { $set: data },
        { new: true, useFindAndModify: false, session: mockSession }
      );
      expect(result).toEqual(mockUpdatedFacility);
    });

    it("should throw error on database failure", async () => {
      const data = {
        _id: "facility1",
        name: "Updated",
      };

      Facility.findOneAndUpdate = jest
        .fn()
        .mockRejectedValue(new Error("Update failed"));

      await expect(facilityDao.update(data)).rejects.toThrow("Update failed");
    });
  });
});
