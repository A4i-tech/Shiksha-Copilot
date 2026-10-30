const CHARTS = require("../config/analytics.charts.json");
const { supersetGet } = require("./superset.helper.js");
const { saveBoard, chartsMismatch } = require("./dashboard.boards.js");

const PREFIX = "board-";
const MOBILE_SUFFIX = "-mobile";
const TTL_MS = 10 * 60 * 1000;
const RETRY_MS = 60 * 1000;
const keyBySlice = new Map(CHARTS.map((chart) => [chart.sliceName, chart.key]));

function pairBoards(dashboards) {
  const boards = dashboards.filter((dashboard) => dashboard.slug.startsWith(PREFIX));
  return boards
    .filter((dashboard) => !dashboard.slug.endsWith(MOBILE_SUFFIX))
    .map((dashboard) => ({
      boardKey: dashboard.slug.slice(PREFIX.length),
      desktop: dashboard,
      mobile: boards.find((other) => other.slug === dashboard.slug + MOBILE_SUFFIX) || null,
    }));
}

const sliceNames = async (dashboard) => (await supersetGet(`/dashboard/${dashboard.id}/charts`)).map((chart) => chart.slice_name);
const embeddedUuid = async (dashboard) => (await supersetGet(`/dashboard/${dashboard.id}/embedded`)).uuid;

// Skip a board that cannot be embedded, holds an unknown chart, or has a mobile twin with other charts.
async function syncBoards() {
  const query = encodeURIComponent(`(filters:!((col:slug,opr:ct,value:'${PREFIX}')),page_size:100)`);
  const saved = [];
  for (const { boardKey, desktop, mobile } of pairBoards(await supersetGet(`/dashboard/?q=${query}`))) {
    try {
      const chartKeys = (await sliceNames(desktop)).map((name) => keyBySlice.get(name));
      if (chartKeys.includes(undefined)) throw new Error("the dashboard holds a chart that is not in the catalog");
      const mismatch = mobile && chartsMismatch(await sliceNames(mobile), chartKeys);
      if (mismatch) throw new Error(`mobile twin: ${mismatch}`);
      const { skippedRoles } = await saveBoard({ boardKey, chartKeys, desktopUuid: await embeddedUuid(desktop), mobileUuid: mobile ? await embeddedUuid(mobile) : null });
      if (skippedRoles.length) console.warn(`[superset] board ${boardKey}: no role named ${skippedRoles.join(", ")}, so no chart permissions were granted to it. The next sync grants them once the role exists.`);
      saved.push(boardKey);
    } catch (err) {
      console.warn(`[superset] board ${boardKey} (dashboard ${desktop.id}) skipped: ${err.message}`);
    }
  }
  return saved;
}

let lastRun = 0;
let inflight = null;

// Every dashboard request calls this, so it is throttled. The retry window is shorter when the caller found no board.
function refreshBoards(retryNow = false) {
  if (inflight) return inflight;
  if (Date.now() - lastRun < (retryNow ? RETRY_MS : TTL_MS)) return Promise.resolve();
  lastRun = Date.now();
  inflight = syncBoards()
    .catch((err) => console.error("[superset] board sync failed:", err.message))
    .finally(() => { inflight = null; });
  return inflight;
}

module.exports = { pairBoards, syncBoards, refreshBoards };
