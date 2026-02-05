const ScheduleDao = require("../../../dao/schedule.dao");
const Schedule = require("../../../models/schedule.model");

// Mock the model
jest.mock("../../../models/schedule.model");

describe("ScheduleDao", () => {
  let dao;

  beforeEach(() => {
    jest.clearAllMocks();
    dao = new ScheduleDao();
  });

  describe("Instance creation", () => {
    it("should create an instance of ScheduleDao", () => {
      expect(dao).toBeInstanceOf(ScheduleDao);
    });

    it("should have the Model property set to Schedule", () => {
      expect(dao.Model).toBe(Schedule);
    });
  });
});
