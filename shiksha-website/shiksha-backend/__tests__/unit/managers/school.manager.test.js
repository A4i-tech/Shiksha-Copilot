const SchoolManager = require("../../../managers/school.manager");
const SchoolDao = require("../../../dao/school.dao");
const formatApiReponse = require("../../../helper/response");

// Mock the DAO and helpers
jest.mock("../../../dao/school.dao");
jest.mock("../../../dao/school.class.dao");
jest.mock("../../../dao/user.dao");
jest.mock("../../../helper/response");

describe("SchoolManager", () => {
  let manager;
  let mockSchoolDao;

  beforeEach(() => {
    jest.clearAllMocks();
    mockSchoolDao = new SchoolDao();
    manager = new SchoolManager();
    manager.dao = mockSchoolDao;
  });

  describe("Instance creation", () => {
    it("should create an instance of SchoolManager", () => {
      expect(manager).toBeInstanceOf(SchoolManager);
    });

    it("should have a schoolDao property", () => {
      expect(manager.dao).toBeDefined();
    });

    it("should have a classDao property", () => {
      expect(manager.classDao).toBeDefined();
    });

    it("should have a userDao property", () => {
      expect(manager.userDao).toBeDefined();
    });
  });
});
