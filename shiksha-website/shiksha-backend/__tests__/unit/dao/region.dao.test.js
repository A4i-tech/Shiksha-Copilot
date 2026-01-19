const RegionDao = require("../../../dao/region.dao");
const Region = require("../../../models/region.model");

jest.mock("../../../models/region.model");

describe("RegionDao", () => {
  let regionDao;

  beforeEach(() => {
    regionDao = new RegionDao();
    jest.clearAllMocks();
  });

  it("should be an instance of RegionDao", () => {
    expect(regionDao).toBeInstanceOf(RegionDao);
  });

  it("should have Model property set to Region", () => {
    expect(regionDao.Model).toBe(Region);
  });
});
