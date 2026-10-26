const { REGION_SCOPE_FIELDS } = require("../config/role.scope");

const CHART_PERMISSION_PREFIX = "analytics.chart.";

const grantedChartKeys = (grants) => [...new Set(grants.filter((grant) => grant.permission.startsWith(CHART_PERMISSION_PREFIX)).map((grant) => grant.permission.slice(CHART_PERMISSION_PREFIX.length)))];

// Returns null when the user holds no chart permission or no board qualifies.
function resolveDashboard(grantedKeys, boards) {
  if (!grantedKeys.length) return null;
  const granted = new Set(grantedKeys);
  const board = boards
    .filter((candidate) => candidate.chartKeys.every((key) => granted.has(key)))
    .sort((a, b) => b.chartKeys.length - a.chartKeys.length || a.boardKey.localeCompare(b.boardKey))[0];
  if (!board) return null;
  const covered = new Set(board.chartKeys);
  const missing = grantedKeys.filter((key) => !covered.has(key));
  if (missing.length) console.warn(`Dashboard board ${board.boardKey} lacks granted charts: ${missing.join(", ")}. Add a board that holds them.`);
  return { desktopUuid: board.desktopUuid, mobileUuid: board.mobileUuid || null };
}

function buildScope(grants) {
  const regions = (grants || []).filter((grant) => REGION_SCOPE_FIELDS[grant.scopeType]);
  if (regions.length !== 1) return null;
  const dep = regions[0].dep || {};
  return { state: dep.state ?? null, district: dep.district ?? null, block: dep.block ?? null };
}

module.exports = { grantedChartKeys, resolveDashboard, buildScope };
