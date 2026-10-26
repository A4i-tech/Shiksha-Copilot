const DashboardConfig = require("../models/dashboard.config.model");
const Role = require("../models/role.model");
const CHARTS = require("../config/analytics.charts.json");

const KNOWN_KEYS = new Set(CHARTS.map((chart) => chart.key));
// Admin, Manager and Superuser hold every chart through config/builtin_roles.json and isSuperUser. Only field roles are granted here.
const FIELD_ROLES = ["HM", "CRP", "BEO", "MEO", "DEO", "DDPI"];
const RESTRICTED_KEYS = ["avg_feedback_score", "chatbot_requests_by_month", "lba_attempts_by_subject", "module_adoption", "ai_action_type_breakdown", "ai_feature_usage_over_time"];

async function grant(permissions, roleNames) {
  const found = await Role.find({ name: { $in: roleNames }, isDeleted: false }, { name: 1 }).lean();
  const foundNames = new Set(found.map((role) => role.name));
  roleNames.filter((name) => !foundNames.has(name)).forEach((name) => console.warn(`Dashboard seed: role ${name} not found, skipped`));
  await Role.updateMany({ _id: { $in: found.map((role) => role._id) } }, { $addToSet: { permissions: { $each: permissions } } });
}

async function seedBoard({ boardKey, chartKeys, desktopUuid, mobileUuid }) {
  if (!boardKey || !desktopUuid || !Array.isArray(chartKeys) || !chartKeys.length || !chartKeys.every((key) => KNOWN_KEYS.has(key))) {
    console.warn(`Dashboard seed: board ${boardKey} needs boardKey, desktopUuid and a non-empty list of known chartKeys, skipped`);
    return;
  }
  const stored = await DashboardConfig.findOne({ boardKey }, { desktopUuid: 1 }).lean();
  if (stored) {
    if (stored.desktopUuid !== desktopUuid) console.warn(`Dashboard seed: env UUID for board ${boardKey} differs from stored row, stored row kept`);
    return;
  }
  // Grants run before the row is written, so a failed grant is retried on the next boot. $addToSet makes the retry safe.
  await grant(chartKeys.filter((key) => !RESTRICTED_KEYS.includes(key)).map((key) => `analytics.chart.${key}`), FIELD_ROLES);
  await DashboardConfig.updateOne({ boardKey }, { $setOnInsert: { chartKeys, desktopUuid, mobileUuid: mobileUuid || null } }, { upsert: true });
}

async function seedDashboardConfigs() {
  if (!process.env.SUPERSET_BOARDS_JSON) return;
  let boards;
  try {
    boards = JSON.parse(process.env.SUPERSET_BOARDS_JSON);
    if (!Array.isArray(boards)) throw new Error("not an array");
  } catch (err) {
    console.warn(`Dashboard seed: SUPERSET_BOARDS_JSON is not a valid JSON array (${err.message}), skipped`);
    return;
  }
  for (const board of boards) await seedBoard(board);
}

module.exports = seedDashboardConfigs;
