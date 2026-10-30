const CHARTS = require("../config/analytics.charts.json");
const Role = require("../models/role.model");
const { RESTRICTED_KEYS } = require("../helper/dashboard.boards");

// State Admin held only analytics.view, so it lost the dashboard. Give it the open (non-restricted) charts. $addToSet makes a re-run a no-op.
async function grantStateAdminCharts() {
  const permissions = CHARTS.filter((chart) => !RESTRICTED_KEYS.includes(chart.key)).map((chart) => `analytics.chart.${chart.key}`);
  await Role.updateMany({ name: "State Admin", isDeleted: false }, { $addToSet: { permissions: { $each: permissions } } });
}

module.exports = grantStateAdminCharts;
