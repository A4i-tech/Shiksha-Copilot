const { grantedChartKeys, resolveDashboard, buildScope } = require("../../../helper/dashboard.helper");

const board = (boardKey, chartKeys, desktopUuid = boardKey) => ({ boardKey, chartKeys, desktopUuid, mobileUuid: null });

describe("grantedChartKeys", () => {
  it("extracts unique chart keys and ignores other permissions", () => {
    const grants = [{ permission: "analytics.view" }, { permission: "analytics.chart.a" }, { permission: "analytics.chart.a" }, { permission: "analytics.chart.b" }];
    expect(grantedChartKeys(grants)).toEqual(["a", "b"]);
  });
});

describe("resolveDashboard", () => {
  beforeEach(() => jest.spyOn(console, "warn").mockImplementation(() => {}));
  afterEach(() => jest.restoreAllMocks());

  it("picks the board that exactly matches the grants", () => {
    expect(resolveDashboard(["a", "b"], [board("x", ["a", "b"]), board("y", ["a"])])).toEqual({ desktopUuid: "x", mobileUuid: null });
    expect(console.warn).not.toHaveBeenCalled();
  });

  it("picks the largest subset and warns about charts the board lacks", () => {
    const result = resolveDashboard(["a", "b", "c"], [board("small", ["a"]), board("big", ["a", "b"])]);
    expect(result.desktopUuid).toBe("big");
    expect(console.warn).toHaveBeenCalledWith(expect.stringContaining("lacks granted charts: c"));
  });

  it("never picks a board that holds a chart the user lacks", () => {
    const result = resolveDashboard(["a"], [board("full", ["a", "b"]), board("one", ["a"])]);
    expect(result.desktopUuid).toBe("one");
  });

  it("breaks ties by lowest boardKey", () => {
    expect(resolveDashboard(["a", "b"], [board("z", ["a"]), board("m", ["b"])]).desktopUuid).toBe("m");
  });

  it("returns null when the user holds no chart permission", () => {
    expect(resolveDashboard([], [board("full", ["a"])])).toBeNull();
  });

  it("returns null when no board qualifies", () => {
    expect(resolveDashboard(["a"], [board("full", ["a", "b"])])).toBeNull();
    expect(resolveDashboard(["a"], [])).toBeNull();
  });
});

describe("buildScope", () => {
  it("returns region fields for exactly one region grant", () => {
    const grants = [{ scopeType: "DISTRICT", dep: { state: "KA", zone: "z", district: "Mysuru" } }];
    expect(buildScope(grants)).toEqual({ state: "KA", district: "Mysuru", block: null });
  });

  it("returns null for zero or many region grants", () => {
    expect(buildScope([{ scopeType: "GLOBAL", dep: null }])).toBeNull();
    expect(buildScope([{ scopeType: "STATE", dep: { state: "A" } }, { scopeType: "STATE", dep: { state: "B" } }])).toBeNull();
  });
});
