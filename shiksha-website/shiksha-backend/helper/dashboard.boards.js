const CHARTS = require("../config/analytics.charts.json");
const DashboardConfig = require("../models/dashboard.config.model");
const Role = require("../models/role.model");

// Admin, Manager and Superuser hold every chart through config/builtin_roles.json and isSuperUser. Only field roles are granted here.
const FIELD_ROLES = ["HM", "CRP", "BEO", "MEO", "DEO", "DDPI"];
const RESTRICTED_KEYS = CHARTS.filter((chart) => chart.restricted).map((chart) => chart.key);
const CHART_BY_KEY = new Map(CHARTS.map((chart) => [chart.key, chart]));

async function grant(permissions, roleNames) {
  const found = await Role.find({ name: { $in: roleNames }, isDeleted: false }, { name: 1 }).lean();
  const foundNames = new Set(found.map((role) => role.name));
  const missing = roleNames.filter((name) => !foundNames.has(name));
  if (found.length) await Role.updateMany({ _id: { $in: found.map((role) => role._id) } }, { $addToSet: { permissions: { $each: permissions } } });
  return missing;
}

// Returns an error message when the dashboard slice names differ from the board chart keys, else null.
function chartsMismatch(sliceNames, chartKeys) {
  const unknownKeys = chartKeys.filter((key) => !CHART_BY_KEY.has(key));
  if (unknownKeys.length) return `Unknown chart keys: ${unknownKeys.join(", ")}. Check config/analytics.charts.json.`;
  const expected = new Set(chartKeys.map((key) => CHART_BY_KEY.get(key).sliceName));
  const actual = new Set(sliceNames);
  const extra = [...actual].filter((name) => !expected.has(name));
  const absent = [...expected].filter((name) => !actual.has(name));
  if (!extra.length && !absent.length) return null;
  return `The Superset dashboard does not match the board charts. Extra: ${extra.join(", ") || "none"}. Missing: ${absent.join(", ") || "none"}. Check the dashboard UUID.`;
}

const openChartPermissions = (chartKeys) => chartKeys.filter((key) => !RESTRICTED_KEYS.includes(key)).map((key) => `analytics.chart.${key}`);

// Permissions the board grants that the acting user does not hold. Empty when the user holds role.delegate.
const undelegatable = (chartKeys, heldPermissions, canDelegate) =>
  canDelegate ? [] : openChartPermissions(chartKeys).filter((permission) => !heldPermissions.includes(permission));

async function saveBoard({ boardKey, chartKeys, desktopUuid, mobileUuid, roles = FIELD_ROLES }) {
  // Grant before the write, so a failed grant leaves the row unchanged and the next call retries. $addToSet makes the retry safe.
  const skippedRoles = await grant(openChartPermissions(chartKeys), roles);
  const previous = await DashboardConfig.findOne({ boardKey }, { chartKeys: 1 }).lean();
  let upsertedCount;
  try {
    const res = await DashboardConfig.updateOne({ boardKey }, { $set: { chartKeys, desktopUuid, mobileUuid } }, { upsert: true, runValidators: true });
    upsertedCount = res.upsertedCount;
  } catch (err) {
    console.error(`[dashboard.boards] saveBoard write failed after granting roles: ${err.message}. Retrying PUT /superset/boards completes the write and fixes orphaned permissions.`);
    throw err;
  }
  // Revoke a chart the board dropped, unless a field board still holds it. A board with a restricted chart is not a field board.
  const others = await DashboardConfig.find({ boardKey: { $ne: boardKey } }, { chartKeys: 1 }).lean();
  const fieldBoards = others.filter((board) => !board.chartKeys.some((key) => RESTRICTED_KEYS.includes(key)));
  const stillUsed = new Set([...chartKeys, ...fieldBoards.flatMap((board) => board.chartKeys)]);
  const dropped = (previous?.chartKeys || []).filter((key) => !stillUsed.has(key));
  if (dropped.length) await Role.updateMany({ name: { $in: FIELD_ROLES }, isDeleted: false }, { $pull: { permissions: { $in: openChartPermissions(dropped) } } });
  return { boardKey, inserted: upsertedCount === 1, skippedRoles };
}

module.exports = { saveBoard, chartsMismatch, undelegatable, FIELD_ROLES, RESTRICTED_KEYS };
