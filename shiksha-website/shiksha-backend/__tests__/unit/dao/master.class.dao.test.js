const MasterClassDao = require("../../../dao/master.class.dao");
const MasterClass = require("../../../models/master.class.model");

// Mock the model
jest.mock("../../../models/master.class.model");

describe("MasterClassDao", () => {
  let dao;

  beforeEach(() => {
    jest.clearAllMocks();
    dao = new MasterClassDao();
  });

  describe("Instance creation", () => {
    it("should create an instance of MasterClassDao", () => {
      expect(dao).toBeInstanceOf(MasterClassDao);
    });

    it("should have the Model property set to MasterClass", () => {
      expect(dao.Model).toBe(MasterClass);
    });
  });
});
