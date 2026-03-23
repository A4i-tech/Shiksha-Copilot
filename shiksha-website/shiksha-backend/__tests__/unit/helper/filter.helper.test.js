const {
  getStartDate,
  getNumMonths,
  uniqueSubsets,
  validateIsoDate,
  normalizeMultiValueFilter,
  buildMongoInQuery,
} = require("../../../helper/filter.helper");

describe("filter.helper", () => {
  const currentDate = new Date("2024-06-15T00:00:00.000Z");

  it("calculates start dates for filters", () => {
    expect(
      getStartDate("quarter-year", currentDate)
        .toISOString()
        .startsWith("2024-04-01")
    ).toBe(true);
    expect(
      getStartDate("half-year", currentDate)
        .toISOString()
        .startsWith("2024-01-01")
    ).toBe(true);
    expect(
      getStartDate("last-year", currentDate)
        .toISOString()
        .startsWith("2023-01-01")
    ).toBe(true);
    expect(
      getStartDate("current-year", currentDate)
        .toISOString()
        .startsWith("2024-01-01")
    ).toBe(true);
    expect(
      getStartDate("unknown", currentDate)
        .toISOString()
        .startsWith("2024-01-01")
    ).toBe(true);
  });

  it("returns correct number of months", () => {
    expect(getNumMonths("quarter-year")).toBe(3);
    expect(getNumMonths("half-year")).toBe(6);
    expect(getNumMonths("last-year")).toBe(12);
    expect(getNumMonths("current-year")).toBe(12);
    expect(getNumMonths("other")).toBe(6);
  });

  it("builds unique subsets", () => {
    expect(uniqueSubsets([1, 2])).toEqual([[2], [1], [1, 2]]);
    expect(uniqueSubsets([])).toEqual([]);
  });

  it("validates ISO dates and flags invalid ones", () => {
    const helpers = {
      error: jest.fn(
        (code, ctx) =>
          new Error(
            `${code}:${ctx.value.toISOString ? ctx.value.toISOString() : ctx.value}`
          )
      ),
    };
    const valid = new Date("2024-02-29T00:00:00.000Z");
    expect(validateIsoDate(valid, helpers)).toBe(valid);
    expect(helpers.error).not.toHaveBeenCalled();

    const fakeMonth = { toISOString: () => "2024-13-01T00:00:00.000Z" };
    const errMonth = validateIsoDate(fakeMonth, helpers);
    expect(errMonth).toBeInstanceOf(Error);

    const fakeDay = { toISOString: () => "2024-02-30T00:00:00.000Z" };
    const errDay = validateIsoDate(fakeDay, helpers);
    expect(errDay).toBeInstanceOf(Error);
    expect(helpers.error).toHaveBeenCalled();
  });

  it("normalizes and builds mongo queries for multi-value filters", () => {
    const filter = { zone: "north", district: ["A", "B"], status: "active" };
    const normalized = normalizeMultiValueFilter(filter, ["zone", "district"]);
    expect(normalized.zone).toEqual(["north"]);
    expect(normalized.district).toEqual(["A", "B"]);

    const inQuery = buildMongoInQuery(normalized, ["zone", "district"]);
    expect(inQuery.zone).toEqual({ $in: ["north"] });
    expect(inQuery.district).toEqual({ $in: ["A", "B"] });
    expect(inQuery.status).toBe("active");
  });
});
