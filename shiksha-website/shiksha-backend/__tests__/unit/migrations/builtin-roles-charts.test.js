const builtinRoles = require("../../../config/builtin_roles.json");
const charts = require("../../../config/analytics.charts.json");

describe("builtin roles", () => {
  it.each(["Admin", "Manager"])("%s holds a permission for every chart in the catalog", (name) => {
    const permissions = builtinRoles.find((role) => role.name === name).permissions;
    expect(charts.map((chart) => `analytics.chart.${chart.key}`).filter((permission) => !permissions.includes(permission))).toEqual([]);
  });
});
