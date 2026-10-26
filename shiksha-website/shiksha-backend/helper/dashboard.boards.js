const DashboardConfig = require("../models/dashboard.config.model");
const Role = require("../models/role.model");

// Admin, Manager and Superuser hold every chart through config/builtin_roles.json and isSuperUser. Only field roles are granted here.
const FIELD_ROLES = ["HM", "CRP", "BEO", "MEO", "DEO", "DDPI"];
const RESTRICTED_KEYS = ["avg_feedback_score", "chatbot_requests_by_month", "lba_attempts_by_subject", "module_adoption", "ai_action_type_breakdown", "ai_feature_usage_over_time"];

async function grant(permissions, roleNames) {
  const found = await Role.find({ name: { $in: roleNames }, isDeleted: false }, { name: 1 }).lean();
  const foundNames = new Set(found.map((role) => role.name));
  roleNames.filter((name) => !foundNames.has(name)).forEach((name) => console.warn(`Dashboard board: role ${name} not found, skipped`));
  await Role.updateMany({ _id: { $in: found.map((role) => role._id) } }, { $addToSet: { permissions: { $each: permissions } } });
}

async function saveBoard({ boardKey, chartKeys, desktopUuid, mobileUuid }) {
  const stored = await DashboardConfig.findOne({ boardKey }, { _id: 1 }).lean();
  if (stored) {
    await DashboardConfig.updateOne({ boardKey }, { $set: { chartKeys, desktopUuid, mobileUuid } });
    return { boardKey, inserted: false };
  }
  // Grant before insert, so a failed grant leaves no row and the next call retries. $addToSet makes the retry safe.
  await grant(chartKeys.filter((key) => !RESTRICTED_KEYS.includes(key)).map((key) => `analytics.chart.${key}`), FIELD_ROLES);
  await DashboardConfig.create({ boardKey, chartKeys, desktopUuid, mobileUuid });
  return { boardKey, inserted: true };
}

module.exports = { saveBoard, FIELD_ROLES, RESTRICTED_KEYS };
