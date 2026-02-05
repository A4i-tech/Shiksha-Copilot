const MasterResourceDao = require("../../../dao/master.resource.dao");
const MasterResource = require("../../../models/master.resource.model");

// Mock the model
jest.mock("../../../models/master.resource.model");

describe("MasterResourceDao", () => {
  let dao;

  beforeEach(() => {
    jest.clearAllMocks();
    dao = new MasterResourceDao();
  });

  describe("Instance creation", () => {
    it("should create an instance of MasterResourceDao", () => {
      expect(dao).toBeInstanceOf(MasterResourceDao);
    });

    it("should have the Model property set to MasterResource", () => {
      expect(dao.Model).toBe(MasterResource);
    });
  });
});
