const SchoolClassDao = require("../../../dao/school.class.dao");
const SchoolClass = require("../../../models/school.class.model");

// Mock the model
jest.mock("../../../models/school.class.model");

describe("SchoolClassDao", () => {
  let dao;

  beforeEach(() => {
    jest.clearAllMocks();
    dao = new SchoolClassDao();
  });

  describe("Instance creation", () => {
    it("should create an instance of SchoolClassDao", () => {
      expect(dao).toBeInstanceOf(SchoolClassDao);
    });

    it("should have the Model property set to SchoolClass", () => {
      expect(dao.Model).toBe(SchoolClass);
    });
  });
});
